import { createAsyncThunk } from '@reduxjs/toolkit';
import { addId, updateId } from '../slices/identifier';

const BASE_ID = 'ids/';
const BASE_DID = `${BASE_ID}did/`;
const CREATE_DID = `${BASE_DID}create`;
const CREATE_ADD_DID = `${BASE_DID}createAndAdd`;

export const createDid = createAsyncThunk(
    CREATE_DID,
    async (did: any, thunkAPI: any) => {
        const newDid = {
            _id: did._id,
            alias: did.alias,
            published: did.published,
        };
        console.log("thunks/identifiers - Created did", newDid)
        return newDid;
    }
);

export const createdDid = createAsyncThunk(
    CREATE_ADD_DID,
    async (did: any, thunkAPI: any) => {
        const cred = (await thunkAPI.dispatch(createDid(did)))
            .payload;
        thunkAPI.dispatch(addId(cred));
        return cred;
    }
);
