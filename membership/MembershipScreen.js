import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
//import { Button } from 'react-native-elements';

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

    })         




export default MembershipScreen;