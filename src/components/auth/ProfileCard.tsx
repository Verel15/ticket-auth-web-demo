'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Logout,
  VerifiedUser,
  Email,
  MessageTwoTone,
  Person,
  Settings,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { logout } from '@/lib/store/authSlice';
import { getLiffEnvironment } from '@/lib/liff';
import DemoFeatures from '@/components/demo/DemoFeatures';
import { useTranslations } from 'next-intl';

export default function ProfileCard() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const t = useTranslations('HomePage')

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setShowLogoutDialog(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const liffEnv = getLiffEnvironment();

  if (!user) {
    return null;
  }

  return (
    <>
      <Card sx={{ maxWidth: 400, width: '100%', mx: 'auto', mb: 3 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 0 }}>
            <Avatar
              src={user.pictureUrl}
              alt={user.displayName}
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                border: '3px solid',
                borderColor: 'primary.main',
              }}
            >
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </Avatar>

            <Typography variant="h5" component="h2" gutterBottom>
              {user.displayName}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Chip
                icon={<VerifiedUser />}
                label="Verified"
                color="success"
                size="small"
              />
              {liffEnv.isInClient && (
                <Chip
                  label="LINE User"
                  color="primary"
                  size="small"
                  sx={{ backgroundColor: '#00C300', color: 'white' }}
                />
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('profileCard.profileInfomation')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Person sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                <strong>{t('profileCard.displayName')}:</strong> {user.displayName}
              </Typography>
            </Box>

            {user.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>{t('profileCard.email')}:</strong> {user.email}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MessageTwoTone sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                <strong>{t('profileCard.line')}:</strong> {`LINE User ID not available`}
              </Typography>
              <Settings sx={{ color: 'secondary.dark', cursor: 'pointer' }} />
            </Box>
          </Box>

          {liffEnv.isInClient && (
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                LINE Environment
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>In LINE App:</strong> {liffEnv.isInClient ? 'Yes' : 'No'}
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Language:</strong> {liffEnv.language}
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>LINE Version:</strong> {liffEnv.lineVersion}
              </Typography>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<Logout />}
            onClick={() => setShowLogoutDialog(true)}
            disabled={isLoading}
            sx={{ mt: 1 }}
          >
            {t('signOut.title')}
          </Button>
        </CardContent>
      </Card>

      <DemoFeatures />

      <Dialog
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {t('signOut.title')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('signOut.confirmation')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowLogoutDialog(false)}
            disabled={isLoading}
          >
            {t('signOut.cancel')}
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            disabled={isLoading}
          >
            {t('signOut.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
