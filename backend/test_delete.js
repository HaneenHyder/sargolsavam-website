async function testDelete() {
    const apiUrl = 'http://localhost:5000/api/results/test-id';
    try {
        console.log(`Testing DELETE ${apiUrl}...`);
        const res = await fetch(apiUrl, {
            method: 'DELETE',
            headers: { 'Origin': 'http://localhost:3000' } // Simulate CORS
        });
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${await res.text()}`);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testDelete();
