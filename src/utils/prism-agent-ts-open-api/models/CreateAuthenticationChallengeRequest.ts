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
 * @interface CreateAuthenticationChallengeRequest
 */
export interface CreateAuthenticationChallengeRequest {
    /**
     * A number of seconds that challenge will be considered valid.
     * @type {number}
     * @memberof CreateAuthenticationChallengeRequest
     */
    ttl: number;
    /**
     * An opaque string provided by a relying-party indicating the purpose of
     * this challenge in order to avoid repurposing the challenge submission.
     * @type {string}
     * @memberof CreateAuthenticationChallengeRequest
     */
    state?: string;
    /**
     * A challenged subject that must complete the challenge.
     * May refer to DID or VerificationMethod inside a DID. If VerificationMethod
     * is used, it must be inside the authentication verification relationship.
     * @type {string}
     * @memberof CreateAuthenticationChallengeRequest
     */
    subject?: string;
}

/**
 * Check if a given object implements the CreateAuthenticationChallengeRequest interface.
 */
export function instanceOfCreateAuthenticationChallengeRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "ttl" in value;

    return isInstance;
}

export function CreateAuthenticationChallengeRequestFromJSON(json: any): CreateAuthenticationChallengeRequest {
    return CreateAuthenticationChallengeRequestFromJSONTyped(json, false);
}

export function CreateAuthenticationChallengeRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateAuthenticationChallengeRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'ttl': json['ttl'],
        'state': !exists(json, 'state') ? undefined : json['state'],
        'subject': !exists(json, 'subject') ? undefined : json['subject'],
    };
}

export function CreateAuthenticationChallengeRequestToJSON(value?: CreateAuthenticationChallengeRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'ttl': value.ttl,
        'state': value.state,
        'subject': value.subject,
    };
}

