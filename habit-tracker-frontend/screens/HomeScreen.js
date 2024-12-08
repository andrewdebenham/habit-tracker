import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import ProgressGrid from '../components/ProgressGrid';
import { useAuthedUser } from '../contexts/AuthedUserProvider';
import { useTrackingUpdate } from '../contexts/TrackingUpdateProvider';
import { logout } from '../services/authService';
import { getHabits } from '../services/habitService';
import { getTrackingProgress, trackHabit } from '../services/trackingService';

function HomeScreen() {
    const { user, setUser } = useAuthedUser(); // Access user and setUser from context
    const { toggleTrackingUpdate, trackingUpdated } = useTrackingUpdate();
    const [todayHabits, setTodayHabits] = useState([]);

    useEffect(() => {
        const fetchTodayHabits = async () => {
            try {
                const today = new Date().toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD

                const fetchedHabits = await getHabits(user.id);
                console.log('Fetched Habits:', fetchedHabits);

                const trackingProgress = await getTrackingProgress(user.id, today);
                console.log('Tracking Progress:', trackingProgress);

                const filteredHabits = fetchedHabits
                    .filter((habit) => {
                        const habitCreatedAt = new Date(habit.created_at);
                        // Normalize both dates to exclude the time component
                        const habitCreatedDate = new Date(habitCreatedAt.getFullYear(), habitCreatedAt.getMonth(), habitCreatedAt.getDate());
                        const todayDate = new Date(new Date(today).getFullYear(), new Date(today).getMonth(), new Date(today).getDate());

                        console.log(`Habit: ${habit.name}, Created Date: ${habitCreatedDate}, Today: ${todayDate}`);
                        console.log(`Comparison: ${habitCreatedDate <= todayDate}`);
                        return habitCreatedDate <= todayDate;
                    })
                    .map((habit) => {
                        const progressEntry = trackingProgress.find((entry) => entry.habit_id === habit.id);
                        return { ...habit, progress: progressEntry ? progressEntry.completed === 1 : false };
                    });

                console.log('Filtered Habits:', filteredHabits);
                setTodayHabits(filteredHabits);
            } catch (error) {
                console.error('Error fetching today\'s habits:', error);
            }
        };

        fetchTodayHabits();
    }, [user, trackingUpdated]); // Re-fetch if the user changes

    const handleLogout = () => {
        logout(); // Call the logout function from authService
        setUser(null); // Clear the user from context
    };

    const toggleHabit = async (habitId) => {
        const habit = todayHabits.find((h) => h.id === habitId);
        const newCompleted = !habit.progress;

        try {
            await trackHabit(habitId, new Date().toISOString().split('T')[0], newCompleted); // Update backend
            setTodayHabits((prevHabits) =>
                prevHabits.map((h) =>
                    h.id === habitId ? { ...h, progress: newCompleted } : h
                )
            );
            toggleTrackingUpdate(); // Notify the progress grid to update
        } catch (error) {
            console.error('Error updating habit progress:', error);
        }
    };

    const renderHabit = ({ item }) => (
        <View style={styles.habitContainer}>
            <TouchableOpacity
                style={[styles.checkbox, item.progress && styles.checkedCheckbox]}
                onPress={() => toggleHabit(item.id)}
            />
            <Text style={styles.habitText}>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* <Text style={styles.welcome}>Welcome, {user.name || 'User'}!</Text> */}
            <Text style={styles.welcome}>Habit Tracker</Text>

            {/* Progress Grid */}
            <ProgressGrid />

            {/* Today's Habits */}
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            <FlatList
                data={todayHabits}
                renderItem={renderHabit}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.habitList}
            />
            {/* Logout Button */}
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    welcome: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    habitList: {
        marginTop: 10,
        width: 320,
    },
    habitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: 'green',
        borderRadius: 4,
        marginRight: 10,
    },
    checkedCheckbox: {
        backgroundColor: 'green',
    },
    habitText: {
        fontSize: 16,
    },
});

export default HomeScreen;