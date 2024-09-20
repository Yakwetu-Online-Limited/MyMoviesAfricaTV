// RequestForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {Picker} from '@react-native-picker/picker';

const RequestForm = ({ onClose }) => {
  const [requestDetails, setRequestDetails] = useState({
    organizationName: "",
    contactPersonName: "",
    email: "",
    phone: "",
    location: "",
    movie: "",
    attendees: "",
    date: "",
  });

  const movies = [
    'WHERE THE RIVER DIVIDES (Dholuo): KES 149 per Attendee',
    'ACT OF LOVE : KES 149 Per Attendee',
    'WHERE THE RIVER DIVIDES (English): KES 149 per Attendee',
    'WHERE THE RIVER DIVIDES (Kiswahili): KES 149 per Attendee'
  ];

  const attendeesOptions = ['6-20 People', '21-100 People', '101-200 People', '201+ People'];

  const handleRequestScreening = () => {
    console.log("Screening request submitted:", requestDetails);
    onClose(); // Close the modal
  };

  return (

    <Modal
    visible={setModalVisible(true)}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.formContainer}>
      <Text style={styles.modalTitle}>Request Screening</Text>
      <ScrollView style={styles.scrollView}>
        <InputField
          label="Organization Name"
          value={requestDetails.organizationName}
          onChangeText={(text) =>
            setRequestDetails({ ...requestDetails, organizationName: text })
          }
          placeholder="Enter organization name"
          required
        />
        <InputField
          label="Contact Person Name"
          value={requestDetails.contactPersonName}
          onChangeText={(text) =>
            setRequestDetails({ ...requestDetails, contactPersonName: text })
          }
          placeholder="Enter full name"
          required
        />
        <InputField
          label="Email"
          value={requestDetails.email}
          onChangeText={(text) =>
            setRequestDetails({ ...requestDetails, email: text })
          }
          placeholder="Enter email address"
          keyboardType="email-address"
          required
        />
        <PhoneInputField
          value={requestDetails.phone}
          onChangeText={(text) =>
            setRequestDetails({ ...requestDetails, phone: text })
          }
        />
        <LocationInputField
          value={requestDetails.location}
          onChangeText={(text) =>
            setRequestDetails({ ...requestDetails, location: text })
          }
        />
        <SelectField
          label="Movie to Screen"
          value={requestDetails.movie}
          onSelect={(movie) => setRequestDetails({ ...requestDetails, movie })}
          placeholder="Select Movie"
          options={movies}
          required
        />
        <SelectField
          label="Number of Attendees"
          value={requestDetails.attendees}
          onSelect={(attendees) => setRequestDetails({ ...requestDetails, attendees })}
          placeholder="Select Attendee Tier"
          options={attendeesOptions}
          required
        />
        <InputField
          label="Date of the Screening"
          value={requestDetails.date}
          onChangeText={(text) =>
            setRequestDetails({ ...requestDetails, date: text })
          }
          placeholder="Select screening date"
          required
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleRequestScreening}
        >
          <Text style={styles.submitButtonText}>Request Screening</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </Modal>
  );
};

// Define the InputField, LocationInputField, PhoneInputField, and SelectField components
const InputField = ({ label, value, onChangeText, placeholder, required, keyboardType }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={styles.asterisk}>*</Text>}
    </Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
    />
  </View>
);

const LocationInputField = ({ value, onChangeText }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      Location of the Screening: <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="Enter screening location"
      placeholderTextColor="#999"
    />
  </View>
);

const PhoneInputField = ({ value, onChangeText }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      Phone Number <Text style={styles.asterisk}>*</Text>
    </Text>
    <PhoneInput
      defaultValue={value}
      defaultCode="KE"
      onChangeFormattedText={onChangeText}
      containerStyle={styles.phoneInputContainer}
      textContainerStyle={styles.phoneTextContainer}
      textInputStyle={styles.phoneTextInput}
    />
  </View>
);

const SelectField = ({ label, value, onSelect, placeholder, options }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <Picker
      selectedValue={value}
      onValueChange={(itemValue) => onSelect(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label={placeholder} value="" />
      {options.map((option, index) => (
        <Picker.Item key={index} label={option} value={option} />
      ))}
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
  },
  scrollView: {
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  asterisk: {
    color: 'red',
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderRadius: 5,
    padding: 10,
    color: '#FFFFFF',
  },
  phoneInputContainer: {
    backgroundColor: '#2C2C2C',
    borderRadius: 5,
    padding: 10,
  },
  phoneTextContainer: {
    backgroundColor: '#2C2C2C',
  },
  phoneTextInput: {
    color: '#FFFFFF',
  },
  picker: {
    backgroundColor: '#2C2C2C',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#8E44AD',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RequestForm;