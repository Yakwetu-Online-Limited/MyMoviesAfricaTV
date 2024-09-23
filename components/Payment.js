import React, { useState } from 'react';
import { Alert, TouchableOpacity, Text } from 'react-native';
import { initiatePayment } from 'tajiri'; // Import the initiatePayment function from tajiri

const MpesaPayment = ({ amount, reference, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await initiatePayment({
        amount: amount,
        reference: reference,
        // Other parameters can be added here as per tajiri documentation
      });

      if (response.status === 'success') {
        onSuccess(response); // Call the success callback
        Alert.alert('Payment Successful', `Your payment of Ksh ${amount} has been processed successfully.`);
      } else {
        onFailure(response); // Call the failure callback
        Alert.alert('Payment Failed', response.message || 'An error occurred while processing your payment.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Payment Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handlePayment} disabled={loading}>
      <Text>{loading ? 'Processing...' : 'Pay with M-Pesa'}</Text>
    </TouchableOpacity>
  );
};

export default MpesaPayment;
