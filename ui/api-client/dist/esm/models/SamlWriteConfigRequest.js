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
 * Check if a given object implements the SamlWriteConfigRequest interface.
 */
export function instanceOfSamlWriteConfigRequest(value) {
    if (!('acsUrls' in value) || value['acsUrls'] === undefined)
        return false;
    if (!('entityId' in value) || value['entityId'] === undefined)
        return false;
    return true;
}
export function SamlWriteConfigRequestFromJSON(json) {
    return SamlWriteConfigRequestFromJSONTyped(json, false);
}
export function SamlWriteConfigRequestFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
        return json;
    }
    return {
        'acsUrls': json['acs_urls'],
        'defaultRole': json['default_role'] == null ? undefined : json['default_role'],
        'entityId': json['entity_id'],
        'idpCert': json['idp_cert'] == null ? undefined : json['idp_cert'],
        'idpEntityId': json['idp_entity_id'] == null ? undefined : json['idp_entity_id'],
        'idpMetadataUrl': json['idp_metadata_url'] == null ? undefined : json['idp_metadata_url'],
        'idpSsoUrl': json['idp_sso_url'] == null ? undefined : json['idp_sso_url'],
        'validateAssertionSignature': json['validate_assertion_signature'] == null ? undefined : json['validate_assertion_signature'],
        'validateResponseSignature': json['validate_response_signature'] == null ? undefined : json['validate_response_signature'],
        'verboseLogging': json['verbose_logging'] == null ? undefined : json['verbose_logging'],
    };
}
export function SamlWriteConfigRequestToJSON(json) {
    return SamlWriteConfigRequestToJSONTyped(json, false);
}
export function SamlWriteConfigRequestToJSONTyped(value, ignoreDiscriminator = false) {
    if (value == null) {
        return value;
    }
    return {
        'acs_urls': value['acsUrls'],
        'default_role': value['defaultRole'],
        'entity_id': value['entityId'],
        'idp_cert': value['idpCert'],
        'idp_entity_id': value['idpEntityId'],
        'idp_metadata_url': value['idpMetadataUrl'],
        'idp_sso_url': value['idpSsoUrl'],
        'validate_assertion_signature': value['validateAssertionSignature'],
        'validate_response_signature': value['validateResponseSignature'],
        'verbose_logging': value['verboseLogging'],
    };
}
