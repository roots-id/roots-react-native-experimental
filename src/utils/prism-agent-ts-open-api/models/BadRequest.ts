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
 * @interface BadRequest
 */
export interface BadRequest {
    /**
     * 
     * @type {string}
     * @memberof BadRequest
     */
    msg: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof BadRequest
     */
    errors?: Array<string>;
}

/**
 * Check if a given object implements the BadRequest interface.
 */
export function instanceOfBadRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "msg" in value;

    return isInstance;
}

export function BadRequestFromJSON(json: any): BadRequest {
    return BadRequestFromJSONTyped(json, false);
}

export function BadRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): BadRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'msg': json['msg'],
        'errors': !exists(json, 'errors') ? undefined : json['errors'],
    };
}

export function BadRequestToJSON(value?: BadRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'msg': value.msg,
        'errors': value.errors,
    };
}
