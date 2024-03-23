import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import axios from 'axios';

const ExpenseListScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('day');

  const handleDeleteExpense = async (expense) => {
    try {
      await axios.delete(`https://expense-tracker-react-native.onrender.com/expenses/delete/${expense.expenseId}`);
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
    let url = 'https://expense-tracker-react-native.onrender.com/expenses';
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

    return (
      <Swipeout left={swipeoutLeftButtons} right={swipeoutRightButtons} autoClose={true} backgroundColor="transparent">
        <TouchableOpacity
          style={styles.expenseItem}
          onPress={() => handleExpenseDetails(item)}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.label}>{item.label}</Text>
          <View style={styles.amountContainer}>
            <Text style={item.type === 'Credit' ? styles.creditedAmount : styles.debitedAmount}>
              ₹{item.amount}
            </Text>
          </View>
          <Text style={styles.type}>{item.type}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
    borderColor: '#ccc',
  },
  activeFilter: {
    backgroundColor: '#ccc',
  },
  filterText: {
    fontWeight: 'bold',
  },
  expenseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rightAction: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
  },
  leftAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    padding: 20,
  },
  creditedAmount: {
    color: 'green',
  },
  debitedAmount: {
    color: 'red',
  },
  title: {
    fontWeight: 'bold',
  },
  label: {
    color: '#666',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    color: '#666',
  },
});

export default ExpenseListScreen;
