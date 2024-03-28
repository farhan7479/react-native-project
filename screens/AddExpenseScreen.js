import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

const AddExpenseScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Debit'); // Default to Debit
  const [label, setLabel] = useState('');
  const [message, setMessage] = useState(null);

  function randomID(len) {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }
  const expenseId = randomID(10);

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(`${process.env.API_URL}/expenses/add-expense`, {
        title,
        amount: parseFloat(amount),
        type,
        label,
        expenseId
      });
  

      console.log('Expense added:', response.data);

      setMessage('Expense added successfully!');
      setTitle('');
      setAmount('');
      setType('Debit');
      setLabel('');

      setTimeout(() => {
        navigation.navigate('ExpenseList');
      }, 1);
    } catch (error) {
      console.error('Error adding expense:', error);
      setMessage('Failed to add expense. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {message && <Text style={styles.message}>{message}</Text>}
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Type:</Text>
      <View style={styles.dropdown}>
        <TouchableOpacity
          style={[styles.dropdownOption, type === 'Debit' && styles.selectedOption]}
          onPress={() => setType('Debit')}
        >
          <Text style={styles.dropdownText}>Debit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dropdownOption, type === 'Credit' && styles.selectedOption]}
          onPress={() => setType('Credit')}
        >
          <Text style={styles.dropdownText}>Credit</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Label/Category:</Text>
      <TextInput
        style={styles.input}
        value={label}
        onChangeText={setLabel}
        placeholder="Enter label/category"
      />
      <Button title="Add Expense" onPress={handleAddExpense} />
    </View>
  );
};

const colors = {
  white: '#fff',
  green: 'green',
  blue: 'blue',
  gray: '#ccc'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  message: {
    marginBottom: 10,
    color: colors.green,
    fontWeight: 'bold',
  },
  dropdown: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dropdownOption: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  selectedOption: {
    borderColor: colors.blue, 
  },
});

export default AddExpenseScreen;
