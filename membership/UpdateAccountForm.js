import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Platform, TouchableOpacity, Alert } from 'react-native';
import { Button, Card } from '@rneui/themed';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from 'react-native-phone-number-input';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword, updateEmail } from 'firebase/auth';


const validationSchema = Yup.object().shape({
    username: Yup.string().required('Name is required'),
    userEmail: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number is not valid')
        .required('Phone number is required')
        .min(10, 'Phone number is not valid'),
    birthday: Yup.date().required('Birthday is required'),
    password: Yup.string().required('Password is required'),
});

const UpdateAccountForm = () => {
    const navigation = useNavigation();
    const route = useRoute(); // Access the route params
    const { userId, userEmail, username, phoneNumber, birthday } = route.params; // Destructure parameters

    console.log("Route params incoming - userId:", userId, "userEmail:", userEmail, "fullName:", username, "phoneNumber:", phoneNumber, "birthday:", birthday);

    const initialBirthday = birthday ? new Date(birthday) : new Date(); 
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const handleSubmit = async (values) => {
        console.log('Submitting values:', values);
        try {
            // Get the current user from Firebase
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userId = user.uid; // Extract userId from Firebase
                
                // Re-authenticate user before updating email
                
                await signInWithEmailAndPassword(auth, userEmail, values.password);

                // Update email
                await updateEmail(user, values.userEmail);

                // Make an API call to your backend
                // Make sure birthday exists and is a valid date before formatting it
                let formattedBirthday = values.birthday && !isNaN(new Date(values.birthday).getTime())
                ? values.birthday.toISOString().split('T')[0]
                : null;

                if (!formattedBirthday) {
                    Alert.alert('Error', 'Invalid birthday date. Please select a valid date.');
                    return;
                }
                const response = await fetch('https://api.mymovies.africa/api/v1/users/login', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId, // Use the userId from Firebase
                        username: values.username,
                        email: values.userEmail,
                        phoneNumber: values.phoneNumber,
                        birthday: formattedBirthday,
                    }),
                });
                console.log('API response:', response);

                if (!response.ok) {
                    throw new Error('Failed to update account on API');
                }
                console.log('Navigating to Membership');
                Alert.alert(
                    "Success",
                    "Account updated successfully!",
                    [{
                        text: "OK",
                        onPress: () => {
                          console.log('Navigating with data:', {
                            userId,
                            userEmail: values.userEmail || userEmail,
                            username: values.username || username,
                            phoneNumber: values.phoneNumber || phoneNumber,
                            birthday: formattedBirthday,
                          });
                          navigation.navigate('Membership', {
                            userId,
                            userEmail: values.userEmail || userEmail,
                            username: values.username || username,
                            phoneNumber: values.phoneNumber || phoneNumber,
                            birthday: formattedBirthday,
                          });
                        }
                      }]
                );
            } else {
                Alert.alert('Error', 'User is not logged in.');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            Alert.alert('Error', 'Failed to update account. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Card containerStyle={styles.card}>
                <Formik
                    initialValues={{
                        username: username || '',
                        userEmail: userEmail || '',
                        phoneNumber: phoneNumber || '',
                        birthday: initialBirthday,
                        password: '',
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
                                onChangeText={handleChange('username')}
                                value={values.username}
                                placeholderTextColor="#999"
                            />
                            {errors.username && touched.username && <Text style={styles.errorText}>{errors.username}</Text>}

                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                onChangeText={handleChange('userEmail')}
                                value={values.userEmail}
                                keyboardType="email-address"
                                placeholderTextColor="#999"
                            />
                            {errors.userEmail && touched.userEmail && <Text style={styles.errorText}>{errors.userEmail}</Text>}

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
                                onChangeFormattedText={(text) => setFieldValue('phoneNumber', text)}
                                withDarkTheme
                                withShadow
                            />
                            {errors.phoneNumber && touched.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

                            <Text style={styles.inputLabel}>Birthday</Text>
                            <Button
                                title={values.birthday ? values.birthday.toDateString() : 'Select a date'}
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
                            {errors.birthday && touched.birthday && <Text style={styles.errorText}>{errors.birthday}</Text>}

                            <Text style={styles.inputLabel}>Confirm Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    onChangeText={handleChange('password')}
                                    value={values.password}
                                    secureTextEntry
                                    placeholderTextColor="#999"
                                />
                                {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

                            <Button
                                title="Update Account"
                                onPress={() => {
                                    console.log('Is form valid:', isValid);
                                    console.log('Values:', values); // Log values
                                    console.log('Errors:', errors); // Log errors
                                    handleSubmit();
                                }}
                                buttonStyle={styles.submitButton}
                                titleStyle={styles.submitButtonTitle}
                                type="outline"
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
