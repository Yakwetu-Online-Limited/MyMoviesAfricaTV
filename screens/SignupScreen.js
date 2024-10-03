import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Switch, ActivityIndicator } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (fullName === '' || email === '' || phoneNumber === '' || password === '' || !isPrivacyChecked) {
      Alert.alert('Error', 'Please fill in all fields and agree to the Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase user created', userCredential);

      const formData = new URLSearchParams({
        email: email,
        name: fullName,
        phone: phoneNumber.replace('+', ''),
        ref: `signupFromApp_${Date.now()}`,
        isHidden: '0',
        reason: 'newUserSignup',
      }).toString();

      console.log('Request URL:', 'https://api.mymovies.africa/api/v1/users/createAccount');
      console.log('Request Body:', formData);

      const response = await fetch('https://api.mymovies.africa/api/v1/users/createAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseText = await response.text();
      console.log(response.status, responseText); 

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{.*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in the response');
        Alert.alert('Error', 'Invalid server response. Please try again later.');
        return;
      }

      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON:', jsonStr);

      let data;
      try {
        data = JSON.parse(jsonStr);
        console.log('Parsed response:', data);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        Alert.alert('Error', 'Unable to parse server response. Please try again later.');
        return;
      }

      if (data.status === true) {
        console.log('API response contains uid:', data.userId);
        Alert.alert('Success', 'Account created successfully');

        // Save user data to AsyncStorage
        await AsyncStorage.setItem('userId', JSON.stringify(data.userId));
        await AsyncStorage.setItem('username', fullName);
        await AsyncStorage.setItem('userEmail', email);

        console.log("Stored in AsyncStorage:", {userId: data.userId, username: fullName, userEmail: email});

        //Retrieve to verify
        const checkUserId = await AsyncStorage.getItem('userId');
        const parsedUserId = JSON.parse(checkUserId);
        console.log("Login check userId:", parsedUserId);

        const checkUsername = await AsyncStorage.getItem('username');
        console.log("Login check username:", checkUsername);

        if (!checkUserId || !checkUsername) {
          console.error("Error: AsyncStorage values were not set properly");
        } else {
          console.log("AsyncStorage values are set correctly");
        }
        
        navigation.navigate('Home', { userId: data.userId, username: fullName, userEmail: email });
      } else {
        console.error('Server error:', data);
        Alert.alert('Error', data.message || 'An error occurred while creating the account.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('Error', 'An error occurred while creating the account. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.webp')} style={styles.logo} />

      <Text style={styles.headerText}>
        Sign-up now to Enjoy the latest Movies from Africa available to #RentFor2Days, #RentFor7Days or #OwnForLife!
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        {fullName === '' && <Text style={styles.errorText}>Full name is required</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {email === '' && <Text style={styles.errorText}>Enter a valid Email</Text>}
      </View>

      <View style={styles.inputContainer}>
        <PhoneInput
          style={styles.phoneInput}
          textStyle={{ color: '#fff' }}
          initialCountry="ke"
          value={phoneNumber}
          onChangePhoneNumber={(text) => setPhoneNumber(text)}
        />
        {phoneNumber === '' && <Text style={styles.errorText}>Enter a valid phone number</Text>}
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        {password.length < 6 && <Text style={styles.errorText}>Password should be at least 6 characters</Text>}
      </View>

      <View style={styles.checkboxContainer}>
        <Switch
          value={isPrivacyChecked}
          onValueChange={(value) => setIsPrivacyChecked(value)}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isPrivacyChecked ? "#f4f3f4" : "#f4f3f4"}
        />
        <Text style={styles.checkboxLabel}>I have read and agreed to the Privacy Policy</Text>
      </View>

      <TouchableOpacity 
        style={styles.signupButton} 
        onPress={handleSignup} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signupButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerText}>Already a Member?</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    color: '#fff',
    marginLeft: 10,
  },
  signupButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  orText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  footerText: {
    color: '#007BFF',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default SignupScreen;
