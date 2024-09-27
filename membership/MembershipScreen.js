import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import { Button, Card } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Cookies from 'js-cookie'; // Import JS Cookies
import axios from 'axios';
import qs from 'qs';

const MembershipScreen = () => {
    const [userData, setUserData] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                console.log("User ID from params:", userId); // Log the value of userId from route params

                if (userId) {
                    // Fetch user data
                    const userResponse = await axios.get('https://api.mymovies.africa/api/v1/users/login');
                    console.log("User Response:", userResponse.data);
                    if (userResponse.data && userResponse.data.user) {
                        setUserData(userResponse.data.user);
                    } else {
                        console.error('User data is missing in response:', userResponse.data);
                        Alert.alert("Error", "User data not found.");
                    }

                    // Fetch wallet balance
                    const balanceResponse = await axios.post('https://api.mymovies.africa/api/v1/users/wallet', 
                        qs.stringify({ user_id: userId }), 
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        }
                    );
                    setWalletBalance(balanceResponse.data.balance);
                } else {
                    console.log("User ID not available in route params"); 
                }
            } catch (error) {
                console.error('Error loading user data:', error.response ? error.response.data : error.message);
                Alert.alert("Error", "Could not load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    const handleLogout = () => {
        Cookies.remove('userId'); // Clear the userId cookie
        navigation.navigate('Login'); // Navigate to login screen
    };

    if (isLoading) {
        return <Text style={styles.loadingText}>Loading user data...</Text>;
    }

    if (!userData) {
        return <Text style={styles.loadingText}>No user data available</Text>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Image 
                    source={require('../assets/mymovies-africa-logo.png')}
                    style={styles.logoImage}
                />
                <TouchableOpacity onPress={handleLogout}>
                    <Icon 
                        name="logout" 
                        size={30} 
                        color="#fff" 
                        style={styles.logoutIcon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
                <Card containerStyle={styles.card}>
                    <Card.Title style={styles.cardTitle}>
                        <View style={{ marginTop: 20 }}>
                            <Icon 
                                name="person-outline" 
                                size={22} 
                                color="white"
                                onPress={() => navigation.navigate('Login')} 
                            />
                        </View>
                        <Text style={styles.titleText}>Account</Text>
                    </Card.Title>

                    <Card.Divider/>

                    <View style={styles.cardContent}>
                        <Icon name="account-circle" size={140} color="rgba(172, 231, 223, 1)" />
                        <View style={styles.userInfo}>
                            <Text style={styles.text}>{userData.fullname}</Text>
                            <Text style={styles.text}>{userData.email}</Text> 
                            <Text style={styles.text}>{userData.phone}</Text>
                            <Text style={styles.text}>{userData.birthday}</Text>
                            <Text style={styles.text}>Locale: {userData.locale}</Text>
                            <Text style={[styles.text, styles.boldUnderline]}>Wallet Balance</Text>
                            <Text style={styles.text}>KSH {walletBalance !== null ? walletBalance : 'Loading...'}</Text>
                        </View>

                        <Button
                            title="Top Up"
                            buttonStyle={styles.button}
                            type="outline"
                            containerStyle={styles.buttonContainer}
                            onPress={() => {}}
                        />

                        <Button
                            title="Update Account"
                            buttonStyle={styles.button}
                            type="outline"
                            containerStyle={styles.buttonContainer}
                            onPress={() => navigation.navigate('UpdateAccountForm')}
                        />
                    </View>
                </Card>
            </View>
        </SafeAreaView>
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

export default MembershipScreen;
