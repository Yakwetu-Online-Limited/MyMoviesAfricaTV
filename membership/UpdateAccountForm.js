import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Button, Card } from '@rneui/themed';
import { Formik } from 'formik';

const UpdateAccountForm = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Card containerStyle={styles.card}>
                <Formik
                    initialValues={{name: '', email: '', phoneNumber: '', birthday: '' }}
                    onSubmit={values => console.log(values)}
                >
                   {(props) => (
                       <View>
                           <TextInput
                               style={styles.input} 
                               placeholder="Enter your name"
                               onChangeText={props.handleChange('name')}
                               value={props.values.name}
                           />

                            <TextInput
                               style={styles.input} 
                               placeholder="Enter your email"
                               onChangeText={props.handleChange('email')}
                               value={props.values.email}
                           />

                            <TextInput
                               style={styles.input} 
                               placeholder="Enter your phone number"
                               onChangeText={props.handleChange('phoneNumber')}
                               value={props.values.phoneNumber}
                           />

                            <TextInput
                               style={styles.input} 
                               placeholder="Enter your birthday"
                               onChangeText={props.handleChange('birthday')}
                               value={props.values.birthday}
                           />

                            <Button
                                title="Update Account"
                                onPress={props.handleSubmit}
                            />
                       </View>
                   )} 
                </Formik>
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    card: {
        backgroundColor: '#000000',
        borderRadius: 10,
        padding: 20,
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default UpdateAccountForm;