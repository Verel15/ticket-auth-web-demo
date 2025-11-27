import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import liff from '@line/liff';
import { login } from '../../service/user.service';
import Cookies from 'js-cookie';

export interface User {
  uuid?: string;
  displayName?: string;
  pictureUrl?: string;
  company?: string;
  email?: string;
}

export interface AuthState {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  liffInitialized: boolean;
}

const initialState: AuthState = {
  user: {},
  isAuthenticated: false,
  isLoading: false,
  error: null,
  liffInitialized: false,
};

// LIFF initialization
export const initializeLiff = createAsyncThunk(
  'auth/initializeLiff',
  async (liffId: string, { rejectWithValue }) => {
    try {
      await liff.init({ liffId });

      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        return {
          user: {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
          },
          isAuthenticated: true,
        };
      }

      return {
        user: null,
        isAuthenticated: false,
      };
    } catch (error) {
      return rejectWithValue(`LIFF initialization failed: ${error}`);
    }
  }
);

// LINE Login
export const loginWithLine = createAsyncThunk(
  'auth/loginWithLine',
  async (_, { rejectWithValue }) => {
    try {
      if (!liff.isLoggedIn()) {
        liff.login();
        return null; // Will redirect, so no need to return data
      }

      const profile = await liff.getProfile();
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };
    } catch (error) {
      return rejectWithValue(`Login failed: ${error}`);
    }
  }
);

// Regular email/password login (for demo purposes)
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(email, password)
      const results = response.data

      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log({ results, response });
      
      if (response.status === 200) {
        return {
          uuid: results.profile.uuid,
          displayName: results.profile.displayName || 'Anonymous',
          company: results.profile.company,
          email: results.profile.email,
        }
      }
      throw new Error(results.message);
    } catch (error: any) {
      console.log(error.message);
            
      return rejectWithValue(`Login failed: ${error.message}`);
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        userId: `user-${Date.now()}`,
        displayName: displayName,
        email: email,
        pictureUrl: '/default-avatar.png',
      };
    } catch (error) {
      return rejectWithValue(`Registration failed: ${error}`);
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      if (liff.isLoggedIn()) {
        liff.logout();
      }

      Cookies.remove('token')
      Cookies.remove('refreshToken')

      return null;
    } catch (error) {
      return rejectWithValue(`Logout failed: ${error}`);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = {};
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize LIFF
      .addCase(initializeLiff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeLiff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.liffInitialized = true;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = action.payload.isAuthenticated;
        }
      })
      .addCase(initializeLiff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // LINE Login
      .addCase(loginWithLine.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithLine.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginWithLine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Email Login
      .addCase(loginWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = {};
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
