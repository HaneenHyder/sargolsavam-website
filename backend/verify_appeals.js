const jwt = require('jsonwebtoken');
require('dotenv').config();
// const fetch = require('node-fetch'); // Global fetch

async function verifyAppeals() {
    console.log('Verifying Appeals...');

    // 1. Test getAllAppeals as Admin
    const adminUser = { id: 'admin-id', role: 'admin', email: 'admin@example.com' };
    const adminToken = jwt.sign(adminUser, process.env.JWT_SECRET, { expiresIn: '1h' });

    try {
        console.log('\n--- Testing Admin getAllAppeals ---');
        const resAdmin = await fetch('http://localhost:5000/api/appeals', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (resAdmin.ok) {
            const appeals = await resAdmin.json();
            console.log(`Fetched ${appeals.length} appeals.`);
            if (appeals.length > 0) {
                const first = appeals[0];
                console.log('First Appeal Submitter:', {
                    name: first.submitter_name,
                    code: first.submitter_code,
                    role: first.submitted_by_role
                });

                // Test Update Status
                console.log('\n--- Testing Update Status ---');
                const newStatus = first.status === 'Resolved' ? 'Pending' : 'Resolved';
                const resUpdate = await fetch(`http://localhost:5000/api/appeals/${first.id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (resUpdate.ok) {
                    const updatedAppeal = await resUpdate.json();
                    console.log('Status updated successfully:', updatedAppeal.status);
                } else {
                    console.error('Update status failed:', resUpdate.status, resUpdate.statusText);
                    const errText = await resUpdate.text();
                    console.error('Error details:', errText);
                }
            }
        } else {
            console.error('Admin fetch failed:', resAdmin.status, resAdmin.statusText);
        }

    } catch (err) {
        console.error('Admin test error:', err);
    }

    // 2. Test getMyAppeals as Team
    const teamUser = { id: 'team-uuid', role: 'team', code: '100' }; // Use valid team code '100'
    const teamToken = jwt.sign(teamUser, process.env.JWT_SECRET, { expiresIn: '1h' });

    try {
        console.log('\n--- Testing Team getMyAppeals ---');
        const resTeam = await fetch('http://localhost:5000/api/appeals/my-appeals', {
            headers: { 'Authorization': `Bearer ${teamToken}` }
        });

        if (resTeam.ok) {
            const myAppeals = await resTeam.json();
            console.log(`Fetched ${myAppeals.length} appeals for team.`);
        } else {
            console.error('Team fetch failed:', resTeam.status, resTeam.statusText);
        }

    } catch (err) {
        console.error('Team test error:', err);
    }
}

verifyAppeals();
