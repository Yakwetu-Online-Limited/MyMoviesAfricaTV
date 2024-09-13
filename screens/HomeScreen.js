import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import defaultPosterImage from '../images/default.jpg';

const { width } = Dimensions.get('window');

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('https://app.mymovies.africa/api/cache');
      const data = await response.json();

      if (data && typeof data === 'object' && data.content) {
        const formattedGenres = formatGenres(data.content);
        setGenres(formattedGenres);
        setBanners(data.banners || []);
      } else {
        console.error('Unexpected API response format: Missing "content" key');
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatGenres = (moviesData) => {
    if (!Array.isArray(moviesData)) {
      console.error('moviesData is not an array:', moviesData);
      return [];
    }

    const genresMap = {};

    moviesData.forEach(movie => {
      try {
        const movieGenres = JSON.parse(movie.genres);
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

    return Object.values(genresMap);
  };

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Request Screening</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Events</Text>
        </TouchableOpacity>
      </View>
      <BannerSection banners={banners} />
      {genres.slice(0, 5).map(genre => (
        <GenreSection key={genre.id} name={genre.name} movies={genre.movies} />
      ))}
    </ScrollView>
  );
};

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

const BannerItem = ({ banner }) => {
  const bannerUrl = `https://app.mymovies.africa/api/images/${banner.image}`;

  return (
    <View style={styles.bannerContainer}>
      <Image
        source={{ uri: bannerUrl }}
        style={styles.bannerImage}
        defaultSource={defaultPosterImage}
      />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{banner.title}</Text>
        <Text style={styles.bannerDescription}>{banner.description}</Text>
      </View>
    </View>
  );
};

const MovieItem = ({ title, poster }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.movieItem}>
      <Image
        source={imageError || !poster ? defaultPosterImage : { uri: poster }}
        style={styles.poster}
        onError={() => setImageError(true)}
      />
      <Text style={styles.movieTitle}>{title}</Text>
    </View>
  );
};

const GenreSection = ({ name, movies }) => (
  <View style={styles.genreSection}>
    <Text style={styles.genreTitle}>{name}</Text>
    <FlatList
      data={movies}
      renderItem={({ item }) => <MovieItem title={item.title} poster={item.poster} />}
      keyExtractor={item => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  genreSection: {
    marginBottom: 20,
  },
  genreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    textAlign: 'center',
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
});

export default HomePage;