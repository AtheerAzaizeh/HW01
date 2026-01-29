// src/pages/Admin/components/ProductsTab.jsx
import React, { useState, useRef } from 'react';
import {
  Box, Typography, Button, IconButton, Chip, Paper, Avatar, Fab, Divider, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Grid, Alert, LinearProgress
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload } from '@mui/icons-material';
import api from '../../../services/api';
import useForm from '../../../hooks/useForm';
import useCloudinaryUpload from '../../../hooks/useCloudinaryUpload';

const ProductsTab = ({ products, isMobile, onRefresh, showToast }) => {
  const [productDialog, setProductDialog] = useState({ open: false, product: null });
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  const { uploadImage, uploading, progress, error: uploadError, resetUpload } = useCloudinaryUpload();

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
        onRefresh();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  );

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

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
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {isMobile ? (
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={() => openProductDialog()}
          sx={{ position: 'fixed', bottom: 24, right: 24, bgcolor: '#FFD700', color: 'black', zIndex: 1000 }}
        >
          <Add />
        </Fab>
      ) : (
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => openProductDialog()}
          sx={{ mb: 3, bgcolor: '#FFD700', color: 'black' }}
        >
          Add Product
        </Button>
      )}

      {/* Mobile Card Layout */}
      {isMobile ? (
        <Stack spacing={2}>
          {products.map((product) => (
            <Paper key={product._id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
                <Avatar 
                  src={product.image} 
                  variant="rounded" 
                  sx={{ width: 70, height: 70, mr: 2, bgcolor: 'grey.200' }} 
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.name}
                    </Typography>
                    {product.featured && <Chip label="★" size="small" color="warning" sx={{ height: 20 }} />}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    ${product.price} • Stock: <strong>{product.stock}</strong>
                  </Typography>
                  <Chip label={product.category} size="small" variant="outlined" sx={{ height: 24 }} />
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex' }}>
                <Button 
                  fullWidth 
                  startIcon={<Edit />} 
                  onClick={() => openProductDialog(product)}
                  sx={{ py: 1.5, borderRadius: 0, borderRight: '1px solid rgba(0,0,0,0.1)' }}
                >
                  Edit
                </Button>
                <Button 
                  fullWidth 
                  startIcon={<Delete />} 
                  color="error" 
                  onClick={() => handleDeleteProduct(product._id)}
                  sx={{ py: 1.5, borderRadius: 0 }}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Stack>
      ) : (
        /* Desktop Table Layout */
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>
                    <Avatar src={product.image} variant="rounded" sx={{ width: 50, height: 50 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell><Chip label={product.category} size="small" variant="outlined" /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {product.stock}
                      {product.stock < 5 && <Chip label="Low" color="error" size="small" sx={{ height: 20, fontSize: '0.625rem' }} />}
                    </Box>
                  </TableCell>
                  <TableCell>{product.featured ? '⭐' : '-'}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton onClick={() => openProductDialog(product)} color="primary"><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteProduct(product._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Product Dialog */}
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
    </Box>
  );
};

export default ProductsTab;
