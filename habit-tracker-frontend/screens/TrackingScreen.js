import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getHabits, addHabit } from '../services/habitService'; // Import habitService functions
import { useAuthedUser } from '../contexts/AuthedUserProvider';


// Custom Checkbox Component
const CustomCheckbox = ({ isChecked, onToggle }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
        <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]} />
    </TouchableOpacity>
);

const TrackingScreen = () => {
    const authedUser = useAuthedUser();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState('');

    // Fetch habits on component mount
    useEffect(() => {
        if (authedUser?.user.id) {
            const fetchHabits = async () => {
                try {
                    const fetchedHabits = await getHabits(authedUser.user.id);
                    setHabits(fetchedHabits.map(habit => ({ ...habit, progress: false })));
                } catch (error) {
                    console.error('Error fetching habits:', error);
                }
            };

            fetchHabits();
        }
    }, [authedUser]);

    // Toggle habit completion (local only for now)
    const toggleHabit = (id) => {
        setHabits((prevHabits) =>
            prevHabits.map((habit) =>
                habit.id === id ? { ...habit, progress: !habit.progress } : habit
            )
        );
    };

    const handleAddHabit = async () => {
        try {
            console.log(authedUser, newHabit);
            await addHabit(authedUser.user.id, newHabit);
            setNewHabit(''); // Clear input field
            const updatedHabits = await getHabits(authedUser.user.id); // Refetch habits after adding
            setHabits(updatedHabits.map(habit => ({ ...habit, progress: false })));
        } catch (error) {
            console.error('Error adding habit:', error);
        }
    };

    // Handle date change
    const onChangeDate = (event, selected) => {
        const currentDate = selected || selectedDate;
        setSelectedDate(currentDate);
        // Fetch or update habits for the selected date if needed
    };

    const renderHabit = ({ item }) => (
        <View style={styles.habitContainer}>
            <CustomCheckbox
                isChecked={item.progress}
                onToggle={() => toggleHabit(item.id)}
            />
            <Text style={styles.habitText}>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Date Picker */}
            <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
            />

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
        backgroundColor: '#f5f5f5',
    },
    addHabitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
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