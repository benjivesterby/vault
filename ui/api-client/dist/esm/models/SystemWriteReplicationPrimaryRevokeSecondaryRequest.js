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
/**
 * Check if a given object implements the SystemWriteReplicationPrimaryRevokeSecondaryRequest interface.
 */
export function instanceOfSystemWriteReplicationPrimaryRevokeSecondaryRequest(value) {
    return true;
}
export function SystemWriteReplicationPrimaryRevokeSecondaryRequestFromJSON(json) {
    return SystemWriteReplicationPrimaryRevokeSecondaryRequestFromJSONTyped(json, false);
}
export function SystemWriteReplicationPrimaryRevokeSecondaryRequestFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'id': json['id'] == null ? undefined : json['id'],
    };
}
export function SystemWriteReplicationPrimaryRevokeSecondaryRequestToJSON(json) {
    return SystemWriteReplicationPrimaryRevokeSecondaryRequestToJSONTyped(json, false);
}
export function SystemWriteReplicationPrimaryRevokeSecondaryRequestToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'id': value['id'],
    };
}
