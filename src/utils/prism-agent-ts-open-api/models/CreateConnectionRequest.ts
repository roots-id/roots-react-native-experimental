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
 * @interface CreateConnectionRequest
 */
export interface CreateConnectionRequest {
    /**
     * 
     * @type {string}
     * @memberof CreateConnectionRequest
     */
    label?: string;
}

/**
 * Check if a given object implements the CreateConnectionRequest interface.
 */
export function instanceOfCreateConnectionRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function CreateConnectionRequestFromJSON(json: any): CreateConnectionRequest {
    return CreateConnectionRequestFromJSONTyped(json, false);
}

export function CreateConnectionRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateConnectionRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'label': !exists(json, 'label') ? undefined : json['label'],
    };
}

export function CreateConnectionRequestToJSON(value?: CreateConnectionRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'label': value.label,
    };
}

