import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import axios from 'axios';

const ExpenseListScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('day');

  const handleDeleteExpense = async (expense) => {
    try {
      await axios.delete(`${process.env.API_URL}/delete/${expense.expenseId}`);
      Alert.alert('Success', 'Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense. Please try again.');
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (expense) => {
    navigation.navigate('EditExpense', { expense });
  };

  const fetchExpenses = async () => {
    let url = `${process.env.API_URL}/expenses`;
    if (filter === 'day' || filter === 'week' || filter === 'month') {
      url += `/filter?filter=${filter}`;
    }

    try {
      const response = await axios.get(url);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter]);

  const handleExpenseDetails = (expense) => {
    navigation.navigate('ExpenseDetail', { expense });
  };

  const renderExpenseItem = ({ item }) => {
    const swipeoutLeftButtons = [
      {
        text: 'Delete',
        onPress: () => handleDeleteExpense(item),
        backgroundColor: 'red',
      },
    ];

    const swipeoutRightButtons = [
      {
        text: 'Edit',
        onPress: () => handleEditExpense(item),
        backgroundColor: 'blue',
      },
    ];

    const expenseDateTime = new Date(item.date);
    const formattedDateTime = `${expenseDateTime.toLocaleDateString()} ${expenseDateTime.toLocaleTimeString()}`;

    return (
      <Swipeout right={swipeoutRightButtons} left={swipeoutLeftButtons} autoClose={true} backgroundColor="transparent">
        <TouchableOpacity
          style={styles.expenseItem}
          onPress={() => handleExpenseDetails(item)}
        >
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseDate}>Date: {formattedDateTime}</Text>
          <Text style={[styles.expenseAmount, item.type === 'Debit' ? styles.debitedAmount : styles.creditedAmount]}>
            Amount: ₹{item.amount}
          </Text>
        </TouchableOpacity>
      </Swipeout>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Expense List</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'day' && styles.activeFilter]}
          onPress={() => setFilter('day')}
        >
          <Text style={styles.filterText}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'week' && styles.activeFilter]}
          onPress={() => setFilter('week')}
        >
          <Text style={styles.filterText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'month' && styles.activeFilter]}
          onPress={() => setFilter('month')}
        >
          <Text style={styles.filterText}>Month</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const colors = {
  white: '#fff',
  gray: '#ccc',
  blue: 'blue',
  red: 'red',
  green: 'green'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
    alignItems: 'center', // Center items horizontally
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseItem: {
    width: '100%', // Take up full width
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  expenseDate: {
    color: colors.gray,
    marginBottom: 5,
  },
  expenseAmount: {
    fontSize: 16,
    marginBottom: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  activeFilter: {
    backgroundColor: colors.gray,
  },
  filterText: {
    fontWeight: 'bold',
  },
  creditedAmount: {
    color: colors.green,
  },
  debitedAmount: {
    color: colors.red,
  },
});

export default ExpenseListScreen;
