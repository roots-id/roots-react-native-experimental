import { createSelector } from 'reselect';
import { getContactById } from './contact';

const chatSelector = (state: any) => state.chat;

export const getAllChats = createSelector(chatSelector, (state) => {
  const chats = Object.values(state.chats) ?? [];
  return chats;
});

export const getChatById = createSelector(chatSelector, (_, chatId) => chatId, (state) => getContactById(state), (state, chatId, fetchContact) => {
    const chatById = state.chats[chatId];
    if(!chatById) return {};

    return { _id: chatById._id, messages: chatById?.messages.map(message => {
        const user = fetchContact(message.senderId);
        return {
            ...message,
            user: {
                _id: user._id,
                name: user.displayName,
                avatar: user.displayPictureUrl
            }
        }
    })}
});
