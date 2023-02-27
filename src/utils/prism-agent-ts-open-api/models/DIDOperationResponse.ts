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
import type { DidOperationSubmission } from './DidOperationSubmission';
import {
    DidOperationSubmissionFromJSON,
    DidOperationSubmissionFromJSONTyped,
    DidOperationSubmissionToJSON,
} from './DidOperationSubmission';

/**
 * 
 * @export
 * @interface DIDOperationResponse
 */
export interface DIDOperationResponse {
    /**
     * 
     * @type {DidOperationSubmission}
     * @memberof DIDOperationResponse
     */
    scheduledOperation: DidOperationSubmission;
}

/**
 * Check if a given object implements the DIDOperationResponse interface.
 */
export function instanceOfDIDOperationResponse(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "scheduledOperation" in value;

    return isInstance;
}

export function DIDOperationResponseFromJSON(json: any): DIDOperationResponse {
    return DIDOperationResponseFromJSONTyped(json, false);
}

export function DIDOperationResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): DIDOperationResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'scheduledOperation': DidOperationSubmissionFromJSON(json['scheduledOperation']),
    };
}

export function DIDOperationResponseToJSON(value?: DIDOperationResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'scheduledOperation': DidOperationSubmissionToJSON(value.scheduledOperation),
    };
}

