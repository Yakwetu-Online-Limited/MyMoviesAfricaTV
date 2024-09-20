import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, Switch } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SignupScreen = ({ navigation }) => {
  // State Declarations
  const [displayName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email Validation Helper Function
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Signup Handler
  const handleSignup = async () => {
    // Check if all required fields are filled
    if (!displayName || !validateEmail(email) || !phoneNumber || !password || !isPrivacyChecked) {
      Alert.alert('Error', 'Please fill in all fields with valid information and agree to the Privacy Policy.');
      return;
    }

    setIsLoading(true);

    // Prepare Form Data
    const formData = {
      email: email,
      name: displayName,
      phone: phoneNumber,
      ref: 'app',
      isHidden: '0',
      reason: 'Signup',
      transactionType: 'RENTAL',
      birthday: '',
      affiliateCode: '',
    };

    try {
      // API Call to Signup Endpoint
      console.log('Form Data:', formData);
      const response = await fetch('https://api.mymovies.africa/api/v1/users/createAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      console.log('Response:', response);
      const data = await response.json();
      console.log('Data:', data);
      setIsLoading(false);

      // Handle Response
      if (!data || !data.uid) {
        const errorMessage = data.message || 'Failed to create account. Please try again.';
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Success', 'Account created successfully');
        navigation.navigate('Home');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  // JSX Structure
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.webp')} style={styles.logo} />
      <Text style={styles.headerText}>
        Sign-up now to Enjoy the latest Movies from Africa available to #RentFor2Days, #RentFor7Days or #OwnForLife!
      </Text>

      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#888"
          value={displayName}
          onChangeText={setFullName}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {email !== '' && !validateEmail(email) && (
          <Text style={styles.errorText}>Enter a valid Email</Text>
        )}
      </View>

      {/* Phone Number Input */}
      <View style={styles.inputContainer}>
        <PhoneInput
          style={styles.phoneInput}
          textStyle={{ color: '#fff' }}
          initialCountry="ke"
          value={phoneNumber}
          onChangePhoneNumber={setPhoneNumber}
        />
        {phoneNumber !== '' && phoneNumber.length < 10 && (
          <Text style={styles.errorText}>Enter a valid phone number</Text>
        )}
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        {password !== '' && password.length < 6 && (
          <Text style={styles.errorText}>Password should be at least 6 characters</Text>
        )}
      </View>

      {/* Privacy Policy Checkbox */}
      <View style={styles.checkboxContainer}>
        <Switch
          value={isPrivacyChecked}
          onValueChange={setIsPrivacyChecked}
          trackColor={{ false: "#767577", true: "#81b0ff" }} 
          thumbColor={isPrivacyChecked ? "#f4f3f4" : "#f4f3f4"} 
        />
        <Text style={styles.checkboxLabel}>I have read and agreed to the Privacy Policy</Text>
      </View>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.signupButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* Already a Member Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerText}>Already a Member?</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#888',
  },
  phoneInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#888',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#888',
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 12,
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    color: '#ffcc00',
    marginLeft: 10,
  },
  signupButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#90EE90',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SignupScreen;
