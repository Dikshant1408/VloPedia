/**
 * VloPedia — Pre-Index Content Quality Gate
 * 
 * Enforces editorial excellence before pages are submitted for search indexation:
 * - Prevents low-quality, duplicate, or thin API entity pages from polluting the search index
 * - Validates: Unique Intent, Useful Instant Answer, Substantial Word Count, Verified Source, Absolute Canonical, Internal Links, Structured Data
 * - Generates hard NOINDEX or REVIEW directives if quality thresholds fail
 */

export type QualityGateVerdict = 
  | "INDEX_RECOMMENDED"       // 90+ score: fully comprehensive, schema-validated, indexable
  | "NEEDS_EDITORIAL_REVIEW"  // 60-89 score: missing answer box or thin word count
  | "FORCE_NOINDEX";          // <60 score: duplicate alias, missing canonical, or empty shell

export interface QualityGateInput {
  url: string;
  title: string;
  pageType: "SKIN" | "WEAPON" | "AGENT" | "MAP" | "BUNDLE" | "COLLECTION" | "GUIDE" | "LORE" | "TOOL";
  wordCount: number;
  hasInstantAnswer: boolean;
  hasStructuredData: boolean;
  canonicalUrl: string;
  internalLinkCount: number;
  hasVerifiedSource: boolean;
  isLegacyAlias: boolean;
}

export interface QualityGateResult {
  url: string;
  pageType: string;
  overallScore: number; // 0 - 100
  verdict: QualityGateVerdict;
  passedChecks: string[];
  failedChecks: string[];
  remediationAction?: string;
  robotsDirective: "index, follow" | "noindex, follow";
}

export class ContentQualityGate {
  /**
   * Minimum word count thresholds by page category to avoid "thin content" flags
   */
  private static WORD_COUNT_THRESHOLDS: Record<string, number> = {
    SKIN: 150,
    BUNDLE: 250,
    COLLECTION: 200,
    WEAPON: 250,
    AGENT: 350,
    MAP: 250,
    GUIDE: 400,
    LORE: 300,
    TOOL: 120
  };

  /**
   * Evaluates a page against the 7 pre-index quality standards
   */
  public static evaluatePage(input: QualityGateInput): QualityGateResult {
    const passedChecks: string[] = [];
    const failedChecks: string[] = [];
    let score = 100;

    // 1. Check for legacy UUID or alias redirect
    if (input.isLegacyAlias) {
      score -= 50;
      failedChecks.push("Page is a legacy UUID or redirect alias (Must be excluded from indexation)");
    } else {
      passedChecks.push("Unique canonical route (not a duplicate alias)");
    }

    // 2. Check canonical URL validity
    const isAbsoluteCanonical = input.canonicalUrl.startsWith("http://") || input.canonicalUrl.startsWith("https://");
    if (!isAbsoluteCanonical || !input.canonicalUrl.includes(input.url.split("?")[0])) {
      score -= 20;
      failedChecks.push("Missing or invalid absolute canonical URL");
    } else {
      passedChecks.push("Valid absolute canonical URL declared");
    }

    // 3. Check for instant, above-the-fold answer
    if (!input.hasInstantAnswer) {
      score -= 15;
      failedChecks.push("Lacks above-the-fold instant AnswerBox or executive summary block");
    } else {
      passedChecks.push("Includes instant above-the-fold answer box");
    }

    // 4. Check word count against category threshold
    const minWords = this.WORD_COUNT_THRESHOLDS[input.pageType] || 200;
    if (input.wordCount < minWords) {
      score -= 20;
      failedChecks.push(`Word count (${input.wordCount} words) is below quality threshold (${minWords} words)`);
    } else {
      passedChecks.push(`Sufficient descriptive content depth (${input.wordCount} words)`);
    }

    // 5. Check Schema.org structured data
    if (!input.hasStructuredData) {
      score -= 15;
      failedChecks.push("Missing Schema.org JSON-LD (Product, Article, Place, or FAQPage)");
    } else {
      passedChecks.push("Declares Schema.org JSON-LD structured data");
    }

    // 6. Check internal link mesh
    if (input.internalLinkCount < 2) {
      score -= 10;
      failedChecks.push(`Insufficient internal links (${input.internalLinkCount} links; minimum 2 required)`);
    } else {
      passedChecks.push(`Strong internal link connectivity (${input.internalLinkCount} links)`);
    }

    // 7. Check source verification
    if (!input.hasVerifiedSource) {
      score -= 10;
      failedChecks.push("Lacks verified source citation or provenance badge");
    } else {
      passedChecks.push("Source citations verified against SourceRegistry");
    }

    score = Math.max(0, Math.min(100, score));

    let verdict: QualityGateVerdict = "INDEX_RECOMMENDED";
    let robotsDirective: "index, follow" | "noindex, follow" = "index, follow";

    if (score < 60 || input.isLegacyAlias) {
      verdict = "FORCE_NOINDEX";
      robotsDirective = "noindex, follow";
    } else if (score < 85) {
      verdict = "NEEDS_EDITORIAL_REVIEW";
      robotsDirective = "index, follow";
    }

    let remediationAction: string | undefined;
    if (failedChecks.length > 0) {
      remediationAction = `Fix ${failedChecks.length} quality issues: ${failedChecks.join("; ")}`;
    }

    return {
      url: input.url,
      pageType: input.pageType,
      overallScore: score,
      verdict,
      passedChecks,
      failedChecks,
      remediationAction,
      robotsDirective
    };
  }

  /**
   * Batch audit sample pages across key categories
   */
  public static auditCatalogSample(): QualityGateResult[] {
    return [
      this.evaluatePage({
        url: "/skins/aemondir-vandal",
        title: "Aemondir Vandal",
        pageType: "SKIN",
        wordCount: 320,
        hasInstantAnswer: true,
        hasStructuredData: true,
        canonicalUrl: "https://valovault-ivory.vercel.app/skins/aemondir-vandal",
        internalLinkCount: 6,
        hasVerifiedSource: true,
        isLegacyAlias: false
      }),
      this.evaluatePage({
        url: "/skins/2b7f65f7-4e85-becc-5f3d-39961f937b79",
        title: "Libretto Stinger (Legacy UUID)",
        pageType: "SKIN",
        wordCount: 40,
        hasInstantAnswer: false,
        hasStructuredData: false,
        canonicalUrl: "https://valovault-ivory.vercel.app/skins/libretto-stinger",
        internalLinkCount: 1,
        hasVerifiedSource: true,
        isLegacyAlias: true
      }),
      this.evaluatePage({
        url: "/bundles/a4c613c9-4970-61ca-e52a-918ae22f5315",
        title: "Araxys Bundle",
        pageType: "BUNDLE",
        wordCount: 420,
        hasInstantAnswer: true,
        hasStructuredData: true,
        canonicalUrl: "https://valovault-ivory.vercel.app/bundles/a4c613c9-4970-61ca-e52a-918ae22f5315",
        internalLinkCount: 14,
        hasVerifiedSource: true,
        isLegacyAlias: false
      }),
      this.evaluatePage({
        url: "/maps/lotus",
        title: "Lotus Tactical Map Guide",
        pageType: "MAP",
        wordCount: 380,
        hasInstantAnswer: true,
        hasStructuredData: true,
        canonicalUrl: "https://valovault-ivory.vercel.app/maps/lotus",
        internalLinkCount: 8,
        hasVerifiedSource: true,
        isLegacyAlias: false
      })
    ];
  }
}
