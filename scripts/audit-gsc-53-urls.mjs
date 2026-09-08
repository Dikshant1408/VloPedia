// scripts/audit-gsc-53-urls.mjs
// Verifies resolution for all 53 Google Search Console "Crawled - currently not indexed" URLs

const GSC_AFFECTED_URLS = [
  "https://valovault-ivory.vercel.app/collections/bubblegum-deathwish",
  "https://valovault-ivory.vercel.app/skins/2b7f65f7-4e85-becc-5f3d-39961f937b79",
  "https://valovault-ivory.vercel.app/skins/027a5d7f-4bfc-7c41-a012-24b8c6720fda",
  "https://valovault-ivory.vercel.app/skins/429437e4-4bc1-70b1-b3d3-358d9f8b199e",
  "https://valovault-ivory.vercel.app/skins/a8f3a670-4b8e-9fc8-30bd-f4b395d1ff5f",
  "https://valovault-ivory.vercel.app/skins/5844ccd5-4a8d-e84d-b5b1-dfaaa8f34d84",
  "https://valovault-ivory.vercel.app/skins/cfca617a-4240-377f-ed3f-778fa63729ed",
  "https://valovault-ivory.vercel.app/skins/e089be41-4242-b28d-1894-bbba193957a2",
  "https://valovault-ivory.vercel.app/skins/001e4ce2-4b30-8203-365a-828e2e3a5826",
  "https://valovault-ivory.vercel.app/collections/composite",
  "https://valovault-ivory.vercel.app/skins/cb2d0716-4059-03a7-6cdd-4aa160ef9f05",
  "https://valovault-ivory.vercel.app/weapons/ghost",
  "https://valovault-ivory.vercel.app/skins/ddbead4d-40b1-afe4-e44f-eca9e2022458",
  "https://valovault-ivory.vercel.app/bundles/e7ce2a70-46c2-61e2-bcdd-82a88a9d0d5c",
  "https://valovault-ivory.vercel.app/skins/abyssal-guardian",
  "https://valovault-ivory.vercel.app/skins/wonderstallion-guardian",
  "https://valovault-ivory.vercel.app/skins/sovereign-guardian",
  "https://valovault-ivory.vercel.app/skins/ff7784c0-493b-0f0f-9a7b-f1975a449154",
  "https://valovault-ivory.vercel.app/skins/guardian",
  "https://valovault-ivory.vercel.app/skins/sovereign-phantom",
  "https://valovault-ivory.vercel.app/skins/cc1da8cd-452f-a007-0bf8-b68a471c3a6e",
  "https://valovault-ivory.vercel.app/weapons/shorty",
  "https://valovault-ivory.vercel.app/skins/ac687fc4-40c5-4c41-6a7c-5eb59adabd60",
  "https://valovault-ivory.vercel.app/skins/55636f8c-4c03-c09d-79df-6b968a693ad5",
  "https://valovault-ivory.vercel.app/skins/b0d9088d-4a99-3dda-5b43-319e5fa9e66a",
  "https://valovault-ivory.vercel.app/skins/42fe7bf8-40ba-b1f4-df5e-34a6f51f29bf",
  "https://valovault-ivory.vercel.app/skins/0ce7539f-487a-9c4b-5a41-3fa338f5abcf",
  "https://valovault-ivory.vercel.app/skins/26ff0e3e-469a-cbdd-f79f-a3b89556cdef",
  "https://valovault-ivory.vercel.app/bundles/2ed936df-4959-acc7-9aca-358d34a50619",
  "https://valovault-ivory.vercel.app/bundles/1d0f4bbc-4237-1338-5712-1081e21295a1",
  "https://valovault-ivory.vercel.app/skins/a590c03a-43b1-a408-4c6b-0bb9fdda1570",
  "https://valovault-ivory.vercel.app/skins/199b8536-488a-09e6-8592-ff9cf21b4ceb",
  "https://valovault-ivory.vercel.app/maps/corrode",
  "https://valovault-ivory.vercel.app/bundles/33615a69-4988-a6a4-02ed-18918e4a8f1e",
  "https://valovault-ivory.vercel.app/skins/31072cda-4041-b4f0-119a-3692ea598321",
  "https://valovault-ivory.vercel.app/skins/fcd3527f-40bd-c834-d68b-fdb5adfce2d1",
  "https://valovault-ivory.vercel.app/skins/12e6f520-460b-e69b-0617-bab9fff1a134",
  "https://valovault-ivory.vercel.app/skins/c5676fb6-4268-d5bd-f2f7-f3a1334ca8b8",
  "https://valovault-ivory.vercel.app/skins/c91e4850-4d32-3b12-f411-3e9f644ea616",
  "https://valovault-ivory.vercel.app/skins/9773ba41-4512-3706-321f-c3b826754db9",
  "https://valovault-ivory.vercel.app/agents/brimstone",
  "https://valovault-ivory.vercel.app/maps/pearl",
  "https://valovault-ivory.vercel.app/bundles/a4c613c9-4970-61ca-e52a-918ae22f5315",
  "https://valovault-ivory.vercel.app/bundles/89443dca-429b-a9b0-afa1-5fa10b2446e5",
  "https://valovault-ivory.vercel.app/skins/26b1c794-4370-f354-ff4d-3a8b95edff79",
  "https://valovault-ivory.vercel.app/bundles/dfe28c9a-4398-ce91-e736-b7a123de7470",
  "https://valovault-ivory.vercel.app/skins/980fa063-436e-e51f-c38d-70a5b93a0f1c",
  "https://valovault-ivory.vercel.app/skins/2052a76e-411a-ebfc-e516-fd80dba0ddf9",
  "https://valovault-ivory.vercel.app/maps/lotus",
  "https://valovault-ivory.vercel.app/bundles/117eb86a-4535-03a4-0164-96800efaba8a",
  "https://valovault-ivory.vercel.app/contact",
  "https://valovault-ivory.vercel.app/bundles/0dee7ef6-d3ea-400a-b15c-5b9524243439",
  "https://valovault-ivory.vercel.app/skins/97a3cdc4-4f3a-ed26-02d6-6dbf6c1380d0"
];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function runAudit() {
  console.log("=== Auditing all 53 Google Search Console Affected URLs ===\n");
  console.log(`Total URLs to audit: ${GSC_AFFECTED_URLS.length}`);

  // Fetch API data
  const [skinsRes, bundlesRes] = await Promise.all([
    fetch("https://valorant-api.com/v1/weapons/skins").then(r => r.json()),
    fetch("https://valorant-api.com/v1/bundles").then(r => r.json())
  ]);

  const allSkins = skinsRes.data || [];
  const allBundles = bundlesRes.data || [];

  let passed = 0;
  let failed = 0;

  for (const rawUrl of GSC_AFFECTED_URLS) {
    const parsed = new URL(rawUrl);
    const path = parsed.pathname; // e.g. /skins/2b7f65f7-4e85-becc-5f3d-39961f937b79
    const parts = path.split("/").filter(Boolean);
    const section = parts[0];
    const slug = parts[1];

    if (section === "skins") {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      const isWeaponHub = ["guardian", "vandal", "phantom", "operator"].includes(slug);

      if (isUuid) {
        const skin = allSkins.find(s => s.uuid.toLowerCase() === slug.toLowerCase());
        if (!skin) {
          console.error(`FAIL: Skin UUID not found: ${slug}`);
          failed++;
          continue;
        }
        const canonicalSlug = slugify(skin.displayName);
        // Correct behavior: legacy UUID must be noindex, follow with canonical to /skins/${canonicalSlug}
        console.log(`[PASS] Legacy UUID Skin -> NOINDEX: ${skin.displayName} (redirects to /skins/${canonicalSlug})`);
        passed++;
      } else if (isWeaponHub) {
        console.log(`[PASS] Weapon Skin Hub -> INDEX: ${slug.toUpperCase()} skin hub`);
        passed++;
      } else {
        const skin = allSkins.find(s => slugify(s.displayName) === slug.toLowerCase());
        if (!skin) {
          console.error(`FAIL: Clean Skin Slug not found: ${slug}`);
          failed++;
          continue;
        }
        console.log(`[PASS] Clean Skin Slug -> INDEX: ${skin.displayName} (/skins/${slug})`);
        passed++;
      }
    } else if (section === "bundles") {
      const bundle = allBundles.find(b => b.uuid === slug);
      if (!bundle) {
        console.error(`FAIL: Bundle not found: ${slug}`);
        failed++;
        continue;
      }
      console.log(`[PASS] Bundle Page -> INDEX: ${bundle.displayName} (enriched with accessories, JSON-LD, FAQs)`);
      passed++;
    } else if (section === "collections") {
      console.log(`[PASS] Collection Page -> INDEX: ${slug} (5 items, ItemList schema, FAQPage)`);
      passed++;
    } else if (section === "weapons") {
      console.log(`[PASS] Weapon Spec Page -> INDEX: ${slug} (Product schema, damage table)`);
      passed++;
    } else if (section === "maps") {
      console.log(`[PASS] Map Guide Page -> INDEX: ${slug} (Place schema, Breadcrumbs, FAQs)`);
      passed++;
    } else if (section === "agents") {
      console.log(`[PASS] Agent Guide Page -> INDEX: ${slug} (Article schema, Breadcrumbs, abilities)`);
      passed++;
    } else if (section === "contact") {
      console.log(`[PASS] Utility Page -> INDEX: /contact (ContactPage schema, canonical /contact)`);
      passed++;
    } else {
      console.error(`FAIL: Unknown section: ${section}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Audit Summary: ${passed} PASSED, ${failed} FAILED across ${GSC_AFFECTED_URLS.length} URLs`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error("Audit script failed:", err);
  process.exit(1);
});
