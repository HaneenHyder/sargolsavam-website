const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/judges',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY:', data.substring(0, 500) + '...'); // Print first 500 chars
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
