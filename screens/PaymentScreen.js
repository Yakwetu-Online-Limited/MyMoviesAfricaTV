import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import axios from 'axios'; 

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const navigation = useNavigation(); // Use navigation from the hook
  const [walletBalance, setWalletBalance] = useState(0);

  const handleNextPress = () => {
    if (paymentMethod) {
      if(!amount){
        Alert.alert('Amount required', 'Please enter the amount to top up.');
        return;
      }

      console.log(`Selected Payment Method: ${paymentMethod}`);
      processPayment(paymentMethod);
    } else {
      alert('Please select a payment method.');
    }
  };

  const processPayment = async (method) => {
    
    try{
      let response;
      switch(method){
        case 'mpesa':	
          response = await axios.post('http://192.168.100.86:3000/mpesa/stkpush', {
            phone: '2547XXXXXXXX',
            amount: parseInt(amount),
      });
          break;
        case 'bonga':
          response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {

      });
          break;
        case 'visa':
          response = await axios.post('https://api.visa.com/cybersource/payments/v1/payment', {
            // Add VISA API data here
          });
          break;
        default:
          alert('Invalid payment method');
          return
    }

    if(response.status === 200){
      Alert.alert('Payment Successful', `Your payment of Ksh ${amount} has been processed successfully`);	
      setWalletBalance(walletBalance + amount);
    } else {
      Alert.alert('Payment Failed', 'An error occurred while processing your payment');
    }
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Payment Error', 'Something went wrong. Please try again.');
  }
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.infoText}>You can top up your account with any amount</Text>
      <Text style={styles.selectText}>
        Select your preferred Payment Method then click the NEXT button below
      </Text>

      {/* M-PESA Option */}
      <View style={styles.paymentOption}>
        <RadioButton
          value="mpesa"
          status={paymentMethod === 'mpesa' ? 'checked' : 'unchecked'}
          onPress={() => setPaymentMethod('mpesa')}
          color="#4CAF50"
        />
        <Image
          
          source={require('../assets/mpesa-logo.png')}
          style={styles.paymentImage}
        />
      </View>

      {/* Bonga Option */}
      <View style={styles.paymentOption}>
        <RadioButton
          value="bonga"
          status={paymentMethod === 'bonga' ? 'checked' : 'unchecked'}
          onPress={() => setPaymentMethod('bonga')}
          color="#FF3D00"
        />
        <Image
          
          source={require('../assets/bonga-logo.png')}
          style={styles.paymentImage}
        />
      </View>

      {/* VISA Option */}
      <View style={styles.paymentOption}>
        <RadioButton
          value="visa"
          status={paymentMethod === 'visa' ? 'checked' : 'unchecked'}
          onPress={() => setPaymentMethod('visa')}
          color="#1A73E8"
        />
        <Image
          
          source={require('../assets/visa-logo.png')}
          style={styles.paymentImage}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>NEXT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  infoText: {
    color: '#4CAF50',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  selectText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentImage: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 40,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentPage;
