import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Button, Card } from '@rneui/themed';

const MembershipScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* header section */}
            <View style={styles.header}>
                <View >
                    <Image 
                        source = {require('../assets/mymovies-africa-logo.png')}
                        style={styles.logoImage}
                    />
                </View>

                {/* logging out */}
                <View>
                    <TouchableOpacity>
                        <Image 
                            source={require('../assets/default.jpg')}
                            style={styles.logoutImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* container containing the body container */}
            <Card containerStyle={{backgroundColor: '#000000', margin: 10}}>
                <Card.Title style={{color: 'white'}}>
                    <Image source= {require('../assets/default.jpg')} style={{width: 50, height: 50, borderRdius: 50}}/>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Account</Text>
                </Card.Title>

                <Card.Divider/>

                <View containerStyle={{padding: 10}}>
                    <Card.Image source={require('../assets/default.jpg')} style ={styles.profileImage}/>
                    <View>
                        <Text style={{color: 'white'}}>Ryan Munge</Text>
                        <Text style={{color: 'white'}}>ryanmunge@gmail.com</Text> 
                        <Text style={{color: 'white'}}>+254701449264</Text>
                        <Text style={{color: 'white', fontWeight: 'bold', textDecorationLine: 'underline'}}>Wallet Balance</Text>
                        <Text style={{color: 'white'}}>KSH 0</Text>
                    </View>

                    <Button
                        title="Top Up"
                        buttonStyle={{
                            borderColor: 'rgba(78, 116, 289, 1)',
                        }}
                        type="outline"
                        titleStyle={{ color: 'rgba(78, 116, 289, 1)' }}
                        containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                        }}
                    />

                    <Button
                        title="Update Account"
                        buttonStyle={{
                            borderColor: 'rgba(78, 116, 289, 1)',
                        }}
                        type="outline"
                        titleStyle={{ color: 'rgba(78, 116, 289, 1)' }}
                        containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                        }}
                    />
                </View>

            </Card>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    logoImage: {
        width: 400,
        height: 60,
    },
    logoutImage: {
        width: 50,
        height: 50, 
    },
    profileImage: {
        borderRadius: 100,
    }


    })         




export default MembershipScreen;