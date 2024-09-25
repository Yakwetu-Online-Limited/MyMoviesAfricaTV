import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';


const Header = ({ userName, walletBalance, userId, onTopUp}) => {
  console.log('Header received userName:', userName);
  console.log('Header received userId:', userId);
  
  const navigation = useNavigation();

  const handleTopUp = () => {
    if (userId) {
      const url = `https://api.mymovies.africa/api/v1/payment/gate/${userId}`;

      Linking.openURL(url)
        .then((supported) => {
          if (!supported) {
            console.error('Unable to open URL:', url);
            Alert.alert('Error', 'Unable to open the top-up page.');
          }
          else {
            // Assuming the top-up completes successfully and the user returns to the app
            if (onTopUpSuccess) {
              onTopUpSuccess();
            }
          }
        })
        .catch((err) => console.error('An error occurred:', err));
    } else {
      Alert.alert('Error', 'User ID not found. Please log in.');
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
        <TouchableOpacity onPress={handleTopUp}  style={styles.topUpButton}>
          <Text style={styles.topUpText}>Top Up</Text>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName || 'Guest'}</Text>
          <Text style={styles.walletBalance}>Wallet Balance: {walletBalance}</Text>
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
