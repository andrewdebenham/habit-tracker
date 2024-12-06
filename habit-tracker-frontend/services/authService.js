import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://localhost:3000';

/**
 * Decode the JWT token to extract payload
 * @param {string} token - The JWT token
 * @returns {object|null} - Decoded payload or null
 */
const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        console.log(JSON.parse(atob(payload)));
        return JSON.parse(atob(payload));
    } catch (err) {
        console.log('Error decoding token:', err);
        return null;
    }
};

/**
 * Get the user details from the token
 * @returns {Promise<object|null>} - User object or null if no token
 */
const getUser = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return null;

        const user = decodeToken(token); // Decode token to get user data
        return user;
    } catch (err) {
        console.log('Error getting user:', err);
        return null;
    }
};

// /**
//  * Get the user_id of the logged-in user
//  * @returns {Promise<number|null>} - User ID or null
//  */
// const getUserId = async () => {
//     try {
//         const user = await getUser();
//         return user?.id || null; // Assuming `id` is part of the decoded payload
//     } catch (err) {
//         console.log('Error getting user_id:', err);
//         return null;
//     }
// };

/**
 * Signup a new user
 * @param {object} formData - User registration data
 * @returns {Promise<object>} - Server response
 */
const signup = async (formData) => {
    try {
        const res = await fetch(`${BACKEND_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.error) {
            throw new Error(json.error);
        }
        await AsyncStorage.setItem('token', json.token); // Store token
        return json;
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * Login a user
 * @param {object} user - User credentials
 * @returns {Promise<object>} - User data
 */
const login = async (user) => {
    try {
        const res = await fetch(`${BACKEND_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        const json = await res.json();
        if (json.error) {
            throw new Error(json.error);
        }
        if (json.token) {
            await AsyncStorage.setItem('token', json.token); // Store token
            const decodedUser = decodeToken(json.token); // Decode token to get user data
            return decodedUser;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * Logout the user by removing the token
 */
const logout = async () => {
    await AsyncStorage.removeItem('token');
};

export { signup, login, getUser, logout };