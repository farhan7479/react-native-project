import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ExpenseListScreen from './screens/ExpenseListScreen';
import ExpenseDetailScreen from './screens/ExpenseDetailScreen';
import EditExpenseScreen from './screens/EditExpenseScreen';

const Stack = createNativeStackNavigator();

const Main= () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="ExpenseList" component={ExpenseListScreen} options={{ title: 'Expense List' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Expense Tracker' }} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
        
        <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} options={{ title: 'Expense Detail' }} />
        <Stack.Screen name="EditExpense" component={EditExpenseScreen} options={{ title: 'Edit Expense' }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
