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
 * @interface VerificationPolicyInput
 */
export interface VerificationPolicyInput {
    /**
     * 
     * @type {string}
     * @memberof VerificationPolicyInput
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof VerificationPolicyInput
     */
    name: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof VerificationPolicyInput
     */
    attributes?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof VerificationPolicyInput
     */
    issuerDIDs?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof VerificationPolicyInput
     */
    credentialTypes?: Array<string>;
    /**
     * 
     * @type {Date}
     * @memberof VerificationPolicyInput
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof VerificationPolicyInput
     */
    updatedAt?: Date;
}

/**
 * Check if a given object implements the VerificationPolicyInput interface.
 */
export function instanceOfVerificationPolicyInput(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function VerificationPolicyInputFromJSON(json: any): VerificationPolicyInput {
    return VerificationPolicyInputFromJSONTyped(json, false);
}

export function VerificationPolicyInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): VerificationPolicyInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': json['name'],
        'attributes': !exists(json, 'attributes') ? undefined : json['attributes'],
        'issuerDIDs': !exists(json, 'issuerDIDs') ? undefined : json['issuerDIDs'],
        'credentialTypes': !exists(json, 'credentialTypes') ? undefined : json['credentialTypes'],
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'updatedAt': !exists(json, 'updatedAt') ? undefined : (new Date(json['updatedAt'])),
    };
}

export function VerificationPolicyInputToJSON(value?: VerificationPolicyInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'attributes': value.attributes,
        'issuerDIDs': value.issuerDIDs,
        'credentialTypes': value.credentialTypes,
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'updatedAt': value.updatedAt === undefined ? undefined : (value.updatedAt.toISOString()),
    };
}

