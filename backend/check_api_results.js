// const fetch = require('node-fetch'); // Use native fetch

async function checkApiResults() {
    try {
        console.log('Fetching results from API...');
        const response = await fetch('http://localhost:5000/api/results');
        const results = await response.json();

        console.log(`Total Results: ${results.length}`);

        const groupResults = results.filter(r => r.item_type === 'Group');
        console.log(`Group Results: ${groupResults.length}`);

        if (groupResults.length > 0) {
            console.log('Sample Group Result:', JSON.stringify(groupResults[0], null, 2));

            // Check if team_code is present
            if (groupResults[0].team_code) {
                console.log(`Team Code present: ${groupResults[0].team_code}`);
            } else {
                console.log('WARNING: Team Code is MISSING in Group Result!');
            }
        } else {
            console.log('No Group Results found.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

checkApiResults();
