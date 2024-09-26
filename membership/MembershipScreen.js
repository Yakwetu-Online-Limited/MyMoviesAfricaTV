import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Button, Card } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const MembershipScreen = () => {
    const navigation = useNavigation();

    // Add state for button presses
    const [topUpPressed, setTopUpPressed] = useState(false);
    const [updateAccountPressed, setUpdateAccountPressed] = useState(false);

    // : Create handler functions for button presses
    const handleTopUpPress = () => {
        setTopUpPressed(true);
        // Simulate button press duration
        setTimeout(() => setTopUpPressed(false), 200);
    };

    const handleUpdateAccountPress = ({ navigation }) => {
        setUpdateAccountPressed(true);
        // Simulate button press duration
        setTimeout(() => setUpdateAccountPressed(false), 200);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* header section */}
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

            {/* Card container */}
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
                            <Text style={styles.text}>Ryan Munge</Text>
                            <Text style={styles.text}>ryanmunge@gmail.com</Text> 
                            <Text style={styles.text}>+254701449264</Text>
                            <Text style={[styles.text, styles.boldUnderline]}>Wallet Balance</Text>
                            <Text style={styles.text}>KSH 0</Text>
                        </View>

                        {/* Step 3: Update Button components with onPress handlers and dynamic styles */}
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
});

export default MembershipScreen;