import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import defaultPosterImage from "../images/default.jpg";
import { getArtwork } from "../components/imageUtils";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Events = ({ currentEvents, genres }) => {
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newReleases, setNewReleases] = useState([]);

  const navigation = useNavigation();

  const route = useRoute();
  const { userId, userEmail, username, walletBalance = 500 } = route.params || {};
  console.log('Received route params Events:', route.params);  
  console.log('Events Received :- userId / walletBalance', userId, userEmail, username, walletBalance);

  useEffect(() => {
    if (genres && genres.length > 0) {
      const allMovies = genres.flatMap((genre) => genre.movies);
      const sortedMovies = allMovies.sort(
        (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
      );
      setNewReleases(sortedMovies.slice(0, 5));
    }
  }, [genres]);

  useFocusEffect(
    useCallback(() => {
      setEventModalVisible(false);
      setSelectedEvent(null);
    }, [])
  );

  const handleEventPress = () => {
    setEventModalVisible(true);
  };

  const handleLearnMore = (event) => {
    setSelectedEvent(event);
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
        events={currentEvents}
        onClose={() => setEventModalVisible(false)}
        onLearnMore={handleLearnMore}
      />

      {selectedEvent && (
        <EventLearnMoreModal
          visible={!!selectedEvent}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          newReleases={newReleases}
          userId={userId} // Pass userId here
          username={username} // Pass username here
        />
      )}
    </>
  );
};

const EventDetailsModal = ({ visible, events, onClose, onLearnMore }) => {
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
    return text.substr(0, maxLength) + "...";
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalBackground}>
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
            <View style={styles.spacer} />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.eventLinkButton}
              onPress={() => onLearnMore(currentEvent)}
            >
              <Text style={styles.eventLinkButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={goToPreviousEvent}
              style={styles.navButton}
            >
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
      </SafeAreaView>
    </Modal>
  );
};

const EventLearnMoreModal = ({ visible, event, onClose, newReleases, userId, username }) => {
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
            <Text style={styles.modalTitle}>{event.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.eventDetailsContainer}>
            <Image
              source={event.artwork || defaultPosterImage}
              style={styles.eventArtwork}
            />
            <Text style={styles.eventDescription}>{event.description}</Text>
            <Text style={styles.newReleasesTitle}>New Releases</Text>
            <View style={styles.newReleasesContainer}>
              <FlatList
                data={newReleases}
                renderItem={({ item }) => (
                  <MovieItem
                    movie={item}
                    userId={userId} // Pass userId here
                    username={username} // Pass username here
                    onPress={(movie) => console.log("Movie pressed:", movie)}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const MovieItem = ({ movie, userId, username }) => {
  const navigation = useNavigation();
  const posterUrl =
    movie.poster || (movie.ref ? getArtwork(movie.ref).portrait : null);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MovieDetail", { movieId: movie.id, userId: userId, username: username, walletBalance: 600 })}
    >
      <View style={styles.movieContainer}>
        <Image
          source={{ uri: posterUrl }}
          style={styles.moviePoster}
          defaultSource={defaultPosterImage}
        />
        <Text style={styles.movieTitle}>{movie.title}</Text>
      </View>
    </TouchableOpacity>
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
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
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
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    fontSize: SCREEN_WIDTH * 0.06,
    color: "#FFFFFF",
  },
  eventDetailsContainer: {
    padding: 20,
    flexGrow: 1,
  },
  eventArtwork: {
    width: "100%",
    height: SCREEN_WIDTH * 0.6,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: SCREEN_WIDTH * 0.055,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: "#CCCCCC",
    marginBottom: 15,
    lineHeight: SCREEN_WIDTH * 0.05,
  },
  eventLinkButton: {
    backgroundColor: "#8E44AD",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  eventLinkButtonText: {
    color: "#FFFFFF",
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: "bold",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: "bold",
  },
  eventCounter: {
    color: "#FFFFFF",
    fontSize: SCREEN_WIDTH * 0.04,
  },
  newReleasesTitle: {
    fontSize: SCREEN_WIDTH * 0.055,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 30,
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  newReleasesContainer: {
    marginBottom: 30,
  },
  movieContainer: {
    marginRight: 15,
    alignItems: "center",
    width: SCREEN_WIDTH * 0.325,
  },
  moviePoster: {
    width: SCREEN_WIDTH * 0.325,
    height: SCREEN_WIDTH * 0.4875,
    borderRadius: 10,
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: "#FFFFFF",
    textAlign: "center",
    width: SCREEN_WIDTH * 0.325,
    fontWeight: "600",
  },
  spacer: {
    height: SCREEN_HEIGHT * 0.05, // Add more space after the description
  },
  
});

export default Events;