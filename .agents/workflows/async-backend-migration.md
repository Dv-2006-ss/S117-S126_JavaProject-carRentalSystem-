---
description: How to maintain non-blocking performance for heavy SMTP/SMS tasks
---

This workflow ensures the Velox backend stays responsive for a high-traffic production environment.

// turbo
1. **Never use await** on functions that don't need to return data to the client immediately (e.g. `emailService.sendEmail`).
   
2. **Background Wrapper Architecture**:
   - For bulk operations, use `(async () => { try { ... } catch(e) { console.error(e); } })();` to background it immediately.
   - For progress updates, provide a callback to the service function that updates the database at specific intervals (every 10 or 50 records).
   
3. **HTTP Response Handling**:
   - Always return `res.status(202).json({ success: true, message: 'Processing in background' })` if the task will take more than 500ms.
   
4. **Log Retention**:
   - Every background task must write its final status (success/failure) to the `deliveryLogs` array in the `Campaign` document.
   - Use `Campaign.findByIdAndUpdate` with `$push` to avoid fetching the whole document and causing race conditions.

// turbo
5. Run `node bckend/check_db_v4.js` to ensure the MongoDB connections are healthy and can handle concurrent background writes.
