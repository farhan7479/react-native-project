import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TotalExpensesCard = ({ totalExpenses }) => {
  return (
    <View style={styles.container}>
      <Text>Total Expenses: ₹{totalExpenses}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default TotalExpensesCard;
