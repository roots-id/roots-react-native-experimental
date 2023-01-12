import { createAsyncThunk } from '@reduxjs/toolkit';
import { addMessage } from '../slices/chat';
import { MessageType } from '../../models/constants/chat-enums';
import { sendMessage } from '../../helpers/messages';
import { LocalPlaintextStore } from '../../services';
import { loadChatsAndMessagesReducer} from '../slices/chat';
//import Datetime from 'react-datetime';
const BASE_CHAT = 'chat/';
const SEND_MESSAGE = `${BASE_CHAT}sendMessage`;


interface SendMessageDto {
  chatId: string;
  senderId: string;
  message: string;
  type: MessageType;
}

export const sendMessageToChat = createAsyncThunk(
    SEND_MESSAGE,
  async (messageDto: SendMessageDto, thunkAPI) => {

    const message= sendMessage(
      messageDto.chatId,
      messageDto.senderId,
      messageDto.message,
      messageDto.type,
      false,
      {},
      false
    )
    console.log('storing message', message)
    await LocalPlaintextStore.persist('chat'+'/'+messageDto.chatId+'/'+message._id, JSON.stringify(message));
    thunkAPI.dispatch(
      addMessage({
        chatId: messageDto.chatId,
        message: message,
      })
    );
    
   
  }
);

//create a load_chats_and_messages thunk using LocalPlaintextStore and call loadChatsAndMessages reducer

export const loadChatsAndMessages = createAsyncThunk(
    `${BASE_CHAT}loadChatsAndMessages`,
    async (arg, thunkAPI) => {
      let chats =  await LocalPlaintextStore.getAllChatsWithMessages();
      console.log("loading chats and messages from local storage ", chats)
      thunkAPI.dispatch(loadChatsAndMessagesReducer(chats));
    }
);