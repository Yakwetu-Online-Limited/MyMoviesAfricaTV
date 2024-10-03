import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Cookies from 'js-cookie'; // Import js-cookie
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../firebase';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkUserInStorage = async () => {
      try {
        const userIdString = await AsyncStorage.getItem('userId');
        const username = await AsyncStorage.getItem('username');
        const userEmail = await AsyncStorage.getItem('userEmail');

        const userId = userIdString ? Number(userIdString) : null;

        console.log('AsyncStorage userId:', userId); // Log the userId for troubleshooting
        console.log('AsyncStorage username with userEmail:', username, userEmail); // Log the username

        if (userId && username) {
          // If user data exists in AsyncStorage, navigate to the Home screen
          console.log('Navigating to Home with userId and username');
          navigation.navigate('Home', { userId, username, userEmail });
        } else {
          console.log('No user data in AsyncStorage');
        }
      } catch (error) {
        console.error("Error checking AsyncStorage:", error);
      }
    };
    checkUserInStorage();
  }, [navigation]);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential);
  
      const userId = userCredential.user.uid;
      const userEmail = userCredential.user.email || email;

      const fullName = userEmail.split('@')[0];
  
      // Prepare form-encoded data for the POST request
      const formData = new URLSearchParams();
      formData.append('uid', userId);
      formData.append('email', userEmail);
      formData.append('name', fullName);
  
      // Make the POST request to fetch user data
      const response = await axios.post('https://api.mymovies.africa/api/v1/users/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('API Response:', response.data);
  
      if (response.data && response.data.user) {
        const userData = response.data.user;
        console.log("Login API user data:", userData);
        
        // Store the userId and username in AsyncStorage
        await AsyncStorage.setItem('userId', userData.id.toString()); // Store userId as a string
        await AsyncStorage.setItem('username', userData.fullname || fullName); // Store username

        console.log('User data saved to AsyncStorage');
        const userId = userData.id ? Number(userData.id) : null;
        
        // Navigate to the Home screen with user data
        navigation.navigate('Home', { userId: userId, username: userData.fullname || fullName, userEmail: userData.email || email });
      } else {
        throw new Error('User data not found in the API response');
      }
    } catch (error) {
      // Check if it's a Firebase error
      if (error.code) {
        // Firebase error
        console.error('Firebase Error during login:', error.message);
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'User not found. Please check your email.');
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'Incorrect password. Please try again.');
        } else {
          Alert.alert('Error', 'Authentication failed. Please try again.');
        }
      } else if (error.response) {
        // API error
        console.error('API Error during login:', error.response.data);
        Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
      } else {
        // General error
        console.error('Unknown Error during login:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.webp')} style={styles.logo} />
      <Text style={styles.headerText}>
        Log-in now to Enjoy the latest Movies from Africa available to #RentFor2Days, #RentFor7Days or #OwnForLife!
      </Text>

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
        <Text style={styles.errorText}>Enter a valid Email</Text>
      </View>

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
        <Text style={styles.errorText}>Password should be more than 6 characters</Text>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerText}>Not a Member?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.footerText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 50,
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
  loginButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffcc00',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default LoginScreen;
