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
 * @interface Service
 */
export interface Service {
    /**
     * 
     * @type {string}
     * @memberof Service
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Service
     */
    type: ServiceTypeEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof Service
     */
    serviceEndpoint: Array<string>;
}


/**
 * @export
 */
export const ServiceTypeEnum = {
    MediatorService: 'MediatorService'
} as const;
export type ServiceTypeEnum = typeof ServiceTypeEnum[keyof typeof ServiceTypeEnum];


/**
 * Check if a given object implements the Service interface.
 */
export function instanceOfService(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "serviceEndpoint" in value;

    return isInstance;
}

export function ServiceFromJSON(json: any): Service {
    return ServiceFromJSONTyped(json, false);
}

export function ServiceFromJSONTyped(json: any, ignoreDiscriminator: boolean): Service {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'type': json['type'],
        'serviceEndpoint': json['serviceEndpoint'],
    };
}

export function ServiceToJSON(value?: Service | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'type': value.type,
        'serviceEndpoint': value.serviceEndpoint,
    };
}

