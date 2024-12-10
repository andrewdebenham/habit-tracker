import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getHabits, addHabit, deleteHabit, updateHabit } from '../services/habitService';
import { getTrackingProgress, trackHabit } from '../services/trackingService';
import { useAuthedUser } from '../contexts/AuthedUserProvider';
import { useTrackingUpdate } from '../contexts/TrackingUpdateProvider';
import { Ionicons } from '@expo/vector-icons';

// Custom Checkbox Component
const CustomCheckbox = ({ isChecked, onToggle }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
        <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]} />
    </TouchableOpacity>
);

const TrackingScreen = () => {
    const authedUser = useAuthedUser();
    const { toggleTrackingUpdate, trackingUpdated } = useTrackingUpdate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState('');
    const [editingHabitId, setEditingHabitId] = useState(null);
    const [editingHabitName, setEditingHabitName] = useState('');

    // Fetch habits and their tracking progress when the date changes or on mount
    useEffect(() => {
        if (authedUser?.user.id) {
            const fetchHabitsAndProgress = async () => {
                try {
                    // Fetch habits for the user
                    const fetchedHabits = await getHabits(authedUser.user.id);

                    // Filter habits based on their creation date
                    const filteredHabits = fetchedHabits.filter((habit) => {
                        const habitCreationDate = new Date(habit.created_at).setHours(0, 0, 0, 0);
                        const selectedDateOnly = new Date(selectedDate).setHours(0, 0, 0, 0);
                        return habitCreationDate <= selectedDateOnly;
                    });

                    // Fetch tracking progress for the selected date
                    const trackingProgress = await getTrackingProgress(authedUser.user.id, selectedDate.toISOString().split('T')[0]);

                    // Merge progress into the filtered habits array
                    const updatedHabits = filteredHabits.map((habit) => {
                        const progressEntry = trackingProgress.find((entry) => entry.habit_id === habit.id);
                        return { ...habit, progress: progressEntry ? progressEntry.completed === 1 : false };
                    });

                    setHabits(updatedHabits); // Update the state
                } catch (error) {
                    console.error('Error fetching habits or progress:', error);
                }
            };

            fetchHabitsAndProgress();
        }
    }, [authedUser, selectedDate, trackingUpdated]);

    // Toggle habit completion and sync with backend
    const toggleHabit = async (id) => {
        const habitToUpdate = habits.find((habit) => habit.id === id);
        const newCompletedStatus = !habitToUpdate.progress;

        try {
            // Update the progress in the backend
            await trackHabit(id, selectedDate.toISOString().split('T')[0], newCompletedStatus);

            // Update the local state
            setHabits((prevHabits) =>
                prevHabits.map((habit) =>
                    habit.id === id ? { ...habit, progress: newCompletedStatus } : habit
                )
            );
            toggleTrackingUpdate(); // Notify ProgressGrid
        } catch (error) {
            console.error('Error toggling habit completion:', error);
        }
    };

    const handleAddHabit = async () => {
        try {
            await addHabit(authedUser.user.id, newHabit); // Add the new habit
            setNewHabit(''); // Clear the input field

            // Refetch habits and progress for the selected date
            const fetchedHabits = await getHabits(authedUser.user.id); // Fetch updated habits
            const trackingProgress = await getTrackingProgress(authedUser.user.id, selectedDate.toISOString().split('T')[0]); // Fetch progress

            // Merge the progress data into the habits
            const updatedHabits = fetchedHabits.map((habit) => {
                const progressEntry = trackingProgress.find((entry) => entry.habit_id === habit.id);
                return { ...habit, progress: progressEntry ? progressEntry.completed === 1 : false };
            });

            setHabits(updatedHabits); // Update the state with the merged data
            toggleTrackingUpdate(); // Notify ProgressGrid
        } catch (error) {
            console.error('Error adding habit:', error);
        }
    };

    const handleDeleteHabit = async (habitId) => {
        try {
            await deleteHabit(habitId, authedUser.user.id); // Call delete API
            setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitId)); // Update the state
            toggleTrackingUpdate();
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const handleEditHabit = (habitId, name) => {
        setEditingHabitId(habitId);
        setEditingHabitName(name);
    };

    const handleSaveEdit = async () => {
        try {
            await updateHabit(editingHabitId, editingHabitName);
            setHabits((prevHabits) =>
                prevHabits.map((habit) =>
                    habit.id === editingHabitId ? { ...habit, name: editingHabitName } : habit
                )
            );
            toggleTrackingUpdate();
        } catch (error) {
            console.error('Error updating habit name:', error);
        } finally {
            setEditingHabitId(null); // Exit edit mode
        }
    };

    // Handle date change
    const onChangeDate = (event, selected) => {
        const currentDate = selected || selectedDate;
        setSelectedDate(currentDate);
    };

    const renderHabit = ({ item }) => (
        <View style={styles.habitContainer}>
            <View style={styles.habitSeparator}>
                <CustomCheckbox
                    isChecked={item.progress}
                    onToggle={() => toggleHabit(item.id)}
                />
                {editingHabitId === item.id ? (
                    <View style={styles.editContainer}>
                        <TextInput
                            style={styles.editInput}
                            value={editingHabitName}
                            onChangeText={setEditingHabitName}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleSaveEdit}>
                            <Ionicons name="checkmark-outline" size={20} color="green" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.habitText}>{item.name}</Text>
                )}
            </View>
            {editingHabitId !== item.id && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleEditHabit(item.id, item.name)}>
                        <Ionicons name="create-outline" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteHabit(item.id)}>
                        <Ionicons name="trash-outline" size={20} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            </View>

            {/* Input and Add Habit Button */}
            <View style={styles.addHabitContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new habit"
                    value={newHabit}
                    onChangeText={setNewHabit}
                />
                <Button title="Add Habit" onPress={handleAddHabit} />
            </View>

            {/* Habits List */}
            <FlatList
                data={habits}
                renderItem={renderHabit}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.habitsList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: '#00bf6333',
        backgroundColor: '#fff',
    },
    datePickerContainer: {
        width: 200,
    },
    addHabitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    habitsList: {
        marginTop: 10,
    },
    habitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    editInput: {
        fontSize: 16,
        padding: 5,
        width: 290,
    },
    submitButton: {
        marginLeft: 10,
    },
    habitSeparator: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
    habitText: {
        fontSize: 16,
        marginLeft: 10,
    },
    checkboxContainer: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkbox: {
        width: 16,
        height: 16,
    },
    checkedCheckbox: {
        backgroundColor: 'green',
    },
});

export default TrackingScreen;