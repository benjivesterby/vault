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
exports.instanceOfSystemWriteSyncDestinationsTypeNameAssociationsSetRequest = instanceOfSystemWriteSyncDestinationsTypeNameAssociationsSetRequest;
exports.SystemWriteSyncDestinationsTypeNameAssociationsSetRequestFromJSON = SystemWriteSyncDestinationsTypeNameAssociationsSetRequestFromJSON;
exports.SystemWriteSyncDestinationsTypeNameAssociationsSetRequestFromJSONTyped = SystemWriteSyncDestinationsTypeNameAssociationsSetRequestFromJSONTyped;
exports.SystemWriteSyncDestinationsTypeNameAssociationsSetRequestToJSON = SystemWriteSyncDestinationsTypeNameAssociationsSetRequestToJSON;
exports.SystemWriteSyncDestinationsTypeNameAssociationsSetRequestToJSONTyped = SystemWriteSyncDestinationsTypeNameAssociationsSetRequestToJSONTyped;
/**
 * Check if a given object implements the SystemWriteSyncDestinationsTypeNameAssociationsSetRequest interface.
 */
function instanceOfSystemWriteSyncDestinationsTypeNameAssociationsSetRequest(value) {
    return true;
}
function SystemWriteSyncDestinationsTypeNameAssociationsSetRequestFromJSON(json) {
    return SystemWriteSyncDestinationsTypeNameAssociationsSetRequestFromJSONTyped(json, false);
}
function SystemWriteSyncDestinationsTypeNameAssociationsSetRequestFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'mount': json['mount'] == null ? undefined : json['mount'],
        'secretName': json['secret_name'] == null ? undefined : json['secret_name'],
    };
}
function SystemWriteSyncDestinationsTypeNameAssociationsSetRequestToJSON(json) {
    return SystemWriteSyncDestinationsTypeNameAssociationsSetRequestToJSONTyped(json, false);
}
function SystemWriteSyncDestinationsTypeNameAssociationsSetRequestToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'mount': value['mount'],
        'secret_name': value['secretName'],
    };
}
