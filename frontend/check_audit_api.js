// const fetch = require('node-fetch'); // Native fetch in Node 18+

async function checkApi() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const apiUrl = `${API_BASE_URL}/api/admin/auditlogs`;

    try {
        console.log(`Fetching from ${apiUrl}...`);
        // Try without token first to see if we get 401/403 (which means server is reachable)
        const res = await fetch(apiUrl);
        console.log(`Status (No Token): ${res.status}`);

        if (res.status === 401 || res.status === 403) {
            console.log("Server is reachable and enforcing auth.");
        } else {
            console.log("Unexpected status:", res.status);
            const text = await res.text();
            console.log("Response:", text);
        }

    } catch (err) {
        console.error('Error fetching API:', err);
    }
}

checkApi();
