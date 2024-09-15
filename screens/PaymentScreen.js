import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigation = useNavigation(); // Use navigation from the hook

  const handleNextPress = () => {
    if (paymentMethod) {
      console.log(`Selected Payment Method: ${paymentMethod}`);
      // Example of navigation to the next step
      navigation.navigate('PaymentDetails', { method: paymentMethod });
    } else {
      alert('Please select a payment method.');
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
          // Uncomment this and use your actual image path
          // source={require('../assets/mpesa-logo.png')}
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
          // Uncomment this and use your actual image path
          // source={require('../assets/bonga-logo.png')}
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
          // Uncomment this and use your actual image path
          // source={require('../assets/visa-logo.png')}
          style={styles.paymentImage}
        />
      </View>

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
