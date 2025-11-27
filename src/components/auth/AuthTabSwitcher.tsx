'use client';

import React from 'react';
import {
  Box,
  Tab,
  Tabs,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Login,
  PersonAdd,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useTheme } from '@/components/providers/ThemeProvider';

import { useTranslations } from 'next-intl';

type AuthMode = 'login' | 'register';

interface AuthTabSwitcherProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
}

export default function AuthTabSwitcher({ authMode, onAuthModeChange }: AuthTabSwitcherProps) {
  const { mode, toggleTheme } = useTheme();
  const t = useTranslations('HomePage');
  const handleChange = (event: React.SyntheticEvent, newValue: AuthMode) => {
    onAuthModeChange(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '12px 12px 0 0',
        border: '1px solid',
        borderColor: 'divider',
        borderBottom: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Theme toggle button */}
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Tooltip>
      </Box>

      <Tabs
        value={authMode}
        onChange={handleChange}
        centered
        sx={{
          minHeight: 60,
          '& .MuiTab-root': {
            minWidth: 150,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            py: 2,
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        <Tab
          value="login"
          label={t('signIn.title')}
          icon={<Login />}
          iconPosition="start"
          sx={{
            '&.Mui-selected': {
              background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1) 30%, rgba(66, 165, 245, 0.1) 90%)',
            },
          }}
        />
        <Tab
          value="register"
          label={t('signUp.title')}
          icon={<PersonAdd />}
          iconPosition="start"
          sx={{
            '&.Mui-selected': {
              background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1) 30%, rgba(66, 165, 245, 0.1) 90%)',
            },
          }}
        />
      </Tabs>
    </Paper>
  );
}
