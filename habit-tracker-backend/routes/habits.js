const express = require('express');
const router = express.Router();

// Create habit
router.post('/', async (req, res) => {
    const { user_id, name } = req.body;

    // Validate input
    if (!user_id || !name) {
        return res.status(400).json({ error: 'user_id and name are required.' });
    }

    try {
        // Insert the habit into the database
        const [habitId] = await req.db.from('habits').insert(
            {
                user_id,
                name,
                created_at: req.db.fn.now(), // Adds created_at timestamp
            },
            'id' // Return the newly inserted ID
        );

        // Respond with the created habit's ID
        res.status(201).json({ success: true, habitId });
    } catch (error) {
        console.error('Error adding habit:', error);
        res.status(500).json({ error: 'An error occurred while adding the habit.' });
    }
});

// Get habits
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;

    // Validate input
    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required.' });
    }

    try {
        // Query the database to get the user's habits
        const habits = await req.db.from('habits')
            .select('*')
            .where('user_id', '=', user_id);

        // Respond with the list of habits
        res.status(200).json({ success: true, habits });
    } catch (error) {
        console.error('Error retrieving habits:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the habits.' });
    }
});

// Delete habit
router.delete('/:habitId', async (req, res) => {
    const { habitId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        // Check if the habit exists and belongs to the user
        const habit = await req.db('habits')
            .select('*')
            .where({ id: habitId, user_id: userId })
            .first();

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found or not authorized to delete this habit.' });
        }

        // Delete the habit
        await req.db('habits').where({ id: habitId }).del();

        res.status(200).json({ success: true, message: 'Habit deleted successfully.' });
    } catch (error) {
        console.error('Error deleting habit:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// PUT route to update a habit name
router.put('/:habitId', async (req, res) => {
    const { habitId } = req.params; // Extracts habitId from the route parameter
    const { name } = req.body; // Extracts the new name from the request body

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
            error: true,
            message: 'Invalid habit name. Please provide a valid name.',
        });
    }

    try {
        const result = await req.db('habits')
            .where({ id: habitId })
            .update({ name: name.trim() });

        if (result === 0) {
            return res.status(404).json({
                error: true,
                message: 'Habit not found or no changes made.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Habit name updated successfully.',
        });
    } catch (error) {
        console.error('Error updating habit name:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error.',
        });
    }
});

module.exports = router;