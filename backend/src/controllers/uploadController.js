const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://xyz.supabase.co',
    process.env.SUPABASE_KEY || 'public-anon-key'
);

exports.getUploadUrl = async (req, res) => {
    const { filename, filetype } = req.body;
    try {
        const path = `uploads/${Date.now()}_${filename}`;

        // Create signed upload URL
        const { data, error } = await supabase
            .storage
            .from('works')
            .createSignedUploadUrl(path);

        if (error) throw error;

        res.json({
            signedUrl: data.signedUrl,
            path: data.path,
            token: data.token
        });
    } catch (err) {
        console.error('Upload URL Error:', err);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
};

exports.getDownloadUrl = async (req, res) => {
    const { id } = req.params; // This is actually the path or we look up path by participant ID?
    // Prompt says: GET /api/uploads/:id/signed-url
    // Usually we store the path in the DB (work_url).
    // If :id is participant ID, we fetch path from DB.

    // Let's assume :id is the participant ID for now, or just the path passed as query param?
    // Prompt implies looking up by some ID.
    // Let's assume it's participant ID.

    const db = require('../db');
    try {
        const { rows } = await db.query('SELECT work_url FROM participants WHERE id = $1', [id]);
        if (rows.length === 0 || !rows[0].work_url) return res.status(404).json({ error: 'No work found' });

        const path = rows[0].work_url;

        const { data, error } = await supabase
            .storage
            .from('works')
            .createSignedUrl(path, 60 * 60); // 1 hour

        if (error) throw error;

        res.json({ signedUrl: data.signedUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
