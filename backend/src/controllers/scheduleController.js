const db = require('../db');

// Get all schedule data (days with events)
exports.getSchedule = async (req, res) => {
    try {
        const daysResult = await db.query(
            'SELECT * FROM schedule_days ORDER BY display_order'
        );

        const schedule = [];
        for (const day of daysResult.rows) {
            const eventsResult = await db.query(
                'SELECT * FROM schedule_events WHERE day_id = $1 ORDER BY display_order',
                [day.id]
            );
            schedule.push({
                id: day.id,
                date: day.date,
                day: day.day_label,
                events: eventsResult.rows.map(e => ({
                    id: e.id,
                    time: e.time,
                    stage: e.stage,
                    item: e.item,
                    category: e.category
                }))
            });
        }

        res.json(schedule);
    } catch (err) {
        console.error('Error fetching schedule:', err);
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
};

// Get events for a specific day
exports.getDayEvents = async (req, res) => {
    try {
        const { dayId } = req.params;
        const result = await db.query(
            'SELECT * FROM schedule_events WHERE day_id = $1 ORDER BY display_order',
            [dayId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching day events:', err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

// Add a new event
exports.addEvent = async (req, res) => {
    try {
        const { dayId, time, stage, item, category } = req.body;

        // Get max display order for this day
        const maxOrder = await db.query(
            'SELECT COALESCE(MAX(display_order), -1) as max_order FROM schedule_events WHERE day_id = $1',
            [dayId]
        );
        const displayOrder = maxOrder.rows[0].max_order + 1;

        const result = await db.query(
            `INSERT INTO schedule_events (day_id, time, stage, item, category, display_order) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [dayId, time, stage || '-', item, category || '-', displayOrder]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).json({ error: 'Failed to add event' });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { time, stage, item, category } = req.body;

        const result = await db.query(
            `UPDATE schedule_events 
             SET time = $1, stage = $2, item = $3, category = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 RETURNING *`,
            [time, stage || '-', item, category || '-', id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Failed to update event' });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM schedule_events WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json({ message: 'Event deleted' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Failed to delete event' });
    }
};
