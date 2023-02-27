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
// import { IdType, rootsManager } from 'roots-manager';
// import { Identifier } from 'roots-manager/src/types/id';
// import { CreateIdProtocol } from 'roots-manager/src/protocol/id';
// import { registerPrism } from 'RootsRN/src/prism';
import {Configuration, 
  ConnectionCollection, 
  ConnectionsManagementApi,
  CreateConnectionRequest,
  CreateConnectionOperationRequest,
  Connection,
  AcceptConnectionInvitationRequest,
  AcceptConnectionInvitationOperationRequest,
  GetConnectionRequest,
  CreateManagedDidRequestFromJSON,
  CreateManagedDidRequest,
  CreateManagedDidOperationRequest,
  DIDRegistrarApi,
  DIDApi,
  GetDidRequest,
  CreateManagedDIDResponse
} from '../../utils'
import { agent } from '../../services/agent';
let agentImpl = new agent()
const api_holder_didregistrar = new DIDRegistrarApi(new Configuration({
  basePath: 'https://lw22q.atalaprism.io/prism-agent',
  apiKey: '8FctIBKmFAUOvofO1DVycHgz4C5ONccn'
})
)

const api_holder_did = new DIDApi(new Configuration({
  basePath: 'https://lw22q.atalaprism.io/prism-agent',
  apiKey: '8FctIBKmFAUOvofO1DVycHgz4C5ONccn'
})
)

// const resolveDid = async (api: DIDApi, didRef: string) => {
//   const conn_par: GetDidRequest = {"didRef": didRef}
//   const data = await api.getDid(conn_par)
//   console.log("did resolved:")
//   console.log(data)
//   return data
// }


// const createDid = async (api: DIDRegistrarApi) => {
//   const conn_par: CreateManagedDidOperationRequest = {createManagedDidRequest: CreateManagedDidRequestFromJSON({
//     "documentTemplate": {
//       "publicKeys": [
//           {
//               "id": "key1",
//               "purpose": "authentication"
//           },
//           {
//               "id": "key2",
//               "purpose": "keyAgreement"
//           },
//       ],
//       "services": [
//           {
//               "id": "did:prism:test1",
//               "type": "LinkedDomains",
//               "serviceEndpoint": [
//                   "https://test1.com"
//               ]
//           },
//           {
//               "id": "did:prism:test2",
//               "type": "LinkedDomains",
//               "serviceEndpoint": [
//                   "https://test2.com"
//               ]
//           }
//       ]
//     }
//   })}
//   const data = await api.createManagedDid(conn_par)

//   console.log("did:")
//   console.log(data)
//   return data
// }

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
const MEDIATOR_CHECK_MESSAGES = `${PRISM}checkMessages`;
const PRISM_PARSE_OOB = `${PRISM}parseOob`;
const RESOLVE_DID = `${PRISM}resolveDid`;
const CREATE_DID = `${PRISM}createDid`;
const UPDATE_DID = `${PRISM}updateDid`;

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



// export const checkMessages = createAsyncThunk(
//     MEDIATOR_CHECK_MESSAGES,
//     async (wallet: CreateWalletDto, thunkAPI) => {
//     // const messages =  await DIDFunctionalities.getMessages();
//     console.log('wallet - check messages', messages);
//     thunkAPI.dispatch(
//         addMessage({
//             chatId: prismDemoId,
//             message: sendMessage(
//                 prismDemoId,
//                 rootsHelperId,
//                 messages,
//                 MessageType.TEXT,
//                 false,
//             ),
//         })
//     )
//     }
// )

// export const parseOob = createAsyncThunk(
//     PRISM_PARSE_OOB,
//     async (wallet: CreateWalletDto, thunkAPI) => {
//         let url = 'https://mediator.rootsid.cloud/?_oob=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9vdXQtb2YtYmFuZC8yLjAvaW52aXRhdGlvbiIsImlkIjoiNTkyYWYzZWEtNjAyOS00YmNiLTg1NzYtMWUzNjkzYjQ5MTU3IiwiZnJvbSI6ImRpZDpwZWVyOjIuRXo2TFNqZnY5OGNHbzFrcHdNYmpzNG90YzExdTlpeXJNNDFYYXczSmdDSnE1b3oyMy5WejZNa3FHMVRuaFdXcmMyWUdvQ0Z2dmN5WWt6VnRkcVNIMlRqMkJCam1HNlJneTNMLlNleUpwWkNJNkltNWxkeTFwWkNJc0luUWlPaUprYlNJc0luTWlPaUprYVdRNmNHVmxjam95TGtWNk5reFRha05WYWtkR2RYQTFZVnB1TkdoMFZraE1jR3BvVVhwMlVXOURaVk14ZDFKck5HSnZjMlUzYWpaRVdsRXVWbm8yVFd0cFVFeG9kVFU1UVZKUlZVSllOV2RHVFRKS1oyVlhia2hNV0dJMWRFZE9NbFJ2VUhRelNEVm1jWHBYZVM1VFpYbEtjRnBEU1RaSmJUVnNaSGt4Y0ZwRFNYTkpibEZwVDJsS2EySlRTWE5KYmsxcFQybEtiMlJJVW5kamVtOTJUREl4YkZwSGJHaGtSemw1VEc1S2RtSXpVbnBoVjFGMVdUSjRkbVJYVVdsTVEwcG9TV3B3WWtsdFVuQmFSMDUyWWxjd2RtUnFTV2xZV0RBaUxDSmhJanBiSW1ScFpHTnZiVzB2ZGpJaVhYMCIsImJvZHkiOnsiYWNjZXB0IjpbImRpZGNvbW0vdjIiXSwibGFiZWwiOiJhbGV4In19'

//         const msgpacked2 = await DIDFunctionalities.parseOOBMessage(url);
//         console.log('wallet - parseOOBMessage is', msgpacked2);
// // //wait 1 minutes and then call getMessages
// //
// // // Wait for 1 minute (60,000 milliseconds)
// // await new Promise(resolve => setTimeout(resolve, 20000));
// //
//         thunkAPI.dispatch(
//             addMessage({
//                 chatId: prismDemoId,
//                 message: sendMessage(
//                     prismDemoId,
//                     rootsHelperId,
//                     "You have new messages available",
//                     MessageType.PROMPT_GET_MESSAGES,
//                     false,
//                 ),
//             })
//         )
//     }
// )


//create async thunk for createDid 
export const createDid = createAsyncThunk(
    CREATE_DID,
    async (wallet: CreateWalletDto, thunkAPI) => {
      const { dispatch, getState } = thunkAPI;
      const rootsHelper = getRootsHelperContact(getState());
      const currentUser = getCurrentUserContact(getState());

      let longdid = await agentImpl.createIdentifier('prism');

    
      let msg = "Created a new did for you "+longdid
      dispatch(
        addMessage({
          chatId: currentUser._id,
          message: sendMessage(
            currentUser._id,
            rootsHelper?._id,
            msg,
            MessageType.LONG_PRISM_DID,
            false,
            { did: longdid }
          ),
        })
      );
    }
)

export const updateDid = createAsyncThunk(
  UPDATE_DID,
  async (did: string, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());

    let short_did = await agentImpl.updateDid(did)
      console.log('short did is', short_did)

      thunkAPI.dispatch(
      addMessage({
        chatId: currentUser._id,
        message: sendMessage(
          currentUser._id,
          rootsHelper?._id,
          `Updating did: ${short_did.scheduledOperation.didRef}`,
          MessageType.PRISM_DID,
          false,
          { did: short_did.scheduledOperation.didRef}
        ),
      })
    );
  }
)

export const publishDid = createAsyncThunk(
  CREATE_DID,
  async (longdid: string, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());

    let short_did = await agentImpl.publishManagedDID(longdid)
      console.log('short did is', short_did)

      thunkAPI.dispatch(
      addMessage({
        chatId: currentUser._id,
        message: sendMessage(
          currentUser._id,
          rootsHelper?._id,
          "Anchoring on chain for: "+short_did,
          MessageType.PRISM_DID
        ),
      })
    );
  }
)

// const CREATE_CONNECTION = 'wallet/create/prism/createConnection'
// export const createConnection = createAsyncThunk(
//   CREATE_CONNECTION,
//   async (connectionId: string, thunkAPI) => {
//     const { dispatch, getState } = thunkAPI;
//     const rootsHelper = getRootsHelperContact(getState());
//     const currentUser = getCurrentUserContact(getState());
    
    
    


//     console.log("ciaooo",connectionId)
//     // let connections = await agentImpl.listConnections('')
//     // console.log('connections are', connections)
//     // let connection = await agentImpl.acceptConnectionInvitationRequest(connectionId)
//     let connection = {"connectionId":"43996730-ad4a-4867-83a5-78b5b67c019a","createdAt":"2023-02-16T16:54:28.000Z","invitation":{"from":"did:peer:2.Ez6LSjjRXrcm2kBvcXkanUyXSfcc2Ak336WtDJ8PtDf1Dm2XY.Vz6Mkf9am9hjbH4TDHhmg9pkugNNq7hzkt4FtJoDjCS17RtPP.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9iZzY1ai5hdGFsYXByaXNtLmlvL3ByaXNtLWFnZW50L2RpZGNvbW0iLCJyIjpbXSwiYSI6WyJkaWRjb21tL3YyIl19","id":"88ba3680-e17c-49cf-95fc-9bac8c3ba04c","invitationUrl":"https://domain.com/path?_oob=eyJpZCI6Ijg4YmEzNjgwLWUxN2MtNDljZi05NWZjLTliYWM4YzNiYTA0YyIsInR5cGUiOiJodHRwczovL2RpZGNvbW0ub3JnL291dC1vZi1iYW5kLzIuMC9pbnZpdGF0aW9uIiwiZnJvbSI6ImRpZDpwZWVyOjIuRXo2TFNqalJYcmNtMmtCdmNYa2FuVXlYU2ZjYzJBazMzNld0REo4UHREZjFEbTJYWS5WejZNa2Y5YW05aGpiSDRUREhobWc5cGt1Z05OcTdoemt0NEZ0Sm9EakNTMTdSdFBQLlNleUowSWpvaVpHMGlMQ0p6SWpvaWFIUjBjSE02THk5aVp6WTFhaTVoZEdGc1lYQnlhWE50TG1sdkwzQnlhWE50TFdGblpXNTBMMlJwWkdOdmJXMGlMQ0p5SWpwYlhTd2lZU0k2V3lKa2FXUmpiMjF0TDNZeUlsMTkiLCJib2R5Ijp7ImdvYWxfY29kZSI6ImlvLmF0YWxhcHJpc20uY29ubmVjdCIsImdvYWwiOiJFc3RhYmxpc2ggYSB0cnVzdCBjb25uZWN0aW9uIGJldHdlZW4gdHdvIHBlZXJzIHVzaW5nIHRoZSBwcm90b2NvbCAnaHR0cHM6Ly9hdGFsYXByaXNtLmlvL21lcmN1cnkvY29ubmVjdGlvbnMvMS4wL3JlcXVlc3QnIiwiYWNjZXB0IjpbXX19","type":"https://didcomm.org/out-of-band/2.0/invitation"},"kind":"/connections/43996730-ad4a-4867-83a5-78b5b67c019a","label":null,"myDid":"did:peer:2.Ez6LSnEXZBqRpsQZ5X3wR1P7coLxMdtcPasVqQSWA3MADgwwr.Vz6Mktr1bR9Am2Te2XHPcBw4wfJzJafM81Kp8ehsJv414THyN.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9sdzIycS5hdGFsYXByaXNtLmlvL3ByaXNtLWFnZW50L2RpZGNvbW0iLCJyIjpbXSwiYSI6WyJkaWRjb21tL3YyIl19","self":"Connection","state":"ConnectionRequestPending","theirDid":"did:peer:2.Ez6LSjjRXrcm2kBvcXkanUyXSfcc2Ak336WtDJ8PtDf1Dm2XY.Vz6Mkf9am9hjbH4TDHhmg9pkugNNq7hzkt4FtJoDjCS17RtPP.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9iZzY1ai5hdGFsYXByaXNtLmlvL3ByaXNtLWFnZW50L2RpZGNvbW0iLCJyIjpbXSwiYSI6WyJkaWRjb21tL3YyIl19","updatedAt":"2023-02-16T16:54:28.000Z"}
//     console.log("CONNECTION", connection)

//     let msg = "Connected to prism bot issuer "+connection.connectionId
//     dispatch(
//       addMessage({
//         chatId: currentUser._id,
//         message: sendMessage(
//           currentUser._id,
//           rootsHelper?._id,
//           msg,
//           MessageType.TEXT
//         ),
//       }) 
//     )    
//       // let credential = await agentImpl.listCredentialsByState('OfferReceived')
//       let credential = {'subjectId': 'did:peer:2.Ez6LSigpShawc1oJdeKEcuG3SaFdNfAXaTsp7aKiVbmMK7CQP.Vz6MkjQq5JRjzMxn3wdRSmX48k1aFvQ6iYnLZwEa1J8nMzaqX.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9sdzIycS5hdGFsYXByaXNtLmlvL3ByaXNtLWFnZW50L2RpZGNvbW0iLCJyIjpbXSwiYSI6WyJkaWRjb21tL3YyIl19',
//       'claims': {
//         "user_id": "415681239836786688",
//         "username": "AlexA",
//         "discriminator": "9679",
//         "created_at": "2018-02-21T01:28:50.561000Z"
//       },
//       'recordId': 'e0b154f2-2711-4771-90ab-4e23d284d0c7',
//       'createdAt': '2023-02-16T17:40:22+00:00',
//       'role': 'Holder',
//       'protocolState': 'OfferReceived'}
//       //sleep 5 seconds for the credential to be issued 
//       console.log('credentisl OfferReceived are', credential)

//       const credsObject = {
//         alias: `Discord Credential 0`,
//         issuerId: credential['subjectId'],
//         credSub: credential['claims'],
//         revoked: false,
//       };
//       const cred = (
//         await dispatch(
//           createCredential(credsObject)
//         )
//       ).payload;

//       dispatch(
//         addMessage({
//           chatId: currentUser._id,
//           message: sendMessage(
//             currentUser._id,
//             rootsHelper?._id,
//             `You created a an offer for credential ${cred.alias}!`,
//             MessageType.PROMPT_ISSUED_CREDENTIAL,
//             false,
//             { credential: cred }
//           ),
//         })
//       );
    
//     //create a while loop for 3 secends that runs and gets the connection and console log the state
//     // let connection_ = await agentImpl.getConnection(connection.connectionId)

//     // // console.log('connection state is', connection_.theirDid)
//     // await thunkAPI.dispatch(acceptPrismCredential())

//   }
// )



const ACCEPT_PRISM_CREDETIAL = 'wallet/create/prism/acceptPrismCredential'
export const acceptPrismCredential = createAsyncThunk(
  ACCEPT_PRISM_CREDETIAL,
  async (data: {chatId:  string, recordId: string  } ,  thunkAPI) => {

    //get chatId:  string, recordId: string from data 
    const { chatId, recordId } = data

    console.log('acceptPrismCredential called')
    //chatId console log it
    console.log('chatId is', chatId)
    console.log('recordId is', recordId)
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());
    let _cred = true
    let credential = null
    while (_cred) {
      // let credential = await agentImpl.listCredentialsByState('OfferReceived')
      // let credential = {'subjectId': 'did:peer:2.Ez6LSigpShawc1oJdeKEcuG3SaFdNfAXaTsp7aKiVbmMK7CQP.Vz6MkjQq5JRjzMxn3wdRSmX48k1aFvQ6iYnLZwEa1J8nMzaqX.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9sdzIycS5hdGFsYXByaXNtLmlvL3ByaXNtLWFnZW50L2RpZGNvbW0iLCJyIjpbXSwiYSI6WyJkaWRjb21tL3YyIl19',
      // 'claims': {
      //   "user_id": "415681239836786688",
      //   "username": "AlexA",
      //   "discriminator": "9679",
      //   "created_at": "2018-02-21T01:28:50.561000Z"
      // },
      // 'recordId': 'e0b154f2-2711-4771-90ab-4e23d284d0c7',
      // 'createdAt': '2023-02-16T17:40:22+00:00',
      // 'role': 'Holder',
      // 'protocolState': 'OfferReceived'}
      //sleep 5 seconds for the credential to be issued 
      //accept the credential offer
      let credentialOfferAcceptedBefore = await agentImpl.acceptCredentialOffer(recordId)
      console.log('credentisl OFFER ACCEPTED are', credentialOfferAcceptedBefore)
      //dispatch accepted message 

      //wait 5 seconds for the credential to be issued
      
      //get credential from wallet
      //wait 5 seconds for the credential to be issued
      await new Promise((resolve) => setTimeout(resolve, 10000));
      let credentialOfferAccepted = await agentImpl.getCredentialsById(recordId)


      // let credentialOfferAccepted = {'subjectId': 'did:peer:2.Ez6LSigpShawc1oJdeKEcuG3SaFdNfAXaTsp7aKiVbmMK7CQP.Vz6MkjQq5JRjzMxn3wdRSmX48k1aFvQ6iYnLZwEa1J8nMzaqX.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9sdzIycS5hdGFsYXByaXNtLmlvL3ByaXNtLWFnZW50L2RpZGNvbW0iLCJyIjpbXSwiYSI6WyJkaWRjb21tL3YyIl19',
      // 'claims': {
      //   "user_id": "415681239836786688",
      //   "username": "AlexA",
      //   "discriminator": "9679",
      //   "created_at": "2018-02-21T01:28:50.561000Z"
      // },
      // 'recordId': 'e0b154f2-2711-4771-90ab-4e23d284d0c7',
      // 'createdAt': '2023-02-16T17:40:22+00:00',
      // 'role': 'Holder',
      // 'jwt_encoded': "eyJpZCI6ImRpZDpkaXNjb3JkOjEyMyIsImtleUlkIjoiaXNzdWluZzAiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJ1c2VyX2lkIjoiNDE1NjgxMjM5ODM2Nzg2Njg4IiwidXNlcm5hbWUiOiJBbGV4QSIsImRpc2NyaW1pbmF0b3IiOiI5Njc5IiwiY3JlYXRlZF9hdCI6IjIwMTgtMDItMjFUMDE6Mjg6NTAuNTYxMDAwWiJ9fQ==",
      // 'protocolState': 'CredentialReceived',
      // 'updatedAt': '2023-02-16T17:42:02+00:00'}

      console.log('credentialOfferAccepted is', credentialOfferAccepted)



      const credsObject = {
        alias: `DISCORD HANDLE`,
        jwtCred: credentialOfferAccepted['jwt_encoded'],
        issuerId: credentialOfferAccepted['subjectId'],
        credSub: credentialOfferAccepted['claims'],
        revoked: false,
      };
      const _cred_wallet = (
        await dispatch(
          createAndAddCredential(credsObject)
        )
      ).payload;

      dispatch(
        addMessage({
          chatId: chatId,
          message: sendMessage(
            chatId,
            rootsHelper?._id,
            `You received a credential: ${_cred_wallet.alias}!`,
            MessageType.CRED_VIEW,
            false,
            { credential: _cred_wallet }
          ),
        })
      );

        if (_cred_wallet){
          _cred = false
        }
      
    }
  }
)

    
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
          connectiondId:'roots'
        })
      )
    ).payload;

    const prismBotId = (
      await thunkAPI.dispatch(
        createContact({
          displayPictureUrl:
            'https://avatars.githubusercontent.com/u/11140484?s=200&v=4',
          displayName: BOTS_NAMES.PRISM_BOT,
          connectiondId: 'prism'

        })
      )
    ).payload

    const userId = (
      await thunkAPI.dispatch(
        createContact({
          displayPictureUrl: 'https://avatars.githubusercontent.com/u/95590918?s=200&v=4',
          displayName: '',
          isCurrentUser: true,
          connectiondId: 'user'
        })
      )
    ).payload;
      thunkAPI.dispatch(addProfile({ _id: userId, displayPictureUrl: 'https://avatars.githubusercontent.com/u/95590918?s=200&v=4', displayName: '' }))
      thunkAPI.dispatch(initiateChat({ chatId: userId }));

      // let data = await createDid(api_holder_didregistrar)
    //   let longdid = await agentImpl.createIdentifier('prism');

    
    //   let msg = "Created a new did for you "+longdid
    //   thunkAPI.dispatch(
    //   addMessage({
    //     chatId: userId,
    //     message: sendMessage(
    //       userId,
    //       rootsHelperId,
    //       msg,
    //       MessageType.TEXT,
    //       false,
    //       {did: longdid}
    //     ),
    //   })
    // );
    //   let short_did = await agentImpl.publishManagedDID(longdid)
    //   console.log('short did is', short_did)

    //   thunkAPI.dispatch(
    //   addMessage({
    //     chatId: userId,
    //     message: sendMessage(
    //       userId,
    //       rootsHelperId,
    //       "Anchoring on chain for: "+short_did,
    //       MessageType.PRISM_DID
    //     ),
    //   })
    // );
    // console.log('here')

    thunkAPI.dispatch(createDid({}))
    //timeout for 10 seconds
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // thunkAPI.dispatch(publishDid({}))

    // await new Promise(resolve => setTimeout(resolve, 10000));
    // let agent_status = await agentImpl.resolveIdentifier(short_did)
    // //check if agent_stats is not null 
    // if(agent_status){
    //   console.log('agent status is', agent_status)
    // }
    // else{
    //   console.log('agent status is null')
    // }
    //   thunkAPI.dispatch(
    //   addMessage({
    //     chatId: userId,
    //     message: sendMessage(
    //       userId,
    //       rootsHelperId,
    //       "status"+JSON.stringify(agent_status),
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
    // const today = new Date(Date.now());
    // await setupDiscordDemo(thunkAPI,rootsHelperId,today)
    // await thunkAPI.dispatch(startPrismDemo())
    return WALLET_CREATED_SUCCESS;
  }
);


export const resolveDidAndShowKeys = createAsyncThunk(
  RESOLVE_DID,
  async (did: string, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());
    const didDoc = await agentImpl.resolveIdentifier(did)
    
    let keys_msg = "Endpoints urls: "+ "\n"
    //add new line  to message

    console.log('agent status is', didDoc)
    didDoc?.did?.service?.forEach((element: any) => {
      keys_msg += element.serviceEndpoint[0] + "\n"
    // didDoc?.did?.verificationMethod?.forEach((element: any) => {
    //   keys_msg += element.id + " "
    });

    //check if agent_stats is not null
    dispatch(
      addMessage({
        chatId: currentUser._id,
        message: sendMessage(
          currentUser._id,
          rootsHelper?._id,
          keys_msg,
          MessageType.LONG_PRISM_DIDDOC,
          false,
          {didDoc: didDoc}
        ),
      })
    );

  }
)
export const resolveFetchDid = createAsyncThunk(
  RESOLVE_DID,
  async (did: string, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());
    dispatch(
      addMessage({
        chatId: currentUser._id,
        message: sendMessage(
          currentUser._id,
          rootsHelper?._id,
          'fetching did...',
          MessageType.TEXT,
          false
        ),
      })
    );
    const didDoc = await agentImpl.resolveIdentifier(did)
    console.log('agent status is', didDoc)
    //check if agent_stats is not null
    dispatch(
      addMessage({
        chatId: currentUser._id,
        message: sendMessage(
          currentUser._id,
          rootsHelper?._id,
          JSON.stringify(didDoc),
          MessageType.LONG_PRISM_DIDDOC,
          false,
          {didDoc: didDoc}
        ),
      })
    );

  }
)
const INITIATE_DISCORD_DEMO = 'INITIATE_DISCORD_DEMO';
export const initiatDiscordDemo = createAsyncThunk(
  INITIATE_DISCORD_DEMO,
  async (invite_url:string, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());

    let invitation = invite_url.split('=')
    let connection = await agentImpl.acceptConnectionInvitationRequest(invitation[1])
    console.log('conn',connection.connectionId)
    const userName =  faker.internet.userName()
    const newContactId = (
      await dispatch(
        createContact({
          displayPictureUrl: 'https://avatars.githubusercontent.com/u/11140484?s=200&v=4',
          displayName: 'Discord Issuer'
        })
      )
    ).payload;
    dispatch(initiateChat({ chatId: newContactId }));
    
    console.log('created chat an now waiting to ListCredentialsByState for 3 seconds')
    await new Promise((resolve) => setTimeout(resolve, 3000));
    let credential = await agentImpl.listCredentialsByState('OfferReceived')
    console.log('listCredentialsByState result',credential)

    const credsObject = {
      alias: 'DISCORD HANDLE1',
      issuerId: "did:discord:123",
      credSub: credential['claims'],
      revoked: false,
    };
    console.log(
      'creating credential offer'
    )
    const cred = (await dispatch(createCredential(credsObject))).payload;
    dispatch(
      addMessage({
        chatId: newContactId,
        message: sendMessage(
          newContactId,
          rootsHelper?._id,
          `You have a credential offer for: ${cred?.alias}`,
          MessageType.PROMPT_ISSUED_CREDENTIAL,
          false,
          { credential: cred, recordId: credential['recordId'] }
        ),
      })
    );
  }
);

export const initiateNewContact = createAsyncThunk(
  INITIATE_CONTACT,
  async (contact, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootsHelper = getRootsHelperContact(getState());
    const currentUser = getCurrentUserContact(getState());

    let invite_url = 'https://domain.com/path?_oob=eyJpZCI6IjExMjYzZTk0LWQyNTYtNGU5Ny1iOTkxLTQ1MzFlNjI5ZTU2NCIsInR5cGUiOiJodHRwczovL2RpZGNvbW0ub3JnL291dC1vZi1iYW5kLzIuMC9pbnZpdGF0aW9uIiwiZnJvbSI6ImRpZDpwZWVyOjIuRXo2TFNmZEFncXJDR05mbnRyd0huZjF1NjV1N0NrNmVZS1Y1b0RDZmQ2VE12SGRTVy5WejZNa2lZWHo1c3JSYkp4NG9lNnNiOXNrUUNhRWhXMUg1VVNDdXhUQkdSVW1IVnVQLlNleUowSWpvaVpHMGlMQ0p6SWpvaWFIUjBjSE02THk5aVp6WTFhaTVoZEdGc1lYQnlhWE50TG1sdkwzQnlhWE50TFdGblpXNTBMMlJwWkdOdmJXMGlMQ0p5SWpwYlhTd2lZU0k2V3lKa2FXUmpiMjF0TDNZeUlsMTkiLCJib2R5Ijp7ImdvYWxfY29kZSI6ImlvLmF0YWxhcHJpc20uY29ubmVjdCIsImdvYWwiOiJFc3RhYmxpc2ggYSB0cnVzdCBjb25uZWN0aW9uIGJldHdlZW4gdHdvIHBlZXJzIHVzaW5nIHRoZSBwcm90b2NvbCAnaHR0cHM6Ly9hdGFsYXByaXNtLmlvL21lcmN1cnkvY29ubmVjdGlvbnMvMS4wL3JlcXVlc3QnIiwiYWNjZXB0IjpbXX19'
    let invitation = invite_url.split('=')
    // let connection = await agentImpl.acceptConnectionInvitationRequest(invitation[1])
    let connection  = {"connectionId": "a886f987-6be2-4c09-aa13-d111f22b410e", "createdAt": "2023-02-17T00:50:14.000Z", "invitation": {"from": "did:peer:2.Ez6LSfdAgqrCGNfntrwHnf1u65u7Ck6eYKV5oDCfd6TMvHdSW.Vz6MkiYXz5srRbJx4oe6sb9skQCaEhW1H5USCuxTBGRUmHVuP.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9iZzY1ai5hdGFsYXByaXNtLmlvL3ByaXNtLWFnZW50L2RpZGNvbW0iLCJyIjpbXSwiYSI6WyJkaWRjb21tL3YyIl19", "id": "11263e94-d256-4e97-b991-4531e629e564", "invitationUrl": "https://domain.com/path?_oob=eyJpZCI6IjExMjYzZTk0LWQyNTYtNGU5Ny1iOTkxLTQ1MzFlNjI5ZTU2NCIsInR5cGUiOiJodHRwczovL2RpZGNvbW0ub3JnL291dC1vZi1iYW5kLzIuMC9pbnZpdGF0aW9uIiwiZnJvbSI6ImRpZDpwZWVyOjIuRXo2TFNmZEFncXJDR05mbnRyd0huZjF1NjV1N0NrNmVZS1Y1b0RDZmQ2VE12SGRTVy5WejZNa2lZWHo1c3JSYkp4NG9lNnNiOXNrUUNhRWhXMUg1VVNDdXhUQkdSVW1IVnVQLlNleUowSWpvaVpHMGlMQ0p6SWpvaWFIUjBjSE02THk5aVp6WTFhaTVoZEdGc1lYQnlhWE50TG1sdkwzQnlhWE50TFdGblpXNTBMMlJwWkdOdmJXMGlMQ0p5SWpwYlhTd2lZU0k2V3lKa2FXUmpiMjF0TDNZeUlsMTkiLCJib2R5Ijp7ImdvYWxfY29kZSI6ImlvLmF0YWxhcHJpc20uY29ubmVjdCIsImdvYWwiOiJFc3RhYmxpc2ggYSB0cnVzdCBjb25uZWN0aW9uIGJldHdlZW4gdHdvIHBlZXJzIHVzaW5nIHRoZSBwcm90b2NvbCAnaHR0cHM6Ly9hdGFsYXByaXNtLmlvL21lcmN1cnkvY29ubmVjdGlvbnMvMS4wL3JlcXVlc3QnIiwiYWNjZXB0IjpbXX19", "type": "https://didcomm.org/out-of-band/2.0/invitation"}, "kind": "/connections/a886f987-6be2-4c09-aa13-d111f22b410e", "label": undefined, "myDid": "did:peer:2.Ez6LSmnuu6Sd9QbnUP6k9d6aVeFsAKEmqQCUk9iM3E1tfVRHX.Vz6MksewQ4W7qAfY7Nknsz42jf8Xp8oirHEaumL2MkNub159P.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9sdzIycS5hdGFsYXByaXNtLmlvL3ByaXNtLWFnZW50L2RpZGNvbW0iLCJyIjpbXSwiYSI6WyJkaWRjb21tL3YyIl19", "self": "Connection", "state": "ConnectionRequestPending", "theirDid": "did:peer:2.Ez6LSfdAgqrCGNfntrwHnf1u65u7Ck6eYKV5oDCfd6TMvHdSW.Vz6MkiYXz5srRbJx4oe6sb9skQCaEhW1H5USCuxTBGRUmHVuP.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9iZzY1ai5hdGFsYXByaXNtLmlvL3ByaXNtLWFnZW50L2RpZGNvbW0iLCJyIjpbXSwiYSI6WyJkaWRjb21tL3YyIl19", "updatedAt": "2023-02-17T00:50:14.000Z"}
    console.log('conn',connection.connectionId)
    const userName =  faker.internet.userName()
    const newContactId = (
      await dispatch(
        createContact({
          displayPictureUrl: 'https://avatars.githubusercontent.com/u/11140484?s=200&v=4',
          displayName: 'Discord Issuer'
        })
      )
    ).payload;
    dispatch(initiateChat({ chatId: newContactId }));
    
    console.log('created chat an now waiting to ListCredentialsByState for 3 seconds')
    await new Promise((resolve) => setTimeout(resolve, 3000));
    let credential = await agentImpl.listCredentialsByState('OfferReceived')
    console.log('listCredentialsByState result',credential)

    const credsObject = {
      alias: 'DISCORD HANDLE1',
      issuerId: "did:discord:123",
      credSub: credential['claims'],
      revoked: false,
    };
    console.log(
      'creating credential offer'
    )
    const cred = (await dispatch(createCredential(credsObject))).payload;
    dispatch(
      addMessage({
        chatId: newContactId,
        message: sendMessage(
          newContactId,
          rootsHelper?._id,
          `You have a credential offer for: ${cred?.alias}`,
          MessageType.PROMPT_ISSUED_CREDENTIAL,
          false,
          { credential: cred, recordId: credential['recordId'] }
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

export const createNewDidAndNotify = createAsyncThunk(
    CREATE_NEW_DID,
    async (type: any, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;

        let newId: Identifier = {value: "not set"};
        rootsManager.createId(IdType.Fake, (id) => {
            newId = id
        })
        console.log("wallet - createId produced", newId.value)
        const currentUser = getCurrentUserContact(getState());
        thunkAPI.dispatch(
            addMessage({
                chatId: currentUser._id,
                message: sendMessage(
                    currentUser,
                    rootsHelperId,
                    BOTS_MSGS[3] + "\n" + newId,
                    MessageType.PROMPT_OWN_DID
                ),
            })
        );
    }
);
