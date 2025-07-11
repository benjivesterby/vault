"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfSystemReadSyncDestinationsAwsSmNameResponse = instanceOfSystemReadSyncDestinationsAwsSmNameResponse;
exports.SystemReadSyncDestinationsAwsSmNameResponseFromJSON = SystemReadSyncDestinationsAwsSmNameResponseFromJSON;
exports.SystemReadSyncDestinationsAwsSmNameResponseFromJSONTyped = SystemReadSyncDestinationsAwsSmNameResponseFromJSONTyped;
exports.SystemReadSyncDestinationsAwsSmNameResponseToJSON = SystemReadSyncDestinationsAwsSmNameResponseToJSON;
exports.SystemReadSyncDestinationsAwsSmNameResponseToJSONTyped = SystemReadSyncDestinationsAwsSmNameResponseToJSONTyped;
/**
 * Check if a given object implements the SystemReadSyncDestinationsAwsSmNameResponse interface.
 */
function instanceOfSystemReadSyncDestinationsAwsSmNameResponse(value) {
    return true;
}
function SystemReadSyncDestinationsAwsSmNameResponseFromJSON(json) {
    return SystemReadSyncDestinationsAwsSmNameResponseFromJSONTyped(json, false);
}
function SystemReadSyncDestinationsAwsSmNameResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'connectionDetails': json['connection_details'] == null ? undefined : json['connection_details'],
        'name': json['name'] == null ? undefined : json['name'],
        'options': json['options'] == null ? undefined : json['options'],
        'purgeError': json['purge_error'] == null ? undefined : json['purge_error'],
        'purgeInitiatedAt': json['purge_initiated_at'] == null ? undefined : (new Date(json['purge_initiated_at'])),
        'type': json['type'] == null ? undefined : json['type'],
    };
}
function SystemReadSyncDestinationsAwsSmNameResponseToJSON(json) {
    return SystemReadSyncDestinationsAwsSmNameResponseToJSONTyped(json, false);
}
function SystemReadSyncDestinationsAwsSmNameResponseToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'connection_details': value['connectionDetails'],
        'name': value['name'],
        'options': value['options'],
        'purge_error': value['purgeError'],
        'purge_initiated_at': value['purgeInitiatedAt'] == null ? undefined : ((value['purgeInitiatedAt']).toISOString()),
        'type': value['type'],
    };
}
