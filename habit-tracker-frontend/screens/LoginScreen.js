import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthedUser } from '../contexts/AuthedUserProvider'; // Adjust path if needed
import { login } from '../services/authService'; // Adjust path if needed
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useAuthedUser(); // Access setUser to update the user state
    const navigation = useNavigation(); // Navigation hook to navigate to SignupScreen

    const handleLogin = async () => {
        try {
            setError(''); // Clear previous errors
            const user = await login({ email, password }); // Call login from authService
            setUser(user); // Update the user state
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {/* Error Message */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Email Input */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            {/* Password Input */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
            />

            {/* Login Button */}
            <Button title="Log In" onPress={handleLogin} />

            {/* Navigation to Signup */}
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.link}>
                    Don't have an account? <Text style={styles.linkText}>Sign up here</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    link: {
        marginTop: 20,
        textAlign: 'center',
    },
    linkText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
});

export default LoginScreen;