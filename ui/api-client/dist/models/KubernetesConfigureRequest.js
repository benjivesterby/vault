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
exports.instanceOfKubernetesConfigureRequest = instanceOfKubernetesConfigureRequest;
exports.KubernetesConfigureRequestFromJSON = KubernetesConfigureRequestFromJSON;
exports.KubernetesConfigureRequestFromJSONTyped = KubernetesConfigureRequestFromJSONTyped;
exports.KubernetesConfigureRequestToJSON = KubernetesConfigureRequestToJSON;
exports.KubernetesConfigureRequestToJSONTyped = KubernetesConfigureRequestToJSONTyped;
/**
 * Check if a given object implements the KubernetesConfigureRequest interface.
 */
function instanceOfKubernetesConfigureRequest(value) {
    return true;
}
function KubernetesConfigureRequestFromJSON(json) {
    return KubernetesConfigureRequestFromJSONTyped(json, false);
}
function KubernetesConfigureRequestFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'disableLocalCaJwt': json['disable_local_ca_jwt'] == null ? undefined : json['disable_local_ca_jwt'],
        'kubernetesCaCert': json['kubernetes_ca_cert'] == null ? undefined : json['kubernetes_ca_cert'],
        'kubernetesHost': json['kubernetes_host'] == null ? undefined : json['kubernetes_host'],
        'serviceAccountJwt': json['service_account_jwt'] == null ? undefined : json['service_account_jwt'],
    };
}
function KubernetesConfigureRequestToJSON(json) {
    return KubernetesConfigureRequestToJSONTyped(json, false);
}
function KubernetesConfigureRequestToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'disable_local_ca_jwt': value['disableLocalCaJwt'],
        'kubernetes_ca_cert': value['kubernetesCaCert'],
        'kubernetes_host': value['kubernetesHost'],
        'service_account_jwt': value['serviceAccountJwt'],
    };
}
