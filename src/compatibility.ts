import { isValidSemanticVersion } from './manifest';

export const SDK_COMPATIBILITY_STATUSES = [
  'COMPATIBLE',
  'DEPRECATED_WARN',
  'INCOMPATIBLE',
  'SECURITY_BLOCKED',
] as const;

export type AtlasSdkCompatibilityStatus = typeof SDK_COMPATIBILITY_STATUSES[number];

export type AtlasSdkCompatibilityRuleInput = {
  sdkVersion: string;
  apiVersion: string;
  manifestSchemaVersion: string;
  capabilityType: 'ALL' | 'PLUGIN' | 'THEME' | 'SAAS_INTEGRATION';
  compatibilityStatus: AtlasSdkCompatibilityStatus;
  migrationGuidanceAr?: string;
};

export function validateSdkCompatibilityRule(input: AtlasSdkCompatibilityRuleInput): string[] {
  const errors: string[] = [];
  if (!isValidSemanticVersion(input.sdkVersion)) errors.push('INVALID_SDK_SEMVER');
  if (!/^v[1-9]\d*$/.test(input.apiVersion)) errors.push('INVALID_ATLAS_API_VERSION');
  if (input.manifestSchemaVersion !== '1.0.0') errors.push('UNSUPPORTED_MANIFEST_SCHEMA_VERSION');
  if (!['ALL', 'PLUGIN', 'THEME', 'SAAS_INTEGRATION'].includes(input.capabilityType)) errors.push('INVALID_CAPABILITY_TYPE');
  if (!SDK_COMPATIBILITY_STATUSES.includes(input.compatibilityStatus)) errors.push('INVALID_COMPATIBILITY_STATUS');
  if (input.compatibilityStatus !== 'COMPATIBLE' && !String(input.migrationGuidanceAr || '').trim()) {
    errors.push('MIGRATION_GUIDANCE_REQUIRED');
  }
  return errors;
}
