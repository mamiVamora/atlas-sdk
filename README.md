# Atlas SDK — Qanati Atlas

Official source repository for the Atlas Marketplace developer SDK, maintained under the account of the Atlas product owner.

**Current distribution status: PRIVATE / PRE-RELEASE.** This repository contains working TypeScript contracts and validators copied from the Atlas product source. It is **not** a published npm package, a running developer Sandbox, or a production-ready plugin runtime. Do not advertise installation from npm until an official release is published.

## What exists today

The public exports in `src/index.ts` contain:
- `validatePluginManifest`, `validateManifestRevision`, `isValidSemanticVersion`, `isSafePackagePath`, and `canonicalizeManifest`
- `PermissionSandboxValidator`, `ALLOWED_PERMISSIONS`, `PROHIBITED_CAPABILITIES`
- `ThemeSectionGuard`, `CANONICAL_THEME_SECTIONS`
- `validateSdkCompatibilityRule`, `SDK_COMPATIBILITY_STATUSES`

These are **validation and compatibility contracts**, not API clients, payment SDKs, Sandbox execution services, or permission grants.

## Develop and verify locally

Requires Node.js 20+ and npm:

```bash
npm install
npm run build
npm test
npm run pack:check
```

To exercise the actual built exports from a local checkout:

```js
const { validatePluginManifest, PermissionSandboxValidator } = require('./dist/index.js');

const permissions = PermissionSandboxValidator.validatePermissions(['READ_ACTIVITY_PROFILE']);
console.log(permissions.isValid);
```

## Repository and release policy

- Atlas product source: [mamiVamora/atlas](https://github.com/mamiVamora/atlas) (private).
- SDK source is extracted from `packages/sdk/src` of that repository. Changes must be reconciled with the authoritative product contracts, security guards and compatibility registry before release.
- Intended package name: `@qanati-atlas/sdk`.
- Manual, owner-approved releases only; SDK versions are independent of Marketplace item versions.
- The package is marked `private: true` and `UNLICENSED` to prevent accidental distribution. A deliberate owner-approved licensing/publication decision is required before either is changed.
- No credentials, customer data, internal administrative endpoints, payment secrets or production DB access in SDK code or documentation.

**Not yet available:** public npm installation, external developer Sandbox, independent docs website, verified public API/Webhook client, and published compatibility matrix. These require separate engineering and acceptance checks; this README does not promise them.

Canonical decisions remain in the Atlas repository: `ATLAS_SDK_RELEASE_DISTRIBUTION_APPROVED_CONTRACT_2026-11-08.md`, `ADM-016`, `ADM-050`, and `ATLAS_MASTER_JOURNEY_MAP.md`.
