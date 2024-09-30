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
    const { userId, userEmail, username, phoneNumber, birthday } = route.params; // Get name and email from params

    console.log("Route params - userId:", userId, "userEmail:", userEmail, "fullName:", username, "phoneNumber:", phoneNumber, "birthday:", birthday);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                console.log("User ID from params:", userId); // Log the value of userId from route params

                if (userId && userEmail && username) { // Ensure all necessary data is available
                    // Fetch user data, send the required parameters
                    console.log("Fetching user data...");
                    const userResponse = await axios.post(
                        'https://api.mymovies.africa/api/v1/users/login',
                        qs.stringify({
                            user_id: userId,
                            email: userEmail,
                            name: username
                        }),
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        }
                    );
                    console.log("User Response:", userResponse.data);

                    if (userResponse.data && userResponse.data.user) {
                        setUserData(userResponse.data.user);
                        console.log("User Data Set:", userResponse.data.user);
                    } else {
                        console.error('User data is missing in response:', userResponse.data);
                        Alert.alert("Error", "User data not found.");
                    }

                    // Fetch wallet balance
                    console.log("Fetching wallet balance...");
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
                    console.log("User ID, Email, or Full Name not available in route params");
                    Alert.alert("Error", "Missing required user details.");
                }
            } catch (error) {
                console.error('Error loading user data:', error.response ? error.response.data : error.message);
                Alert.alert("Error", "Could not load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId, userEmail, username]); // Ensure these values trigger the effect

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
                            <Text style={styles.text}>{username}</Text>
                            <Text style={styles.text}>{userEmail}</Text> 
                            <Text style={styles.text}>{phoneNumber}</Text>
                            <Text style={styles.text}>{birthday}</Text>
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
                            onPress={() => navigation.navigate('UpdateAccountForm', {
                                userId: userId,
                                username: username, // Use userData instead of user
                                userEmail:  userEmail,
                                phoneNumber: userData.phoneNumber,
                                birthday: userData.birthday,
                            })}
                        />
                    </View>
                </Card>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    logoImage: {
        width: 180,
        height: 36,
        resizeMode: 'contain',
    },
    logoutImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    card: {
        backgroundColor: '#000000',
        borderRadius: 10,
        padding: 20,
        marginVertical: 20,
    },
    cardTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    titleImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    titleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    },
    cardContent: {
        alignItems: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    text: {
        color: 'white',
        marginBottom: 8,
        fontSize: 16,
    },
    boldUnderline: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        width: '100%',
        marginVertical: 10,
    },
    button: {
        borderColor: 'rgba(78, 116, 289, 1)',
        borderWidth: 2,
        borderRadius: 8,
    },
    buttonPressed: {
        backgroundColor: 'rgba(78, 116, 289, 1)',
    },
    buttonText: {
        color: 'rgba(78, 116, 289, 1)',
        fontSize: 16,
    },
    buttonTextPressed: {
        color: 'white',
    },
});


export default MembershipScreen;
