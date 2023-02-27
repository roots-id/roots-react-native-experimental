import React, { useEffect, useState, useCallback } from 'react';
import { Linking, Text, View } from 'react-native';
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Reply,
  User,
} from 'react-native-gifted-chat';

import {
  renderInputToolbar,
      renderBubble,
      renderComposer,
      renderSend,
} from "../components/gifted-chat";
import * as models from '../models';;
import { styles } from '../styles/styles';
import { CompositeScreenProps } from '@react-navigation/core/src/types';
import { BubbleProps } from 'react-native-gifted-chat/lib/Bubble';
import { MessageType } from '../models/constants';
import { ROUTE_NAMES } from '../navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getChatById } from '../store/selectors/chat';
import {
  addCredentialAndNotify, publishDid, updateDid,
  denyCredentialAndNotify, resolveFetchDid, resolveDidAndShowKeys, acceptPrismCredential
} from '../store/thunks/wallet';
import {
  getContactById,
  getCurrentUserContact,
} from '../store/selectors/contact';
import { sendMessageToChat } from '../store/thunks/chat';
import { updateMessageQuickReplyStatus } from "../store/slices/chat";
import { agent } from '../services/agent';
let agentImpl = new agent();
export default function ChatScreen({
  route,
  navigation,
}: CompositeScreenProps<any, any>) {
  console.log('ChatScreen - route params', route.params);
  const user = route.params.user;
  // roots.getChatItem(route.params.chatId)
  const [contact, setContact] = useState<models.contact>();
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const currentChat = useSelector((state) => getChatById(state, user._id));
  const currentUser = useSelector(getCurrentUserContact);
  const getUserById = useSelector(getContactById);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   setMessages(messages);
  // }, []);
  //   useEffect(() => {
  //     console.log('ChatScreen - chat set', chat);
  //     const chatSession = roots.startChatSession(chat.id, {
  //       chat: chat,
  //       onReceivedMessage: (message) => {
  //         if (message && GiftedChat) {
  //           setMessages((currentMessages) => {
  //             const iMsg = mapMessage(message);
  //             if (iMsg) {
  //               return GiftedChat.append(currentMessages, [iMsg]);
  //             }
  //           });
  //         }
  //       },
  //       onProcessing: (processing) => {
  //         setProcessing(processing);
  //         console.log('ChatScreen - updated processing indicator', processing);
  //       },
  //     });
  //     if (chatSession.succeeded) {
  //       console.log('ChatScreen - chat session started successfully');
  //     } else {
  //       console.error('ChatScreen - chat session failed', chatSession.error);
  //     }

  //     setContact(getContactByAlias(chat.id));
  //     console.log('ChatScreen - getting all messages');
  //     const msgs = roots.getMessagesByChat(chat.id);
  //     console.log('ChatScreen - got', msgs.length, 'msgs');
  //     const mapMsgs = msgs.map((msg) => {
  //       return mapMessage(msg);
  //     });
  //     setMessages(mapMsgs);
  //     setLoading(false);
  //     return () => {
  //       chatSession.end;
  //     };
  //   }, [chat]);

  //   useEffect(() => {}, [messages]);

  //   async function handleSend(pendingMsgs: IMessage[]) {
  //     console.log('ChatScreen - handle send', pendingMsgs);
  //     const result = await roots.sendMessages(
  //       chat,
  //       pendingMsgs.map((msg) => msg.text),
  //       roots.MessageType.TEXT,
  //       contacts.getUserId()
  //     );
  //   }

  const openRelationshipDetailScreen = (user) => {
    navigation.navigate(ROUTE_NAMES.RELATIONSHIP_DETAILS, {
      user,
    });
  };

  function handleQuickReply(replies: Reply[]) {
    console.log('replies', replies);
    if (replies) {
      for (const reply of replies) {
        if (reply.value.startsWith(MessageType.PROMPT_OWN_DID)) {
          console.log('ChatScreen - quick reply view did');
          openRelationshipDetailScreen(currentUser);
        } else if (
          reply.value.startsWith(MessageType.PROMPT_ISSUED_CREDENTIAL)
        ) {
          if (reply.value.endsWith(MessageType.CRED_REVOKE)) {
            console.log(
              'ChatScreen - process quick reply for revoking credential'
            );
            const msgCurrentChat = currentChat?.messages.find(

              (message) => message._id === reply.messageId
            );
            let chatid: string = currentChat?._id
            let recordid: string = msgCurrentChat?.data?.recordId
            //entrypoint fro prism acceptance
            dispatch(acceptPrismCredential(
              {chatId: chatid,
              recordId: recordid})
              )
            console.log('ChatScreen - credential revoked?');
          } else if (reply.value.endsWith(MessageType.CRED_VIEW)) {
            console.log('ChatScreen - quick reply view issued credential');
            const msgCurrentChat = currentChat?.messages.find(

              (message) => message._id === reply.messageId
            );
            navigation.navigate(ROUTE_NAMES.CREDENTIAL_DETAILS, {
              cred: msgCurrentChat?.data?.credential,
            });
          }
        } else if (reply.value.startsWith(MessageType.PROMPT_OWN_CREDENTIAL)) {
          console.log('ChatScreen - process quick reply for owned credential');
          if (reply.value.endsWith(MessageType.CRED_VIEW)) {
            console.log('ChatScreen - quick reply view imported credential');
            const msgCurrentChat = currentChat?.messages.find(
              (message) => message._id === reply.messageId
            );
            navigation.navigate(ROUTE_NAMES.CREDENTIAL_DETAILS, {
              cred: msgCurrentChat?.data?.credential,
            });
          }
        } else if (
          reply.value.startsWith(
            MessageType.PROMPT_PREVIEW_ACCEPT_DENY_CREDENTIAL
          )
        ) {
          console.log('ChatScreen - process quick reply for owned credential');
          const msgCurrentChat = currentChat?.messages.find(
            (message) => message._id === reply.messageId
          );
          if (reply.value.endsWith(MessageType.CRED_PREVIEW)) {
            console.log('ChatScreen - quick reply preview credential');
            navigation.navigate(ROUTE_NAMES.CREDENTIAL_DETAILS, {
              cred: msgCurrentChat?.data?.credential,
            });
          } else if (reply.value.endsWith(MessageType.CRED_ACCEPT)) {
            console.log('ChatScreen - quick reply accept imported credential');
            dispatch(addCredentialAndNotify(msgCurrentChat?.data?.credential));
          } else if (reply.value.endsWith(MessageType.CRED_DENY)) {
            console.log('ChatScreen - quick reply deny imported credential');
            dispatch(denyCredentialAndNotify(msgCurrentChat?.data?.credential));
            dispatch(
                updateMessageQuickReplyStatus({
                  chatId: currentChat?._id,
                  messageId: msgCurrentChat?._id,
                  keepIt: false,
                })
            );
          }
        } else if (
          reply.value.startsWith(MessageType.PROMPT_ACCEPTED_CREDENTIAL)
        ) {
          console.log(
            'ChatScreen - process quick reply for accepted credential'
          );
          if (reply.value.endsWith(MessageType.CRED_VIEW)) {
            console.log('ChatScreen - quick reply view credential');
            const msgCurrentChat = currentChat?.messages.find(
              (message) => message._id === reply.messageId
            );
            navigation.navigate(ROUTE_NAMES.CREDENTIAL_DETAILS, {
              cred: msgCurrentChat?.data?.credential,
            });
          }
        } else if (reply.value.startsWith(MessageType.PROMPT_DISPLAY_IDENTIFIER)) {
          console.log('ChatScreen - quick reply display id');
          const msg = currentChat?.messages.find(
              (message) => message._id === reply.messageId)
          navigation.navigate(ROUTE_NAMES.IDENTIFIER_DETAILS, {
            identifier: msg?.data?.identifier

          });
        } else if (reply.value.startsWith(MessageType.PROMPT_DISPLAY_OOB)) {
          console.log('ChatScreen - quick reply display oob');
          // dispatch(parseOob())
          const msg = currentChat?.messages.find(
              (message) => message._id === reply.messageId)
          console.log('ChatScreen - reply msg data is',msg?.data);
          navigation.navigate(ROUTE_NAMES.SHOW_QR_CODE, {qrdata: msg?.data?.identifier.oob});
        } else if (reply.value.startsWith(MessageType.PROMPT_RETRY_PROCESS)) {
          console.log('ChatScreen - process quick reply for retry');

            const msgCurrentChat = currentChat?.messages.find(
                (message) => message._id === reply.messageId
            );
            console.log('ChatScreen - retrying',msgCurrentChat?.data?.callback)
            dispatch(msgCurrentChat?.data?.callback())
          } else if (reply.value.startsWith(MessageType.PROMPT_GET_MESSAGES)) {
              console.log('ChatScreen - process quick reply for check messages');
              // dispatch(checkMessages())
          } else if (reply.value.startsWith(MessageType.FETCH_PRISM_DID)) {
              console.log('fetching prism did ')
              const msg = currentChat?.messages.find(
                (message) => message._id === reply.messageId)
                

              let short_did = msg.text.split(": ")[1].replace(" ","")
              console.log('ChatScreen - prism did is',msg);
              dispatch(resolveFetchDid(short_did))

            
          } else if (reply.value.startsWith(MessageType.LONG_PRISM_DID_PUBLISH)) {
            console.log('fetching prism did ')
            const msg = currentChat?.messages.find(
              (message) => message._id === reply.messageId)
              

            let short_did = msg.data.did
            console.log('ChatScreen - prism did is',msg);
            dispatch(publishDid(short_did))

          
        }else if (reply.value.startsWith(MessageType.SHOW_KEYS_PRISM_DID)) {
          console.log('fetching prism did ')
          const msg = currentChat?.messages.find(
            (message) => message._id === reply.messageId)
            
            //try this
          let short_did = msg.data.didDoc?.did?.controller
          //or else
          if (short_did == undefined) {
            short_did = msg.data.did
          }

          console.log('ChatScreen - prism did is',msg);
          dispatch(resolveDidAndShowKeys(short_did))

        
      }

        else if (reply.value.startsWith(MessageType.LONG_PRISM_UPDATE)) {
          console.log('fetching prism did ')
          const msg = currentChat?.messages.find(
            (message) => message._id === reply.messageId)
            

          let short_did = msg.data.didDoc.did.controller
          console.log('UPDATE-ChatScreen - update prism did is',msg.data.didDoc.did.controller);
          console.log('UPDATE-SHORT DID',reply);

          dispatch(updateDid(short_did))

        
      }
        else {
          console.log(
            'ChatScreen - reply value not recognized, was',
            reply.value
          );
        }
      }
    } else {
      console.log('ChatScreen - reply', replies, 'were undefined');
    }
  }

  //   function processBubbleClick(context: any, message: IMessage): void {
  //     console.log('ChatScreen - bubble pressed', context, message);
  //     const msg = roots.getMessageById(message._id.toString());
  //     if (msg) {
  //       switch (msg.type) {
  //         case roots.MessageType.BLOCKCHAIN_URL:
  //           console.log('ChatScreen - Clicked blockchain url msg', msg.data);
  //           Linking.openURL(msg.data);
  //           break;
  //         case roots.MessageType.DID:
  //           console.log('ChatScreen - Clickable did msg', msg.data);
  //           const c = getContactByDid(msg.data);
  //           if (c) {
  //             showQR(navigation, asContactShareable(c));
  //           }
  //           break;
  //         default:
  //           console.log('ChatScreen - Clicked non-active message type', msg.type);
  //       }
  //     }
  //   }

  //   if (loading) {
  //     console.log('ChatScreen - Loading....');
  //     return <Loading />;
  //   }

  const onSend = useCallback((messages = []) => {
    messages.forEach((message) => {
      dispatch(
        sendMessageToChat({
          senderId: currentUser?._id,
          chatId: currentChat?._id,
          message: message.text,
          type: MessageType.TEXT
        })
      );
    });
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, messages)
    // );
  }, []);

  return (
    <View style={{ backgroundColor: '#000000', flex: 1, display: 'flex' }}>
      <GiftedChat
        isTyping={processing}
        inverted={false}
        onQuickReply={handleQuickReply}
        messages={currentChat?.messages?.sort((a, b) => {
          return a.createdAt < b.createdAt ? -1 : 1;
        })}
        placeholder={'Tap to type...'}
        onSend={onSend}
        user={{
          _id: currentUser._id,
          name: currentUser.displayName,
          avatar: currentUser.displayPictureUrl,
        }}
        showUserAvatar={ false }
        renderUsernameOnMessage={ true }
        parsePatterns={(linkStyle) => [
          {
            type: 'url',
            style: styles.clickableListTitle,
            onPress: (tag: string) => Linking.openURL(tag),
          },
          {
            pattern: /\*Click to geek out on Cardano blockchain details\*/,
            style: styles.red,
          },
        ]}
        renderAvatarOnTop={true}
        renderComposer={renderComposer}
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
        renderSend={renderSend}
        quickReplyStyle={{
          backgroundColor: "#140A0F",
          borderRadius: 4,
          borderWidth: 0,
          elevation: 3,
          marginRight: 4,
          marginTop: 6,
        }}
        quickReplyTextStyle={{
          color: "#DE984F",
          fontSize: 12,
        }}
        showAvatarForEveryMessage={true}
        onPressAvatar={(u) => openRelationshipDetailScreen(getUserById(u._id))}
      />
    </View>
  );

  //   function mapMessage(message: models.message): IMessage {
  //     console.log('ChatScreen - Map message for gifted', message);
  //     const image = message.image;
  //     const user = getContactByAlias(message.rel);
  //     const mappedMsg: IMessage = {
  //       _id: message.id,
  //       createdAt: message.createdTime,
  //       system: message.system,
  //       text: message.body,
  //       user: mapUser(user),
  //     };
  //     if (message.image) {
  //       mappedMsg.image = message.image;
  //     }
  //     if (message.quickReplies) {
  //       mappedMsg.quickReplies = message.quickReplies;
  //     }
  //     console.log('ChatScreen - got mapped message', mappedMsg);
  //     return mappedMsg;
  //     //image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png',
  //     // You can also add a video prop:
  //     //video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  //     // Mark the message as sent, using one tick
  //     //sent: true,
  //     // Mark the message as received, using two tick
  //     //received: true,
  //     // Mark the message as pending with a clock loader
  //     //pending: true,
  //     // Any additional custom parameters are passed through
  //   }

  //   function mapUser(rel: models.contact | undefined): User {
  //     console.log('ChatScreen - Map User for gifted', rel);
  //     let user: User;
  //     if (rel) {
  //       user = {
  //         _id: rel.id,
  //         name: rel.displayName,
  //         avatar: rel.displayPictureUrl,
  //       };
  //     } else {
  //       console.error('Unable to map user', rel);
  //       user = {
  //         _id: '',
  //         name: '',
  //         avatar: '',
  //       };
  //     }

  //     console.log('ChatScreen - mapped user is', user);
  //     return user;
  //   }
}
