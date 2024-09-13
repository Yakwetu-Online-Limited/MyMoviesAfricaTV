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
import defaultPosterImage from "../images/default.jpg";

// Get the device screen width to use for responsive design
const { width } = Dimensions.get("window");

const HomePage = () => {
  // State variables to store genres, banners, and loading status
  const [genres, setGenres] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayedGenres, setDisplayedGenres] = useState(5);

  useEffect(() => {
    fetchMovies();
  }, []);

  // Function to fetch movie data from the API
  const fetchMovies = async () => {
    try {
      const response = await fetch("https://app.mymovies.africa/api/cache");
      const data = await response.json();

      // Check if data is in the expected format and contains the "content" key
      if (data && typeof data === "object" && data.content) {
        // Format genres
        const formattedGenres = formatGenres(data.content);
        // update state with formatted genres
        setGenres(formattedGenres);
        // update state with banners
        setBanners(data.banners || []);
      } else {
        console.error('Unexpected API response format: Missing "content" key');
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    } finally {
      // Set loading state to false when data is fetched
      setLoading(false);
    }
  };

  // Function to format movies data into genres
  const formatGenres = (moviesData) => {
    if (!Array.isArray(moviesData)) {
      console.error("moviesData is not an array:", moviesData);
      return [];
    }
// object to map genres and their movies
    const genresMap = {};
// loop through movies data and add it to the appropriate genre
    moviesData.forEach((movie) => {
      try {
        const movieGenres = JSON.parse(movie.genres);
        movieGenres.forEach((genre) => {
          if (!genresMap[genre]) {
            // Initialize genre if not already added
            genresMap[genre] = { id: genre, name: genre, movies: [] };
          }
          genresMap[genre].movies.push({
            id: movie.id,
            title: movie.title,
            // Set default poster image if not available
            poster: movie.poster || null,
          });
        });
      } catch (err) {
        console.error("Error parsing genres for movie:", movie.title, err);
      }
    });
// return genres as an array
    return Object.values(genresMap);
  };


  // Function to load more genres
  const handleLoadMore = () => {
    // Increase the displayed genres by 5
    setDisplayedGenres((prevDisplayed) => prevDisplayed + 5);
  };


  // show loading spinner while fetching data
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Movie Catalog</Text>
      {/* Display buttons for "Request Screening" and "Events" */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Request Screening</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Events</Text>
        </TouchableOpacity>
      </View>

      {/* Display banner in horizontal scrolling */}
      <BannerSection banners={banners} />

       {/* Display genres and their movies, limit based on displayedGenres state */}
      {genres.slice(0, displayedGenres).map((genre) => (
        <GenreSection key={genre.id} name={genre.name} movies={genre.movies} />
      ))}

       {/* "Load More" button to load more genres if not all are displayed */}
      {displayedGenres < genres.length && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
        >
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

// Component to display banners at the top of the screen
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


// Component to display an individual banner item
const BannerItem = ({ banner }) => {
  const bannerUrl = `https://app.mymovies.africa/api/images/${banner.image}`;

  return (
    <View style={styles.bannerContainer}>
      <Image
      // display banner image
        source={{ uri: bannerUrl }}
        style={styles.bannerImage}
        // Set default poster image if not available
        defaultSource={defaultPosterImage}
      />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{banner.title}</Text>
        <Text style={styles.bannerDescription}>{banner.description}</Text>
      </View>
    </View>
  );
};


// Component to display an individual movie item
const MovieItem = ({ title, poster }) => {
  // State to handle image loading errors
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.movieItem}>
      <Image
        source={imageError || !poster ? 
          //  // Show default image if there's an error
          defaultPosterImage : { uri: poster }}
        style={styles.poster}
        onError={() => setImageError(true)}
      />
      {/* Display movie title */}
      <Text style={styles.movieTitle}>{title}</Text>
    </View>
  );
};



// Component to display movies in a genre section
const GenreSection = ({ name, movies }) => (
  <View style={styles.genreSection}>
    {/* Display genre name as a title */}
    <Text style={styles.genreTitle}>{name}</Text>
    <FlatList
      data={movies}
      // array of movies for the genre
      renderItem={({ item }) => (
        <MovieItem title={item.title} poster={item.poster} />
      )}
      // key for each movie
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  genreSection: {
    marginBottom: 20,
  },
  genreTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 10,
  },
  movieItem: {
    marginLeft: 16,
    width: 120,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  movieTitle: {
    marginTop: 5,
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
  },
  bannerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bannerDescription: {
    color: "white",
    fontSize: 14,
  },
  loadMoreButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: "center",
  },
  loadMoreText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HomePage;
