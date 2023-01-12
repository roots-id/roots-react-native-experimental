import { createAsyncThunk } from '@reduxjs/toolkit'
import uuid from 'react-native-uuid';
import { MOCK_CONTACT_PREFIX_ID } from '../constants/mocks';
import { addContact, loadAllContactsReducer } from '../slices/contact';
import { LocalPlaintextStore } from '../../services';

const BASE_CONTACT = 'contact/';
const CREATE_CONTACT = `${BASE_CONTACT}create`;

export const createContact = createAsyncThunk(
  CREATE_CONTACT,
async (contact: any, thunkAPI: any) => {
  const dummyContact = {
    //id is a concat of MOCK_CONTACT_PREFIX_ID and displayname without spaces
      _id: MOCK_CONTACT_PREFIX_ID + contact.displayName.replace(/\s/g, ''),
      displayPictureUrl: contact.displayPictureUrl,
      displayName: contact.displayName,
      ...(contact.isCurrentUser ? { isCurrentUser: true} : {})
    }
  console.log('dummyContact', dummyContact)
  const does_contact_exist = await LocalPlaintextStore.fetch('contacts/'+dummyContact._id);
  if(does_contact_exist !== null) {
    console.log('found contacts in local storage', does_contact_exist)
    thunkAPI.dispatch(addContact(JSON.parse(does_contact_exist)));
    return dummyContact._id;
  }
  console.log('contact does not exist in local storage', dummyContact)
  await LocalPlaintextStore.persist('contacts/'+dummyContact._id, JSON.stringify(dummyContact));

  thunkAPI.dispatch(addContact(dummyContact));

  return dummyContact._id;
}
)

export const loadAllContacts = createAsyncThunk(
  `${BASE_CONTACT}loadAllContacts`,
  async (arg, thunkAPI) => {
    let bodies = []
    const contacts = await LocalPlaintextStore.fetchbyregex(/contacts\//)
    console.log('contacts', contacts)  
      for (const contact of contacts) {
        console.log('contact', contact)
        const id = contact[0]
        const body = JSON.parse(contact[1])
        bodies.push(body)
        
      }
    
    thunkAPI.dispatch(loadAllContactsReducer(bodies))

  }
)
