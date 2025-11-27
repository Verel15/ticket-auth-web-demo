'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Fade,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { initializeLiff } from '@/lib/store/authSlice';
import { LIFF_ID } from '@/lib/liff';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ProfileCard from './ProfileCard';
import Header from '@/components/layout/Header';
import AuthTabSwitcher from './AuthTabSwitcher';

import { useTranslations } from 'next-intl';
import Cookies from 'js-cookie';

type AuthMode = 'login' | 'register';

export default function AuthLayout() {
  const dispatch = useAppDispatch();
  const t = useTranslations('HomePage');
  const { user, isAuthenticated, isLoading, liffInitialized, error } = useAppSelector((state) => state.auth);

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [initializingLiff, setInitializingLiff] = useState(true);

  // Initialize LIFF on component mount
  useEffect(() => {
    const initLiff = async () => {
      try {
        await dispatch(initializeLiff(LIFF_ID)).unwrap();
      } catch (error) {
        console.error('LIFF initialization failed:', error);
      } finally {
        setInitializingLiff(false);
      }
    };

    initLiff();
  }, [dispatch]);

  const handleSwitchToRegister = () => {
    setAuthMode('register');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic
    console.log('Forgot password clicked');
  };

  // Show loading while initializing LIFF
  if (initializingLiff) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {t('loadAuthenticating')}
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show profile if user is authenticated
  if (Cookies.get('token')) {
    return (
      <Box>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Fade in={true} timeout={1500}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                  {t('Head.welcome')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('Head.loginSuccess')}
                </Typography>
              </Box>
              <ProfileCard />
            </Box>
          </Fade>
        </Container>
      </Box>
    );
  }

  // Show authentication forms
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {t('title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('subTitle')}
          </Typography>
        </Box>

        {/* LIFF Status */}
        {!liffInitialized && (
          <Alert severity="warning" sx={{ mb: 3, width: '100%', maxWidth: 450 }}>
            LIFF is not initialized. LINE features may not work properly.
          </Alert>
        )}

        {/* Authentication Card with Tab Switcher */}
        <Box sx={{ width: '100%', maxWidth: 450 }}>
          <AuthTabSwitcher
            authMode={authMode}
            onAuthModeChange={setAuthMode}
          />

          <Paper
            elevation={3}
            sx={{
              borderRadius: '0 0 12px 12px',
              border: '1px solid',
              borderColor: 'divider',
              borderTop: 'none',
              overflow: 'hidden',
            }}
          >
            <Fade in={true} timeout={300} key={authMode}>
              <Box>
                {authMode === 'login' ? (
                  <LoginForm
                    onSwitchToRegister={handleSwitchToRegister}
                    onForgotPassword={handleForgotPassword}
                  />
                ) : (
                  <RegisterForm
                    onSwitchToLogin={handleSwitchToLogin}
                  />
                )}
              </Box>
            </Fade>
          </Paper>
        </Box>

        {/* Footer */}
        {/* <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Built with Next.js, Material UI, Redux Toolkit & LINE LIFF
          </Typography>
        </Box> */}
      </Box>
    </Container>
  );
}
