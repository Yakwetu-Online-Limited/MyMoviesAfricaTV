import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import defaultPosterImage from "../images/default.jpg";

const { width } = Dimensions.get("window");

const Events = ({ currentEvents }) => {
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const handleEventPress = () => {
    setSelectedEvents(currentEvents);
    setEventModalVisible(true);
  };

  return (
    <>
      {currentEvents.length > 0 && (
        <TouchableOpacity
          style={styles.eventsButton}
          onPress={handleEventPress}
        >
          <Text style={styles.buttonText}>Events ({currentEvents.length})</Text>
        </TouchableOpacity>
      )}

      <EventDetailsModal
        visible={eventModalVisible}
        events={selectedEvents}
        onClose={() => setEventModalVisible(false)}
      />
    </>
  );
};

const EventDetailsModal = ({ visible, events, onClose }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  
  if (!events || events.length === 0) return null;
  
  const currentEvent = events[currentEventIndex];

  const goToPreviousEvent = () => {
    setCurrentEventIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : events.length - 1
    );
  };

  const goToNextEvent = () => {
    setCurrentEventIndex((prevIndex) => 
      prevIndex < events.length - 1 ? prevIndex + 1 : 0
    );
  };

  const truncateDescription = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>MyMovies.Africa™ Events</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.eventDetailsContainer}>
            <Image
              source={currentEvent.artwork || defaultPosterImage}
              style={styles.eventArtwork}
            />
            <Text style={styles.eventTitle}>{currentEvent.title}</Text>
            <Text style={styles.eventDescription}>
              {truncateDescription(currentEvent.description, 150)}
            </Text>
            <TouchableOpacity
              style={styles.eventLinkButton}
              onPress={() => {
                console.log("Event link pressed:", currentEvent.link);
              }}
            >
              <Text style={styles.eventLinkButtonText}>Learn More</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.navigationContainer}>
            <TouchableOpacity onPress={goToPreviousEvent} style={styles.navButton}>
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.eventCounter}>
              {currentEventIndex + 1} / {events.length}
            </Text>
            <TouchableOpacity onPress={goToNextEvent} style={styles.navButton}>
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  eventsButton: {
    backgroundColor: "#3E3E3E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
    borderColor: "#D648D7",
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
  eventDetailsContainer: {
    padding: 20,
  },
  eventArtwork: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: "#CCCCCC",
    marginBottom: 15,
    lineHeight: 24,
  },
  eventLinkButton: {
    backgroundColor: "#8E44AD",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  eventLinkButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventCounter: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Events;