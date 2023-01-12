import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const credentialSlice = createSlice({
  name: 'credentials',
  initialState: {
    credentials: [],
  },
  reducers: {
    loadCredentialsReducer(state, action: PayloadAction<any>) {
      state.credentials = action.payload;
    },
    addCredential(state, action: PayloadAction<any>) {
      state.credentials.push(action.payload);
    },
    updateCredential(state, action: PayloadAction<any>) {
      state.credentials[action.payload.index] = action.payload.credential;
    },
  },
});

export const { addCredential, updateCredential, loadCredentialsReducer } = credentialSlice.actions;
export const credentialReducer = credentialSlice.reducer;
