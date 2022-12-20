import ReactNative from 'react-native';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';
import { BOTS_MSGS, BOTS_NAMES } from '../../common/constants';
import { WALLET_CREATED_SUCCESS } from '../action-types/wallet';
import { addProfile, addWallet, changeProfileInfo } from '../slices/wallet';
import { createContact } from './contact';
import { addMessage, initiateChat } from '../slices/chat';
import { MessageType } from '../../models/constants/chat-enums';
import { sendMessage } from '../../helpers/messages';
import {
  addCredentialToList,
  createAndAddCredential,
  createCredential,
} from './credential';
import {
  getCurrentUserContact,
  getRootsHelperContact,
} from '../selectors/contact';
import { updateContact } from '../slices/contact';
import {createAndAddId} from "./identifier";
import * as models from "../../models";
import thunk from "redux-thunk";
import {identifier} from "../../models";
import uuid from "react-native-uuid";

const { DIDFunctionalities, CalendarModuleFoo } = ReactNative.NativeModules;

const WALLET_NAME_STORAGE_KEY = 'primaryRootsWalletStorageNameKey';

const BASE_WALLET = 'wallet/';
const CREATE_WALLET = `${BASE_WALLET}create`;
const INITIATE_ACCOUNT = `${BASE_WALLET}initiateAccount`;
const INITIATE_CONTACT = `${BASE_WALLET}initiateContact`;
const CREATE_NEW_CREDENTIAL = `${BASE_WALLET}createNewCredential`;
const CREATE_NEW_DID = `${BASE_WALLET}createNewDID`;
const ADD_CREDENTIAL_AND_NOTIFY = `${BASE_WALLET}addCredentialAndNotify`;
const DENY_CREDENTIAL_AND_NOTIFY = `${BASE_WALLET}denyCredentialAndNotify`;
const UPDATE_PROFILE_AND_NOTIFY = `${BASE_WALLET}updateProfileAndNotify`;
const PRISM = `${BASE_WALLET}/prism/`
const PRISM_DEMO = `${PRISM}/prismDemo/`;
const PRISM_DEMO_START = `${PRISM_DEMO}startDemo`;
const PRISM_CREATE_ID = `${PRISM}/id/`;
const PRISM_CREATE_PEER_DID = `${PRISM_CREATE_ID}createPeerID`;

let discordSocialIssuerId
let rootsHelperId: any;
let prismDemoId: any;

    interface CreateWalletDto {
  name: string;
  mnemonic: string;
  password: string;
}

export const createWallet = createAsyncThunk(
  CREATE_WALLET,
  async (wallet: CreateWalletDto, thunkAPI) => {
    const createdWallet = { ...wallet, key: WALLET_NAME_STORAGE_KEY };
    thunkAPI.dispatch(addWallet(createdWallet));
  }
);

async function setupDiscordDemo(thunkAPI: any, rootsHelperId: unknown,today: Date) {
    const discordSocialIssuerId = (
        await thunkAPI.dispatch(
            createContact({
                displayPictureUrl:
                    'https://avatars.githubusercontent.com/u/1965106?s=200&v=4', //https://cdn.logojoy.com/wp-content/uploads/20210422095037/discord-mascot.png
                displayName: BOTS_NAMES.DISCORD_SOCIAL_ISSUER,
            })
        )
    ).payload;
    console.log('discordSocialIssuerId', discordSocialIssuerId);
    thunkAPI.dispatch(initiateChat({ chatId: discordSocialIssuerId }));

    const discordCreds = {
        alias: 'DISCORD HANDLE',
        issuerId: discordSocialIssuerId,
        credSub: {
            HANDLE: `@${faker.internet.userName()}`,
            'MEMBER SINCE': new Date(faker.date.past(2)).toLocaleString(),
            EMAIL: faker.internet.email(),
            'MESSAGE ID': discordSocialIssuerId,
            'CHANNEL ID': discordSocialIssuerId,
            'SERVER ID': discordSocialIssuerId,
            'ISSUED AT': new Date(Date.now()).toLocaleString(),
        },
        revoked: false,
    };
    console.log('discordCreds', discordCreds);
    const cred = (await thunkAPI.dispatch(createCredential(discordCreds)))
        .payload;
    thunkAPI.dispatch(
        addMessage({
            chatId: discordSocialIssuerId,
            message: sendMessage(
                discordSocialIssuerId,
                rootsHelperId,
                `A Discord Social credential has been created for you`,
                MessageType.PROMPT_PREVIEW_ACCEPT_DENY_CREDENTIAL,
                false,
                { credential: cred }
            ),
        })
    );
}

//create async function called generateOOB() that returns a string
function generateOOB(mediatorPeerDID: string): string {

    //create a json with type, id from and body
    const msg = {
        type: 'https://didcomm.org/out-of-band/2.0/invitation',
        id: faker.datatype.uuid(),
        from: mediatorPeerDID,
        body: {
            'accept': ['didcomm/v2'],
        }
    }

    //convert json to string
    const msgString = JSON.stringify(msg);
    console.log("wallet - OOB message is", msgString);
    //convert string to base64
    // const msgBase64 = Buffer.from(msgString).toString('base64');
    // console.log("wallet - OOB encoded message is", msgBase64)

    return msgString;
}

export const startPrismDemo = createAsyncThunk(
    PRISM_DEMO_START,
    async (args,thunkAPI) => {
        if(!prismDemoId) {
            prismDemoId = (
                await thunkAPI.dispatch(
                    createContact({
                        displayPictureUrl:
                            'https://raw.githubusercontent.com/roots-id/roots-react-native/simple-android-ios-web/src/assets/ATALAPRISM.png', //https://cdn.logojoy.com/wp-content/uploads/20210422095037/discord-mascot.png
                        displayName: BOTS_NAMES.PRISM_DEMO,
                    })
                )
            ).payload

            console.log('wallet - prismDemo contact name', prismDemoId);
            thunkAPI.dispatch(initiateChat({chatId: prismDemoId}));
        }
        // const result1 = await DIDFunctionalities.createPeerDID('false')
        // console.log('wallet - DIDFunctionalities await peerDID', result1);
        // const didObj: identifier = {
        //     _id: result1,
        //     alias: "prism peer did " + result1,
        //     published: false
        // }
        // const prismDid = (await thunkAPI.dispatch(createAndAddId(didObj)))
        //     .payload;
        // console.log("")

        const error = await DIDFunctionalities.StartPrismAgent('did:peer:2.Ez6LSms555YhFthn1WV8ciDBpZm86hK9tp83WojJUmxPGk1hZ.Vz6MkmdBjMyB4TS5UbbQw54szm8yvMMf1ftGV2sQVYAxaeWhE.SeyJpZCI6Im5ldy1pZCIsInQiOiJkbSIsInMiOiJodHRwczovL21lZGlhdG9yLnJvb3RzaWQuY2xvdWQiLCJhIjpbImRpZGNvbW0vdjIiXX0').catch(console.error)
        if(!error || error.length<=0) {
            console.log('wallet - prism agent started');
            thunkAPI.dispatch(
                addMessage({
                    chatId: prismDemoId,
                    message: sendMessage(
                        prismDemoId,
                        rootsHelperId,
                        "Started Prism agent w/mediation",
                        MessageType.TEXT,
                        false,
                    ),
                })
            )

            const mediatorPeerDid = await DIDFunctionalities.createPeerDID('false')
            console.log("wallet - created peer did from mediator",mediatorPeerDid)

            if(mediatorPeerDid) {
                const oob = generateOOB(mediatorPeerDid)
                console.log("wallet - encoded oob",oob)
                // const decodedOob = atob(oob)
                // console.log("wallet - created oob",decodedOob);
                thunkAPI.dispatch(
                    addMessage({
                        chatId: prismDemoId,
                        message: sendMessage(
                            prismDemoId,
                            rootsHelperId,
                            "Prism created your identifier and corresponding Out-of-Band (OOB) invitation",
                            MessageType.PROMPT_DISPLAY_IDENTIFIER,
                            false,
                            {identifier:
                                    {
                                        identifier: mediatorPeerDid,
                                        oob: oob
                                    }
                            }
                        ),
                    })
                )
            } else {
                console.error("Could not create Prism peer did",mediatorPeerDid)
                thunkAPI.dispatch(
                    addMessage({
                        chatId: prismDemoId,
                        message: sendMessage(
                            prismDemoId,
                            rootsHelperId,
                            "Failed to generate your identifier",
                            MessageType.TEXT,
                            false,
                        ),
                    })
                )
            }



            //
            // let url = 'https://mediator.rootsid.cloud/?_oob=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9vdXQtb2YtYmFuZC8yLjAvaW52aXRhdGlvbiIsImlkIjoiNTkyYWYzZWEtNjAyOS00YmNiLTg1NzYtMWUzNjkzYjQ5MTU3IiwiZnJvbSI6ImRpZDpwZWVyOjIuRXo2TFNqZnY5OGNHbzFrcHdNYmpzNG90YzExdTlpeXJNNDFYYXczSmdDSnE1b3oyMy5WejZNa3FHMVRuaFdXcmMyWUdvQ0Z2dmN5WWt6VnRkcVNIMlRqMkJCam1HNlJneTNMLlNleUpwWkNJNkltNWxkeTFwWkNJc0luUWlPaUprYlNJc0luTWlPaUprYVdRNmNHVmxjam95TGtWNk5reFRha05WYWtkR2RYQTFZVnB1TkdoMFZraE1jR3BvVVhwMlVXOURaVk14ZDFKck5HSnZjMlUzYWpaRVdsRXVWbm8yVFd0cFVFeG9kVFU1UVZKUlZVSllOV2RHVFRKS1oyVlhia2hNV0dJMWRFZE9NbFJ2VUhRelNEVm1jWHBYZVM1VFpYbEtjRnBEU1RaSmJUVnNaSGt4Y0ZwRFNYTkpibEZwVDJsS2EySlRTWE5KYmsxcFQybEtiMlJJVW5kamVtOTJUREl4YkZwSGJHaGtSemw1VEc1S2RtSXpVbnBoVjFGMVdUSjRkbVJYVVdsTVEwcG9TV3B3WWtsdFVuQmFSMDUyWWxjd2RtUnFTV2xZV0RBaUxDSmhJanBiSW1ScFpHTnZiVzB2ZGpJaVhYMCIsImJvZHkiOnsiYWNjZXB0IjpbImRpZGNvbW0vdjIiXSwibGFiZWwiOiJhbGV4In19'
            //
            // const msgpacked2 = await DIDFunctionalities.parseOOBMessage(url);
            // console.log('wallet - parseOOBMessage is', msgpacked2);
            // //wait 1 minutes and then call getMessages
            //
            // // Wait for 1 minute (60,000 milliseconds)
            // await new Promise(resolve => setTimeout(resolve, 20000));
            //
            // thunkAPI.dispatch(
            //     addMessage({
            //         chatId: prismDemoId,
            //         message: sendMessage(
            //             prismDemoId,
            //             rootsHelperId,
            //             "Waiting for new messages...",
            //             MessageType.TEXT,
            //             false,
            //         ),
            //     })
            // )
            //
            // // Call the getMessages function
            // const messages =  DIDFunctionalities.getMessages();
            // // console.log('wallet - messages is', messages);
            // console.log('wallet - messages is', messages);
            // return url
        } else {
            console.error("wallet - prism agent failed to start",error)
            thunkAPI.dispatch(
                addMessage({
                    chatId: prismDemoId,
                    message: sendMessage(
                        prismDemoId,
                        rootsHelperId,
                        "Error starting Prism agent: "+error,
                        MessageType.PROMPT_RETRY_PROCESS,
                        false,
                        {callback: startPrismDemo}
                    ),
                })
            )
        }

    //console.log('wallet - msgpacked is', msgpacked);
    //
    // const resultmediated = await DIDFunctionalities.createPeerDID('true')
    // console.log('wallet - DIDFunctionalities mediated', resultmediated);
    //
    // const DIDDOC2 = await DIDFunctionalities.resolveDID(resultmediated);
    // console.log('wallet - DIDDOC for ',resultmediated,' is', DIDDOC2);
    // let url = 'https://domain.com/path?_oob=eyJpZCI6IjhkYzY3MTRjLTJiNmEtNGZkOS1iYzg3LWJiODhlYTk1NmFiNyIsInR5cGUiOiJodHRwczovL2RpZGNvbW0ub3JnL291dC1vZi1iYW5kLzIuMC9pbnZpdGF0aW9uIiwiZnJvbSI6ImRpZDpwZWVyOjIuRXo2TFNxQWlIZWRIRmZiZW14UnpyUjV0ZTQ2VUdzdHhkcW0yMXpFelVjd3dGaVhwcC5WejZNa2ljRWh6NHRoQlZMWVRlc3VEWkJOOTdLRTdoTHdYRVR0UWppajJrcWl3N3Q0LlNleUowSWpvaVpHMGlMQ0p6SWpvaWFIUjBjRG92TDJodmMzUXVaRzlqYTJWeUxtbHVkR1Z5Ym1Gc09qZ3dPREF2Wkdsa1kyOXRiU0lzSW5JaU9sdGRMQ0poSWpwYkltUnBaR052YlcwdmRqSWlYWDAiLCJib2R5Ijp7ImdvYWxfY29kZSI6ImNvbm5lY3QiLCJnb2FsIjoiRXN0YWJsaXNoIGEgdHJ1c3QgY29ubmVjdGlvbiBiZXR3ZWVuIHR3byBwZWVycyIsImFjY2VwdCI6W119fQ=='

    // const msgpacked2 = await DIDFunctionalities.parseOOBMessage(url);

}
);

export const initiateWalletCreation = createAsyncThunk(
  INITIATE_ACCOUNT,
  async (wallet: CreateWalletDto, thunkAPI) => {
    await thunkAPI.dispatch(createWallet(wallet));
    rootsHelperId = (
      await thunkAPI.dispatch(
        createContact({
          displayPictureUrl:
            'https://avatars.githubusercontent.com/u/95590918?s=200&v=4',
          displayName: BOTS_NAMES.ROOTS_HELPER,
        })
      )
    ).payload;

    const prismBotId = (
      await thunkAPI.dispatch(
        createContact({
          displayPictureUrl:
            'https://avatars.githubusercontent.com/u/11140484?s=200&v=4',
          displayName: BOTS_NAMES.PRISM_BOT,
        })
      )
    ).payload

    const userId = (
      await thunkAPI.dispatch(
        createContact({
          displayPictureUrl: 'https://avatars.githubusercontent.com/u/95590918?s=200&v=4',
          displayName: '',
          isCurrentUser: true,
        })
      )
    ).payload;
      thunkAPI.dispatch(addProfile({ _id: userId, displayPictureUrl: 'https://avatars.githubusercontent.com/u/95590918?s=200&v=4', displayName: '' }))
      thunkAPI.dispatch(initiateChat({ chatId: userId }));
      thunkAPI.dispatch(
      addMessage({
        chatId: userId,
        message: sendMessage(
          userId,
          rootsHelperId,
          BOTS_MSGS[0],
          MessageType.TEXT
        ),
      })
    );
      thunkAPI.dispatch(
      addMessage({
        chatId: userId,
        message: sendMessage(
          userId,
          rootsHelperId,
          BOTS_MSGS[1],
          MessageType.TEXT
        ),
      })
    );
      thunkAPI.dispatch(
      addMessage({
        chatId: userId,
        message: sendMessage(
          userId,
          rootsHelperId,
          BOTS_MSGS[2],
          MessageType.TEXT
        ),
      })
    );
    // thunkAPI.dispatch(
    //   addMessage({
    //     chatId: userId,
    //     message: sendMessage(
    //       userId,
    //       prismBotId,
    //       BOTS_MSGS[3],
    //       MessageType.TEXT
    //     ),
    //   })
    // );
    // thunkAPI.dispatch(
    //   addMessage({
    //     chatId: userId,
    //     message: sendMessage(
    //       userId,
    //       prismBotId,
    //       BOTS_MSGS[4],
    //       MessageType.PROMPT_OWN_DID,
    //       false,
    //       '1234567890'
    //     ),
    //   })
    // );
    // thunkAPI.dispatch(
    //   addMessage({
    //     chatId: userId,
    //     message: sendMessage(
    //       userId,
    //       prismBotId,
    //       BOTS_MSGS[5],
    //       MessageType.BLOCKCHAIN_URL,
    //       false,
    //       'randomhash123413132'
    //     ),
    //   })
    // );
    // thunkAPI.dispatch(
    //   addMessage({
    //     chatId: userId,
    //     message: sendMessage(
    //       userId,
    //       prismBotId,
    //       BOTS_MSGS[6],
    //       MessageType.TEXT
    //     ),
    //   })
    // );
    const today = new Date(Date.now());
    await setupDiscordDemo(thunkAPI,rootsHelperId,today)

    return WALLET_CREATED_SUCCESS;
  }
);

export const initiateNewContact = createAsyncThunk(
  INITIATE_CONTACT,
  async (contact, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());
    const userName =  faker.internet.userName()
    const newContactId = (
      await dispatch(
        createContact({
          displayPictureUrl: faker.internet.avatar(),
          displayName: userName,
        })
      )
    ).payload;

    dispatch(initiateChat({ chatId: newContactId }));

    dispatch(
      addMessage({
        chatId: newContactId,
        message: sendMessage(
          newContactId,
          rootsHelper?._id,
          'To celebrate your new contact, you are issuing a verifiable credential',
          MessageType.TEXT
        ),
      })
    );
      dispatch(
          addMessage({
              chatId: currentUser._id,
              message: sendMessage(
                  currentUser._id,
                  rootsHelper?._id,
                  `You added a demo contact ${userName}`,
                  MessageType.PROMPT_NEW_CONTACT,
                  false,
                  { contact: newContactId }
              ),
          })
      );
    const today = new Date(Date.now());
    const credsObject = {
      alias: `${faker.word.adjective()} Credential`,
      issuerId: currentUser?._id,
      credSub: {
        NAME: `${faker.word.adverb()} Credential`,
        achievement: 'Created fake cred',
        'ISSUED AT': today.toISOString(),
        id: currentUser?._id,
      },
      revoked: false,
    };
    const cred = (await dispatch(createAndAddCredential(credsObject))).payload;
    dispatch(
      addMessage({
        chatId: newContactId,
        message: sendMessage(
          newContactId,
          rootsHelper?._id,
          `You have issued a verifiable credential ${cred?.alias}!`,
          MessageType.PROMPT_ISSUED_CREDENTIAL,
          false,
          { credential: cred }
        ),
      })
    );
  }
);

export const createNewCredential = createAsyncThunk(
  CREATE_NEW_CREDENTIAL,
  async (contact, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());
    const today = new Date(Date.now());
    const credsObject = {
      alias: `${faker.word.adjective()} Credential`,
      issuerId: currentUser?._id,
      credSub: {
        NAME: `${faker.word.adverb()} Credential`,
        achievement: 'Created fake cred',
        'ISSUED AT': today.toISOString(),
        id: currentUser?._id,
      },
      revoked: false,
    };
    const cred = (
      await dispatch(
        createAndAddCredential(credsObject)
      )
    ).payload;
    dispatch(
      addMessage({
        chatId: currentUser._id,
        message: sendMessage(
          currentUser._id,
          rootsHelper?._id,
          `You created a demo credential ${cred.alias}!`,
          MessageType.PROMPT_ISSUED_CREDENTIAL,
          false,
          { credential: cred }
        ),
      })
    );
  }
);

export const addCredentialAndNotify = createAsyncThunk(
  ADD_CREDENTIAL_AND_NOTIFY,
  async (credential: any, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const cred = (await dispatch(addCredentialToList(credential))).payload;
    dispatch(
      addMessage({
        chatId: credential.issuerId,
        message: sendMessage(
          credential.issuerId,
          rootsHelper?._id,
          `Discord Social credential accepted ${cred.alias}!`,
          MessageType.PROMPT_ACCEPTED_CREDENTIAL,
          false,
          { credential: cred }
        ),
      })
    );
  }
);

export const denyCredentialAndNotify = createAsyncThunk(
  DENY_CREDENTIAL_AND_NOTIFY,
  async (credential: any, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    dispatch(
      addMessage({
        chatId: credential.issuerId,
        message: sendMessage(
          credential.issuerId,
          rootsHelper?._id,
          `Discord social credential denied!`,
          MessageType.TEXT,
          false
        ),
      })
    );
  }
);

export const updateProfileInfo = createAsyncThunk(
  UPDATE_PROFILE_AND_NOTIFY,
  async (profile: any, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());
    dispatch(changeProfileInfo({...profile.data}));
    dispatch(updateContact({ _id: currentUser?._id, ...profile.data}));
    dispatch(
      addMessage({
        chatId: currentUser?._id,
        message: sendMessage(
          currentUser?._id,
          rootsHelper?._id,
          profile.message,
          MessageType.TEXT
        ),
      })
    );
  }
);
