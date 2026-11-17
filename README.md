# Atlas SDK | حزمة تطوير أطلس

**العربية** | [English](#english)

المستودع الرسمي المستقل للكود المصدري لـ **Atlas Marketplace SDK** التابع لمنصة قناتي أطلس. يُدار حاليًا عبر حساب مالك المشروع.

**الحالة الحالية: مستودع خاص — قيد التجهيز والاختبار، غير منشور للمطورين بعد.**

هذا المستودع يحتوي **كود TypeScript حقيقيًا** مستخرجًا من عقود أطلس الحالية للتحقق من ملفات تعريف الإضافات (`Manifest`)، والصلاحيات، وحماية أقسام الثيمات، وتوافق الإصدارات. لا يتضمن حاليًا بيئة Sandbox تشغيلية أو عميلًا عامًا مكتملًا لواجهات Atlas API أو منظومة الدفع.

## ما الذي تستطيع فعله بالحزمة حاليًا؟

تتوفر الصادرات البرمجية الموجودة فعلًا في `src/index.ts`:

| المجال | الصادرات الفعلية |
|---|---|
| Manifest والإصدارات | `validatePluginManifest`، `validateManifestRevision`، `isValidSemanticVersion`، `isSafePackagePath`، `canonicalizeManifest` |
| الصلاحيات | `PermissionSandboxValidator`، `ALLOWED_PERMISSIONS`، `PROHIBITED_CAPABILITIES` |
| الثيمات | `ThemeSectionGuard`، `CANONICAL_THEME_SECTIONS` |
| التوافق | `validateSdkCompatibilityRule`، `SDK_COMPATIBILITY_STATUSES` |

هذه الأدوات **تفحص العقود والبيانات فقط**؛ نجاح التحقق لا يمنح صلاحية تنفيذية أو إذن نشر داخل أطلس.

## التشغيل والاختبار من المستودع

المتطلبات: **Node.js 20 أو أحدث** وnpm. نفّذ الأوامر داخل نسخة محلية من المستودع:

```bash
npm install
npm run build
npm test
npm run pack:check
```

الأوامر مضافة في `package.json`، لكن اجتيازها في بيئة تطوير مستقلة **لم يُثبَت بعد**؛ التحقق مطلوب قبل الإصدار الرسمي.

مثال يستخدم صادرات الحزمة الحقيقية بعد البناء:

```js
const { validatePluginManifest, PermissionSandboxValidator } = require('./dist/index.js');

const result = PermissionSandboxValidator.validatePermissions(['READ_ACTIVITY_PROFILE']);
console.log(result.isValid);
```

هذا المثال يفحص تصريحًا مطلوبًا محليًا، ولا يتصل بخادم أطلس ولا يفعّل الإضافة.

## سياسة الإصدار والأمان

- الاسم المستهدف للحزمة: `@qanati-atlas/sdk`، **ولم يتم نشره على npm حتى الآن**؛ لا تستخدم `npm install @qanati-atlas/sdk` باعتباره أمرًا متاحًا.
- الملفات المصدرية مشتقة من `packages/sdk/src` في [مستودع أطلس الأساسي](https://github.com/mamiVamora/atlas) (خاص). يجب مراجعة التوافق عند كل إصدار.
- إصدار SDK مستقل عن إصدارات منتجات Marketplace، وتكون عملية نشر الإصدارات الرسمية يدوية وبموافقة المالك.
- الحزمة حاليًا `private: true` وترخيصها `UNLICENSED` لمنع نشرها قبل حسم الترخيص والمراجعة الأمنية.
- يمنع نشر أسرار أو مفاتيح أو بيانات مستخدمين أو مسارات الإدارة الداخلية أو الوصول المباشر إلى قاعدة الإنتاج.

**غير متاح بعد:** تثبيت npm العام، Sandbox حقيقي للمطورين، موقع وثائق منفصل، عميل API/Webhooks عام مثبت، ومصفوفة توافق عامة منشورة. لن توصف هذه الإمكانات بأنها جاهزة قبل تنفيذها واختبارها.

المراجع الحاكمة في أطلس: `ATLAS_SDK_RELEASE_DISTRIBUTION_APPROVED_CONTRACT_2026-11-08.md`، `ADM-016`، `ADM-050`، `ATLAS_MASTER_JOURNEY_MAP.md`.

---

<a id="english"></a>

# English

Official standalone source repository for the **Qanati Atlas Marketplace SDK**, currently maintained under the product owner's GitHub account.

**Status: PRIVATE / PRE-RELEASE — not yet distributed to developers.**

This repository contains **real TypeScript source code** extracted from Atlas's existing contracts for plugin manifest validation, permissions, theme-section safeguards, and version compatibility. It does **not** currently contain an operational developer Sandbox, a verified public Atlas API client, or payment functionality.

## Available SDK exports

The following APIs are exported by `src/index.ts`:

| Area | Available exports |
|---|---|
| Manifest and versioning | `validatePluginManifest`, `validateManifestRevision`, `isValidSemanticVersion`, `isSafePackagePath`, `canonicalizeManifest` |
| Permissions | `PermissionSandboxValidator`, `ALLOWED_PERMISSIONS`, `PROHIBITED_CAPABILITIES` |
| Themes | `ThemeSectionGuard`, `CANONICAL_THEME_SECTIONS` |
| Compatibility | `validateSdkCompatibilityRule`, `SDK_COMPATIBILITY_STATUSES` |

These utilities **validate contracts and data**. Successful validation does not grant runtime permissions, deployment authorization, or Marketplace publication.

## Build and verify locally

Requires **Node.js 20+** and npm. Run inside a local checkout:

```bash
npm install
npm run build
npm test
npm run pack:check
```

The scripts are defined in `package.json`; **independent execution has not yet been verified**. Successful local build and tests are required before any release.

Example using actual compiled exports:

```js
const { validatePluginManifest, PermissionSandboxValidator } = require('./dist/index.js');

const result = PermissionSandboxValidator.validatePermissions(['READ_ACTIVITY_PROFILE']);
console.log(result.isValid);
```

This only validates a requested permission locally. It does not connect to Atlas or activate an integration.

## Distribution, security and licensing

- Intended npm package: `@qanati-atlas/sdk` — **not published**. Do not advertise `npm install @qanati-atlas/sdk` as an available installation method.
- Source originates from `packages/sdk/src` in the [main Atlas repository](https://github.com/mamiVamora/atlas) (private). Each release must be reconciled against canonical contracts and security guards.
- Official SDK versions are independent of Marketplace item versions. Releases are manual and owner-approved.
- `private: true` and `UNLICENSED` intentionally prevent premature distribution. Licensing and security review are prerequisites for public release.
- Do not include secrets, customer data, internal administration endpoints, payment credentials or direct production database access.

**Not available yet:** public npm distribution, hosted developer Sandbox, standalone documentation website, verified public API/Webhooks client, or published compatibility matrix. These are engineering deliverables, not existing features.

Canonical decisions: `ATLAS_SDK_RELEASE_DISTRIBUTION_APPROVED_CONTRACT_2026-11-08.md`, `ADM-016`, `ADM-050`, and `ATLAS_MASTER_JOURNEY_MAP.md` in the main Atlas repository.
