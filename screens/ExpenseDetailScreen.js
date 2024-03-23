import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExpenseDetailScreen = ({ route }) => {
  const { title, date, amount, type ,label} = route.params.expense;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });


  const textColor = type === 'Credit' ? '#2ecc71' : '#e74c3c'; 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title: {title}</Text>
      <Text style={styles.date}>Date: {formattedDate}</Text>
      <Text style={[styles.amount, { color: textColor }]}>Amount: ₹{amount}</Text>
      <Text style={styles.type}>Type: {type}</Text>
      <Text style={styles.type}>Label/Category: {label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    marginBottom: 5,
  },
  amount: {
    fontSize: 18,
    marginBottom: 5,
  },
  type: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default ExpenseDetailScreen;
