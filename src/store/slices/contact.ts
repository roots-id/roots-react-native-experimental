import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalPlaintextStore } from '../../services';
const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    contacts: [],
  },
  reducers: {
    loadAllContactsReducer(state, action: PayloadAction<any>): any {
      state.contacts = action.payload;
    },

    addContact(state, action: PayloadAction<any>): any {
      state.contacts.push(action.payload);
      // extract only the _id field from action.payload      
    },
    updateContact(state, action: PayloadAction<any>): any {
      const { _id, ...rest } = action.payload;
      const contactIndex = state.contacts.findIndex(contact => contact._id === _id);
      if(contactIndex >= 0) {
        state.contacts[contactIndex] = { ...state.contacts[contactIndex], ...rest };
      }
    }
  }
});

export const { addContact, updateContact , loadAllContactsReducer} = contactSlice.actions;
export const contactReducer = contactSlice.reducer;
