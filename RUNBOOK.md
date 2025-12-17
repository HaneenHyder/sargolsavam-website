# SARGOLSAVAM 2025 - Operational Runbook

## Emergency Contacts
- **Lead Developer**: [Name]
- **Event Coordinator**: [Name]

## Common Procedures

### 1. How to Fix a Published Result
If a result was entered incorrectly and published:
1.  **Login as Admin**.
2.  Go to the **Event Management** page.
3.  Find the event and click **Manage Results**.
4.  Update the winners/grades.
5.  Click **Republish/Update**.
    *   *Note: This will recalculate points for the affected teams automatically.*
6.  Verify the **Leaderboard** to ensure points are updated.

### 2. How to Rollback Last Publish
If a major error occurs and you need to "unpublish" an event:
1.  **Database Access Required** (via Supabase Dashboard or SQL client).
2.  Run SQL:
    ```sql
    UPDATE events SET status = 'Pending' WHERE code = 'EVENT_CODE';
    UPDATE participants SET status = 'Pending', position = NULL, grade = NULL, points = 0 WHERE event_id = (SELECT id FROM events WHERE code = 'EVENT_CODE');
    -- Recalculate team points manually or trigger a recalc via API if available
    ```
3.  **Better Option**: Use the Admin UI to "Reset Event" (if implemented) or just edit the results to be empty/correct.

### 3. Backup & Restore
- **Backup**:
    - Go to Supabase Dashboard -> Database -> Backups.
    - Download the latest daily backup or trigger a manual backup.
- **Restore**:
    - Use the Supabase Dashboard to restore to a specific point in time.

### 4. Recalculate All Points
If points seem out of sync:
1.  Call the hidden API endpoint (Admin only):
    `POST /api/admin/recalc-all-points`
    *(Ensure this endpoint is implemented or run a SQL script)*

## Pre-Event Checklist
- [ ] Verify Database Connection
- [ ] Check Storage Quota
- [ ] Test "Emergency Mode" (if applicable)
