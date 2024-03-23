import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const EditExpenseScreen = ({ route, navigation }) => {
  const { expense } = route.params;
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [type, setType] = useState(expense.type);
  const [label, setLabel] = useState(expense?.label);

  const handleUpdateExpense = async () => {
    try {
      await axios.put(`https://expense-tracker-react-native.onrender.com/expenses/update`, { title, amount, type, label, expenseId: expense.expenseId });
      Alert.alert('Success', 'Expense updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update expense. Please try again.');
      console.error('Error updating expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />
      <Text style={styles.label}>Amount:₹</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Type:</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Enter type (Credit/Debit)"
      />
      <Text style={styles.label}>Label:</Text>
      <TextInput
        style={styles.input}
        value={label}
        onChangeText={setLabel}
        placeholder="Enter label"
      />
      <Button title="Update Expense" onPress={handleUpdateExpense} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default EditExpenseScreen;
