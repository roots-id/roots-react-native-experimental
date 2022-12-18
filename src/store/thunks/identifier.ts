import { createAsyncThunk } from '@reduxjs/toolkit';
import {addId, updateDidDocument, updateId} from '../slices/identifier';
import {did} from "../../models";
import {addMessage} from "../slices/chat";
import {sendMessage} from "../../helpers/messages";
import {MessageType} from "../../models/constants";
import ReactNative from "react-native";
const { DIDFuncionalities, CalendarModuleFoo } = ReactNative.NativeModules;

const BASE_ID = 'ids/';
const BASE_DID = `${BASE_ID}did/`;
const CREATE_DID = `${BASE_DID}create`;
const CREATE_ADD_DID = `${BASE_DID}createAndAdd`;
const DID_DOCUMENT = `${BASE_DID}document/`;
const RESOLVE_DID_DOCUMENT = `${DID_DOCUMENT}resolve`;

function createDid (did) {
    const newDid = {
        _id: did._id,
        alias: did.alias,
        published: did.published,
    };
    console.log("thunks/identifiers - Created did", newDid)
    return newDid;
}

export const createAndAddDid = createAsyncThunk(
    CREATE_ADD_DID,
    async (did: any, thunkAPI: any) => {
        const newDid = (await thunkAPI.dispatch(createDid(did)))
            .payload;
        thunkAPI.dispatch(addId(newDid));
        console.log("thunks/identifiers - created and added did",newDID)
        return newDid;
    }
);

async function resolveDidDocument(did) {
    console.log("DID document",did)
    const didDoc = await DIDFuncionalities.resolveDID("did:peer:2.Ez6LSdFHEaZqLfkpvT93VkeKu2Eu7xAzNudVqvFsCEVD5Bt1J.Vz6MkrYuSSPrGkir94WpUaTHdvn3DGqhgVjKa2yLbAqfXAvQ9.SeyJyIjpbXSwicyI6ImFsZXgiLCJhIjpbXSwidCI6IkRlbW9UeXBlIn0");
    console.log('wallet - DID document for ',did,' is', didDoc);
    return didDoc
}

export const resolveAndAddDidDocument = createAsyncThunk(
    RESOLVE_DID_DOCUMENT,
    async (did: string, thunkAPI: any) => {
        const didDoc = (await thunkAPI.dispatch(resolveDidDocument(did)))
            .payload;
        thunkAPI.dispatch(updateDidDocument(didDoc));
        // thunkAPI.dispatch(
        //     addMessage({
        //         chatId: prismDemoId,
        //         message: sendMessage(
        //             prismDemoId,
        //             rootsHelperId,
        //             "DID Document ",
        //             MessageType.PROMPT_DISPLAY_IDENTIFIER,
        //             false,
        //             {identifier: prismDid}
        //         ),
        //     })
        // )
        return didDoc;
    }
);
