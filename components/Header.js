import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Linking } from 'react-native';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({ username, walletBalance }) => {
  const [currentBalance, setCurrentBalance] = useState(walletBalance);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Ensure that the currentBalance updates if walletBalance changes from props
    setCurrentBalance(walletBalance);
  }, [walletBalance]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserId = async () => {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);  // Set userId from AsyncStorage
        fetchWalletBalance(storedUserId);  // Fetch wallet balance
      };
      fetchUserId();
    }, [])
  );

  const handleTopUp = () => {
    if (userId) {
      const url = `https://api.mymovies.africa/api/v1/payment/gate/${userId}`;

      Linking.openURL(url)
        .then((supported) => {
          if (!supported) {
            console.error('Unable to open URL:', url);
            Alert.alert('Error', 'Unable to open the top-up page.');
          }
        })
        .catch((err) => console.error('An error occurred:', err));
    } else {
      Alert.alert('Error', 'User ID not found. Please log in.');
    }
  };

  // Function to fetch wallet balance
  const fetchWalletBalance = async (userId) => {
    if (!userId) {
      console.error('No user ID provided');
      return;
    }
    const mockBalance = 300;
    try {
      // Preparing form-encoded data
      const formData = new URLSearchParams();
      formData.append('user_id', userId);
      formData.append('amount', mockBalance);

      const response = await axios.post('https://api.mymovies.africa/api/v1/users/wallet', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',  // Set the content type for form data
        },
      });

      if (response.data && response.data.balance) {
        setCurrentBalance(response.data.balance);  // Update the wallet balance state
        Alert.alert('Top Up Successful', `New Wallet Balance: ${response.data.balance}`);
      } else {
        Alert.alert('Error', 'Failed to retrieve wallet balance.');
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to retrieve wallet balance.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/mymovies-africa-logo.png')} 
          style={styles.logo}
        />
      </View>
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={handleTopUp} style={styles.topUpButton}>
          <Text style={styles.topUpText}>Top Up</Text>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{username || 'Guest'}</Text>
          <Text style={styles.walletBalance}>Wallet Balance: {currentBalance}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#000', // Black background like in your design
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 90,
    resizeMode: 'contain',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topUpButton: {
    backgroundColor: '#FFCC00', 
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  topUpText: {
    color: '#000',
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'flex-start',
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  walletBalance: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Header;
