// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, createTheme } from '@mui/material';
import useLocalStorage from './hooks/useLocalStorage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import ChatWidget from './components/chat/ChatWidget';
import GlobalSocketListener from './components/GlobalSocketListener';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ExternalData from './pages/ExternalData';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

// Create themes
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    secondary: { main: '#FFD700' },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h2: { fontWeight: 900 },
    h5: { fontWeight: 600 },
    button: { fontWeight: 600 },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a1a1a' },
    secondary: { main: '#FFD700' },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h2: { fontWeight: 900 },
    h5: { fontWeight: 600 },
    button: { fontWeight: 600 },
  },
});

// Loading screen component
const LoadingScreen = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    bgcolor: 'background.default'
  }}>
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ 
        width: 40, 
        height: 40, 
        border: '3px solid',
        borderColor: 'grey.700',
        borderTopColor: '#FFD700',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        mx: 'auto',
        mb: 2,
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }} />
    </Box>
  </Box>
);

// Layout component that conditionally renders navbar
const AppLayout = ({ children, themeMode, toggleTheme }) => {
  const { isAdmin, loading } = useAuth();
  
  // Handle loading state without early return to maintain hooks order
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Admin sees admin navbar only
  if (isAdmin) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AdminNavbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    );
  }

  // Regular users see full store
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar themeMode={themeMode} toggleTheme={toggleTheme} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
      <ChatWidget />
    </Box>
  );
};

// Routes component
const AppRoutes = () => {
  const { isAdmin, loading } = useAuth();
  
  // Return null during loading - parent AppLayout handles the loading screen
  if (loading) {
    return null;
  }

  // Admin users only see admin panel
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Regular users and guests
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/api" element={<ExternalData />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* Protected Routes (for registered users) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  // useLocalStorage hook for theme persistence
  const [themeMode, setThemeMode] = useLocalStorage('theme', 'dark');

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <NotificationProvider>
          <AuthProvider>
            <SocketProvider>
              <AppLayout themeMode={themeMode} toggleTheme={toggleTheme}>
                <GlobalSocketListener />
                <AppRoutes />
              </AppLayout>
            </SocketProvider>
          </AuthProvider>
        </NotificationProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;