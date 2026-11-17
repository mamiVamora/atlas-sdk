<div align="center">

<img src="assets/atlas-logo-horizontal.png" alt="Qanati Atlas Logo" width="280" />

# Atlas SDK

### أدوات المطورين لمنظومة قناتي أطلس · Developer Toolkit for Qanati Atlas

**طوّر إضافات وثيمات متوافقة مع أطلس.**  
Build plugins and themes with validated Atlas contracts.

[![npm version](https://img.shields.io/npm/v/@qanati-atlas/sdk?style=for-the-badge&color=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@qanati-atlas/sdk)
[![MIT License](https://img.shields.io/badge/License-MIT-22a06b?style=for-the-badge)](LICENSE)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js 20+](https://img.shields.io/badge/Node.js-20%2B-43853D?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SDK contracts](https://img.shields.io/badge/SDK-Contracts%20%26%20Validators-5B46C5?style=for-the-badge)

[**📦 npm**](https://www.npmjs.com/package/@qanati-atlas/sdk) · [**🇮🇶 الدليل بالعربية**](#arabic-guide) · [**🌍 English Guide**](#english-guide) · [**💻 الشيفرة / Source**](src) · [**📄 الترخيص / License**](LICENSE)

</div>

---

<a id="arabic-guide"></a>

## 🇮🇶 دليل المطور — العربية

طوّر إضافات وثيمات متوافقة مع **Qanati Atlas** باستخدام عقود SDK الرسمية للتحقق من بنية الإضافات، والصلاحيات المطلوبة، وأقسام واجهة النشاط، وتوافق الإصدارات.

### 🚀 ابدأ من هنا

يتطلب تشغيل SDK **Node.js 20 أو أحدث** و **npm**.

ثبّت الحزمة الرسمية من npm:

```bash
npm install @qanati-atlas/sdk
```

أو عند العمل محليًا من الشيفرة المصدرية:

```bash
npm install
npm run build
npm test
```

> **التوزيع:** حزمة [`@qanati-atlas/sdk`](https://www.npmjs.com/package/@qanati-atlas/sdk) منشورة على npm، وتعمل أدوات التحقق فيها محليًا دون الحاجة إلى الاتصال بخوادم أطلس.

### 🧩 1. التحقق من Manifest الإضافة

يحدد `Manifest` هوية الإضافة ونوعها وإصدارها والصلاحيات التي تطلبها.

```js
const { validatePluginManifest } = require('@qanati-atlas/sdk');

const manifest = {
  manifestVersion: '1.0.0',
  code: 'business-hours',
  name: 'Business Hours',
  version: '1.0.0',
  capabilityType: 'PLUGIN',
  description: 'Display business opening hours',
  author: {
    name: 'Example Developer',
    activityId: 'example-activity'
  },
  permissions: ['READ_ACTIVITY_PROFILE'],
  entryPoint: 'dist/index.js'
};

const result = validatePluginManifest(manifest);

if (!result.isValid) {
  console.error(result.errors);
}
```

هذا المثال يوضح فحص بنية البيانات؛ القيم التعريفية فيه أمثلة، وليست نشاطًا أو إضافة منشورة في أطلس.

### 🛡️ 2. التحقق من الصلاحيات

```js
const { PermissionSandboxValidator } = require('@qanati-atlas/sdk');

const result = PermissionSandboxValidator.validatePermissions([
  'READ_ACTIVITY_PROFILE',
  'DIRECT_DB_ACCESS'
]);

console.log(result.grantedPermissions);  // ['READ_ACTIVITY_PROFILE']
console.log(result.rejectedPermissions); // ['DIRECT_DB_ACCESS']
```

يسمح المدقق بتحديد الصلاحيات المعلنة والمرفوضة. **نتيجة التحقق لا تمنح صلاحيات فعلية على حسابات المستخدمين أو أنشطتهم.**

### 🎨 3. حماية أقسام النشاط في الثيمات

يجب أن يحافظ الثيم على الأقسام السبعة الأساسية في صفحة النشاط.

```js
const { ThemeSectionGuard, CANONICAL_THEME_SECTIONS } = require('@qanati-atlas/sdk');

const result = ThemeSectionGuard.validateThemeSections([
  ...CANONICAL_THEME_SECTIONS
]);

console.log(result.isCompliant); // true
```

### 🔄 4. الإصدارات والتوافق

يمكنك فحص تغيير تعريف إضافة بين إصدارين باستخدام `validateManifestRevision(previous, next)`، أو فحص عقد توافق SDK باستخدام `validateSdkCompatibilityRule(rule)`.

تدعم قاعدة التوافق الحالات التالية:

- `COMPATIBLE` — متوافق.
- `DEPRECATED_WARN` — متوافق مع تحذير بالإيقاف التدريجي.
- `INCOMPATIBLE` — غير متوافق.
- `SECURITY_BLOCKED` — محظور لأسباب أمنية.

هذه **أدوات تحقق محلية**؛ لا تعني أن الإضافة نُشرت أو أن تشغيلها داخل بيئة أطلس قد تم.

### 📄 الترخيص

الحزمة متاحة بموجب [ترخيص MIT](LICENSE). يمكنك استخدامها وتعديلها وتوزيعها في مشاريع تجارية، بشرط الاحتفاظ بإشعار الحقوق والترخيص. ينطبق الترخيص على ملفات هذا المستودع، ولا يمنح حق الوصول إلى خوادم أطلس أو بيانات المستخدمين أو صلاحيات Marketplace، ولا يشمل شيفرة منصة أطلس الخاصة.

### 🧰 واجهات SDK المتاحة

| المجال | الواجهات |
|---|---|
| تعريفات الإضافات والإصدارات | `validatePluginManifest`, `validateManifestRevision`, `isValidSemanticVersion`, `isSafePackagePath`, `canonicalizeManifest` |
| الصلاحيات | `PermissionSandboxValidator`, `ALLOWED_PERMISSIONS`, `PROHIBITED_CAPABILITIES` |
| الثيمات | `ThemeSectionGuard`, `CANONICAL_THEME_SECTIONS` |
| التوافق | `validateSdkCompatibilityRule`, `SDK_COMPATIBILITY_STATUSES` |

تُستورد جميعها مباشرةً من `@qanati-atlas/sdk` (أو من `src/index.ts` / `dist/index.js` عند التطوير المحلي).

> **حدود الحزمة:** بيئة تنفيذ Sandbox المستضافة، وعميل API عام للاتصال بخدمات أطلس ليست ضمن الوظائف المتاحة في هذه الحزمة حاليًا. يُرجى الاعتماد على الواجهات الموثقة أعلاه فقط.

---

<a id="english-guide"></a>

## 🌍 Developer Guide — English

Build Atlas-compatible plugins and themes with the **Qanati Atlas SDK**. Use its TypeScript contracts and validators to check plugin manifests, requested permissions, required activity-page sections, and version compatibility.

### 🚀 Getting started

You'll need **Node.js 20+** and **npm**.

Install the official package from npm:

```bash
npm install @qanati-atlas/sdk
```

Or when working locally from the source repository:

```bash
npm install
npm run build
npm test
```

> **Distribution:** [`@qanati-atlas/sdk`](https://www.npmjs.com/package/@qanati-atlas/sdk) is published on npm, and all validation utilities run locally without connecting to Atlas servers.

### 🧩 1. Validate a plugin manifest

A manifest describes a plugin's identity, version, capability and requested permissions.

```js
const { validatePluginManifest } = require('@qanati-atlas/sdk');

const manifest = {
  manifestVersion: '1.0.0',
  code: 'business-hours',
  name: 'Business Hours',
  version: '1.0.0',
  capabilityType: 'PLUGIN',
  description: 'Display business opening hours',
  author: {
    name: 'Example Developer',
    activityId: 'example-activity'
  },
  permissions: ['READ_ACTIVITY_PROFILE'],
  entryPoint: 'dist/index.js'
};

const result = validatePluginManifest(manifest);

if (!result.isValid) {
  console.error(result.errors);
}
```

The identifiers are illustrative; this example does not represent a published Atlas plugin or activity.

### 🛡️ 2. Validate requested permissions

```js
const { PermissionSandboxValidator } = require('@qanati-atlas/sdk');

const result = PermissionSandboxValidator.validatePermissions([
  'READ_ACTIVITY_PROFILE',
  'DIRECT_DB_ACCESS'
]);

console.log(result.grantedPermissions);  // ['READ_ACTIVITY_PROFILE']
console.log(result.rejectedPermissions); // ['DIRECT_DB_ACCESS']
```

The validator identifies recognized and rejected permission identifiers. **Validation does not grant access to any user data or Atlas services.**

### 🎨 3. Preserve required activity sections in themes

An Atlas-compatible theme must preserve the seven canonical activity-page sections.

```js
const { ThemeSectionGuard, CANONICAL_THEME_SECTIONS } = require('@qanati-atlas/sdk');

const result = ThemeSectionGuard.validateThemeSections([
  ...CANONICAL_THEME_SECTIONS
]);

console.log(result.isCompliant); // true
```

### 🔄 4. Versions and compatibility

Use `validateManifestRevision(previous, next)` to validate a manifest update, and `validateSdkCompatibilityRule(rule)` to inspect an SDK compatibility rule.

Supported compatibility statuses:

- `COMPATIBLE` — compatible.
- `DEPRECATED_WARN` — compatible with a deprecation warning.
- `INCOMPATIBLE` — incompatible.
- `SECURITY_BLOCKED` — blocked for security reasons.

These are **local validators**, not proof that a plugin has been published, installed or executed by Atlas.

### 📄 License

This SDK is licensed under the [MIT License](LICENSE). You may use, modify and redistribute it in commercial projects provided you retain the copyright and license notice. The license applies to this repository's code; it does not grant access to Atlas servers, customer data, Marketplace permissions, or the private Atlas platform source.

### 🧰 Available SDK APIs

| Area | Exports |
|---|---|
| Manifests and versioning | `validatePluginManifest`, `validateManifestRevision`, `isValidSemanticVersion`, `isSafePackagePath`, `canonicalizeManifest` |
| Permissions | `PermissionSandboxValidator`, `ALLOWED_PERMISSIONS`, `PROHIBITED_CAPABILITIES` |
| Themes | `ThemeSectionGuard`, `CANONICAL_THEME_SECTIONS` |
| Compatibility | `validateSdkCompatibilityRule`, `SDK_COMPATIBILITY_STATUSES` |

All exports are available directly from `@qanati-atlas/sdk` (or from `src/index.ts` / `dist/index.js` when developing locally).

> **Availability:** Hosted Sandbox execution and a public Atlas API client are not yet provided by this SDK package. Use only the documented APIs above.


---

<div align="center">

**Qanati Atlas** · [المنصة / Platform](https://atlas.qanati.site/) · [↑ العودة للأعلى / Back to top](#-atlas-sdk)

</div>
