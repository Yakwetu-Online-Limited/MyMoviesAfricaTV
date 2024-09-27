import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Platform, TouchableOpacity, Alert } from 'react-native';
import { Button, Card } from '@rneui/themed';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from 'react-native-phone-number-input';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number is not valid')
    .required('Phone number is required')
    .min(10, 'Phone number is not valid'),
  birthday: Yup.date().required('Birthday is required'),
});

const UpdateAccountForm = () => {
    const navigation = useNavigation();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSubmit = (values) => {
        console.log(values);
        Alert.alert(
            "Success",
            "Account updated successfully!",
            [{ text: "OK", onPress: () => navigation.navigate('MembershipScreen') }]
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
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                   {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, isValid }) => (
                       <View>
                           <Text style={styles.inputLabel}>Name</Text>
                           <TextInput
                               style={styles.input}
                               placeholder="Enter your name"
                               onChangeText={handleChange('name')}
                               value={values.name}
                               placeholderTextColor="#999"
                           />
                           {errors.name && (
                               <Text style={styles.errorText}>{errors.name}</Text>
                           )}

                           <Text style={styles.inputLabel}>Email</Text>
                           <TextInput
                               style={styles.input}
                               placeholder="Enter your email"
                               onChangeText={handleChange('email')}
                               value={values.email}
                               keyboardType="email-address"
                               placeholderTextColor="#999"
                           />
                           {errors.email && (
                               <Text style={styles.errorText}>{errors.email}</Text>
                           )}

                           <Text style={styles.inputLabel}>Phone Number</Text>
                           <PhoneInput
                               containerStyle={styles.phoneInputContainer}
                               textContainerStyle={styles.phoneInputTextContainer}
                               textInputStyle={styles.phoneInputText}
                               codeTextStyle={styles.phoneInputCodeText}
                               placeholder="Enter your phone number"
                               defaultValue={values.phoneNumber}
                               defaultCode="KE"
                               layout="first"
                               onChangeFormattedText={(text) => {
                                   setFieldValue('phoneNumber', text);
                               }}
                               withDarkTheme
                               withShadow
                           />
                           {errors.phoneNumber && (
                               <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                           )}

                           <Text style={styles.inputLabel}>Birthday</Text>
                           <Button
                               title={values.birthday.toDateString()}
                               onPress={() => setShowDatePicker(true)}
                               buttonStyle={styles.dateButton}
                           />
                           {showDatePicker && (
                               <DateTimePicker
                                   value={values.birthday}
                                   mode="date"
                                   display="default"
                                   onChange={(event, selectedDate) => {
                                       setShowDatePicker(Platform.OS === 'ios');
                                       if (selectedDate) {
                                           setFieldValue('birthday', selectedDate);
                                       }
                                   }}
                               />
                           )}
                           { errors.birthday && (
                               <Text style={styles.errorText}>{errors.birthday}</Text>
                           )}

                           <Button
                               title="Update Account"
                               onPress={handleSubmit}
                               buttonStyle={styles.submitButton}
                               titleStyle={styles.submitButtonTitle}
                               type="outline"
                               disabled={!isValid}
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
        marginBottom: 5,
        color: '#ffffff',
        backgroundColor: '#1a1a1a', 
    },
    phoneInputContainer: {
        width: '100%',
        height: 50,
        marginBottom: 5,
        backgroundColor: '#1a1a1a', 
    },
    phoneInputTextContainer: {
        backgroundColor: '#1a1a1a', 
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
    },
    phoneInputText: {
        color: '#ffffff',
    },
    phoneInputCodeText: {
        color: '#ffffff',
    },
    dateButton: {
        backgroundColor: '#1a1a1a', 
        borderRadius: 5,
        marginBottom: 5,
    },
    submitButton: {
        borderColor: '#9370DB',
        borderRadius: 10,
        marginTop: 20,
    },
    submitButtonTitle: {
        color: '#9370DB',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
        marginBottom: 10,
        fontWeight: 'bold',
    },
});

export default UpdateAccountForm;