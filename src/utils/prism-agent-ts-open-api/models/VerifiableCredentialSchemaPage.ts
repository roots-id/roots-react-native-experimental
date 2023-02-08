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
import type { VerifiableCredentialSchema } from './VerifiableCredentialSchema';
import {
    VerifiableCredentialSchemaFromJSON,
    VerifiableCredentialSchemaFromJSONTyped,
    VerifiableCredentialSchemaToJSON,
} from './VerifiableCredentialSchema';

/**
 * 
 * @export
 * @interface VerifiableCredentialSchemaPage
 */
export interface VerifiableCredentialSchemaPage {
    /**
     * 
     * @type {string}
     * @memberof VerifiableCredentialSchemaPage
     */
    self: string;
    /**
     * 
     * @type {string}
     * @memberof VerifiableCredentialSchemaPage
     */
    kind: string;
    /**
     * 
     * @type {string}
     * @memberof VerifiableCredentialSchemaPage
     */
    pageOf: string;
    /**
     * 
     * @type {string}
     * @memberof VerifiableCredentialSchemaPage
     */
    next?: string;
    /**
     * 
     * @type {string}
     * @memberof VerifiableCredentialSchemaPage
     */
    previous?: string;
    /**
     * 
     * @type {Array<VerifiableCredentialSchema>}
     * @memberof VerifiableCredentialSchemaPage
     */
    contents?: Array<VerifiableCredentialSchema>;
}

/**
 * Check if a given object implements the VerifiableCredentialSchemaPage interface.
 */
export function instanceOfVerifiableCredentialSchemaPage(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "self" in value;
    isInstance = isInstance && "kind" in value;
    isInstance = isInstance && "pageOf" in value;

    return isInstance;
}

export function VerifiableCredentialSchemaPageFromJSON(json: any): VerifiableCredentialSchemaPage {
    return VerifiableCredentialSchemaPageFromJSONTyped(json, false);
}

export function VerifiableCredentialSchemaPageFromJSONTyped(json: any, ignoreDiscriminator: boolean): VerifiableCredentialSchemaPage {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'self': json['self'],
        'kind': json['kind'],
        'pageOf': json['pageOf'],
        'next': !exists(json, 'next') ? undefined : json['next'],
        'previous': !exists(json, 'previous') ? undefined : json['previous'],
        'contents': !exists(json, 'contents') ? undefined : ((json['contents'] as Array<any>).map(VerifiableCredentialSchemaFromJSON)),
    };
}

export function VerifiableCredentialSchemaPageToJSON(value?: VerifiableCredentialSchemaPage | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'self': value.self,
        'kind': value.kind,
        'pageOf': value.pageOf,
        'next': value.next,
        'previous': value.previous,
        'contents': value.contents === undefined ? undefined : ((value.contents as Array<any>).map(VerifiableCredentialSchemaToJSON)),
    };
}
