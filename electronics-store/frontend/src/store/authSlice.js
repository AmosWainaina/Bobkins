
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, access, refresh } = action.payload;
      
      // Ensure we store the COMPLETE user object
      state.user = {
        ...user,  // Spread all user properties
        is_staff: user.is_staff || false,
        is_superuser: user.is_superuser || false,
      };
      state.accessToken = access;
      state.refreshToken = refresh;
      state.isAuthenticated = true;
      
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Debug log
      console.log('User saved to Redux:', state.user);
    },
    clearUser(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;