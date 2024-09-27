import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Button, Card } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'https://api.mymovies.africa/api/v1/users';

const fetchUserData = async (userId) => {
    try {
        const response = await fetch(`${baseUrl}/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        return {
            id: userId,
            name: data.name,
            phoneNumber: data.phone_number,
            email: data.email
        };
    } catch (err) {
        console.log('Error fetching user data:', err);
        return null;
    }
};

const fetchWalletBalance = async (userId) => {
    try {
        const response = await fetch(`${baseUrl}/wallet`);
        if (!response.ok) {
            throw new Error('Failed to fetch wallet balance');
        }
        const data = await response.json();
        return data.balance;
    } catch (err) {
        console.log('Error fetching wallet balance:', err);
        return null;
    }
};

const MembershipScreen = () => {
    const [userData, setUserData] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    const data = await fetchUserData(storedUserId);
                    if (data) {
                        setUserData(data);
                        const balance = await fetchWalletBalance(storedUserId);
                        setWalletBalance(balance);
                    }
                }
            } catch (err) {
                console.log('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading) {
        return <Text style={styles.loadingText}>Loading user data...</Text>;
    }

    if (!userData) {
        return <Text style={styles.loadingText}>No user data available</Text>;
    }

    const navigation = useNavigation();

    const [topUpPressed, setTopUpPressed] = useState(false);
    const [updateAccountPressed, setUpdateAccountPressed] = useState(false);

    const handleTopUpPress = () => {
        setTopUpPressed(true);
        setTimeout(() => setTopUpPressed(false), 200);
    };

    const handleUpdateAccountPress = () => {
        setUpdateAccountPressed(true);
        setTimeout(() => setUpdateAccountPressed(false), 200);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Image 
                    source={require('../assets/mymovies-africa-logo.png')}
                    style={styles.logoImage}
                />
                <TouchableOpacity>
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
                            />
                        </View>
                        <Text style={styles.titleText}>Account</Text>
                    </Card.Title>

                    <Card.Divider/>

                    <View style={styles.cardContent}>
                        <Icon name="account-circle" size={140} color="rgba(172, 231, 223, 1)" />
                        <View style={styles.userInfo}>
                            <Text style={styles.text}>{userData.name}</Text>
                            <Text style={styles.text}>{userData.email}</Text> 
                            <Text style={styles.text}>{userData.phoneNumber}</Text>
                            <Text style={[styles.text, styles.boldUnderline]}>Wallet Balance</Text>
                            <Text style={styles.text}>KSH {walletBalance !== null ? walletBalance : 'Loading...'}</Text>
                        </View>

                        <Button
                            title="Top Up"
                            buttonStyle={[
                                styles.button,
                                topUpPressed && styles.buttonPressed
                            ]}
                            type="outline"
                            titleStyle={[
                                styles.buttonText,
                                topUpPressed && styles.buttonTextPressed
                            ]}
                            containerStyle={styles.buttonContainer}
                            onPress={handleTopUpPress}
                        />

                        <Button
                            title="Update Account"
                            buttonStyle={[
                                styles.button,
                                updateAccountPressed && styles.buttonPressed
                            ]}
                            type="outline"
                            titleStyle={[
                                styles.buttonText,
                                updateAccountPressed && styles.buttonTextPressed
                            ]}
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
    logoutIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 20,
    },
    cardContainer: {
        //flex: 1,
        //justifyContent: 'center',
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: '#190028',
        borderRadius: 10,
        padding: 20,
        
        marginVertical: 20,
        borderWidth: 0,// the white lining of the card
    },
    cardTitle: {
        flexDirection: 'row',
        //alignItems: 'center',
        textAlign: "left",
    },
    titleIcon: {
        paddingTop: 20,
        marginTop: 20, 
    },
    titleText: {
        color: 'white',
        //fontWeight: 'bold',
        fontSize: 16,
        marginTop: 15, 
        
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
        borderColor: '#9370DB',
        borderWidth: 2,
        borderRadius: 8,
    },
    buttonPressed: {
        backgroundColor: '#9370DB',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextPressed: {
        color: 'white',
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default MembershipScreen;