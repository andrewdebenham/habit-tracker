import React from 'react';
import { View, Text, StyleSheet, Button, Linking } from 'react-native';
import { logout } from '../services/authService';
import { useAuthedUser } from '../contexts/AuthedUserProvider';

const AboutScreen = () => {
    const { user, setUser } = useAuthedUser(); // Access user and setUser from context

    const handleLogout = () => {
        logout(); // Call the logout function from authService
        setUser(null); // Clear the user from context
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>About HabitTracker</Text>
            <Text style={styles.text}>
                This app is designed to help you track and improve your daily habits.
            </Text>
            <Text style={styles.text}>
                It features a 60-day progress graphic, designed to help you visualize your progress and foster continual improvement through consistent habits.
            </Text>
            <Text style={styles.text}>
                Complete your habits each day to fill in the grid and level up your life!
            </Text>
            <Text style={styles.text}>
                Built with React Native, it features a clean and intuitive interface.
            </Text>
            <Text style={styles.licenseTitle}>Licensing</Text>
            <Text style={styles.text}>
                This app is licensed under the{' '}
                <Text
                    style={styles.link}
                    onPress={() => Linking.openURL('https://opensource.org/licenses/MIT')}
                >
                    MIT License
                </Text>.
            </Text>
            {/* Logout Button */}
            <View style={styles.logoutButtonContainer}>
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        gap: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    licenseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    logoutButtonContainer: {
        marginTop: 'auto',
        paddingTop: 20,
    },
});

export default AboutScreen;