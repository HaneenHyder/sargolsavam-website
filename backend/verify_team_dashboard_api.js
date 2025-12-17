
const axios = require('axios'); // Assuming axios might not be installed, use native fetch or http? Backend usually doesn't have axios.
// using native fetch (node 18+) or http module. 
// Let's use simple http request or require 'http' to be safe for older node, but user has node 20+ likely.
// Actually, let's just use the existing 'supertest' or just basic fetch if available.
// Safest is standard http request or using a small helper.

const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api' + path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: body }));
        });

        req.on('error', reject);
        req.write(dataString);
        req.end();
    });
}

function getRequest(path, cookie) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api' + path,
            method: 'GET',
            headers: {
                'Cookie': cookie
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: body }));
        });

        req.on('error', reject);
        req.end();
    });
}

async function verify() {
    try {
        console.log('1. Attempting Login (Code: 100)...');
        const loginRes = await postRequest('/auth/login', { type: 'team', code: '100', password: '100' });
        console.log(`Login Status: ${loginRes.status}`);
        // console.log(`Login Body: ${loginRes.body}`);

        if (loginRes.status !== 200) {
            console.error('Login Failed:', loginRes.body);
            return;
        }

        const cookies = loginRes.headers['set-cookie'];
        if (!cookies) {
            console.error('No cookies received!');
            return;
        }
        const tokenCookie = cookies.find(c => c.startsWith('token='));
        console.log('Token Cookie received.');

        console.log('2. Fetching Dashboard Data...');
        const dashboardRes = await getRequest('/teams/dashboard', tokenCookie);
        console.log(`Dashboard Status: ${dashboardRes.status}`);
        console.log(`Dashboard Body: ${dashboardRes.body.substring(0, 500)}...`); // Print first 500 chars

    } catch (err) {
        console.error('Error:', err.message);
    }
}

verify();
