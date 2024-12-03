import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://localhost:3000';

const getUser = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return null;
        const user = JSON.parse(atob(token.split('.')[1]));
        return user;
    } catch (err) {
        console.log('Error getting user:', err);
        return null;
    }
};

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
        await AsyncStorage.setItem('token', json.token);
        return json;
    } catch (err) {
        throw new Error(err);
    }
};

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
            await AsyncStorage.setItem('token', json.token);
            const user = JSON.parse(atob(json.token.split('.')[1]));
            return user;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const logout = async () => {
    await AsyncStorage.removeItem('token');
};

export { signup, login, getUser, logout };