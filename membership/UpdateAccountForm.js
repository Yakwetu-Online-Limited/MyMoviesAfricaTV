import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Platform, TouchableOpacity, Alert } from 'react-native';
import { Button, Card } from '@rneui/themed';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from 'react-native-phone-number-input';

const UpdateAccountForm = () => {
    // State to control the visibility of the date picker
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Function to handle form submission
    const handleSubmit = (values) => {
        console.log(values); // Replace with actual submit logic
        Alert.alert(
            "Success",
            "Account updated successfully!",
            [{ text: "OK" }]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Card containerStyle={styles.card}>
                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        phoneNumber: '',  
                        birthday: new Date()
                    }}
                    onSubmit={handleSubmit}
                >
                   {(props) => (
                       <View>
                           <Text style={styles.inputLabel}>Name</Text>
                           <TextInput
                               style={styles.input}
                               placeholder="Enter your name"
                               onChangeText={props.handleChange('name')}
                               value={props.values.name}
                               placeholderTextColor="#999"
                           />

                           <Text style={styles.inputLabel}>Email</Text>
                           <TextInput
                               style={styles.input}
                               placeholder="Enter your email"
                               onChangeText={props.handleChange('email')}
                               value={props.values.email}
                               keyboardType="email-address"
                               placeholderTextColor="#999"
                           />

                           <Text style={styles.inputLabel}>Phone Number</Text>
                           <PhoneInput
                               containerStyle={styles.phoneInputContainer}
                               textContainerStyle={styles.phoneInputTextContainer}
                               textInputStyle={styles.phoneInputText}
                               codeTextStyle={styles.phoneInputCodeText}
                               placeholder="Enter your phone number"
                               defaultValue={props.values.phoneNumber}
                               defaultCode="KE"
                               layout="first"
                               onChangeFormattedText={(text) => {
                                   props.setFieldValue('phoneNumber', text);
                               }}
                               withDarkTheme
                               withShadow
                           />

                           <Text style={styles.inputLabel}>Birthday</Text>
                           <Button
                               title={props.values.birthday.toDateString()}
                               onPress={() => setShowDatePicker(true)}
                               buttonStyle={styles.dateButton}
                           />
                           {showDatePicker && (
                               <DateTimePicker
                                   value={props.values.birthday}
                                   mode="date"
                                   display="default"
                                   onChange={(event, selectedDate) => {
                                       setShowDatePicker(Platform.OS === 'ios');
                                       if (selectedDate) {
                                           props.setFieldValue('birthday', selectedDate);
                                       }
                                   }}
                               />
                           )}

                           <Button
                               title="Update Account"
                               onPress={props.handleSubmit}
                               buttonStyle={styles.submitButton}
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
        marginHorizontal: 0,
        width: '100%',
    },
    inputLabel: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: '#ffffff',
    },
    phoneInputContainer: {
        width: '100%',
        height: 50,
        marginBottom: 15,
    },
    phoneInputTextContainer: {
        backgroundColor: '#000000',
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
        margin: 0.5,
    },
    phoneInputText: {
        color: '#ffffff',
    },
    phoneInputCodeText: {
        color: '#ffffff',
    },
    dateButton: {
        backgroundColor: '#333333',
        borderRadius: 5,
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: 'rgba(78, 116, 289, 1)', 
        borderRadius: 10,
        marginTop: 10,
    },
});

export default UpdateAccountForm;