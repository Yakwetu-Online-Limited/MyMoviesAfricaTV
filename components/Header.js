import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Linking } from 'react-native';
import axios from 'axios'; 

const Header = ({ username, walletBalance, userId, movieId }) => {
  console.log('Header received userName:', username);
  console.log('Header received userId:', userId);

  const [currentBalance, setCurrentBalance] = useState(walletBalance);
  const navigation = useNavigation();

  useEffect(() => {
    // Ensure that the currentBalance updates if walletBalance changes from props
    setCurrentBalance(walletBalance);
  }, [walletBalance]);

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
  // Function to fetch wallet balance after a top-up
  // const fetchWalletBalance = async () => {
  //   try {
  //     const response = await axios.post('https://api.mymovies.africa/api/v1/users/wallet', {
  //       user_id: userId,  // Send userId in the request body
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',  // Set the content type for form data
  //       }
  //     });

  //     if (response.data && response.data.balance) {
  //       setCurrentBalance(response.data.balance);  // Update the wallet balance state
  //       Alert.alert('Top Up Successful', `New Wallet Balance: ${response.data.balance}`);
  //     } else {
  //       Alert.alert('Error', 'Failed to retrieve wallet balance.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching updated wallet balance:', error);
  //     Alert.alert('Error', 'Failed to update wallet balance.');
  //   }
  // };

  // Mocking wallet balance for now
  const fetchWalletBalance = async () => {
    try {
      const mockBalance = 500;  // Mocking with a wallet balance of 5000
      setCurrentBalance(mockBalance);
      Alert.alert('Mock Top Up Successful', `New Wallet Balance: ${mockBalance}`);
    } catch (error) {
      console.error('Error fetching updated wallet balance:', error);
      Alert.alert('Error', 'Failed to update wallet balance.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWalletBalance();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/mymovies-africa-logo.png')} 
          style={styles.logo}
        />
        
      </View>
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={handleTopUp}  style={styles.topUpButton}>
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
