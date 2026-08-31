Firestore access analysis for queue prep plans

Project database:
- projects/valovault-7de08/databases/(default)
- Edition: STANDARD
- Type: FIRESTORE_NATIVE

Application paths currently used:
- users/{uid}
  - Read through useFirestoreUserDocument with doc(db, "users", user.uid)
  - Owner-only create, read, update, delete
  - Contains private user data including email, so it must stay owner-only
- users/{uid}/wishlistItems
  - Read through collection query ordered by createdAt desc
  - Owner-only create, read, delete
  - Fields: title, category, notes, createdAt, updatedAt
- users/{uid}/queuePrepPlans
  - Read through collection query ordered by updatedAt desc
  - Owner-only create, read, update, delete
  - Fields: title, mapName, mode, agentRole, status, notes, createdAt, updatedAt

Queries:
- users/{uid}/wishlistItems ordered by createdAt desc
- users/{uid}/queuePrepPlans ordered by updatedAt desc

Index notes:
- Both queue queries use a single orderBy within a user subcollection.
- Firestore Standard single-field indexes cover these queries automatically.

Security assumptions:
- User documents contain PII and are never readable by other users.
- Queue prep plans are private player workflow data.
- Client writes use serverTimestamp for createdAt and updatedAt.
- Update rules must re-run the full queue-prep validator and keep createdAt immutable.

Devil's advocate pass:
- Public list exploit: denied by owner-only read.
- Unauthorized read/write: denied by isOwner(userId).
- Update bypass: queue updates call isValidQueuePrepPlan and immutable createdAt check.
- Ownership hijacking: path ownership comes from users/{userId}; no owner field is accepted.
- Schema pollution: hasOnly blocks extra fields.
- Type juggling: all queue fields are type-checked.
- Resource exhaustion: every string has a bounded length.
- Required field omission: validators require all required keys through direct field checks and hasOnly.
- Timestamp manipulation: queue create/update require server request time for written timestamps.
