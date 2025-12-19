// const fetch = require('node-fetch');

async function checkStatsApi() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const apiUrl = `${API_BASE_URL}/api/admin/stats`;

    try {
        console.log(`Fetching from ${apiUrl}...`);
        const res = await fetch(apiUrl);
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log("Data:", data);
        } else {
            console.log("Response text:", await res.text());
        }
    } catch (err) {
        console.error('Error fetching API:', err);
    }
}

checkStatsApi();
