import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const Screening = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [requestDetails, setRequestDetails] = useState({
    organizationName: "",
    contactPersonName: "",
    email: "",
    phone: "",
    location: "",
    movie: "",
    attendees: "",
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: -1.2921,
    longitude: 36.8219,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null);

  const movies = [
    'WHERE THE RIVER DIVIDES (Dholuo): KES 149 per Attendee',
    'ACT OF LOVE : KES 149 Per Attendee',
    'WHERE THE RIVER DIVIDES (English): KES 149 per Attendee',
    'WHERE THE RIVER DIVIDES (Kiswahili): KES 149 per Attendee'
  ];

  const attendeesOptions = ['6-20 People', '21-100 People', '101-200 People', '201+ People'];

  const handleRequestScreening = useCallback(() => {
    console.log("Screening request submitted:", requestDetails);
    setModalVisible(false);
  }, [requestDetails]);

  const handleInputChange = useCallback((field, value) => {
    setRequestDetails(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDateChange = useCallback((event, selectedDate) => {
    const currentDate = selectedDate || requestDetails.date;
    setShowDatePicker(Platform.OS === 'ios');
    handleInputChange('date', currentDate);
  }, [handleInputChange, requestDetails.date]);

  const handleMapPress = useCallback((event) => {
    const { coordinate } = event.nativeEvent;
    setMapRegion(prev => ({
      ...prev,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    }));
    handleInputChange('location', `${coordinate.latitude}, ${coordinate.longitude}`);
  }, [handleInputChange]);

  return (
    <>
      <TouchableOpacity
        style={styles.requestScreeningButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Request Screening</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Screening</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <InputField
                label="Organization Name"
                value={requestDetails.organizationName}
                onChangeText={(text) => handleInputChange('organizationName', text)}
                placeholder="Enter organization name"
                required
              />
              <InputField
                label="Contact Person Name"
                value={requestDetails.contactPersonName}
                onChangeText={(text) => handleInputChange('contactPersonName', text)}
                placeholder="Enter full name"
                required
              />
              <InputField
                label="Email"
                value={requestDetails.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter email address"
                keyboardType="email-address"
                required
              />
              <PhoneInputField
                value={requestDetails.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
              />
              <LocationInputField
                value={requestDetails.location}
                onChangeText={(text) => handleInputChange('location', text)}
                onPressMap={() => setShowMap(true)}
              />
              <SelectField
                label="Movie to Screen"
                value={requestDetails.movie}
                onSelect={(movie) => handleInputChange('movie', movie)}
                placeholder="Select Movie"
                options={movies}
                required
              />
              <SelectField
                label="Number of Attendees"
                value={requestDetails.attendees}
                onSelect={(attendees) => handleInputChange('attendees', attendees)}
                placeholder="Select Attendee Tier"
                options={attendeesOptions}
                required
              />
              <DateInputField
                label="Date of the Screening"
                value={requestDetails.date}
                onPress={() => setShowDatePicker(true)}
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
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={requestDetails.date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <Modal
        visible={showMap}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={mapRegion}
            onPress={handleMapPress}
            provider="google"
          >
            <Marker coordinate={mapRegion} />
          </MapView>
          <TouchableOpacity
            style={styles.closeMapButton}
            onPress={() => setShowMap(false)}
          >
            <Text style={styles.closeMapButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const InputField = React.memo(({ label, value, onChangeText, placeholder, required, keyboardType }) => (
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
));

const LocationInputField = React.memo(({ value, onChangeText, onPressMap }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      Location of the Screening: <Text style={styles.asterisk}>*</Text>
    </Text>
    <View style={styles.locationInputContainer}>
      <TextInput
        style={[styles.input, styles.locationInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter screening location"
        placeholderTextColor="#999"
      />
      <TouchableOpacity onPress={onPressMap} style={styles.mapButton}>
        <Text style={styles.mapButtonText}>📍 Map</Text>
      </TouchableOpacity>
    </View>
  </View>
));

const PhoneInputField = React.memo(({ value, onChangeText }) => (
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
));

const SelectField = React.memo(({ label, value, onSelect, placeholder, options, required }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={styles.asterisk}>*</Text>}
    </Text>
    <View style={styles.selectContainer}>
      <Picker
        selectedValue={value}
        onValueChange={onSelect}
        style={styles.picker}
      >
        <Picker.Item label={placeholder} value="" />
        {options.map((option, index) => (
          <Picker.Item key={index} label={option} value={option} />
        ))}
      </Picker>
    </View>
  </View>
));

const DateInputField = React.memo(({ label, value, onPress, required }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={styles.asterisk}>*</Text>}
    </Text>
    <TouchableOpacity onPress={onPress} style={styles.dateButton}>
      <Text style={styles.dateButtonText}>
        {value.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  </View>
));

const styles = StyleSheet.create({
  requestScreeningButton: {
    backgroundColor: "#3E3E3E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
    borderColor: "#008080",
    borderWidth: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  formContainer: {
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  asterisk: {
    color: "red",
  },
  input: {
    backgroundColor: "#2C2C2C",
    borderRadius: 5,
    padding: 10,
    color: "#FFFFFF",
  },
  phoneInputContainer: {
    backgroundColor: "#2C2C2C",
    borderRadius: 5,
  },
  phoneTextContainer: {
    backgroundColor: "#2C2C2C",
  },
  phoneTextInput: {
    color: "#FFFFFF",
  },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    borderRadius: 5,
  },
  locationInput: {
    flex: 1,
  },
  mapButton: {
    padding: 10,
    backgroundColor: "#3E3E3E",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  mapButtonText: {
    color: "#FFFFFF",
  },
  selectContainer: {
    backgroundColor: "#2C2C2C",
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    color: "#FFFFFF",
  },
  dateButton: {
    backgroundColor: "#2C2C2C",
    borderRadius: 5,
    padding: 10,
  },
  dateButtonText: {
    color: "#FFFFFF",
  },
  submitButton: {
    backgroundColor: "#8E44AD",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeMapButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: "#8E44AD",
    borderRadius: 5,
    padding: 15,
  },
  closeMapButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default React.memo(Screening);