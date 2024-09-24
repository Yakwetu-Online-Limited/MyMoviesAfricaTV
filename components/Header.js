import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = ({ userName, walletBalance, userId, onTopUp}) => {
  console.log('Header received userName:', userName);
  console.log('Header received userId:', userId);
  
  const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/mymovies-africa-logo.png')} 
          style={styles.logo}
        />
        
      </View>
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={() => {
    console.log('Navigating to Payment with userId:', userId);
    navigation.navigate('Payment', {
      id: userId,
      purchase_type: 'TOPUP',
    });
  }}  style={styles.topUpButton}>
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
