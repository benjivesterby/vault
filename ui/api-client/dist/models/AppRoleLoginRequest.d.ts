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
 *
 * @export
 * @interface AppRoleLoginRequest
 */
export interface AppRoleLoginRequest {
    /**
     * Unique identifier of the Role. Required to be supplied when the 'bind_secret_id' constraint is set.
     * @type {string}
     * @memberof AppRoleLoginRequest
     */
    roleId?: string;
    /**
     * SecretID belong to the App role
     * @type {string}
     * @memberof AppRoleLoginRequest
     */
    secretId?: string;
}
/**
 * Check if a given object implements the AppRoleLoginRequest interface.
 */
export declare function instanceOfAppRoleLoginRequest(value: object): value is AppRoleLoginRequest;
export declare function AppRoleLoginRequestFromJSON(json: any): AppRoleLoginRequest;
export declare function AppRoleLoginRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): AppRoleLoginRequest;
export declare function AppRoleLoginRequestToJSON(json: any): AppRoleLoginRequest;
export declare function AppRoleLoginRequestToJSONTyped(value?: AppRoleLoginRequest | null, ignoreDiscriminator?: boolean): any;
