// const fetch = require('node-fetch'); // Native fetch in Node 18+

async function checkApi() {
    try {
        const candidatesRes = await fetch('http://localhost:5000/api/candidates');
        const candidates = await candidatesRes.json();
        console.log('Candidates API status:', candidatesRes.status);
        console.log('Candidates count:', Array.isArray(candidates) ? candidates.length : 'Not Array');

        const resultsRes = await fetch('http://localhost:5000/api/results');
        const results = await resultsRes.json();
        console.log('Results API status:', resultsRes.status);
        console.log('Results count:', Array.isArray(results) ? results.length : 'Not Array');
        if (Array.isArray(results) && results.length > 0) {
            console.log('Sample result keys:', Object.keys(results[0]));
            console.log('Sample result event_status:', results[0].event_status);
        }
    } catch (err) {
        console.error(err);
    }
}

checkApi();
