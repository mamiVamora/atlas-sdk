/**
 * Atlas Plugin & Extension Permissions Matrix (ADM-016 §3)
 */

export const ALLOWED_PERMISSIONS = [
  'READ_ACTIVITY_PROFILE',
  'READ_PRODUCTS',
  'READ_SERVICES',
  'CREATE_WIDGET',
  'CREATE_OFFER',
  'SEND_NOTIFICATION',
  'READ_REVIEWS',
] as const;

export type AtlasPluginPermission = typeof ALLOWED_PERMISSIONS[number];

export const PROHIBITED_CAPABILITIES = [
  'DATABASE_ACCESS',
  'DIRECT_CORE_ACCESS',
  'BYPASS_AUTHORIZATION',
  'MODIFY_SYSTEM_RULES',
  'DIRECT_DB_ACCESS',
  'CORE_MUTATION',
  'BYPASS_AUTH',
  'RAW_SOCKET_ACCESS',
] as const;

export interface PermissionValidationResult {
  isValid: boolean;
  grantedPermissions: AtlasPluginPermission[];
  rejectedPermissions: string[];
  reasons: string[];
}

export class PermissionSandboxValidator {
  /**
   * Validates requested permissions against the allowed manifest scope.
   */
  public static validatePermissions(requestedPermissions: string[]): PermissionValidationResult {
    const granted: AtlasPluginPermission[] = [];
    const rejected: string[] = [];
    const reasons: string[] = [];

    for (const perm of requestedPermissions) {
      if ((ALLOWED_PERMISSIONS as readonly string[]).includes(perm)) {
        granted.push(perm as AtlasPluginPermission);
      } else {
        rejected.push(perm);
        if ((PROHIBITED_CAPABILITIES as readonly string[]).includes(perm)) {
          reasons.push(`Permission '${perm}' is strictly PROHIBITED by Atlas Constitutional Security Protocol (ADM-016).`);
        } else {
          reasons.push(`Unknown permission identifier: '${perm}'.`);
        }
      }
    }

    return {
      isValid: rejected.length === 0,
      grantedPermissions: granted,
      rejectedPermissions: rejected,
      reasons,
    };
  }
}
