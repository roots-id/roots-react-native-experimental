import AsyncStorage from '@react-native-async-storage/async-storage';

import * as models from'../../models';
export class LocalStorageService {
  persist = async (key: string, value: string): Promise<any> => {
    await AsyncStorage.setItem(key, value);
  };
  fetch = async (key: string): Promise<any> => {
    const item = await AsyncStorage.getItem(key);
    return item;
  }
  remove = async (key: string): Promise<any> => {
    await AsyncStorage.removeItem(key);
  }

  clear = async (): Promise<any> => {
    await AsyncStorage.clear();
  }

  fetchbyregex = async (regex: RegExp): Promise<any> => {
    const keys = await AsyncStorage.getAllKeys();
    const filteredKeys = keys.filter(key => regex.test(key));
    const items = await AsyncStorage.multiGet(filteredKeys);
    //return an array where the each element is from the form [key, value] parses the value split on / and grabs the second element from the items array
    return items
  }

  storeCredential = async (credential: any): Promise<any> => {
    const key = `credential/${credential._id}`;
    console.log('storing credential at location, ', key, 'with value', credential)
    await this.persist(key, JSON.stringify(credential));
  }

  storeMessage = async (message: any): Promise<any> => {
    const key = `chat/${message.rel}/${message._id}`;
    console.log('storing message', message, key)
    await this.persist(key, JSON.stringify(message));
  }

  storeContact = async (contact: any): Promise<any> => {
    const key = `contact/${contact.id}`;
    await this.persist(key, JSON.stringify(contact));
  }

  getAllCredentials = async (): Promise<any> => {
    const credentials = await this.fetchbyregex(/credential\//);
    let credentialsArray = []
    for (const credential of credentials) {
      const body = JSON.parse(credential[1])
      credentialsArray.push(body)
    }
    console.log('loading credenitals state, ', credentials)
    return credentialsArray
  }


  getAllChatsWithMessages = async (): Promise<any> => {
    const messages = await this.fetchbyregex(/chat\//);
    // chat : {chatId: {_id: chatId, messages: []}}
    let chats = {}
    for (const message of messages) {
      const body = JSON.parse(message[1])
      const id = message[0].split('/')[1]
      if (!chats[id]) {
        chats[id] = {
          _id: id,
          messages: []
        }
      }
      chats[id].messages.push(body)
    }
    return chats
  }

  getAllContacts = async (): Promise<any> => {
    const contacts = await this.fetchbyregex(/contact\//);
    let contactsArray = []
    for (const contact of contacts) {
      const body = JSON.parse(contact[1])
      contactsArray.push(body)
    }
    return contactsArray
  }

}

export const LocalPlaintextStore = new LocalStorageService();