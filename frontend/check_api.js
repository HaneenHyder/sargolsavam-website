// const fetch = require('node-fetch'); // Native fetch in Node 18+

async function checkApi() {
    const apiUrl = 'http://localhost:5000/api';

    try {
        console.log(`Fetching candidates from ${apiUrl}/candidates...`);
        const candidatesRes = await fetch(`${apiUrl}/candidates`);
        const candidates = await candidatesRes.json();
        console.log(`Candidates Status: ${candidatesRes.status}`);
        console.log(`Candidates Count: ${Array.isArray(candidates) ? candidates.length : 'Not Array'}`);
        if (Array.isArray(candidates) && candidates.length > 0) {
            console.log('Sample Candidate:', candidates[0]);
        }

        console.log(`\nFetching results from ${apiUrl}/results...`);
        const resultsRes = await fetch(`${apiUrl}/results`);
        const results = await resultsRes.json();
        console.log(`Results Status: ${resultsRes.status}`);
        console.log(`Results Count: ${Array.isArray(results) ? results.length : 'Not Array'}`);
        if (Array.isArray(results) && results.length > 0) {
            console.log('Sample Result:', results[0]);
        }

    } catch (err) {
        console.error('Error fetching API:', err);
    }
}

checkApi();
