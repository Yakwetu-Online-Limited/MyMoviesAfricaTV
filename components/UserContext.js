
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a new Context for user data to be accessible throughout the app.
const UserContext = createContext();
// console.log('User context:', UserContext);


// Create the UserProvider component that wraps the app and provides user-related data/functions.
export const UserProvider = ({ children , value}) => {
  // Declare the user state and initialize it to null.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect to run the logic when the component mounts, fetching stored user data.
  useEffect(() => {
    // Load user data from AsyncStorage when the app starts or reloads.
    const loadUser = async () => {
      try {
        // Retrieve the user data (if any) from AsyncStorage.
        const userData = await AsyncStorage.getItem('userData');
        console.log('Raw userData from AsyncStorage:', userData);
        if (userData) {
          // If user data is found, parse it and set it in the state.
          setUser(JSON.parse(userData));
          console.log('Parsed user data:', parsedUserData);
            // CHANGE: Add console.log for debugging
            // console.log('Loaded user data:', parsedUserData);
        }else{
            console.log('no user data found')
        }
        
      } catch (error) {
        // Log any errors that occur while loading user data.
        console.error('Error loading user data:', error);
      }finally{
        setLoading(false);
      }
    };
    loadUser();
  }, []); // Empty dependency array ensures this effect runs only once on component mount.

  // Define the login function that accepts userData and saves it in AsyncStorage.
  const login = async (userData) => {
    try {
      // Store the user data in AsyncStorage after converting it to a string.
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      console.log('user loggied in', userData);
      // Update the user state with the logged-in user data.
    //   setUser(userData);
    } catch (error) {
      // Log any errors that occur during saving.
      console.error('Error saving user data:', error);
    }
  };

  // Define the logout function that removes user data from AsyncStorage.
  const logout = async () => {
    try {
      // Remove the user data from AsyncStorage.
      await AsyncStorage.removeItem('userData');
      // Reset the user state to null, indicating the user is logged out.
      setUser(null);
    } catch (error) {
      // Log any errors that occur during removal.
      console.error('Error removing user data:', error);
    }
  };

  // Provide the user data, login, and logout functions to any components wrapped in UserProvider.
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to make accessing the UserContext easier in other components.
export const useUser = () => useContext(UserContext);

// CHANGE: Add console.log for debugging
console.log('UserContext created');
