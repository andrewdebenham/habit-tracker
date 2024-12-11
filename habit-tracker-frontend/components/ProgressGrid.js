import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTrackingProgress } from '../services/trackingService';
import { useAuthedUser } from '../contexts/AuthedUserProvider';
import { useTrackingUpdate } from '../contexts/TrackingUpdateProvider';

// Generates a grid of 60 squares, each representing one day and the completion progress for that day
const ProgressGrid = () => {
    const authedUser = useAuthedUser();
    const { trackingUpdated } = useTrackingUpdate();
    const [progressData, setProgressData] = useState([]);

    // fetch the progress data for the last 60 days on mount and then listen for updates
    useEffect(() => {
        const fetchLast60DaysProgress = async () => {
            if (!authedUser?.user.id) return;

            // create array of dates for the last 60 days
            try {
                const today = new Date();
                const last60Days = Array.from({ length: 60 }, (_, i) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    return date.toISOString().split('T')[0]; // Formats as YYYY-MM-DD
                });

                // Map through each date and check the completion progress for each
                const progress = await Promise.all(
                    last60Days.map(async (date) => {
                        const trackingProgress = await getTrackingProgress(
                            authedUser.user.id,
                            date
                        );

                        const completedCount = trackingProgress.filter(
                            (entry) => entry.completed === 1
                        ).length;
                        const totalCount = trackingProgress.length;

                        // return completion status
                        return {
                            date,
                            completed: totalCount > 0 && completedCount === totalCount, // All habits completed
                        };
                    })
                );

                setProgressData(progress); // Reverse to display earliest date first
            } catch (error) {
                console.error('Error fetching progress:', error);
            }
        };

        fetchLast60DaysProgress();
    }, [authedUser, trackingUpdated]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>60 Day Progress Chart</Text>
            <View style={styles.grid}>
                {progressData.map((day, index) => (
                    <View
                        key={index}
                        style={[
                            styles.square,
                            { backgroundColor: day.completed ? 'green' : 'gray' },
                        ]}
                    />
                ))}
            </View>
            <View style={styles.keyContainer}>
                <View style={styles.keyItem}>
                    <View style={[styles.square, { backgroundColor: 'green' }]} />
                    <Text style={styles.keyText}>All habits completed</Text>
                </View>
                <View style={styles.keyItem}>
                    <View style={[styles.square, { backgroundColor: 'gray' }]} />
                    <Text style={styles.keyText}>Not all completed</Text>
                </View>
            </View>
            {/* <Text style={styles.smallText}>Complete your habits to fill in the grid!</Text> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: 225,
    },
    square: {
        width: 20,
        height: 20,
        margin: 2,
        borderRadius: 4,
    },
    keyContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        gap: 20,
    },
    keyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    keyText: {
        fontSize: 14,
        color: '#555',
    },
    smallText: {
        marginTop: 10,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
    },
});

export default ProgressGrid;