import React from 'react';
import { FlatList, Text, View, StyleSheet, Dimensions } from 'react-native';

const Calendar = () => {
  // Generate an array of dates
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const renderDate = ({ item }) => {
    return (
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {item.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <FlatList
          data={dates}
          renderItem={renderDate}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    height: 60, // Restrict the calendar's height
    marginVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  dateContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  otherContent: {
    flex: 1, // Take the remaining space
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Calendar;
