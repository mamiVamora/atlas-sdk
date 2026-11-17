/**
 * Atlas Plugin & Theme Manifest Schema (ADM-016)
 */

import { AtlasPluginPermission } from './permissions';

export type CapabilityType = 'THEME' | 'PLUGIN' | 'SAAS_INTEGRATION' | 'DIRECT_SERVICE' | 'BUNDLE';

export type StandardIntegrationCategory =
  | 'SHIPPING_LOGISTICS'
  | 'WHATSAPP_BUSINESS'
  | 'SMS_NOTIFICATIONS'
  | 'PAYMENT_GATEWAYS_WALLETS'
  | 'INVOICING_ERP_POS'
  | 'BOOKING_SCHEDULING'
  | 'CRM_CUSTOMER_SUPPORT'
  | 'EMAIL_COMMUNICATION'
  | 'ANALYTICS_MARKETING_PIXELS'
  | 'OMNICHANNEL_COMMERCE'
  | 'SECURITY_VERIFICATION_KYC'
  | 'AI_AGENTS_AUTOMATION'
  | 'CUSTOM_WEBHOOK_API';

export const STANDARD_INTEGRATION_CATEGORIES: StandardIntegrationCategory[] = [
  'SHIPPING_LOGISTICS',
  'WHATSAPP_BUSINESS',
  'SMS_NOTIFICATIONS',
  'PAYMENT_GATEWAYS_WALLETS',
  'INVOICING_ERP_POS',
  'BOOKING_SCHEDULING',
  'CRM_CUSTOMER_SUPPORT',
  'EMAIL_COMMUNICATION',
  'ANALYTICS_MARKETING_PIXELS',
  'OMNICHANNEL_COMMERCE',
  'SECURITY_VERIFICATION_KYC',
  'AI_AGENTS_AUTOMATION',
  'CUSTOM_WEBHOOK_API',
];

export interface AtlasPluginManifest {
  manifestVersion: '1.0.0';
  code: string;
  name: string;
  version: string;
  capabilityType: CapabilityType;
  integrationCategory?: StandardIntegrationCategory;
  description: string;
  author: {
    name: string;
    activityId: string;
    website?: string;
  };
  permissions: AtlasPluginPermission[];
  targetSections?: string[];
  entryPoint?: string;
  optionsSchema?: Record<string, any>;
  iconUrl?: string;
}

const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export function isValidSemanticVersion(value: unknown): value is string {
  return typeof value === 'string' && SEMVER_PATTERN.test(value);
}

type ParsedSemanticVersion = {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
};

export type ManifestRevisionValidationResult =
  | { isValid: true; changed: boolean }
  | { isValid: false; changed: boolean; error: 'INVALID_PREVIOUS_MANIFEST' | 'INVALID_NEXT_MANIFEST' | 'MANIFEST_VERSION_MUST_INCREASE' };

function parseSemanticVersion(value: string): ParsedSemanticVersion | null {
  if (!SEMVER_PATTERN.test(value)) return null;
  const withoutBuild = value.split('+', 1)[0];
  const [core, prerelease = ''] = withoutBuild.split('-', 2);
  const [major, minor, patch] = core.split('.').map(Number);
  return { major, minor, patch, prerelease: prerelease ? prerelease.split('.') : [] };
}

function compareSemanticVersions(left: string, right: string): number {
  const a = parseSemanticVersion(left);
  const b = parseSemanticVersion(right);
  if (!a || !b) throw new Error('Semantic versions must be validated before comparison.');

  for (const key of ['major', 'minor', 'patch'] as const) {
    if (a[key] !== b[key]) return a[key] > b[key] ? 1 : -1;
  }
  if (a.prerelease.length === 0 || b.prerelease.length === 0) {
    if (a.prerelease.length === b.prerelease.length) return 0;
    return a.prerelease.length === 0 ? 1 : -1;
  }
  const length = Math.max(a.prerelease.length, b.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const aPart = a.prerelease[index];
    const bPart = b.prerelease[index];
    if (aPart === undefined || bPart === undefined) return aPart === undefined ? -1 : 1;
    if (aPart === bPart) continue;
    const aNumeric = /^\d+$/.test(aPart);
    const bNumeric = /^\d+$/.test(bPart);
    if (aNumeric && bNumeric) return Number(aPart) > Number(bPart) ? 1 : -1;
    if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
    return aPart > bPart ? 1 : -1;
  }
  return 0;
}

export function canonicalizeManifest(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalizeManifest).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${canonicalizeManifest(entryValue)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function isSafePackagePath(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0 || value.trim() !== value) return false;
  if (value.includes('\\') || /[\u0000-\u001f\u007f?#]/.test(value)) return false;
  if (value.startsWith('/') || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)) return false;

  const packagePath = value.startsWith('./') ? value.slice(2) : value;
  const segments = packagePath.split('/');
  return segments.every((segment) => segment.length > 0 && segment !== '.' && segment !== '..');
}

export function validatePluginManifest(manifest: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!manifest || typeof manifest !== 'object') {
    return { isValid: false, errors: ['Manifest must be a valid JSON object.'] };
  }

  const m = manifest as Record<string, any>;
  if (!m.code || typeof m.code !== 'string' || !/^[a-z0-9-]+$/.test(m.code)) {
    errors.push('Manifest must contain a valid kebab-case "code" identifier.');
  }
  if (!m.name || typeof m.name !== 'string') {
    errors.push('Manifest must contain a "name" string.');
  }
  if (m.manifestVersion !== '1.0.0') {
    errors.push('Unsupported manifestVersion. Expected "1.0.0".');
  }
  if (!isValidSemanticVersion(m.version)) {
    errors.push('Manifest must contain a SemVer "version" (e.g. 1.0.0).');
  }
  if (!['THEME', 'PLUGIN', 'SAAS_INTEGRATION', 'DIRECT_SERVICE', 'BUNDLE'].includes(m.capabilityType)) {
    errors.push(`Invalid capabilityType: "${m.capabilityType}".`);
  }
  if (m.capabilityType === 'SAAS_INTEGRATION' && m.integrationCategory) {
    if (!STANDARD_INTEGRATION_CATEGORIES.includes(m.integrationCategory)) {
      errors.push(`Invalid integrationCategory: "${m.integrationCategory}". Must be one of the standard categories.`);
    }
  }
  if (m.entryPoint !== undefined && !isSafePackagePath(m.entryPoint)) {
    errors.push('Manifest "entryPoint" must be a safe relative package path.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Guards the immutable identity of a reviewed/distributed manifest revision.
 * It deliberately does not decide compatibility, publication, or support
 * policy; it only requires a strictly newer SemVer for changed content.
 */
export function validateManifestRevision(previous: unknown, next: unknown): ManifestRevisionValidationResult {
  const previousValidation = validatePluginManifest(previous);
  if (!previousValidation.isValid) {
    return { isValid: false, changed: false, error: 'INVALID_PREVIOUS_MANIFEST' };
  }
  const nextValidation = validatePluginManifest(next);
  if (!nextValidation.isValid) {
    return { isValid: false, changed: false, error: 'INVALID_NEXT_MANIFEST' };
  }

  const changed = canonicalizeManifest(previous) !== canonicalizeManifest(next);
  if (!changed) return { isValid: true, changed: false };

  const previousVersion = (previous as Record<string, unknown>).version as string;
  const nextVersion = (next as Record<string, unknown>).version as string;
  if (compareSemanticVersions(nextVersion, previousVersion) <= 0) {
    return { isValid: false, changed: true, error: 'MANIFEST_VERSION_MUST_INCREASE' };
  }
  return { isValid: true, changed: true };
}
