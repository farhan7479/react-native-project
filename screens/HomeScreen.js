import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList ,Alert} from 'react-native';
import axios from 'axios';
import Swipeout from 'react-native-swipeout'; 
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
      const response = await axios.get('https://expense-tracker-react-native.onrender.com/expenses/get-expenses');
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
        backgroundColor: 'blue',
      },
    ];
    const swipeoutLeftButtons = [
      {
        text: 'Delete',
        onPress: () => handleDeleteExpense(item),
        backgroundColor: 'red',
      },
      
    ];

    return (
      <Swipeout right={swipeoutRightButtons} left = {swipeoutLeftButtons}autoClose={true} backgroundColor="transparent">
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
      </Swipeout>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    borderBottomColor: '#ccc',
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
    color: 'blue',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
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
    color: 'black',
  },
  debitAmount: {
    color: 'red',
  },
  creditAmount: {
    color: 'green',
  },
});

export default HomeScreen;
