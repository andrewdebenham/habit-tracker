import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTrackingProgress } from '../services/trackingService';
import { useAuthedUser } from '../contexts/AuthedUserProvider';
import { useTrackingUpdate } from '../contexts/TrackingUpdateProvider';

const ProgressGrid = () => {
    const authedUser = useAuthedUser();
    const { trackingUpdated } = useTrackingUpdate();
    const [progressData, setProgressData] = useState([]);

    useEffect(() => {
        const fetchLast30DaysProgress = async () => {
            if (!authedUser?.user.id) return;

            try {
                const today = new Date();
                const last30Days = Array.from({ length: 60 }, (_, i) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                });

                const progress = await Promise.all(
                    last30Days.map(async (date) => {
                        const trackingProgress = await getTrackingProgress(
                            authedUser.user.id,
                            date
                        );

                        const completedCount = trackingProgress.filter(
                            (entry) => entry.completed === 1
                        ).length;
                        const totalCount = trackingProgress.length;

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

        fetchLast30DaysProgress();
    }, [authedUser, trackingUpdated]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Last 60 Days Progress</Text>
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
        gap: 20, // Adds space between the key items
    },
    keyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5, // Adds space between the square and text
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