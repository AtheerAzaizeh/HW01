import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useNotification } from '../context/NotificationContext';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GlobalSocketListener = () => {
    const socket = useSocket();
    const { notifyNewMessage } = useNotification();
    const location = useLocation();
    const { user } = useAuth();
    
    useEffect(() => {
        if (!socket) return;
        
        const handleNewMessage = (updatedChat) => {
            // Check if we are currently looking at this specific chat in the Support page
            // If we are on /support and the chat ID matches (this logic might be complex to get exactly "which chat is open" without context, 
            // but we can at least avoid notifying if we are on the /support page generally, OR we can let Support.jsx handle it and this component handle it elsewhere)
            
            // Actually, a better approach is: always notify unless we are mostly sure the user sees it.
            // But the user specifically asked for "notify... on any page".
            
            // Let's get the last message
            const lastMsg = updatedChat.messages[updatedChat.messages.length - 1];
            
            // Don't notify if I sent the message
            if (lastMsg.sender._id === user?._id || lastMsg.sender === user?._id) {
                return;
            }
            
            // If we are on the support page, Support.jsx might already be handling the UI update. 
            // However, a toast is still useful unless we are actively typing.
            // Let's show the toast. The user complaint was "notify just when the user in the page of support must it's showing on anypage".
            
            // We should filter based on role.
            // If user is Admin, they should get notified of new messages from Users.
            // If user is User, they should get notified of new messages from Admin.
            
            if (user?.role === 'admin' || user?.role === 'superadmin') {
                if (!lastMsg.isAdminReply) {
                    notifyNewMessage(lastMsg.sender.name || 'User', lastMsg.content, updatedChat._id);
                }
            } else {
                if (lastMsg.isAdminReply) {
                    notifyNewMessage('Support Team', lastMsg.content, updatedChat._id);
                }
            }
        };
        
        socket.on('new_message', handleNewMessage);
        
        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [socket, notifyNewMessage, user, location.pathname]);
    
    return null; // This component handles side effects only
};

export default GlobalSocketListener;
