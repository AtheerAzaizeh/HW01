// src/pages/Admin/index.jsx
import React, { useState } from 'react';
import {
  Container, Box, Typography, Tabs, Tab, Paper, Alert, Snackbar, Chip,
  useMediaQuery, useTheme
} from '@mui/material';
import { Inventory, ShoppingCart, People, Chat as ChatIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAdminData from './hooks/useAdminData';

// Tab Components
import ProductsTab from './components/ProductsTab';
import OrdersTab from './components/OrdersTab';
import ChatsTab from './components/ChatsTab';
import UsersTab from './components/UsersTab';

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
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  // Use custom hook for data management
  const { products, orders, users, chats, loading, error, refetch } = useAdminData(isSuperAdmin);

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

        {/* Products Tab */}
        <TabPanel value={tab} index={0}>
          <ProductsTab 
            products={products} 
            isMobile={isMobile} 
            onRefresh={refetch} 
            showToast={showToast} 
          />
        </TabPanel>

        {/* Orders Tab */}
        <TabPanel value={tab} index={1}>
          <OrdersTab 
            orders={orders} 
            isMobile={isMobile} 
            onRefresh={refetch} 
            showToast={showToast} 
          />
        </TabPanel>

        {/* Chats Tab */}
        <TabPanel value={tab} index={2}>
          <ChatsTab 
            chats={chats} 
            isMobile={isMobile} 
            onRefresh={refetch} 
            showToast={showToast} 
          />
        </TabPanel>

        {/* Users Tab (SuperAdmin only) */}
        {isSuperAdmin && (
          <TabPanel value={tab} index={3}>
            <UsersTab 
              users={users} 
              isMobile={isMobile} 
              onRefresh={refetch} 
              showToast={showToast} 
            />
          </TabPanel>
        )}
      </Paper>

      {/* Toast Notification */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;
