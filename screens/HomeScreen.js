import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import defaultPosterImage from "../images/default.jpg";
import { baseURL, mediaURL } from "../components/urlStore";
import { getArtwork } from "../components/imageUtils";
import { eventsData } from "../events";
import Events from "../components/Events";
import Screening from "../components/Screening";
import { useRoute } from '@react-navigation/native';
import { UserProvider } from '../components/UserContext';
import Header from '../components/Header';

const { width } = Dimensions.get("window");

const GENRES_PER_PAGE = 5;

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [visibleGenres, setVisibleGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentEvents, setCurrentEvents] = useState([]);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const route = useRoute();
  const { userId, userEmail, username, walletBalance = 500 } = route.params || {};

  console.log('Received route params in HomeScreen:', route.params);  
  

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${baseURL}api/cache`);
      const data = await response.json();

      if (data && typeof data === "object" && data.content) {
        const formattedGenres = formatGenres(data.content, data.genres);
        setGenres(formattedGenres);
        loadMoreGenres(formattedGenres);
        setBanners(data.banners || []);
      } else {
        console.error('Unexpected API response format: Missing "content" key');
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatGenres = (moviesData, genresList) => {
    const genresMap = {};

    genresList.forEach((genre) => {
      genresMap[genre] = { id: genre, name: genre, movies: [] };
    });

    moviesData.forEach((movie) => {
      try {
        const movieGenres = JSON.parse(movie.genres);
        movieGenres.forEach((genre) => {
          if (genresMap[genre]) {
            genresMap[genre].movies.push({
              id: movie.id,
              title: movie.title,
              poster: movie.poster || null,
              ref: movie.ref || null,
            });
          }
        });
      } catch (err) {
        console.error("Error parsing genres for movie:", movie.title, err);
      }
    });

    return Object.values(genresMap).filter((genre) => genre.movies.length > 0);
  };

  const loadMoreGenres = (allGenres = genres) => {
    const startIndex = (currentPage - 1) * GENRES_PER_PAGE;
    const endIndex = startIndex + GENRES_PER_PAGE;
    const newVisibleGenres = allGenres.slice(0, endIndex);
    setVisibleGenres(newVisibleGenres);
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (isFocused) {
      fetchMovies();
      updateCurrentEvents();
      setSelectedGenre(null);
    }
  }, [isFocused]);

  const updateCurrentEvents = () => {
    const now = new Date();
    const filteredEvents = eventsData.filter((event) => {
      const endDate = new Date(event.endDate);
      return endDate > now;
    });
    setCurrentEvents(filteredEvents);
  };



  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        
      </View>
    );
  }

  const handleGenreSelect = (genre) => {
    if (genre === 'All') {
      setSelectedGenre('All');
    } else {
      setSelectedGenre(prevGenre => prevGenre === genre ? null : genre);
    }
  };

  return (
    <UserProvider value={{ userId, userEmail, username, walletBalance }}>
    <ScrollView style={styles.container}>
      <HeaderSection
        genres={genres}
        onGenreSelect={handleGenreSelect}
        currentEvents={currentEvents}
        username={username}
        walletBalance={walletBalance}
      />
      <BannerSection banners={banners} />
      <GenreSection 
        genres={visibleGenres} 
        selectedGenre={selectedGenre}
        userId={userId}
        username={username}
        walletBalance={walletBalance}
      />
      {visibleGenres.length < genres.length && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => loadMoreGenres()}
        >
          <Text style={styles.loadMoreButtonText}>Load More Genres</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </UserProvider>
  );
};

const HeaderSection = ({
  genres,
  onGenreSelect,
  currentEvents,
  username,
  walletBalance,
}) => (
  <View style={styles.headerContainer}>
    <Header 
        username={username}
        walletBalance={walletBalance} 
      />
    <View style={styles.headerButtons}>
      <Screening />
      <Events currentEvents={currentEvents} genres={genres} />
      {/* <Events currentEvents={currentEvents} /> */}
    </View>
    <GenreButtonCarousel
      genres={genres}
      onGenreSelect={onGenreSelect}
    />
  </View>
);

const BannerSection = ({ banners }) => (
  <FlatList
    data={banners}
    renderItem={({ item }) => <BannerItem banner={item} />}
    keyExtractor={(item) => item.ref}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
  />
);

const BannerItem = ({ banner }) => {
  const bannerUrl = banner.ref ? getArtwork(banner.ref).portrait : null;

  return (
    <View style={styles.bannerContainer}>
      <Image
        source={{ uri: bannerUrl }}
        style={styles.bannerImage}
        onError={() => console.log("Error loading banner image:", bannerUrl)}
        defaultSource={defaultPosterImage}
      />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{banner.title}</Text>
      </View>
    </View>
  );
};

const GenreSection = ({ genres, selectedGenre, userId, username, walletBalance }) => {
  const filteredGenres = selectedGenre === 'All' || selectedGenre === null
    ? genres
    : genres.filter((genre) => genre.name === selectedGenre);

  return (
    <View>
      {filteredGenres.map((genre) => (
        <View key={genre.id} style={styles.genreSection}>
          <Text style={styles.genreTitle}>{genre.name}</Text>
          <FlatList
            data={genre.movies}
            renderItem={({ item }) => <MovieItem movie={item} userId={userId} username={username} walletBalance={walletBalance}/>}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ))}
    </View>
  );
};

const MovieItem = ({ movie, userId, username, walletBalance }) => {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  const posterUrl = movie.poster || (movie.ref ? getArtwork(movie.ref).portrait : null);

  // Updated handlePress function to correctly pass the movieId and userId
  const handlePress = () => {
    navigation.navigate("MovieDetail", { movieId: movie.id, userId: userId, username: username, walletBalance });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.movieContainer, isPressed && styles.movieContainerPressed]}
    >
      <View style={styles.movieContainer}>
        <Image
          source={{ uri: posterUrl }}
          style={[styles.moviePoster, isPressed && styles.moviePosterPressed]}
          onError={(error) => {
            console.log("Error loading poster image:", error.nativeEvent.error);
          }}
        />
        <Text style={styles.movieTitle}>{movie.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const GenreButtonCarousel = ({ genres, onGenreSelect, selectedGenre }) => {
  return (
    <FlatList
      data={[{ id: 'all', name: 'All' }, ...genres]}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.genreButton,
            (selectedGenre === item.name || (selectedGenre === 'All' && item.name === 'All')) && styles.selectedGenreButton
          ]}
          onPress={() => onGenreSelect(item.name)}
        >
          <Text style={styles.genreButtonText}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.genreCarousel}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#000000",
    marginTop: 35
  },
  logo: {
    resizeMode: "contain",
    alignSelf: "flex-start",
  },
  headerButtons: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: "#000000",
  },
  bannerContainer: {
    width: width,
    height: 200,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
  },
  bannerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  genreSection: {
    marginVertical: 15,
  },
  genreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 15,
    marginBottom: 5,
  },
  movieContainer: {
    marginHorizontal: 10,
    alignItems: "center",
    padding: 0,
  },
  movieContainerPressed: {
    transform: [{ scale: 0.95 }],
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  moviePosterPressed: {
    transform: [{ scale: 0.9 }],
  },
  movieTitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    width: 120,
  },
  loadMoreButton: {
    backgroundColor: "#3E3E3E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "center",
    marginVertical: 20,
  },
  loadMoreButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  genreButton: {
    backgroundColor: "#3E3E3E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    borderColor: "orange",
  },
  genreButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  genreButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  genreCarousel: {
    marginTop: 10,
    paddingLeft: 15,
  },
});

export default HomePage;