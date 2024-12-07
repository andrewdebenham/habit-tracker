const BASE_URL = 'http://localhost:3000'; // Replace with your actual backend URL

// Get Tracking Progress
export const getTrackingProgress = async (userId, date) => {
    try {
        const response = await fetch(`${BASE_URL}/habit-tracking?userId=${userId}&date=${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch habit tracking data.');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching habit tracking data:', error);
        throw error;
    }
};

// Track Habit Progress
/**
 * Tracks a habit by adding or updating its completion status for a specific date.
 * @param {number} habitId - The ID of the habit to track.
 * @param {string} date - The date in YYYY-MM-DD format.
 * @param {boolean} completed - Whether the habit is completed (true = completed, false = not completed).
 * @returns {Promise<object>} - Response from the backend.
 */
export const trackHabit = async (habitId, date, completed) => {
    try {
        // Send POST request to the backend
        const response = await fetch(`${BASE_URL}/habit-tracking/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                habitId,
                date,
                completed,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to track habit.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error tracking habit:', error);
        throw error;
    }
};