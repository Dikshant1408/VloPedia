## 2025-03-09 - Bookmarks Drawer Accessibility Update
**Learning:** Found an accessibility issue pattern specific to this app's overlay components where drawers/modals lacked proper ARIA attributes, semantic dialog roles, and most importantly, basic keyboard navigation like closing via the 'Escape' key.
**Action:** When working on similar overlay components (like global search dialog or report issue modal), always verify if proper dialog semantics (`role="dialog"`, `aria-modal`, `aria-labelledby`) and keyboard escape listener logic are present.
