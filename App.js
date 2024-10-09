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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack for Home
const HomeStack = ({ route }) => {
  const { userId, username, userEmail, walletBalance } = route.params || {};
  console.log('HomeStack params:', route.params);
  return(
  <Stack.Navigator>
    <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} initialParams={{ userId, username, userEmail, walletBalance }}/>
    <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ headerShown: false }} initialParams={{ userId, movieId: route.params?.movieId }} />
    <Stack.Screen name="Collection" component={CollectionPage} options={{ headerShown: false }} initialParams={{ userId, username, walletBalance, movieId: route.params?.movieId }}/>
  </Stack.Navigator>
  );
};

// Stack for Collection
const CollectionStack = ({ route }) => {
  const { userId, username, walletBalance, movieId } = route.params || {};
  console.log('CollectionStack params:', route.params);

  return (
    <Stack.Navigator>
    <Stack.Screen name="Collection" component={CollectionPage} options={{ headerShown: false }} initialParams={{ userId, username, walletBalance, movieId }}/>
    <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ headerShown: false }} initialParams={{ userId, movieId }} />
  </Stack.Navigator>
  )
  
};

// Stack for Search
const SearchStack = ({ route }) => {
  const { userId, username, walletBalance, movieId } = route.params || {};
  console.log('SearchStack params:', route.params);

  return (
  <Stack.Navigator>
    <Stack.Screen name="SearchPage" component={SearchPage} options={{ headerShown: false }} initialParams={{ userId, username, walletBalance: 600 }} />
    <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ headerShown: false }} initialParams={{ userId, movieId: route.params?.movieId }} />
    <Stack.Screen name="Collection" component={CollectionPage} options={{ headerShown: false }} initialParams={{ userId, username, walletBalance, movieId }}/>
  </Stack.Navigator>
  );
};

// Stack for Profile (Membership)
const ProfileStack = ({ route }) => {
  const { userId, username, userEmail, walletBalance } = route.params || {};
  console.log('ProfileStack params:', route.params);

  return (
  <Stack.Navigator>
    <Stack.Screen name="MembershipScreen" component={MembershipScreen} options={{ headerShown: false }} initialParams={{ userId, username, userEmail, walletBalance }}/>
    <Stack.Screen name="UpdateAccountForm" component={UpdateAccountForm} options={{ headerShown: false }}/>
  </Stack.Navigator>
  );
};

// Bottom Tab Navigator with all stacks
const BottomTabNavigator = ({ route }) => {
  const { userId, username, movieId, walletBalance, userEmail, phoneNumber, birthday } = route.params || {};
  console.log('BottomTabNavigator params:', route.params);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'CollectionTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'ProfileTab') {
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
        name="HomeTab"
        component={HomeStack}
        options={{ headerShown: false }}
        initialParams={{ userId, username, userEmail, walletBalance }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{ headerShown: false }}
        initialParams={{ userId, username, walletBalance: 600 }}
      />
      <Tab.Screen
        name="CollectionTab"
        component={CollectionStack}
        options={{ headerShown: false }}
        initialParams={{ userId, username, walletBalance, movieId }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ headerShown: false }}
        initialParams={{ userId, username, userEmail, walletBalance }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Home" component={BottomTabNavigator} />
            <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;
