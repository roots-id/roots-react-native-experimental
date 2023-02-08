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
 * @interface CreateManagedDidRequestDocumentTemplatePublicKeysInner
 */
export interface CreateManagedDidRequestDocumentTemplatePublicKeysInner {
    /**
     * Identifier of a verification material in the DID Document
     * @type {string}
     * @memberof CreateManagedDidRequestDocumentTemplatePublicKeysInner
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof CreateManagedDidRequestDocumentTemplatePublicKeysInner
     */
    purpose: CreateManagedDidRequestDocumentTemplatePublicKeysInnerPurposeEnum;
}


/**
 * @export
 */
export const CreateManagedDidRequestDocumentTemplatePublicKeysInnerPurposeEnum = {
    Authentication: 'authentication',
    AssertionMethod: 'assertionMethod',
    KeyAgreement: 'keyAgreement',
    CapabilityInvocation: 'capabilityInvocation',
    CapabilityDelegation: 'capabilityDelegation'
} as const;
export type CreateManagedDidRequestDocumentTemplatePublicKeysInnerPurposeEnum = typeof CreateManagedDidRequestDocumentTemplatePublicKeysInnerPurposeEnum[keyof typeof CreateManagedDidRequestDocumentTemplatePublicKeysInnerPurposeEnum];


/**
 * Check if a given object implements the CreateManagedDidRequestDocumentTemplatePublicKeysInner interface.
 */
export function instanceOfCreateManagedDidRequestDocumentTemplatePublicKeysInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "purpose" in value;

    return isInstance;
}

export function CreateManagedDidRequestDocumentTemplatePublicKeysInnerFromJSON(json: any): CreateManagedDidRequestDocumentTemplatePublicKeysInner {
    return CreateManagedDidRequestDocumentTemplatePublicKeysInnerFromJSONTyped(json, false);
}

export function CreateManagedDidRequestDocumentTemplatePublicKeysInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateManagedDidRequestDocumentTemplatePublicKeysInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'purpose': json['purpose'],
    };
}

export function CreateManagedDidRequestDocumentTemplatePublicKeysInnerToJSON(value?: CreateManagedDidRequestDocumentTemplatePublicKeysInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'purpose': value.purpose,
    };
}
