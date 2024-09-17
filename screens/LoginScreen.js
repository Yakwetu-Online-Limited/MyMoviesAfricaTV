import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const username = user.displayName || 'Guest';

        Alert.alert('Success', 'Logged in successfully');
        navigation.navigate('Collection', { username: username });	
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
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
    borderRadius: 5,
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