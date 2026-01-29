// server/controllers/chatController.js
import Chat from '../models/Chat.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Create new chat/ticket
// @route   POST /api/chat
// @access  Private
export const createChat = async (req, res, next) => {
  try {
    const { subject, message } = req.body;

    const chat = await Chat.create({
      user: req.user.id,
      subject,
      messages: [{
        sender: req.user.id,
        content: message,
        isAdminReply: false
      }]
    });

    await chat.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Support ticket created',
      data: chat
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's chats
// @route   GET /api/chat
// @access  Private
export const getMyChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .populate('user', 'name email')
      .populate('assignedAdmin', 'name')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chats (Admin)
// @route   GET /api/chat/all
// @access  Private/Admin
export const getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find()
      .populate('user', 'name email')
      .populate('assignedAdmin', 'name')
      .populate('messages.sender', 'name')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chat
// @route   GET /api/chat/:id
// @access  Private
export const getChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedAdmin', 'name')
      .populate('messages.sender', 'name');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user owns the chat or is admin
    const isOwner = chat.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat'
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add message to chat
// @route   POST /api/chat/:id/message
// @access  Private
export const addMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user owns the chat or is admin
    const isOwner = chat.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reply to this chat'
      });
    }

    chat.messages.push({
      sender: req.user.id,
      content: message,
      isAdminReply: isAdmin
    });

    // If admin is replying, assign them and set status to in-progress
    if (isAdmin && !chat.assignedAdmin) {
      chat.assignedAdmin = req.user.id;
      chat.status = 'in-progress';
    }

    await chat.save();

    const updatedChat = await Chat.findById(chat._id)
      .populate('user', 'name email')
      .populate('assignedAdmin', 'name')
      .populate('messages.sender', 'name');



    // Emit socket event for real-time updates to the specific chat room
    req.io.to(chat._id.toString()).emit('new_message', updatedChat);
    
    // Also emit to the recipient's personal room for global notifications
    if (isAdmin) {
        // Admin replied -> Notify User
        req.io.to(`user_${chat.user._id}`).emit('new_message', updatedChat);
    } else {
        // User replied -> Notify Admin
        // If assigned, notify that specific admin
        if (chat.assignedAdmin) {
            req.io.to(`user_${chat.assignedAdmin}`).emit('new_message', updatedChat);
        }
        // Also notify all admins (listening on a generic 'admins' room? Or we can just rely on dashboard polling for unassigned)
        // For now, let's just make sure superadmins or anyone listening to 'admins' gets it? 
        // We haven't implemented an 'admins' room in server.js yet.
        // Let's stick to assigned admin or assume admins check their dashboard.
        // BUT, the user wants "WhatsApp style".
        // Let's assume admins are also "users" with IDs.
    }
    
    // Send email notification if Admin replied
    if (isAdmin && chat.user.email) {
        try {
            await sendEmail({
                to: chat.user.email,
                subject: `New Support Message: ${chat.subject}`,
                text: `You have received a new message from the BLAKV Support Team regarding your ticket "${chat.subject}".\n\nMessage: ${message}\n\nLogin to view the full conversation.`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2>New Support Message</h2>
                        <p>You have received a new message from the <strong>BLAKV Support Team</strong> regarding your ticket "<strong>${chat.subject}</strong>".</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p>${message}</p>
                        </div>
                        <p><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/support" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Ticket</a></p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Failed to send email notification', emailErr);
            // Don't fail the request just because email failed
        }
    }

    res.status(200).json({
      success: true,
      message: 'Message added',
      data: updatedChat
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chat status
// @route   PUT /api/chat/:id/status
// @access  Private/Admin
export const updateChatStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('assignedAdmin', 'name');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat status updated',
      data: chat
    });
  } catch (error) {
    next(error);
  }
};
