/* tslint:disable */
/* eslint-disable */
/**
 * PrismAgent OpenAPI specification
 * OpenAPI specification for Decentralized Identifiers (DID) Operations
 *
 * The version of the OpenAPI document: 0.1.0
 * Contact: atala-coredid@iohk.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface CreateManagedDIDResponse
 */
export interface CreateManagedDIDResponse {
    /**
     * A long-form DID for the created DID
     * @type {string}
     * @memberof CreateManagedDIDResponse
     */
    longFormDid: string;
}

/**
 * Check if a given object implements the CreateManagedDIDResponse interface.
 */
export function instanceOfCreateManagedDIDResponse(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "longFormDid" in value;

    return isInstance;
}

export function CreateManagedDIDResponseFromJSON(json: any): CreateManagedDIDResponse {
    return CreateManagedDIDResponseFromJSONTyped(json, false);
}

export function CreateManagedDIDResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateManagedDIDResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'longFormDid': json['longFormDid'],
    };
}

export function CreateManagedDIDResponseToJSON(value?: CreateManagedDIDResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'longFormDid': value.longFormDid,
    };
}

