'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  LanguageOutlined,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAppSelector } from '@/lib/store';
import { useTranslations, useLocale } from 'next-intl';
import Cookies from 'js-cookie';

interface HeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const { mode, toggleTheme } = useTheme();
  const locale = useLocale();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);

  const handleLanguageChange = (lang: string) => {
    if (locale !== lang) {
      Cookies.set('locale', lang);
      window.location.reload()
    } else {
      setLanguageAnchorEl(null);
    }

  }
  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };
    const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  }

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Auth Demo */}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated && user ? (
            <>
              <Chip
                avatar={
                  <Avatar
                    src={user.pictureUrl}
                    alt={user.displayName}
                    sx={{ width: 24, height: 24 }}
                  >
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                }
                label={user.displayName}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  mr: 1,
                }}
              />
            </>
          ) : (
            <>
              <Button
                color="inherit"
                startIcon={<Login />}
                onClick={onLoginClick}
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                startIcon={<PersonAdd />}
                onClick={onRegisterClick}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  mr: 1,
                }}
              >
                Register
              </Button>
            </>
          )}
            <IconButton color={'inherit'} sx={{ mr: 1 }} onClick={handleLanguageClick}>
              <Badge badgeContent={locale.toUpperCase()}>
                <LanguageOutlined />
              </Badge>
            </IconButton>
          <Menu
            anchorEl={languageAnchorEl}
            open={Boolean(languageAnchorEl)}
            onClose={handleLanguageMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuItem onClick={() => handleLanguageChange('th')}>TH</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('en')}>EN</MenuItem>
          </Menu>

          <IconButton
            color="inherit"
            onClick={toggleTheme}
            aria-label="toggle theme"
          >
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
