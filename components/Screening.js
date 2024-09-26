import React, { useState, useCallback, useEffect } from "react";
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
  Alert,
  Linking,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useForm, Controller } from 'react-hook-form';
import { useUser } from "./UserContext";
import { calculatePrice } from "./priceCalculator";
const { width, height } = Dimensions.get("window");

// Helper function to build FormData
const buildFormData = (formObj) => {
  const formData = new FormData();
  Object.keys(formObj).forEach((key) => {
    formData.append(key, formObj[key]);
  });
  return formData;
};

const Screening = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useUser();
  console.log("User in Screening component:", user); // New log

  // const userContext = useUser();
  // const user = userContext?.user;
  const [requestDetails, setRequestDetails] = useState({
    organisation: "",
    contact_name: "",
    email: "",
    phone: "",
    screening_location: "",
    screening_date: "",
    movie_name: "",
    expected_audience: "",
    // user_id: "",
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
  const [errors, setErrors] = useState({});
  const [authToken, setAuthToken] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);


  // Highlight: Added movies array inside the component
  const movies = [
    {
      title: "WHERE THE RIVER DIVIDES (Dholuo)",
      ref: "c342b4d82ea46334",
      pricePerAttendee: 149,
    },
    {
      title: "ACT OF LOVE",
      ref: "0782fa09cf495e49",
      pricePerAttendee: 149,
    },
    {
      title: "WHERE THE RIVER DIVIDES (English)",
      ref: "ced5b16dcf329733",
      pricePerAttendee: 149,
    },
    {
      title: "WHERE THE RIVER DIVIDES (Kiswahili)",
      ref: "3175116ab51d1335",
      pricePerAttendee: 149,
    },
  ];
  const attendeesOptions = [
    "6-20 People",
    "21-100 People",
    "101-200 People",
    "201+ People",
  ];

  useEffect(() => {
    console.log("useEffect triggered, user:", user); // New log
    if (user) {
      //     setRequestDetails(prevDetails => {
      //       const newDetails = {
      //         ...prevDetails,
      //         organisation: user.organisation || "",
      //         contact_name: user.name || "",
      //         email: user.email || "",
      //         phone: user.phone || "",
      //       };
      //       console.log('Updated request details:', newDetails); // New log
      //       return newDetails;
      //     });
      //   }
      // }, [user]);
      setRequestDetails((prevDetails) => ({
        ...prevDetails,
        organisation: user.organisation || "",
        contact_name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // CHANGE: Add console.log to check user and requestDetails
  useEffect(() => {
    console.log("User:", user);
    console.log("Request Details:", requestDetails);
  }, [user, requestDetails]);

  const navigation = useNavigation();

  
  

  // Fetch auth token when component mounts
  useEffect(() => {
    const getAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) setAuthToken(token);
      } catch (error) {
        console.error("Error fetching auth token:", error);
      }
    };
    getAuthToken();
  }, []);

  useEffect(() => {
    const price = calculatePrice(
      requestDetails.movie_name,
      requestDetails.expected_audience
    );
    setTotalPrice(price);
  }, [requestDetails.movie_name, requestDetails.expected_audience]);

  // Form validation function
  const validateForm = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!requestDetails.organisation)
      newErrors.organisation = "Organization name is required";
    if (!requestDetails.contact_name)
      newErrors.contact_name = "Contact person name is required";
    if (!requestDetails.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(requestDetails.email))
      newErrors.email = "Invalid email format";
    if (!requestDetails.phone) newErrors.phone = "Phone number is required";
    if (!requestDetails.screening_location)
      newErrors.screening_location = "Location is required";
    if (!requestDetails.movie_name)
      newErrors.movie_name = "Movie selection is required";
    if (!requestDetails.expected_audience)
      newErrors.expected_audience = "Number of attendees is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [requestDetails]);

  // Handle form submission
  const handleRequestScreening = useCallback(async () => {
    if (!validateForm()) return;

    console.log("form data:", requestDetails);
    const formData = buildFormData(requestDetails);
    console.log("form data built successfully");

    try {
      console.log("making request");
      console.log("auth token", authToken);

      // Log important variables before making the request
      console.log("User ID:", user?.uid);
      console.log("Total Price:", totalPrice);

      const response = await fetch(
        "https://api.mymovies.africa/api/v1/bulkscreenings",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const result = await response.json();
      if (response.ok) {
        console.log("Submission successful:", result);
        setModalVisible(false);

        // Log important variables
        console.log("Screening ID:", result.screeningid);
        console.log("Reference:", result.ref);

        console.log("Before URL construction");

        // Construct the payment URL
      // Highlight: Updated payment URL construction
      if (user?.uid && result.screeningid && requestDetails.movie_name) {
        const selectedMovie = movies.find(movie => movie.ref === requestDetails.movie_name);
        const movieRef = selectedMovie ? selectedMovie.ref : '';

        const paymentUrl = `https://api.mymovies.africa/api/v1/payment/gate/${user.uid}/?amount=${totalPrice}&purchase_type=BULK OFFLINE SCREENING&screeningid=${result.screeningid}&ref=${movieRef}&source=pwa`;

        console.log("Payment URL:", paymentUrl);
        navigation.navigate("Payment", { paymentUrl });
      } else {
        console.error("Missing required data for payment URL");
        Alert.alert(
          "Error",
          "Unable to process payment due to missing information. Please try again."
        );
      }
    } else {
      console.error("Submission failed:", result);
      Alert.alert(
        "Submission Failed",
        "Please check your input and try again."
      );
    }
  } catch (error) {
    console.error("Error during submission:", error);
    Alert.alert(
      "Error",
      "An unexpected error occurred. "
    );
  }
}, [
  requestDetails,
  authToken,
  navigation,
  user?.uid,
  totalPrice,
  validateForm,
  movies,
]);


  // Handle input changes
  const handleInputChange = useCallback(
    (field, value) => {
      setRequestDetails((prev) => ({ ...prev, [field]: value }));
      // Clear the error for this field when the user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors]
  );

  // Handle map press
  const handleMapPress = useCallback(
    (event) => {
      const { coordinate } = event.nativeEvent;
      setMapRegion((prev) => ({
        ...prev,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }));
      handleInputChange(
        "location",
        `${coordinate.latitude}, ${coordinate.longitude}`
      );
    },
    [handleInputChange]
  );

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
              {/* Organization Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Organization Name <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={requestDetails.organisation}
                  onChangeText={(text) =>
                    handleInputChange("organisation", text)
                  }
                  placeholder="Enter organization name"
                  placeholderTextColor="#999"
                />
                {errors.organisation && (
                  <Text style={styles.errorText}>{errors.organisation}</Text>
                )}
              </View>

              {/* Contact Person Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Contact Person Name <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={requestDetails.contact_name}
                  onChangeText={(text) =>
                    handleInputChange("contact_name", text)
                  }
                  placeholder="Enter full name"
                  placeholderTextColor="#999"
                />
                {errors.contact_name && (
                  <Text style={styles.errorText}>{errors.contact_name}</Text>
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={requestDetails.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  placeholder="Enter email address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Phone Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Phone Number <Text style={styles.asterisk}>*</Text>
                </Text>
                <PhoneInput
                  defaultValue={requestDetails.phone}
                  defaultCode="KE"
                  onChangeFormattedText={(text) =>
                    handleInputChange("phone", text)
                  }
                  containerStyle={styles.phoneInputContainer}
                  textContainerStyle={styles.phoneTextContainer}
                  textInputStyle={styles.input}
                  codeTextStyle={styles.phoneCodeText}
                  textInputProps={{ placeholderTextColor: "#999" }}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              {/* Location Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Location of the Screening{" "}
                  <Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={styles.locationInputContainer}>
                  <TextInput
                    style={[styles.input, styles.locationInput]}
                    value={requestDetails.screening_location}
                    onChangeText={(text) =>
                      handleInputChange("screening_location", text)
                    }
                    placeholder="Enter screening location"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    onPress={() => setShowMap(true)}
                    style={styles.mapButton}
                  >
                    <Text style={styles.mapButtonText}>📍 Map</Text>
                  </TouchableOpacity>
                </View>
                {errors.screening_location && (
                  <Text style={styles.errorText}>
                    {errors.screening_location}
                  </Text>
                )}
              </View>

              {/* Movie Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Movie to Screen <Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={styles.selectContainer}>
                  <Picker
                    selectedValue={requestDetails.movie_name}
                    onValueChange={(movieRef) =>
                      handleInputChange("movie_name", movieRef)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Movie" value="" />
                    {movies.map((movie, index) => (
                      <Picker.Item
                        key={index}
                        label={`${movie.title}: KES ${movie.pricePerAttendee} per Attendee`}
                        value={movie.ref}
                      />
                    ))}
                  </Picker>
                </View>
                {errors.movie_name && (
                  <Text style={styles.errorText}>{errors.movie_name}</Text>
                )}
              </View>

              {/* Attendees Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Number of Attendees <Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={styles.selectContainer}>
                  <Picker
                    selectedValue={requestDetails.expected_audience}
                    onValueChange={(attendees) =>
                      handleInputChange("expected_audience", attendees)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Attendee Tier" value="" />
                    {attendeesOptions.map((option, index) => (
                      <Picker.Item key={index} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
                {errors.expected_audience && (
                  <Text style={styles.errorText}>
                    {errors.expected_audience}
                  </Text>
                )}
              </View>

              {/* Date Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Date of the Screening <Text style={styles.asterisk}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateButtonText}>
                    {requestDetails.date.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

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

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={requestDetails.date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) handleInputChange("date", selectedDate);
          }}
        />
      )}

      {/* Map Modal */}
      <Modal
        visible={showMap}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={mapRegion}
            onPress={handleMapPress}
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
    color: "#999",
  },
  // Match the phone input container styling with other input fields
  phoneInputContainer: {
    backgroundColor: "#2C2C2C",
    borderRadius: 5,
    padding: 0, // Ensure padding matches other input fields
    borderWidth: 0,
  },
  phoneTextContainer: {
    backgroundColor: "#2C2C2C", // Same background as input fields
    borderRadius: 5,
  },
  phoneTextInput: {
    color: "#999",
  },
  phoneCodeText: {
    color: "#999", // Set the country code color to whitish-gray
    fontSize: 16, // Match the font size with input fields
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
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
    overflow: "hidden",
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
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeMapButton: {
    position: "absolute",
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
