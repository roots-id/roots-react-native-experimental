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
 * @interface VerificationPolicy
 */
export interface VerificationPolicy {
    /**
     * 
     * @type {string}
     * @memberof VerificationPolicy
     */
    self: string;
    /**
     * 
     * @type {string}
     * @memberof VerificationPolicy
     */
    kind: string;
    /**
     * 
     * @type {string}
     * @memberof VerificationPolicy
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof VerificationPolicy
     */
    name: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof VerificationPolicy
     */
    attributes?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof VerificationPolicy
     */
    issuerDIDs?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof VerificationPolicy
     */
    credentialTypes?: Array<string>;
    /**
     * 
     * @type {Date}
     * @memberof VerificationPolicy
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof VerificationPolicy
     */
    updatedAt: Date;
}

/**
 * Check if a given object implements the VerificationPolicy interface.
 */
export function instanceOfVerificationPolicy(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "self" in value;
    isInstance = isInstance && "kind" in value;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "updatedAt" in value;

    return isInstance;
}

export function VerificationPolicyFromJSON(json: any): VerificationPolicy {
    return VerificationPolicyFromJSONTyped(json, false);
}

export function VerificationPolicyFromJSONTyped(json: any, ignoreDiscriminator: boolean): VerificationPolicy {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'self': json['self'],
        'kind': json['kind'],
        'id': json['id'],
        'name': json['name'],
        'attributes': !exists(json, 'attributes') ? undefined : json['attributes'],
        'issuerDIDs': !exists(json, 'issuerDIDs') ? undefined : json['issuerDIDs'],
        'credentialTypes': !exists(json, 'credentialTypes') ? undefined : json['credentialTypes'],
        'createdAt': (new Date(json['createdAt'])),
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function VerificationPolicyToJSON(value?: VerificationPolicy | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'self': value.self,
        'kind': value.kind,
        'id': value.id,
        'name': value.name,
        'attributes': value.attributes,
        'issuerDIDs': value.issuerDIDs,
        'credentialTypes': value.credentialTypes,
        'createdAt': (value.createdAt.toISOString()),
        'updatedAt': (value.updatedAt.toISOString()),
    };
}
