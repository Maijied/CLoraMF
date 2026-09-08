# Firebase Security Specification & TDD Test Suite

## 1. Data Invariants & Zero-Trust Architecture
1. **User Isolation**: All subcollections (`device`, `vitals`, `customFaces`, `sdkProjects`, `aiLogs`) strictly live under the `/users/{userId}` hierarchy. Users can only read, write, list, or delete documents within their own `/users/{userId}` path.
2. **Identity Immutability**: Any incoming document `userId` field must match `request.auth.uid`, and updates cannot reassign `userId`.
3. **Strict Validation Helper**: Every write must be validated by dedicated `isValid[Entity]` functions preventing shadow/ghost fields and unbounded payload sizes.
4. **Denial-of-Wallet Defense**: String length bounds are enforced on every text field (e.g. code payload capped at 65536 chars, strings at 64-128 chars).

---

## 2. The "Dirty Dozen" Attack Payloads (Must Return PERMISSION_DENIED)

1. **Unauthenticated Write**: An unauthenticated user attempts to create a document in `/users/user_123/device/cmf_main`.
2. **Cross-User Hijack**: User `attacker_uid` attempts to read `/users/victim_uid/vitals/log_1`.
3. **Shadow Field Injection**: User attempts to create a `UserProfile` containing an unapproved field `isAdmin: true` or `godMode: true`.
4. **Identity Spoofing**: User `user_123` sends a payload with `userId: "user_999"` inside `/users/user_123/vitals/log_1`.
5. **ID Poisoning Attack**: User attempts to write to a document ID with 2KB junk characters or invalid regex path characters.
6. **Code Size Exhaustion**: An attacker attempts to write a 5MB payload into `SDKProject.code` exceeding the 65,536-character limit.
7. **Cross-User SDK Steal**: User `user_A` attempts to modify an `SDKProject` located in `/users/user_B/sdkProjects/io.cmf.heartbeats`.
8. **Catch-All Root Bypass**: An attacker queries arbitrary top-level collections like `/admin_secrets` or `/system_config`.
9. **Blanket Query Scraping**: User attempts an unconstrained `collectionGroup` list query across all users' vitals.
10. **Corrupt Vital Data**: User writes a `VitalLog` with negative step counts or negative BPM out of numeric range.
11. **Immutability Breach**: An update attempt tries to mutate `userId` on an existing `DeviceConfig`.
12. **Missing Required Fields**: User creates an `SDKProject` without the required `code` or `name` attributes.
