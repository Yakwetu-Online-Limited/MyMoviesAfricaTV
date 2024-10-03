import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomePage from './screens/HomeScreen';
import MovieDetailScreen from './screens/MovieDetailScreen';
import CollectionPage from './screens/CollectionScreen';
import SearchPage from './screens/SearchScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { UserProvider } from './components/UserContext';
import MembershipScreen from './membership/MembershipScreen';
import UpdateAccountForm from './membership/UpdateAccountForm';

import { PaperProvider } from 'react-native-paper';
import { gestureHandlerRootHOC, GestureHandlerRootView } from 'react-native-gesture-handler';

// Placeholder screens for future implementation




const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ route }) => {
  const { userId, username, movieId, walletBalance, userEmail, phoneNumber, birthday } = route.params || {};
  console.log('BottomTabNavigator params:', route.params); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Collection') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#aa00ff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{ headerShown: false }} 
        initialParams={{ userId, username, userEmail, walletBalance }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{ headerShown: false }} 
        initialParams={{ userId, username, walletBalance: 600 }}
      />
      <Tab.Screen
        name="Collection"
        component={CollectionPage}
        options={{ headerShown: false }} 
        initialParams={{ userId, username, walletBalance, movieId }}
      />
      <Tab.Screen
        name="Profile"
        component={MembershipScreen}
        options={{ headerShown: false }}
        initialParams={{ userId, username, userEmail, walletBalance }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PaperProvider>
        <UserProvider>
      <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />        
        <Stack.Screen name="Home" component={BottomTabNavigator}  />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="Collection" component={CollectionPage} />
        
        
        <Stack.Screen
          name="MovieDetail"
          component={MovieDetailScreen}
          options={{ title: 'Movie Details' }}
      />
      <Stack.Screen
          name="Membership"
          component={MembershipScreen}
        />
        <Stack.Screen
          name="UpdateAccountForm"
          component={UpdateAccountForm} 
        />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
    </PaperProvider>
    </GestureHandlerRootView>
    
    
  );
};

export default App;