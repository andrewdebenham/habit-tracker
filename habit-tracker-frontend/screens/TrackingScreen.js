import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Custom Checkbox Component
const CustomCheckbox = ({ isChecked, onToggle }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
    <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]} />
  </TouchableOpacity>
);

const TrackingScreen = () => {
  // State for selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State for habits (placeholder data)
  const [habits, setHabits] = useState([
    { id: '1', name: 'Drink Water', progress: false },
    { id: '2', name: 'Exercise', progress: false },
    { id: '3', name: 'Meditation', progress: false },
    { id: '4', name: 'Read a Book', progress: false },
  ]);

  // Toggle habit completion
  const toggleHabit = (id) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, progress: !habit.progress } : habit
      )
    );
  };

  // Handle date change
  const onChangeDate = (event, selected) => {
    const currentDate = selected || selectedDate;
    setSelectedDate(currentDate);
    // Fetch or update habits for the selected date if connected to a backend
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

        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />

      {/* Habits List */}
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
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
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
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