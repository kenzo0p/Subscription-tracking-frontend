import { createSlice } from "@reduxjs/toolkit";
export interface AuthState {
  user: null;
  loading: boolean;
}

const initialState: AuthState = {
  loading: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setUser } = authSlice.actions;

export default authSlice.reducer;
