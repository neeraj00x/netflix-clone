import { createSlice } from '@reduxjs/toolkit';
// import { fetchCount } from './counter/counterAPI';

const initialState = {
  user: null,
  status: 'idle',
};


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    }
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.counter.user;

export default userSlice.reducer;
