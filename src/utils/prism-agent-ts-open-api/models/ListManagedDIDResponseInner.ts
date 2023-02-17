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
 * @interface ListManagedDIDResponseInner
 */
export interface ListManagedDIDResponseInner {
    /**
     * 
     * @type {string}
     * @memberof ListManagedDIDResponseInner
     */
    did: string;
    /**
     * A long-form DID. Mandatory when status is not PUBLISHED and optional when status is PUBLISHED
     * @type {string}
     * @memberof ListManagedDIDResponseInner
     */
    longFormDid?: string;
    /**
     * A status indicating whether this is already published from the wallet or not. Does not represent DID full lifecyle (e.g. deactivated, recovered, updated).
     * @type {string}
     * @memberof ListManagedDIDResponseInner
     */
    status: ListManagedDIDResponseInnerStatusEnum;
}


/**
 * @export
 */
export const ListManagedDIDResponseInnerStatusEnum = {
    Created: 'CREATED',
    PublicationPending: 'PUBLICATION_PENDING',
    Published: 'PUBLISHED'
} as const;
export type ListManagedDIDResponseInnerStatusEnum = typeof ListManagedDIDResponseInnerStatusEnum[keyof typeof ListManagedDIDResponseInnerStatusEnum];


/**
 * Check if a given object implements the ListManagedDIDResponseInner interface.
 */
export function instanceOfListManagedDIDResponseInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "did" in value;
    isInstance = isInstance && "status" in value;

    return isInstance;
}

export function ListManagedDIDResponseInnerFromJSON(json: any): ListManagedDIDResponseInner {
    return ListManagedDIDResponseInnerFromJSONTyped(json, false);
}

export function ListManagedDIDResponseInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListManagedDIDResponseInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'did': json['did'],
        'longFormDid': !exists(json, 'longFormDid') ? undefined : json['longFormDid'],
        'status': json['status'],
    };
}

export function ListManagedDIDResponseInnerToJSON(value?: ListManagedDIDResponseInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'did': value.did,
        'longFormDid': value.longFormDid,
        'status': value.status,
    };
}

