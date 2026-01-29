// src/components/chat/ChatWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Fab, Paper, Typography, TextField, IconButton,
  Badge, Avatar, Zoom, Divider, CircularProgress
} from '@mui/material';
import { Chat as ChatIcon, Close, Send, SupportAgent } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ChatWidget = () => {
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Determine if widget should be shown (moved before hooks to use in effects)
  const shouldShow = isAuthenticated && user?.role !== 'admin' && user?.role !== 'superadmin';

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch or create chat
  useEffect(() => {
    if (shouldShow && open && isAuthenticated) {
      fetchActiveChat();
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [open, isAuthenticated, shouldShow]);

  // Poll for new messages
  useEffect(() => {
    if (shouldShow && activeChat && open) {
      pollIntervalRef.current = setInterval(fetchMessages, 3000);
      return () => clearInterval(pollIntervalRef.current);
    }
  }, [activeChat, open, shouldShow]);

  useEffect(() => {
    if (shouldShow) {
      scrollToBottom();
    }
  }, [messages, shouldShow]);

  const fetchActiveChat = async () => {
    setLoading(true);
    try {
      const response = await api.chat.getMyChats();
      const chats = response.data || [];
      // Get open or in-progress chat
      const active = chats.find(c => c.status !== 'closed');
      if (active) {
        setActiveChat(active);
        setMessages(active.messages || []);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!activeChat) return;
    try {
      const response = await api.chat.getOne(activeChat._id);
      const newMessages = response.data.messages || [];
      
      // Check for new admin replies (for notification)
      if (newMessages.length > messages.length) {
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.isAdminReply && !open) {
          setUnreadCount(prev => prev + 1);
          // Browser notification
          if (Notification.permission === 'granted') {
            new Notification('New message from Support', {
              body: lastMsg.content.substring(0, 50) + '...',
              icon: '/vite.svg'
            });
          }
        }
      }
      
      setMessages(newMessages);
      setActiveChat(response.data);
    } catch (err) {
      console.error('Error polling messages:', err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      if (!activeChat) {
        // Create new chat
        const response = await api.chat.create({
          subject: 'Live Support Chat',
          message: newMessage
        });
        setActiveChat(response.data);
        setMessages(response.data.messages || []);
      } else {
        // Add message to existing chat
        const response = await api.chat.addMessage(activeChat._id, newMessage);
        setMessages(response.data.messages || []);
        setActiveChat(response.data);
      }
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setUnreadCount(0);
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // Don't render for non-authenticated users or admins - moved AFTER all hooks
  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <Zoom in={!open}>
        <Fab
          color="secondary"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#FFD700',
            color: 'black',
            '&:hover': { bgcolor: '#e6c200' }
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <ChatIcon />
          </Badge>
        </Fab>
      </Zoom>

      {/* Chat Window */}
      <Zoom in={open}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 360,
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            zIndex: 1300
          }}
        >
          {/* Header */}
          <Box sx={{ 
            bgcolor: '#FFD700', 
            color: 'black', 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'black', width: 36, height: 36 }}>
                <SupportAgent />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                  Live Support
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Usually replies in minutes
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: 'background.default' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} sx={{ color: '#FFD700' }} />
              </Box>
            ) : messages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SupportAgent sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">
                  Hi {user?.name}! 👋
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  How can we help you today?
                </Typography>
              </Box>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.isAdminReply ? 'flex-start' : 'flex-end',
                      mb: 1.5
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '80%',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: msg.isAdminReply ? 'background.paper' : '#FFD700',
                        color: msg.isAdminReply ? 'text.primary' : 'black',
                        boxShadow: 1
                      }}
                    >
                      <Typography variant="body2">{msg.content}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 0.5 }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Input */}
          <Divider />
          <Box sx={{ p: 1.5, display: 'flex', gap: 1, bgcolor: 'background.paper' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              sx={{ '& fieldset': { borderRadius: 3 } }}
            />
            <IconButton 
              onClick={handleSend} 
              disabled={!newMessage.trim()}
              sx={{ bgcolor: '#FFD700', color: 'black', '&:hover': { bgcolor: '#e6c200' } }}
            >
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Zoom>
    </>
  );
};

export default ChatWidget;
