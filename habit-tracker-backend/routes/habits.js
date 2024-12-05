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
                created_at: req.db.fn.now(), // Add created_at timestamp
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

module.exports = router;