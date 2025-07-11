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
exports.instanceOfCollectHostInformationResponse = instanceOfCollectHostInformationResponse;
exports.CollectHostInformationResponseFromJSON = CollectHostInformationResponseFromJSON;
exports.CollectHostInformationResponseFromJSONTyped = CollectHostInformationResponseFromJSONTyped;
exports.CollectHostInformationResponseToJSON = CollectHostInformationResponseToJSON;
exports.CollectHostInformationResponseToJSONTyped = CollectHostInformationResponseToJSONTyped;
/**
 * Check if a given object implements the CollectHostInformationResponse interface.
 */
function instanceOfCollectHostInformationResponse(value) {
    return true;
}
function CollectHostInformationResponseFromJSON(json) {
    return CollectHostInformationResponseFromJSONTyped(json, false);
}
function CollectHostInformationResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'cpu': json['cpu'] == null ? undefined : json['cpu'],
        'cpuTimes': json['cpu_times'] == null ? undefined : json['cpu_times'],
        'disk': json['disk'] == null ? undefined : json['disk'],
        'host': json['host'] == null ? undefined : json['host'],
        'memory': json['memory'] == null ? undefined : json['memory'],
        'timestamp': json['timestamp'] == null ? undefined : (new Date(json['timestamp'])),
    };
}
function CollectHostInformationResponseToJSON(json) {
    return CollectHostInformationResponseToJSONTyped(json, false);
}
function CollectHostInformationResponseToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'cpu': value['cpu'],
        'cpu_times': value['cpuTimes'],
        'disk': value['disk'],
        'host': value['host'],
        'memory': value['memory'],
        'timestamp': value['timestamp'] == null ? undefined : ((value['timestamp']).toISOString()),
    };
}
