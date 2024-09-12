import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import defaultPosterImage from '../images/default.jpg'; // Default image for failed poster loads

const { width } = Dimensions.get('window'); // Get device width for responsive design

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch movies data from API
  const fetchMovies = async () => {
    try {
      const response = await fetch('https://app.mymovies.africa/api/cache');
      const data = await response.json();

      // Check if data contains the expected content
      if (data && typeof data === 'object' && data.content) {
        const formattedGenres = formatGenres(data.content); // Process genres
        setGenres(formattedGenres);
        setBanners(data.banners || []); // Set banners if available
      } else {
        console.error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Function to format genres from movies data
  const formatGenres = (moviesData) => {
    if (!Array.isArray(moviesData)) {
      console.error('moviesData is not an array');
      return [];
    }

    const genresMap = {}; // Map to store genre details

    moviesData.forEach(movie => {
      try {
        const movieGenres = JSON.parse(movie.genres); // Parse genre JSON
        movieGenres.forEach(genre => {
          if (!genresMap[genre]) {
            genresMap[genre] = { id: genre, name: genre, movies: [] };
          }
          genresMap[genre].movies.push({
            id: movie.id,
            title: movie.title,
            poster: movie.poster || null,
          });
        });
      } catch (err) {
        console.error('Error parsing genres for movie:', movie.title, err);
      }
    });

    return Object.values(genresMap); // Return array of genres
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Display loading spinner if data is still being fetched
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <BannerSection banners={banners} />
      <GenreSection genres={genres} />
    </ScrollView>
  );
};

// Component for displaying banners
const BannerSection = ({ banners }) => (
  <FlatList
    data={banners}
    renderItem={({ item }) => <BannerItem banner={item} />}
    keyExtractor={item => item.ref}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
  />
);

// Component for individual banner item
const BannerItem = ({ banner }) => {
  const bannerUrl = `https://app.mymovies.africa/api/images/${banner.image}`;

  return (
    <View style={styles.bannerContainer}>
      <Image
        source={{ uri: bannerUrl }}
        style={styles.bannerImage}
        onError={() => console.log('Error loading banner image:', bannerUrl)}
        defaultSource={defaultPosterImage}
      />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{banner.title}</Text>
        <Text style={styles.bannerDescription}>{banner.description}</Text>
      </View>
    </View>
  );
};

// Component for displaying genres
const GenreSection = ({ genres }) => (
  <FlatList
    data={genres}
    renderItem={({ item }) => <GenreItem genre={item} />}
    keyExtractor={item => item.id}
    ListHeaderComponent={<Text style={styles.genreHeader}>Genres</Text>}
    showsVerticalScrollIndicator={false}
  />
);

// Component for individual genre item
const GenreItem = ({ genre }) => (
  <View style={styles.genreContainer}>
    <Text style={styles.genreTitle}>{genre.name}</Text>
    <FlatList
      data={genre.movies}
      renderItem={({ item }) => <MovieItem movie={item} />}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

// Component for individual movie item
const MovieItem = ({ movie }) => {
  const posterUrl = `https://app.mymovies.africa/api/images/${movie.poster}`;

  return (
    <View style={styles.movieContainer}>
      <Image
        source={{ uri: posterUrl }}
        style={styles.moviePoster}
        onError={() => console.log('Error loading poster image:', posterUrl)}
        defaultSource={defaultPosterImage}
      />
      <Text style={styles.movieTitle}>{movie.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    width: width,
    height: 200,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerDescription: {
    color: 'white',
    fontSize: 14,
  },
  genreHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  genreContainer: {
    marginVertical: 10,
  },
  genreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  movieContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  moviePoster: {
    width: 100,
    height: 150,
  },
  movieTitle: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default HomePage;
