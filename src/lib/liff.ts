import liff from '@line/liff';

// LIFF App ID - replace with your actual LIFF App ID
export const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || '1234567890-abcdefgh';

// LIFF Configuration
export const liffConfig = {
  liffId: LIFF_ID,
};

// Initialize LIFF
export const initializeLiff = async (): Promise<boolean> => {
  try {
    await liff.init(liffConfig);
    console.log('LIFF initialized successfully');
    return true;
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    return false;
  }
};

// Check if LIFF is ready
export const isLiffReady = (): boolean => {
  return liff.isInClient() || liff.isSubWindow() || typeof window !== 'undefined';
};

// Get LINE login URL
export const getLineLoginUrl = (): string => {
  if (liff.isLoggedIn()) {
    return '';
  }
  // LIFF doesn't have getLoginURL method, use login() directly
  return '';
};

// Login with LINE
export const loginWithLine = (): void => {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
};

// Logout from LINE
export const logoutFromLine = (): void => {
  if (liff.isLoggedIn()) {
    liff.logout();
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      return profile;
    }
    return null;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
};

// Get access token
export const getAccessToken = (): string | null => {
  try {
    if (liff.isLoggedIn()) {
      return liff.getAccessToken();
    }
    return null;
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};

// Get ID token
export const getIdToken = (): string | null => {
  try {
    if (liff.isLoggedIn()) {
      return liff.getIDToken();
    }
    return null;
  } catch (error) {
    console.error('Failed to get ID token:', error);
    return null;
  }
};

// Check if running in LINE app
export const isInLineApp = (): boolean => {
  return liff.isInClient();
};

// Close LIFF window
export const closeLiffWindow = (): void => {
  if (liff.isSubWindow()) {
    liff.closeWindow();
  }
};

// Send message to LINE chat
export const sendMessage = async (message: string): Promise<boolean> => {
  try {
    if (liff.isInClient()) {
      await liff.sendMessages([
        {
          type: 'text',
          text: message,
        },
      ]);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to send message:', error);
    return false;
  }
};

// Share target picker
export const shareTargetPicker = async (message: string): Promise<boolean> => {
  try {
    await liff.shareTargetPicker([
      {
        type: 'text',
        text: message,
      },
    ]);
    return true;
  } catch (error) {
    console.error('Failed to share:', error);
    return false;
  }
};

// Get environment info
export const getLiffEnvironment = () => {
  return {
    isInClient: liff.isInClient(),
    isInSubWindow: liff.isSubWindow(),
    isLoggedIn: liff.isLoggedIn(),
    isReady: liff.ready,
    language: liff.getLanguage(),
    version: liff.getVersion(),
    lineVersion: liff.getLineVersion(),
    isApiAvailable: (api: string) => liff.isApiAvailable(api),
  };
};
