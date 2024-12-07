const express = require('express');
const router = express.Router();

// Get tracking progress info
router.get('', async (req, res) => {
    const { userId, date } = req.query;

    // Validate input
    if (!userId || !date) {
        return res.status(400).json({
            error: true,
            message: 'userId and date are required.',
        });
    }

    try {
        // Fetch tracking data for the user and date
        const trackingData = await req.db('habit_tracking')
            .join('habits', 'habit_tracking.habit_id', '=', 'habits.id')
            .select('habit_tracking.habit_id', 'habits.name', 'habit_tracking.date', 'habit_tracking.completed')
            .where('habits.user_id', '=', userId)
            .andWhere('habit_tracking.date', '=', date);

        res.status(200).json({
            success: true,
            data: trackingData,
        });
    } catch (error) {
        console.error('Error fetching habit tracking data:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error.',
        });
    }
});

// Add or update a habit tracking entry
router.post('/', async (req, res) => {
    const { habitId, date, completed } = req.body;

    // Validate input
    if (!habitId || !date || completed === undefined) {
        return res.status(400).json({
            error: true,
            message: 'habitId, date, and completed status are required.',
        });
    }

    try {
        // Insert or update the habit tracking entry
        await req.db('habit_tracking')
            .insert({ habit_id: habitId, date, completed })
            .onConflict(['habit_id', 'date']) // Ensures only one entry per habit and date
            .merge({ completed }); // Updates the completed status if the entry already exists

        res.status(200).json({
            success: true,
            message: 'Habit tracking entry added or updated successfully.',
        });
    } catch (error) {
        console.error('Error adding or updating habit tracking:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error.',
        });
    }
});

module.exports = router;