/* tslint:disable */
/* eslint-disable */
/**
 * HashiCorp Vault API
 * HTTP API that gives you full access to Vault. All API routes are prefixed with `/v1/`.
 *
 * The version of the OpenAPI document: 1.21.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface SystemWriteReplicationSecondaryUpdatePrimaryRequest
 */
export interface SystemWriteReplicationSecondaryUpdatePrimaryRequest {
    /**
     * A path to a file containing a PEM-encoded CA certificate to verify the call against the primary's API address
     * @type {string}
     * @memberof SystemWriteReplicationSecondaryUpdatePrimaryRequest
     */
    caFile?: string;
    /**
     * A path to a directory containing PEM-encoded CA certificates to verify the call against the primary's API address
     * @type {string}
     * @memberof SystemWriteReplicationSecondaryUpdatePrimaryRequest
     */
    caPath?: string;
    /**
     * The client certificate to use for authentication, in PEM format. Note: client authentication for this operation will always use TLS 1.2 or higher.
     * @type {string}
     * @memberof SystemWriteReplicationSecondaryUpdatePrimaryRequest
     */
    clientCertPem?: string;
    /**
     * The client key to use for authentication, in PEM format.
     * @type {string}
     * @memberof SystemWriteReplicationSecondaryUpdatePrimaryRequest
     */
    clientKeyPem?: string;
    /**
     * The API address of the primary. If not set, the value the primary supplies in the token will be used, which is the primary's redirect address.
     * @type {string}
     * @memberof SystemWriteReplicationSecondaryUpdatePrimaryRequest
     */
    primaryApiAddr?: string;
    /**
     * The token given by the primary to activate secondary status for this cluster.
     * @type {string}
     * @memberof SystemWriteReplicationSecondaryUpdatePrimaryRequest
     */
    token?: string;
}

/**
 * Check if a given object implements the SystemWriteReplicationSecondaryUpdatePrimaryRequest interface.
 */
export function instanceOfSystemWriteReplicationSecondaryUpdatePrimaryRequest(value: object): value is SystemWriteReplicationSecondaryUpdatePrimaryRequest {
    return true;
}

export function SystemWriteReplicationSecondaryUpdatePrimaryRequestFromJSON(json: any): SystemWriteReplicationSecondaryUpdatePrimaryRequest {
    return SystemWriteReplicationSecondaryUpdatePrimaryRequestFromJSONTyped(json, false);
}

export function SystemWriteReplicationSecondaryUpdatePrimaryRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): SystemWriteReplicationSecondaryUpdatePrimaryRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'caFile': json['ca_file'] == null ? undefined : json['ca_file'],
        'caPath': json['ca_path'] == null ? undefined : json['ca_path'],
        'clientCertPem': json['client_cert_pem'] == null ? undefined : json['client_cert_pem'],
        'clientKeyPem': json['client_key_pem'] == null ? undefined : json['client_key_pem'],
        'primaryApiAddr': json['primary_api_addr'] == null ? undefined : json['primary_api_addr'],
        'token': json['token'] == null ? undefined : json['token'],
    };
}

export function SystemWriteReplicationSecondaryUpdatePrimaryRequestToJSON(json: any): SystemWriteReplicationSecondaryUpdatePrimaryRequest {
    return SystemWriteReplicationSecondaryUpdatePrimaryRequestToJSONTyped(json, false);
}

export function SystemWriteReplicationSecondaryUpdatePrimaryRequestToJSONTyped(value?: SystemWriteReplicationSecondaryUpdatePrimaryRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'ca_file': value['caFile'],
        'ca_path': value['caPath'],
        'client_cert_pem': value['clientCertPem'],
        'client_key_pem': value['clientKeyPem'],
        'primary_api_addr': value['primaryApiAddr'],
        'token': value['token'],
    };
}

