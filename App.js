import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MovieDetailScreen from './screens/MovieDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MovieDetail"
        screenOptions={{
          headerShown: true, // Show the header by default
        }}
      >
      <Stack.Screen
          name="MovieDetail"
          component={MovieDetailScreen}
          options={{ title: 'Movie Details' }}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;