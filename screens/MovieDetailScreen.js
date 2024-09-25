import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Provider as PaperProvider, Modal, Portal, Button, DefaultTheme } from 'react-native-paper';
import { Video } from 'expo-av';
import { API_URL } from "../store";
import { getArtwork } from "../utils/media";

const { width } = Dimensions.get("window");

// Define a custom theme (optional)
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#008080",
    accent: "#d648d7",
  },
};

const MovieDetailScreen = ({ route }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [insufficientBalanceModalVisible, setInsufficientBalanceModalVisible] = useState(false);
  const [rentalPrice, setRentalPrice] = useState(null);
  const [ownPrice, setOwnPrice] = useState(null);
  const [purchaseType, setPurchaseType] = useState(null);

  const { movieId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const movieData = data.content.find((movie) => movie.id === movieId);
        if (!movieData) {
          throw new Error("Movie not found");
        }
        setMovie(movieData);

        const rentalPriceData = JSON.parse(movieData.rental_price)?.kenya;
        const estPriceData = JSON.parse(movieData.est_price)?.kenya;

        setRentalPrice(rentalPriceData);
        setOwnPrice(estPriceData);

        const currentGenres =
          typeof movieData.genres === "string"
            ? JSON.parse(movieData.genres)
            : movieData.genres;
        const filteredMovies = data.content
          .filter(
            (m) =>
              m.id !== movieId &&
              JSON.parse(m.genres).some((genre) =>
                currentGenres.includes(genre)
              )
          )
          .slice(0, 8);
        setSimilarMovies(filteredMovies);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [movieId]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />
    );
  }

  if (error) {
    return (
      <Text style={styles.errorText}>Error fetching movie data: {error}</Text>
    );
  }

  const posterUrl = getArtwork(movie.ref).portrait;
  const isMovieFree = movie.genres && movie.genres.includes("Watch these Movies for FREE!");

  const handleRentOrOwn = (type) => {
    setPurchaseType(type);
    setInsufficientBalanceModalVisible(true);
  };

  const handlePayment = () => {
    setInsufficientBalanceModalVisible(false);
    navigation.navigate("Payment", {
      movieId: movie.id,
      purchaseType: purchaseType,
      price: purchaseType === "rent" ? rentalPrice : ownPrice,
    });
  };

  const HeaderSection = () => (
    <View style={styles.headerContainer}>
      <Image
        source={require("../images/mymovies-africa-logo.png")}
        style={styles.logo}
      />
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.requestScreeningButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Request Screening</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventsButton}>
          <Text style={styles.buttonText}>Events</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSimilarMovie = ({ item }) => {
    const similarPosterUrl = getArtwork(item.ref).portrait;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push("MovieDetailScreen", { movieId: item.id })
        }
      >
        <Image
          source={{ uri: similarPosterUrl }}
          style={styles.similarMoviePoster}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderSection />

      <View style={styles.posterContainer}>
        <Image source={{ uri: posterUrl }} style={styles.poster} />
      </View>

      {movie.trailer_url && (
        <Video
          source={{ uri: movie.trailer_url }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={false}
          isLooping={false}
          useNativeControls
          style={styles.video}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rentButton]}
          onPress={() => handleRentOrOwn("rent")}
        >
          <Text style={styles.buttonText}>
            {isMovieFree ? "Watch Now" : `Rent For 7 Days\nKSH. ${rentalPrice}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.ownButton]}
          onPress={() => handleRentOrOwn("own")}
        >
          <Text
            style={styles.buttonText}
          >{`Own for Life\nKSH. ${ownPrice}`}</Text>
        </TouchableOpacity>
      </View>

      <Portal>
        <Modal
          visible={insufficientBalanceModalVisible}
          onDismiss={() => setInsufficientBalanceModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Insufficient Account Balance</Text>
          <Text style={styles.modalMessage}>
            You do not have enough money in your wallet. Pay KES 119 to continue.
          </Text>
          <View style={styles.modalButtonContainer}>
            <Button
              mode="contained"
              onPress={() => setInsufficientBalanceModalVisible(false)}
              style={styles.modalButton}
            >
              Close
            </Button>
            <Button
              mode="contained"
              onPress={handlePayment}
              style={[styles.modalButton, styles.topUpButton]}
            >
              Top-up now
            </Button>
          </View>
        </Modal>
      </Portal>

      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.meta}>
        {movie.year} | {movie.duration} minutes | {movie.classification}
      </Text>
      <Text style={styles.cast}>{movie.tags}</Text>
      <Text style={styles.synopsisHeader}>Synopsis</Text>
      <Text style={styles.synopsis}>{movie.synopsis}</Text>

      <Text style={styles.title}>Watch More Like This</Text>

      <FlatList
        data={similarMovies}
        renderItem={renderSimilarMovie}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.similarMoviesContainer}
      />
    </ScrollView>
  );
};

const MovieDetailScreenWrapper = (props) => {
  return (
    <PaperProvider theme={theme}>
      <MovieDetailScreen {...props} />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 30,
    flex: 1,
    backgroundColor: "black",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  synopsis: {
    color: "white",
    fontSize: 16,
    marginVertical: 10,
  },
  synopsisHeader: {
    color: "#008080",
    fontWeight: "bold",
    marginTop: 15,
  },
  cast: {
    color: "white",
    marginTop: 10,
    backgroundColor: "grey",
    padding: 10,
  },
  meta: {
    color: "white",
    paddingTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    width: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  rentButton: {
    backgroundColor: "#008080",
  },
  ownButton: {
    backgroundColor: "#d648d7",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: "contain",
  },
  headerButtons: {
    flexDirection: "row",
  },
  requestScreeningButton: {
    backgroundColor: "#00CED1",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  eventsButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 8,
  },
  video: {
    width: width - 20,
    height: (width * 9) / 16,
    marginTop: 20,
  },
  similarMoviesContainer: {
    marginTop: 20,
  },
  similarMoviePoster: {
    width: 120,
    height: 180,
    marginRight: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
  },
  topUpButton: {
    backgroundColor: "#008080",
  },
});

export default MovieDetailScreenWrapper;
