/**
 * Atlas Canonical Theme Structure Guard (ADM-016 §4)
 * Enforces the preservation of the 7 non-negotiable activity page sections.
 */

export const CANONICAL_THEME_SECTIONS = [
  'BASIC_INFO',
  'PRODUCTS',
  'SERVICES',
  'OFFERS',
  'REVIEWS',
  'LOCATION_CONTACT',
  'VERIFICATION_BADGES',
] as const;

export type CanonicalThemeSection = typeof CANONICAL_THEME_SECTIONS[number];

export interface ThemeValidationResult {
  isCompliant: boolean;
  missingSections: CanonicalThemeSection[];
  declaredSections: string[];
  reasons: string[];
}

export class ThemeSectionGuard {
  /**
   * Validates whether a theme manifest supports all 7 canonical sections.
   */
  public static validateThemeSections(supportedSections: string[]): ThemeValidationResult {
    const missingSections: CanonicalThemeSection[] = [];
    const reasons: string[] = [];

    for (const section of CANONICAL_THEME_SECTIONS) {
      if (!supportedSections.includes(section)) {
        missingSections.push(section);
        reasons.push(`Theme is missing required canonical section: '${section}'. All 7 sections must be preserved (ADM-016).`);
      }
    }

    return {
      isCompliant: missingSections.length === 0,
      missingSections,
      declaredSections: supportedSections,
      reasons,
    };
  }
}
