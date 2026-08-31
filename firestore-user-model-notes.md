# Firestore User Model Notes

- Target collection: `users`
- Document ID: Firebase Auth `uid`
- Ownership: document owner only
- Sensitive data: email, display name, photo URL
- App-owned state: onboarding completion flag
- No public profile data in this collection
- No query patterns yet; only direct document reads/writes by user ID