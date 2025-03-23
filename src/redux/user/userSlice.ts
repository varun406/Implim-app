import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// Define a type for the slice state
interface UserState {
  username: string | null;
  isLoggedIn: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  username: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUsername: (state, action: PayloadAction<string | null>) => {
      state.username = action.payload;
    },
    setUserLogin: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const {addUsername, setUserLogin, logout} = userSlice.actions;

export default userSlice.reducer;
