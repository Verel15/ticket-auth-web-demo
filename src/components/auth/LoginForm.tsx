'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { loginWithEmail, loginWithLine, clearError } from '@/lib/store/authSlice';
import { useTranslations } from 'next-intl';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

export default function LoginForm({ onSwitchToRegister, onForgotPassword }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const t = useTranslations('HomePage');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }

    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {      
      await dispatch(loginWithEmail(formData)).unwrap();
    } catch (error: any) {
      console.log('Login failed:', error);
    }
  };

  const handleLineLogin = async () => {
    try {
      await dispatch(loginWithLine()).unwrap();
    } catch (error: any) {
      console.error('LINE login failed:', error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('signIn.welcomeBack')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('signIn.description')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleEmailLogin}>
        <TextField
          fullWidth
          label={t('signIn.labelEmail')}
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              )
            }
          }}
          placeholder={t('signIn.enterEmail')}
        />

        <TextField
          fullWidth
          label={t('signIn.labelPassword')}
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange('password')}
          error={!!errors.password}
          helperText={errors.password}
          margin="normal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
          placeholder={t('signIn.enterPassword')}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                {t('signIn.buttonText')}
              </>
            )}
          </Button>
        </Box>
      </form>

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Button
          variant="text"
          onClick={onForgotPassword}
          size="small"
          disabled={isLoading}
        >
          {t('signIn.forgotPassword')}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('signIn.or')}
        </Typography>
      </Divider>

      <Button
        fullWidth
        variant="outlined"
        size="large"
        onClick={handleLineLogin}
        disabled={isLoading}
        sx={{
          py: 1.5,
          borderColor: '#00C300',
          color: '#00C300',
          '&:hover': {
            borderColor: '#00A000',
            backgroundColor: '#f0fff0',
          },
        }}
      >
        {t('signIn.loginLineButtonText')}
      </Button>
    </Box>
  );
}
