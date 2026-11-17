const test = require('node:test');
const assert = require('node:assert/strict');
const sdk = require('../dist/index.js');

test('validates an Atlas manifest with real exported API', () => {
  const manifest = {
    manifestVersion: '1.0.0', code: 'sample-plugin', name: 'Sample Plugin',
    version: '1.0.0', capabilityType: 'PLUGIN', description: 'An example',
    author: { name: 'Example Developer', activityId: 'example-activity' },
    permissions: ['READ_ACTIVITY_PROFILE'], entryPoint: 'dist/plugin.js'
  };
  assert.equal(sdk.validatePluginManifest(manifest).isValid, true);
  assert.equal(sdk.validatePluginManifest({...manifest, entryPoint:'../secret'}).isValid,false);
  assert.equal(sdk.validateManifestRevision(manifest, {...manifest,version:'1.0.1',description:'Changed'}).isValid,true);
  assert.equal(sdk.validateManifestRevision(manifest, {...manifest,description:'Changed'}).isValid,false);
});

test('enforces documented permission and theme guards', () => {
  const p=sdk.PermissionSandboxValidator.validatePermissions(['READ_PRODUCTS','DIRECT_DB_ACCESS']);
  assert.equal(p.isValid,false);
  assert.deepEqual(p.grantedPermissions,['READ_PRODUCTS']);
  const t=sdk.ThemeSectionGuard.validateThemeSections([...sdk.CANONICAL_THEME_SECTIONS]);
  assert.equal(t.isCompliant,true);
});

test('validates SDK compatibility contract', () => {
  assert.deepEqual(sdk.validateSdkCompatibilityRule({
    sdkVersion:'1.0.0',apiVersion:'v1',manifestSchemaVersion:'1.0.0',
    capabilityType:'PLUGIN',compatibilityStatus:'COMPATIBLE'
  }),[]);
  assert.ok(sdk.validateSdkCompatibilityRule({
    sdkVersion:'x',apiVersion:'v1',manifestSchemaVersion:'1.0.0',
    capabilityType:'PLUGIN',compatibilityStatus:'COMPATIBLE'
  }).includes('INVALID_SDK_SEMVER'));
});
