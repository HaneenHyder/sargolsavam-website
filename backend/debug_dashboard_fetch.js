const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runTest() {
    try {
        // 1. Login as Candidate (Assuming one exists, e.g. chest_no '101')
        // We might need to try a few or assume '101' exists from previous context
        console.log('1. Logging in as Candidate 101...');
        let token;
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                type: 'candidate',
                code: '104',
                username: 'Abdul Wadood'
            });
            token = loginRes.data.token;
            console.log('✅ Login Successful. Token:', token ? 'Present' : 'Missing');
        } catch (e) {
            console.log('⚠️ Login failed:', e.response?.data || e.message);
        }

        if (!token) {
            console.log('1b. Logging in as Admin to find a candidate...');
            const adminLogin = await axios.post(`${API_URL}/auth/login`, {
                type: 'admin',
                username: 'admin',
                password: 'admin123' // Assumption
            });
            const adminToken = adminLogin.data.token;
            console.log('✅ Admin Login Successful');

            const candidatesRes = await axios.get(`${API_URL}/candidates`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            const candidate = candidatesRes.data[0];
            if (!candidate) throw new Error('No candidates found');
            console.log('Found candidate:', candidate.name, candidate.chest_no);

            // Now login as that candidate
            const candidateLogin = await axios.post(`${API_URL}/auth/login`, {
                type: 'candidate',
                code: candidate.chest_no,
                username: candidate.name
            });
            token = candidateLogin.data.token;
            console.log('✅ Candidate Login Successful');
        }

        // 2. Fetch Dashboard
        console.log('2. Fetching Dashboard...');
        try {
            const dashboardRes = await axios.get(`${API_URL}/candidates/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Dashboard Fetch Status:', dashboardRes.status);
            console.log('✅ Body:', JSON.stringify(dashboardRes.data).substring(0, 200));
        } catch (e) {
            console.error('❌ Dashboard Fetch Failed status:', e.response?.status);
            console.error('❌ Dashboard Fetch Failed data:', e.response?.data);
            if (!e.response) console.error(e);
        }

    } catch (err) {
        console.error('Global Error:', err.message);
        if (err.response) console.error(err.response.data);
    }
}

runTest();
