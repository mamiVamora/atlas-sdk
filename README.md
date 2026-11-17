<div align="center">

# 🌐 Atlas SDK

### أدوات المطورين لمنظومة قناتي أطلس · Developer Toolkit for Qanati Atlas

**طوّر إضافات وثيمات متوافقة مع أطلس.**  
Build plugins and themes with validated Atlas contracts.

[![MIT License](https://img.shields.io/badge/License-MIT-22a06b?style=for-the-badge)](LICENSE)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js 20+](https://img.shields.io/badge/Node.js-20%2B-43853D?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SDK contracts](https://img.shields.io/badge/SDK-Contracts%20%26%20Validators-5B46C5?style=for-the-badge)

[**🇮🇶 الدليل بالعربية**](#arabic-guide) · [**🌍 English Guide**](#english-guide) · [**💻 الشيفرة / Source**](src) · [**📄 الترخيص / License**](LICENSE)

</div>

---

<a id="arabic-guide"></a>

## 🇮🇶 دليل المطور — العربية

طوّر إضافات وثيمات متوافقة مع **Qanati Atlas** باستخدام عقود SDK الرسمية للتحقق من بنية الإضافات، والصلاحيات المطلوبة، وأقسام واجهة النشاط، وتوافق الإصدارات.

### 🚀 ابدأ من هنا

يتطلب تشغيل SDK محليًا **Node.js 20 أو أحدث** و **npm**.

بعد الحصول على نسخة من الشيفرة المصدرية، نفّذ:

```bash
npm install
npm run build
npm test
```

ستُنشأ ملفات JavaScript والتعريفات الخاصة بـTypeScript داخل `dist/`.

> **التوزيع:** تثبيت حزمة `@qanati-atlas/sdk` مباشرةً من npm غير متاح حاليًا. يمكن استخدام الشيفرة الموجودة في هذا المشروع محليًا، ولا يلزم الاتصال بخوادم أطلس لتشغيل أدوات التحقق أدناه.

### 🧩 1. التحقق من Manifest الإضافة

يحدد `Manifest` هوية الإضافة ونوعها وإصدارها والصلاحيات التي تطلبها.

```js
const { validatePluginManifest } = require('./dist/index.js');

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
const { PermissionSandboxValidator } = require('./dist/index.js');

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
const { ThemeSectionGuard, CANONICAL_THEME_SECTIONS } = require('./dist/index.js');

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

تُستورد جميعها من نقطة الدخول `src/index.ts` أو من `dist/index.js` بعد البناء.

> **حدود الحزمة:** بيئة تنفيذ Sandbox المستضافة، والتثبيت عبر npm، وعميل API عام للاتصال بخدمات أطلس ليست ضمن الوظائف المتاحة في هذه الحزمة حاليًا. يُرجى الاعتماد على الواجهات الموثقة أعلاه فقط.

---

<a id="english-guide"></a>

## 🌍 Developer Guide — English

Build Atlas-compatible plugins and themes with the **Qanati Atlas SDK**. Use its TypeScript contracts and validators to check plugin manifests, requested permissions, required activity-page sections, and version compatibility.

### 🚀 Getting started

You'll need **Node.js 20+** and **npm**.

From a local copy of the SDK source, run:

```bash
npm install
npm run build
npm test
```

Compiled JavaScript and TypeScript declarations are generated in `dist/`.

> **Installation:** The `@qanati-atlas/sdk` package is not yet distributed through npm. You can use the SDK source locally; the validation utilities below do not require a connection to Atlas servers.

### 🧩 1. Validate a plugin manifest

A manifest describes a plugin's identity, version, capability and requested permissions.

```js
const { validatePluginManifest } = require('./dist/index.js');

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
const { PermissionSandboxValidator } = require('./dist/index.js');

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
const { ThemeSectionGuard, CANONICAL_THEME_SECTIONS } = require('./dist/index.js');

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

All exports are available from `src/index.ts` or the compiled `dist/index.js`.

> **Availability:** Hosted Sandbox execution, npm distribution, and a public Atlas API client are not yet provided by this SDK package. Use only the documented APIs above.


---

<div align="center">

**Qanati Atlas** · [المنصة / Platform](https://atlas.qanati.site/) · [↑ العودة للأعلى / Back to top](#-atlas-sdk)

</div>
