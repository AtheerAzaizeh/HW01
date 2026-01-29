// src/pages/Admin.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Box, Typography, Tabs, Tab, Paper, Grid, Card, CardContent, CardMedia, CardActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Alert, Snackbar, 
  LinearProgress, Avatar, useMediaQuery, useTheme
} from '@mui/material';
import {
  Inventory, ShoppingCart, People, Chat as ChatIcon,
  Delete, Edit, Add, Visibility, CloudUpload, Reply
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useForm from '../hooks/useForm';
import useCloudinaryUpload from '../hooks/useCloudinaryUpload';

// Tab Panel Component
const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: 24 }}>
    {value === index && children}
  </div>
);

const Admin = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  
  // Dialog states
  const [productDialog, setProductDialog] = useState({ open: false, product: null });
  const [adminDialog, setAdminDialog] = useState(false);
  const [chatDialog, setChatDialog] = useState({ open: false, chat: null });
  const [replyMessage, setReplyMessage] = useState('');
  
  // Toast
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Image upload
  const { uploadImage, uploading, progress, error: uploadError, resetUpload } = useCloudinaryUpload();
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Fetch data
  useEffect(() => {
    fetchData();
    // Poll for new chats every 5 seconds
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.products.getAll(),
        api.orders.getAll()
      ]);
      
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
      
      await fetchChats();
      
      // Fetch users if superadmin
      if (isSuperAdmin) {
        const usersRes = await api.users.getAll();
        setUsers(usersRes.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChats = async () => {
    try {
      const chatsRes = await api.chat.getAll();
      let chatData = chatsRes.data || [];
      
      // Filter chats for regular admin (only assigned to them)
      if (!isSuperAdmin) {
        chatData = chatData.filter(c => 
          !c.assignedAdmin || c.assignedAdmin._id === user.id || c.assignedAdmin === user.id
        );
      }
      
      setChats(chatData);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  // Product form
  const productForm = useForm(
    { name: '', description: '', price: '', image: '', category: 'pullover', stock: '', featured: false },
    null,
    async (values) => {
      try {
        const productData = { ...values, price: parseFloat(values.price), stock: parseInt(values.stock) };
        if (productDialog.product) {
          await api.products.update(productDialog.product._id, productData);
          showToast('Product updated successfully');
        } else {
          await api.products.create(productData);
          showToast('Product created successfully');
        }
        setProductDialog({ open: false, product: null });
        setImagePreview('');
        resetUpload();
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  );

  // Admin form
  const adminForm = useForm(
    { name: '', email: '', password: '' },
    null,
    async (values) => {
      try {
        await api.users.createAdmin(values);
        showToast('Admin created successfully');
        setAdminDialog(false);
        adminForm.resetForm();
        fetchData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  );

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const url = await uploadImage(file);
    if (url) {
      productForm.setFieldValue('image', url);
      showToast('Image uploaded successfully');
    }
  };

  const openProductDialog = (product = null) => {
    if (product) {
      productForm.setValues({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        featured: product.featured || false
      });
      setImagePreview(product.image);
    } else {
      productForm.resetForm();
      setImagePreview('');
    }
    resetUpload();
    setProductDialog({ open: true, product });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.products.delete(id);
      showToast('Product deleted');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await api.orders.updateStatus(id, status);
      showToast('Order status updated');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.users.delete(id);
      showToast('User deleted');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReplyToChat = async () => {
    if (!replyMessage.trim() || !chatDialog.chat) return;
    try {
      const response = await api.chat.addMessage(chatDialog.chat._id, replyMessage);
      setChatDialog({ open: true, chat: response.data });
      setReplyMessage('');
      showToast('Reply sent');
      fetchChats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  if (loading) return <LoadingSpinner message="Loading admin data..." />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        Admin Dashboard
        {isSuperAdmin && <Chip label="Super Admin" color="warning" size="small" />}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ bgcolor: 'background.paper' }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)} 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTabs-flexContainer': {
              flexWrap: { xs: 'wrap', sm: 'nowrap' }
            }
          }}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
        >
          <Tab icon={<Inventory />} label={isMobile ? "" : "Products"} iconPosition="start" sx={{ minWidth: { xs: 'auto', sm: 120 } }} />
          <Tab icon={<ShoppingCart />} label={isMobile ? "" : "Orders"} iconPosition="start" sx={{ minWidth: { xs: 'auto', sm: 120 } }} />
          <Tab icon={<ChatIcon />} label={isMobile ? `(${chats.filter(c => c.status === 'open').length})` : `Support (${chats.filter(c => c.status === 'open').length})`} iconPosition="start" sx={{ minWidth: { xs: 'auto', sm: 120 } }} />
          {isSuperAdmin && <Tab icon={<People />} label={isMobile ? "" : "Users"} iconPosition="start" sx={{ minWidth: { xs: 'auto', sm: 120 } }} />}
        </Tabs>

        {/* PRODUCTS TAB */}
        <TabPanel value={tab} index={0}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => openProductDialog()}
              sx={{ mb: 3, bgcolor: '#FFD700', color: 'black' }}
              fullWidth={isMobile}
            >
              Add Product
            </Button>

            {/* Mobile Card Layout */}
            {isMobile ? (
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item xs={12} key={product._id}>
                    <Card sx={{ bgcolor: 'background.paper' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <Avatar src={product.image} variant="rounded" sx={{ width: 60, height: 60, mr: 2 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                          <Typography variant="body2" color="text.secondary">${product.price} • Stock: {product.stock}</Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            <Chip label={product.category} size="small" />
                            {product.featured && <Chip label="⭐ Featured" size="small" color="warning" />}
                          </Box>
                        </Box>
                        <Box>
                          <IconButton size="small" onClick={() => openProductDialog(product)}><Edit /></IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteProduct(product._id)}><Delete /></IconButton>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              /* Desktop Table Layout */
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Featured</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <Avatar src={product.image} variant="rounded" sx={{ width: 50, height: 50 }} />
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell><Chip label={product.category} size="small" /></TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.featured ? '⭐' : '-'}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => openProductDialog(product)}><Edit /></IconButton>
                          <IconButton color="error" onClick={() => handleDeleteProduct(product._id)}><Delete /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* ORDERS TAB */}
        <TabPanel value={tab} index={1}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Mobile Card Layout */}
            {isMobile ? (
              <Grid container spacing={2}>
                {orders.map((order) => (
                  <Grid item xs={12} key={order._id}>
                    <Card sx={{ bgcolor: 'background.paper' }}>
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            #{order._id.slice(-6).toUpperCase()}
                          </Typography>
                          <Chip 
                            label={order.status} 
                            color={order.status === 'delivered' ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {order.user?.name || 'Guest'} • {order.items?.length || 0} items
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#FFD700', mt: 1 }}>
                          ${order.totalPrice?.toFixed(2)}
                        </Typography>
                        <TextField
                          select
                          size="small"
                          value={order.status}
                          onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                          fullWidth
                          sx={{ mt: 2 }}
                          label="Update Status"
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="processing">Processing</MenuItem>
                          <MenuItem value="shipped">Shipped</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </TextField>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              /* Desktop Table Layout */
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>#{order._id.slice(-6).toUpperCase()}</TableCell>
                        <TableCell>{order.user?.name || 'Guest'}</TableCell>
                        <TableCell>{order.items?.length || 0} items</TableCell>
                        <TableCell>${order.totalPrice?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            color={order.status === 'delivered' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            select
                            size="small"
                            value={order.status}
                            onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                            sx={{ minWidth: 120 }}
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </TextField>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* CHAT/SUPPORT TAB */}
        <TabPanel value={tab} index={2}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {chats.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ChatIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography color="text.secondary">No support requests</Typography>
              </Box>
            ) : isMobile ? (
              /* Mobile Card Layout */
              <Grid container spacing={2}>
                {chats.map((chat) => (
                  <Grid item xs={12} key={chat._id}>
                    <Card sx={{ bgcolor: 'background.paper' }}>
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {chat.subject}
                          </Typography>
                          <Chip 
                            label={chat.status} 
                            color={chat.status === 'closed' ? 'success' : chat.status === 'in-progress' ? 'info' : 'warning'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {chat.user?.name || 'N/A'} • {chat.messages?.length || 0} messages
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => { setChatDialog({ open: true, chat }); setReplyMessage(''); }}
                          sx={{ mt: 2 }}
                          fullWidth
                        >
                          View Chat
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              /* Desktop Table Layout */
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Messages</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chats.map((chat) => (
                      <TableRow key={chat._id}>
                        <TableCell>{chat.subject}</TableCell>
                        <TableCell>{chat.user?.name || 'N/A'}</TableCell>
                        <TableCell>{chat.messages?.length || 0}</TableCell>
                        <TableCell>
                          <Chip 
                            label={chat.status} 
                            color={chat.status === 'closed' ? 'success' : chat.status === 'in-progress' ? 'info' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => { setChatDialog({ open: true, chat }); setReplyMessage(''); }}>
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* USERS TAB (SuperAdmin only) */}
        {isSuperAdmin && (
          <TabPanel value={tab} index={3}>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => setAdminDialog(true)}
                sx={{ mb: 3, bgcolor: '#FFD700', color: 'black' }}
                fullWidth={isMobile}
              >
                Create Admin
              </Button>

              {/* Mobile Card Layout */}
              {isMobile ? (
                <Grid container spacing={2}>
                  {users.map((u) => (
                    <Grid item xs={12} key={u._id}>
                      <Card sx={{ bgcolor: 'background.paper' }}>
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {u.name}
                            </Typography>
                            <Chip 
                              label={u.role} 
                              color={u.role === 'superadmin' ? 'error' : u.role === 'admin' ? 'warning' : 'default'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {u.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Joined: {new Date(u.createdAt).toLocaleDateString()}
                          </Typography>
                          {u.role !== 'superadmin' && u._id !== user.id && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteUser(u._id)}
                              sx={{ mt: 2 }}
                              fullWidth
                            >
                              Delete User
                            </Button>
                          )}
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                /* Desktop Table Layout */
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={u.role} 
                              color={u.role === 'superadmin' ? 'error' : u.role === 'admin' ? 'warning' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {u.role !== 'superadmin' && u._id !== user.id && (
                              <IconButton color="error" onClick={() => handleDeleteUser(u._id)}>
                                <Delete />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </TabPanel>
        )}
      </Paper>

      {/* PRODUCT DIALOG with Image Upload */}
      <Dialog open={productDialog.open} onClose={() => setProductDialog({ open: false, product: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{productDialog.product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Name" name="name" value={productForm.values.name} onChange={productForm.handleChange} fullWidth required />
            <TextField label="Description" name="description" value={productForm.values.description} onChange={productForm.handleChange} multiline rows={3} fullWidth required />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Price" name="price" type="number" value={productForm.values.price} onChange={productForm.handleChange} fullWidth required />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Stock" name="stock" type="number" value={productForm.values.stock} onChange={productForm.handleChange} fullWidth required />
              </Grid>
            </Grid>
            <TextField select label="Category" name="category" value={productForm.values.category} onChange={productForm.handleChange} fullWidth>
              <MenuItem value="pullover">Pullover</MenuItem>
              <MenuItem value="zip-up">Zip-Up</MenuItem>
              <MenuItem value="oversized">Oversized</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="limited">Limited</MenuItem>
            </TextField>
            
            {/* Image Upload */}
            <Box>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                fullWidth
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              {uploading && <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />}
              {uploadError && <Alert severity="error" sx={{ mt: 1 }}>{uploadError}</Alert>}
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialog({ open: false, product: null })}>Cancel</Button>
          <Button 
            onClick={productForm.handleSubmit} 
            variant="contained" 
            sx={{ bgcolor: '#FFD700', color: 'black' }}
            disabled={uploading || !productForm.values.image}
          >
            {productDialog.product ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CREATE ADMIN DIALOG */}
      <Dialog open={adminDialog} onClose={() => setAdminDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Admin Account</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Name" name="name" value={adminForm.values.name} onChange={adminForm.handleChange} fullWidth required />
            <TextField label="Email" name="email" type="email" value={adminForm.values.email} onChange={adminForm.handleChange} fullWidth required />
            <TextField label="Password" name="password" type="password" value={adminForm.values.password} onChange={adminForm.handleChange} fullWidth required />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminDialog(false)}>Cancel</Button>
          <Button onClick={adminForm.handleSubmit} variant="contained" sx={{ bgcolor: '#FFD700', color: 'black' }}>
            Create Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* CHAT DIALOG with Reply */}
      <Dialog open={chatDialog.open} onClose={() => setChatDialog({ open: false, chat: null })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Chat: {chatDialog.chat?.subject}</span>
          <Chip label={chatDialog.chat?.status} size="small" color={chatDialog.chat?.status === 'open' ? 'warning' : 'info'} />
        </DialogTitle>
        <DialogContent>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            User: {chatDialog.chat?.user?.name} ({chatDialog.chat?.user?.email})
          </Typography>
          <Box sx={{ maxHeight: 350, overflow: 'auto', py: 2, bgcolor: 'background.default', borderRadius: 2, p: 2 }}>
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
                    maxWidth: '70%',
                    p: 2,
                    bgcolor: msg.isAdminReply ? '#FFD700' : 'background.paper',
                    color: msg.isAdminReply ? 'black' : 'text.primary',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {msg.isAdminReply ? 'You' : chatDialog.chat?.user?.name} • {new Date(msg.createdAt).toLocaleString()}
                  </Typography>
                  <Typography>{msg.content}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* Reply Input */}
          {chatDialog.chat?.status !== 'closed' && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Type your reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReplyToChat()}
              />
              <Button
                variant="contained"
                startIcon={<Reply />}
                onClick={handleReplyToChat}
                disabled={!replyMessage.trim()}
                sx={{ bgcolor: '#FFD700', color: 'black' }}
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

      {/* TOAST */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;
