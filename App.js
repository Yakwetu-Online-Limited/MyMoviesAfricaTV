import React from 'react';
import {  StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './screens/SearchScreen';
import HomeScreen from './screens/HomeScreen'; 

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Home Screen' }}
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{
            headerStyle: {
              backgroundColor: '#000', // Black background for header
            },
            headerTitleStyle: {
              color: 'transparent', // Hide the title text
            },
            headerTintColor: '#fff', // Color for back button
            headerTitleAlign: 'center', // Center the back button
            headerShown: true, // Show the header
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
