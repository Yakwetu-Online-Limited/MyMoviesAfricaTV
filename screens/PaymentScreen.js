import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import axios from 'axios';
import MpesaPayment from '../components/Payment';

const PaymentPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, purchase_type, ref } = route.params; // Get route params including ref

  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentOptions, setPaymentOptions] = useState([]);

  console.log('Passed route params:', route);

  useEffect(() => {
    if (id) {
      fetchPaymentOptions(id, purchase_type, ref);
    } else {
      console.error('No userId provided to PaymentScreen');
    }
  }, [id, purchase_type, ref]);

  // Fetch payment options from the API
  const fetchPaymentOptions = async (userId, purchaseType, ref) => {
    try {
      const response = await axios.get(`https://api.mymovies.africa/api/v1/payment/gate/${userId}`, {
        params: {
          amount,
          purchase_type: purchaseType,
          ref,
        },
      });
      console.log('Payment options:', response.data);
      setPaymentOptions(response.data.paymentOptions || []);
    } catch (error) {
      console.error('Error fetching payment options:', error);
      Alert.alert('Error', 'Failed to load payment options.');
    }
  };

  const handleNextPress = () => {
    if (paymentMethod) {
      if (!amount) {
        Alert.alert('Amount required', 'Please enter the amount to top up.');
        return;
      }
      console.log(`Selected Payment Method: ${paymentMethod}`);
      if (paymentMethod === 'mpesa') {
        return; 
      }
      processPayment(paymentMethod);
    } else {
      Alert.alert('Payment Method Required', 'Please select a payment method.');
    }
  };

  const processPayment = async (method) => {
    try {
      const transactionParams = {
        method,
        amount: parseInt(amount),
        ref,
        purchase_type,
      };

      const response = await axios.post(`https://api.mymovies.africa/api/v1/payment/`, transactionParams);

      if (response.status === 200) {
        Alert.alert('Payment Successful', `Your payment of Ksh ${amount} has been processed successfully.`);
      } else {
        Alert.alert('Payment Failed', 'An error occurred while processing your payment.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Payment Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.infoText}>You can top up your account with any amount</Text>
      <Text style={styles.selectText}>Select your preferred Payment Method then click the NEXT button below</Text>

      {/* Display payment options dynamically */}
      {paymentOptions.map((option) => (
        <View style={styles.paymentOption} key={option.id}>
          <RadioButton
            value={option.id}
            status={paymentMethod === option.id ? 'checked' : 'unchecked'}
            onPress={() => setPaymentMethod(option.id)}
            color={option.color || '#000'}
          />
          <Image
            source={{ uri: option.logo }} // Assuming the API provides the logo URL
            style={styles.paymentImage}
          />
          <Text style={styles.paymentMethodText}>{option.name}</Text>
        </View>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />

      {/* Predefined Payment Options */}
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

      {/* M-Pesa Payment Logic */}
      {paymentMethod === 'mpesa' && (
        <MpesaPayment
          amount={amount}
          reference={ref} // Make sure ref is defined
          onSuccess={(response) => {
            console.log('M-Pesa Payment Success:', response);
          }}
          onFailure={(response) => {
            console.error('M-Pesa Payment Failed:', response);
          }}
        />
      )}

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
  paymentMethodText: {
    marginLeft: 10,
    fontSize: 16,
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
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
