// const fetch = require('node-fetch');

async function checkStatsApi() {
    const apiUrl = 'http://localhost:8080/api/admin/stats';

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
