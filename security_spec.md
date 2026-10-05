# Security Specification: Ndulu General Dealers Industrial Procurement

## 1. Data Invariants
1. **Quotes Collection (`/quotes/{quoteId}`)**:
   - `id` must match document ID format and match `incoming().id`.
   - On creation, initial status must strictly be `'Pending'`.
   - If an authenticated user creates a quote, `userId` must equal `request.auth.uid`.
   - Creation of quotes must not allow self-approval (`status: 'Approved'`) by clients or guests.
   - Updates to quotes are restricted strictly to verified Administrators (`isAdmin()`).
   - Deletion of quotes is restricted strictly to verified Administrators (`isAdmin()`).
   - Quote query listings (`allow list`) must verify ownership (`resource.data.userId == request.auth.uid`) or administrator role (`isAdmin()`).
   - Items list cannot exceed 50 items, and total estimate must be a non-negative number.

2. **Admins Collection (`/admins/{userId}`)**:
   - Document ID must equal target user UID.
   - Non-admins cannot read or list administrative personnel.
   - Only super administrator (`lundujosh97@gmail.com` with `email_verified == true`) can register or modify admin records.

3. **Security Audits Collection (`/securityAudits/{auditId}`)**:
   - Only administrators can read or append audit entries.
   - Deleting or updating historical audit logs is forbidden to maintain compliance integrity.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Self-Approved Quote Injection**: Non-admin attempts to create a quote with `status: 'Approved'`.
   ```json
   { "id": "Q-001", "clientName": "Attacker", "clientEmail": "attacker@test.com", "clientCompany": "Exploit Ltd", "createdAt": "2026-10-04T00:00:00Z", "status": "Approved", "totalEstimate": 0, "items": [] }
   ```
2. **Ghost Field Poisoning**: Creation attempt containing unauthorized shadow properties (`isSuperAdmin: true`).
   ```json
   { "id": "Q-002", "clientName": "Test", "clientEmail": "t@test.com", "clientCompany": "Mine", "createdAt": "2026-10-04T00:00:00Z", "status": "Pending", "totalEstimate": 100, "items": [], "isSuperAdmin": true }
   ```
3. **Spoofed User Identity on Creation**: Attacker sets `userId` to a target victim's UID instead of `request.auth.uid`.
   ```json
   { "id": "Q-003", "clientName": "Attacker", "clientEmail": "t@test.com", "clientCompany": "Mine", "createdAt": "2026-10-04T00:00:00Z", "status": "Pending", "totalEstimate": 100, "items": [], "userId": "victim_uid_123" }
   ```
4. **Denial-of-Wallet Array Flooding**: Attempt to inject 5,000 array items into a single quote.
   ```json
   { "id": "Q-004", "clientName": "Flooder", "clientEmail": "t@test.com", "clientCompany": "Mine", "createdAt": "2026-10-04T00:00:00Z", "status": "Pending", "totalEstimate": 100, "items": [/* 5000 items */] }
   ```
5. **Path / ID Character Traversal Poisoning**: Malicious quote ID containing illegal path characters `../../root`.
   ```json
   { "id": "../../root", "clientName": "Malicious", "clientEmail": "m@test.com", "clientCompany": "Mine", "createdAt": "2026-10-04T00:00:00Z", "status": "Pending", "totalEstimate": 100, "items": [] }
   ```
6. **Non-Admin Unauthorized Price Tampering**: Regular client attempts `update` to reduce `totalEstimate` to 0.
   ```json
   { "totalEstimate": 0.00 }
   ```
7. **Client Deletion of Audit Logs**: Client attempts `deleteDoc(doc(db, 'securityAudits', 'audit-001'))`.
8. **Unverified Email Admin Escalation**: Attacker signs up with `lundujosh97@gmail.com` with `email_verified: false` to claim admin privilege.
9. **Direct Write into Admins Collection**: Non-admin attempts `setDoc(doc(db, 'admins', 'attacker_uid'), { role: 'super_admin' })`.
10. **Negative Valuation Fraud**: Creation with `totalEstimate: -999999.00`.
11. **Excessive String Payload Attack**: `clientName` set to a 20KB overflow string.
12. **Audit Trail Mutation Attack**: Admin or user attempting to `update` an existing audit log entry to cover actions.
