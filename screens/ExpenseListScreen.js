import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler'; 
import TotalExpensesCard from '../components/TotalExpensesCard';

const HomeScreen = ({ navigation }) => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  const handleDeleteExpense = async (expense) => {
    try {
      await axios.delete(`${process.env.API_URL}/expenses/delete/${expense.expenseId}`);
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

  const handleExpenseDetails = (expense) => {
    navigation.navigate('ExpenseDetail', { expense });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchExpenses();
  };

  const formatDateTime = dateTime => {
    return new Date(dateTime).toLocaleString();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const response = await axios.get(`${process.env.API_URL}/expenses/get-expenses`);
      const allExpenses = response.data;

      const total = allExpenses.reduce((acc, expense) => {
        return expense.type === 'Credit' ? acc + expense.amount : acc - expense.amount;
      }, 0);
      setTotalExpenses(total);

      const weekly = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= lastWeek && expenseDate <= today;
      });
      setWeeklyExpenses(weekly);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderExpenseItem = ({ item }) => {
    const swipeoutRightButtons = [
      {
        text: 'Edit',
        onPress: () => handleEditExpense(item),
        backgroundColor: colors.blue,
      },
    ];
    const swipeoutLeftButtons = [
      {
        text: 'Delete',
        onPress: () => handleDeleteExpense(item),
        backgroundColor: colors.red,
      },
    ];

    const swipeRightActions = (progress, dragX) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      return (
        <TouchableOpacity style={styles.rightAction} onPress={() => handleEditExpense(item)}>
          <Text style={[styles.actionText, { transform: [{ scale }] }]}>Edit</Text>
        </TouchableOpacity>
      );
    };

    const swipeLeftActions = (progress, dragX) => {
      const scale = dragX.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });
      return (
        <TouchableOpacity style={styles.leftAction} onPress={() => handleDeleteExpense(item)}>
          <Text style={[styles.actionText, { transform: [{ scale }] }]}>Delete</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Swipeable
        renderRightActions={swipeRightActions}
        renderLeftActions={swipeLeftActions}
        overshootRight={false}
        overshootLeft={false}
      >
        <TouchableOpacity
          style={styles.expenseItem}
          onPress={() => handleExpenseDetails(item)}
        >
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseDate}>Date: {formatDateTime(item.date)}</Text>
          <Text style={[styles.expenseAmount, item.type === 'Debit' ? styles.debitAmount : styles.creditAmount]}>
            Amount: ₹{item.amount}
          </Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <TotalExpensesCard totalExpenses={totalExpenses} />
      <Text style={styles.sectionTitle}>Expense List (Past Week)</Text>
      <FlatList
        style={styles.expenseList}
        data={weeklyExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.expenseListButton} onPress={() => navigation.navigate('ExpenseList')}>
        <Text style={styles.expenseListButtonText}>List</Text>
      </TouchableOpacity>
    </View>
  );
};

const colors = {
  white: '#fff',
  blue: 'blue',
  red: 'red',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseList: {
    flex: 1,
  },
  expenseItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  expenseDate: {
    color: '#666',
    marginBottom: 5,
  },
  expenseAmount: {
    color: colors.blue,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  addButtonText: {
    fontSize: 30,
    color: colors.white,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  refreshButtonText: {
    fontSize: 16,
    color: colors.black,
  },
  debitAmount: {
    color: 'red',
  },
  creditAmount: {
    color: 'green',
  },
  expenseListButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 80,
    height: 50,
    borderRadius: 40,
    backgroundColor: colors.blue, 
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: "center",
    elevation: 0,
  },
  expenseListButtonText: {
    fontSize: 16,
    color: colors.white,
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: colors.blue,
  },
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.red,
  },
  actionText: {
    color: colors.white,
    fontWeight: '600',
    padding: 20,
  },
});

export default HomeScreen;
