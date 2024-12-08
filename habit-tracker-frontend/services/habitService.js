const BASE_URL = 'http://localhost:3000';

/**
 * Fetch the list of habits for a specific user.
 * @param {number} userId - The ID of the user whose habits should be retrieved.
 * @returns {Promise<Array>} - A promise that resolves to the list of habits.
 */
export const getHabits = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/habits/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching habits: ${response.status}`);
        }

        const data = await response.json();
        return data.habits; // Assumes the API response includes a "habits" array
    } catch (error) {
        console.error('Error in getHabits:', error);
        throw error;
    }
};

/**
 * Add a new habit for a user.
 * @param {number} userId - The ID of the user who owns the habit.
 * @param {string} name - The name of the habit.
 * @returns {Promise<Object>} - A promise that resolves to the newly created habit's ID.
 */
export const addHabit = async (userId, name) => {
    try {
        const response = await fetch(`${BASE_URL}/habits/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                name,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error adding habit: ${response.status}`);
        }

        const data = await response.json();
        return data; // Assumes the API response includes the "habitId"
    } catch (error) {
        console.error('Error in addHabit:', error);
        throw error;
    }
};

/**
 * Delete a habit by its ID.
 * @param {number} habitId - The ID of the habit to delete.
 * @param {number} userId - The user ID of the habit owner.
 * @returns {Promise<object>} - Response indicating success or failure.
 */
export const deleteHabit = async (habitId, userId) => {
    try {
        const response = await fetch(`${BASE_URL}/habits/${habitId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), // Pass userId in the request body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete habit.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting habit:', error);
        throw error;
    }
};

/**
 * Updates the name of a habit.
 * @param {number} habitId - The ID of the habit to update.
 * @param {string} newName - The new name for the habit.
 * @returns {Promise<object>} - The response from the server.
 */
export const updateHabit = async (habitId, newName) => {
    if (!habitId || !newName || typeof newName !== 'string' || newName.trim() === '') {
        throw new Error('Invalid habitId or habit name.');
    }

    try {
        const response = await fetch(`${BASE_URL}/habits/${habitId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName.trim() }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update habit name.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating habit name:', error);
        throw error;
    }
};