const jwt = require('jsonwebtoken');
require('dotenv').config();
// const fetch = require('node-fetch'); // Using global fetch

// Mock User Data
const user = {
    id: 'team-uuid-placeholder', // We might need a real UUID if the DB enforces FK, but let's try.
    // Actually, createAppeal uses req.user.code to find the team ID.
    // "SELECT id FROM teams WHERE code = $1"
    // So we just need a valid code.
    role: 'team',
    code: '100'
};

const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

async function testAppeal() {
    console.log('Testing Appeal Submission...');
    try {
        const res = await fetch('http://localhost:5000/api/appeals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                event_name: 'Test Event',
                reason: 'Test Reason',
                description: 'Test Description',
                payment_order_id: 'order_test_123',
                payment_id: 'pay_test_123',
                payment_signature: 'sig_test_123'
            })
        });

        console.log('Response Status:', res.status, res.statusText);
        const data = await res.json();
        console.log('Response Body:', data);

    } catch (err) {
        console.error('Error:', err);
    }
}

testAppeal();
