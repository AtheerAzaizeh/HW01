// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Paper,
  Alert, CircularProgress, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import useForm from '../hooks/useForm';
import { loginValidator } from '../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (values) => {
    setServerError('');
    const result = await login({
      email: values.email,
      password: values.password
    });

    if (result.success) {
      notifySuccess('Welcome back!', 'Login Successful');
      navigate(from, { replace: true });
    } else {
      setServerError(result.error);
      notifyError(result.error, 'Login Failed');
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    { email: '', password: '' },
    loginValidator,
    handleLogin
  );

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your BLAKV account
          </Typography>
        </Box>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            disabled={isSubmitting}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            disabled={isSubmitting}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{ 
              py: 1.5, 
              mb: 3,
              bgcolor: '#FFD700', 
              color: 'black',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#e6c200' }
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: 'black' }} />
            ) : (
              'Sign In'
            )}
          </Button>

          <Typography variant="body2" align="center" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#FFD700', textDecoration: 'none' }}>
              Create one
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
