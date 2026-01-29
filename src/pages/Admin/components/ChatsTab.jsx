// src/pages/Admin/components/ChatsTab.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Chip, Paper, Stack, IconButton, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button
} from '@mui/material';
import { Visibility, Reply } from '@mui/icons-material';
import api from '../../../services/api';

const ChatsTab = ({ chats, isMobile, onRefresh, showToast }) => {
  const [chatDialog, setChatDialog] = useState({ open: false, chat: null });
  const [replyMessage, setReplyMessage] = useState('');

  const handleReplyToChat = async () => {
    if (!replyMessage.trim() || !chatDialog.chat) return;
    try {
      const response = await api.chat.addMessage(chatDialog.chat._id, replyMessage);
      setChatDialog({ open: true, chat: response.data });
      setReplyMessage('');
      showToast('Reply sent');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openChats = chats.filter(c => c.status === 'open');
  const closedChats = chats.filter(c => c.status !== 'open');

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Mobile Card Layout */}
      {isMobile ? (
        <Stack spacing={2}>
          {chats.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No support tickets</Typography>
            </Paper>
          )}
          {chats.map((chat) => (
            <Paper 
              key={chat._id} 
              sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                border: chat.status === 'open' ? '2px solid #FFD700' : '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#FFD700', color: 'black', fontSize: '0.875rem' }}>
                      {chat.user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {chat.user?.name}
                    </Typography>
                  </Box>
                  <Chip 
                    label={chat.status} 
                    size="small" 
                    color={chat.status === 'open' ? 'warning' : 'default'} 
                  />
                </Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  {chat.subject}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {chat.messages?.length} messages • {new Date(chat.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Button 
                fullWidth 
                startIcon={<Visibility />}
                onClick={() => setChatDialog({ open: true, chat })}
                sx={{ borderRadius: 0, py: 1.5, borderTop: '1px solid rgba(0,0,0,0.1)' }}
              >
                View Chat
              </Button>
            </Paper>
          ))}
        </Stack>
      ) : (
        /* Desktop Table Layout */
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Messages</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chats.map((chat) => (
                <TableRow key={chat._id} hover sx={{ bgcolor: chat.status === 'open' ? 'rgba(255, 215, 0, 0.05)' : 'inherit' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#FFD700', color: 'black', fontSize: '0.875rem' }}>
                        {chat.user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      {chat.user?.name}
                    </Box>
                  </TableCell>
                  <TableCell>{chat.subject}</TableCell>
                  <TableCell>{chat.messages?.length}</TableCell>
                  <TableCell>
                    <Chip 
                      label={chat.status} 
                      size="small" 
                      color={chat.status === 'open' ? 'warning' : 'default'} 
                    />
                  </TableCell>
                  <TableCell>{new Date(chat.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => setChatDialog({ open: true, chat })}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Chat Dialog */}
      <Dialog open={chatDialog.open} onClose={() => setChatDialog({ open: false, chat: null })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Chat: {chatDialog.chat?.subject}</span>
          <Chip label={chatDialog.chat?.status} size="small" color={chatDialog.chat?.status === 'open' ? 'warning' : 'default'} />
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            User: {chatDialog.chat?.user?.name} ({chatDialog.chat?.user?.email})
          </Typography>
          <Box sx={{ 
            maxHeight: 350, 
            overflow: 'auto', 
            py: 2, 
            bgcolor: 'background.default', 
            borderRadius: 2, 
            p: 2 
          }}>
            {chatDialog.chat?.messages?.map((msg, i) => (
              <Box 
                key={i} 
                sx={{ 
                  mb: 2, 
                  display: 'flex',
                  justifyContent: msg.isAdminReply ? 'flex-end' : 'flex-start'
                }}
              >
                <Box
                  sx={{
                    maxWidth: { xs: '85%', sm: '70%' },
                    p: 2,
                    bgcolor: msg.isAdminReply ? '#FFD700' : 'background.paper',
                    color: msg.isAdminReply ? 'black' : 'text.primary',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 0.5 }}>
                    {msg.isAdminReply ? 'You' : chatDialog.chat?.user?.name} • {new Date(msg.createdAt).toLocaleString()}
                  </Typography>
                  <Typography sx={{ wordBreak: 'break-word' }}>{msg.content}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* Reply Input */}
          {chatDialog.chat?.status !== 'closed' && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Type your reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReplyToChat()}
                size="small"
              />
              <Button
                variant="contained"
                startIcon={<Reply />}
                onClick={handleReplyToChat}
                disabled={!replyMessage.trim()}
                sx={{ bgcolor: '#FFD700', color: 'black', whiteSpace: 'nowrap' }}
              >
                Reply
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDialog({ open: false, chat: null })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatsTab;
