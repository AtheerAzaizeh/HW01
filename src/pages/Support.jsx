// src/pages/Support.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Paper, TextField, Button,
  List, ListItem, ListItemText, Divider, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import { Send, Add, Chat as ChatIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import useForm from '../hooks/useForm';

import { useSocket } from '../context/SocketContext';
import { useNotification } from '../context/NotificationContext';

const Support = () => {
  const { isAuthenticated } = useAuth();
  const socket = useSocket();
  const { notifyNewMessage } = useNotification();
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTicketDialog, setNewTicketDialog] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Socket: Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (updatedChat) => {
      // If we are currently viewing this chat, update the messages
      if (selectedChat && selectedChat._id === updatedChat._id) {
        setSelectedChat(updatedChat);
      }
      
      // Update the chat in the list
      setChats(prev => prev.map(c => c._id === updatedChat._id ? updatedChat : c));
      
      // Notify logic handled by GlobalSocketListener
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket, selectedChat]);

  // Join/Leave chat rooms
  useEffect(() => {
    if (!socket || !selectedChat) return;

    socket.emit('join_chat', selectedChat._id);

    return () => {
      socket.emit('leave_chat', selectedChat._id);
    };
  }, [socket, selectedChat]);


  // Fetch user's chats
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchChats = async () => {
    try {
      const response = await api.chat.getMyChats();
      setChats(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // New ticket form
  const ticketForm = useForm(
    { subject: '', message: '' },
    (values) => {
      const errors = {};
      if (!values.subject.trim()) errors.subject = 'Subject is required';
      if (!values.message.trim()) errors.message = 'Message is required';
      return errors;
    },
    async (values) => {
      try {
        await api.chat.create(values);
        setNewTicketDialog(false);
        ticketForm.resetForm();
        fetchChats();
      } catch (err) {
        setError(err.message);
      }
    }
  );

  const handleSelectChat = async (chat) => {
    try {
      const response = await api.chat.getOne(chat._id);
      setSelectedChat(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      const response = await api.chat.addMessage(selectedChat._id, newMessage);
      setSelectedChat(response.data);
      setNewMessage('');
      fetchChats();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'closed') return 'success';
    if (status === 'in-progress') return 'info';
    return 'warning';
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Please login to access support</Typography>
        <Button variant="contained" href="/login" sx={{ bgcolor: '#FFD700', color: 'black' }}>
          Login
        </Button>
      </Container>
    );
  }

  if (loading) return <LoadingSpinner message="Loading support..." />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Support Center
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setNewTicketDialog(true)}
          sx={{ bgcolor: '#FFD700', color: 'black' }}
        >
          New Ticket
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 3, height: '60vh' }}>
        {/* Chat List - Hidden on mobile if chat selected */}
        <Paper sx={{ 
          width: { xs: '100%', md: 300 }, 
          display: { xs: selectedChat ? 'none' : 'block', md: 'block' },
          overflow: 'auto', 
          bgcolor: 'background.paper' 
        }}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            Your Tickets
          </Typography>
          {chats.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No tickets yet</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {chats.map((chat) => (
                <React.Fragment key={chat._id}>
                  <ListItem
                    button
                    onClick={() => handleSelectChat(chat)}
                    selected={selectedChat?._id === chat._id}
                    sx={{ '&.Mui-selected': { bgcolor: 'rgba(255, 215, 0, 0.1)' } }}
                  >
                    <ListItemText
                      secondaryTypographyProps={{ component: 'div' }}
                      primary={chat.subject}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip label={chat.status} size="small" color={getStatusColor(chat.status)} />
                          <Typography variant="caption" color="text.secondary">
                            {chat.messages?.length || 0} msgs
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        {/* Chat Messages - Hidden on mobile if no chat selected */}
        <Paper sx={{ 
          flexGrow: 1, 
          display: { xs: selectedChat ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column', 
          bgcolor: 'background.paper' 
        }}>
          {selectedChat ? (
            <>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Back button for mobile */}
                <Button 
                  size="small" 
                  onClick={() => setSelectedChat(null)} 
                  sx={{ display: { xs: 'block', md: 'none' }, minWidth: 'auto', mr: 1 }}
                >
                  ← Back
                </Button>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    {selectedChat.subject}
                  </Typography>
                  <Chip label={selectedChat.status} size="small" color={getStatusColor(selectedChat.status)} sx={{ mt: 0.5 }} />
                </Box>
              </Box>
              
              {/* Messages */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {selectedChat.messages?.map((msg, i) => (
                  <Box
                    key={i}
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: msg.isAdminReply ? 'primary.dark' : 'background.default',
                      borderRadius: 2,
                      ml: msg.isAdminReply ? 4 : 0,
                      mr: msg.isAdminReply ? 0 : 4
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {msg.isAdminReply ? 'Support Team' : 'You'} • {new Date(msg.createdAt).toLocaleString()}
                    </Typography>
                    <Typography>{msg.content}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Reply Box */}
              {selectedChat.status !== 'closed' && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    sx={{ bgcolor: '#FFD700', color: 'black' }}
                  >
                    <Send />
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <EmptyState
              icon={ChatIcon}
              title="Select a ticket"
              message="Choose a ticket from the list to view the conversation"
            />
          )}
        </Paper>
      </Box>

      {/* New Ticket Dialog */}
      <Dialog open={newTicketDialog} onClose={() => setNewTicketDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Support Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Subject"
              name="subject"
              value={ticketForm.values.subject}
              onChange={ticketForm.handleChange}
              error={!!ticketForm.errors.subject}
              helperText={ticketForm.errors.subject}
              fullWidth
            />
            <TextField
              label="Message"
              name="message"
              value={ticketForm.values.message}
              onChange={ticketForm.handleChange}
              error={!!ticketForm.errors.message}
              helperText={ticketForm.errors.message}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTicketDialog(false)}>Cancel</Button>
          <Button
            onClick={ticketForm.handleSubmit}
            variant="contained"
            sx={{ bgcolor: '#FFD700', color: 'black' }}
          >
            Submit Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Support;
