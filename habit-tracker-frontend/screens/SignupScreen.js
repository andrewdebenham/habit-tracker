import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthedUser } from '../contexts/AuthedUserProvider';
import { signup } from '../services/authService';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useAuthedUser(); // Access setUser to update the user state
    const navigation = useNavigation(); // Navigation hook to navigate back to LoginScreen

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setError(''); // Clear any previous errors
            const user = await signup({ email, password }); // Call signup from authService
            setUser(user); // Update the user state
            navigation.navigate('Login'); // Redirect to login screen after successful signup
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

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

            {/* Confirm Password Input */}
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            {/* Signup Button */}
            <Button title="Sign Up" onPress={handleSignup} />

            {/* Link to Login
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>
                    Already have an account? <Text style={styles.linkText}>Log in here</Text>
                </Text>
            </TouchableOpacity> */}
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

export default SignupScreen;
