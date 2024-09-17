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
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import defaultPosterImage from '../images/default.jpg';
import { baseURL, mediaURL } from '../components/urlStore';
import { getArtwork } from '../components/imageUtils';

const { width } = Dimensions.get('window');

const GENRES_PER_PAGE = 5;

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [visibleGenres, setVisibleGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestDetails, setRequestDetails] = useState({
    organizationName: '',
    contactPersonName: '',
    email: '',
    phone: '',
    location: '',
    movie: '',
    attendees: '',
    date: '',
  });

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${baseURL}api/cache`);
      const data = await response.json();

      if (data && typeof data === 'object' && data.content) {
        // Pass both movie data and genres list to formatGenres
        const formattedGenres = formatGenres(data.content, data.genres);
        setGenres(formattedGenres);
        loadMoreGenres(formattedGenres);
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

  // const formatGenres = (moviesData) => {
  //   if (!Array.isArray(moviesData)) {
  //     // console.error('moviesData is not an array:', moviesData);
  //     return [];
  //   }

  //   const genresMap = {};

  //   moviesData.forEach(movie => {
  //     try {
  //       const movieGenres = JSON.parse(movie.genres);
  //       movieGenres.forEach(genre => {
  //         if (!genresMap[genre]) {
  //           genresMap[genre] = { id: genre, name: genre, movies: [] };
  //         }
  //         genresMap[genre].movies.push({
  //           id: movie.id,
  //           title: movie.title,
  //           poster: movie.poster || null,
  //           ref: movie.ref || null,
  //         });
  //       });
  //     } catch (err) {
  //       console.error('Error parsing genres for movie:', movie.title, err);
  //     }
  //   });

  //   return Object.values(genresMap);
  // };

  // CHANGE: Optimized formatGenres function
  const formatGenres = (moviesData, genresList) => {
    const genresMap = {};

    // Initialize genres from the API-provided list
    genresList.forEach(genre => {
      genresMap[genre] = { id: genre, name: genre, movies: [] };
    });

    moviesData.forEach(movie => {
      try {
        const movieGenres = JSON.parse(movie.genres);
        movieGenres.forEach(genre => {
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
        console.error('Error parsing genres for movie:', movie.title, err);
      }
    });

    // Filter out genres with no movies
    return Object.values(genresMap).filter(genre => genre.movies.length > 0);
  };

  const loadMoreGenres = (allGenres = genres) => {
    const startIndex = (currentPage - 1) * GENRES_PER_PAGE;
    const endIndex = startIndex + GENRES_PER_PAGE;
    const newVisibleGenres = allGenres.slice(0, endIndex);
    setVisibleGenres(newVisibleGenres);
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleRequestScreening = () => {
    console.log('Screening request submitted:', requestDetails);
    setModalVisible(false);
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
      {/*  Pass genres to HeaderSection for GenreButtonCarousel */}
      <HeaderSection setModalVisible={setModalVisible} genres={genres} />
      <BannerSection banners={banners} />
      <GenreSection genres={visibleGenres} />
      {visibleGenres.length < genres.length && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={() => loadMoreGenres()}>
          <Text style={styles.loadMoreButtonText}>Load More Genres</Text>
        </TouchableOpacity>
      )}

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
                onChangeText={(text) => setRequestDetails({ ...requestDetails, organizationName: text })}
                placeholder="Enter organization name"
                required
              />
              <InputField
                label="Contact Person Name"
                value={requestDetails.contactPersonName}
                onChangeText={(text) => setRequestDetails({ ...requestDetails, contactPersonName: text })}
                placeholder="Enter full name"
                required
              />
              <InputField
                label="Email"
                value={requestDetails.email}
                onChangeText={(text) => setRequestDetails({ ...requestDetails, email: text })}
                placeholder="Enter email address"
                keyboardType="email-address"
                required
              />
              <PhoneInputField
                value={requestDetails.phone}
                onChangeText={(text) => setRequestDetails({ ...requestDetails, phone: text })}
              />
              <LocationInputField
                value={requestDetails.location}
                onChangeText={(text) => setRequestDetails({ ...requestDetails, location: text })}
              />
              <SelectField
                label="Movie to Screen"
                value={requestDetails.movie}
                onPress={() => {/* Implement movie selection */}}
                placeholder="Select Movie"
                required
              />
              <SelectField
                label="Number of Attendees"
                value={requestDetails.attendees}
                onPress={() => {/* Implement attendee selection */}}
                placeholder="Select Attendee Tier"
              />
              <InputField
                label="Date of the Screening"
                value={requestDetails.date}
                onChangeText={(text) => setRequestDetails({ ...requestDetails, date: text })}
                placeholder="Select screening date"
                required
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleRequestScreening}>
                <Text style={styles.submitButtonText}>Request Screening</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// CHANGE: Updated HeaderSection to include GenreButtonCarousel
const HeaderSection = ({ setModalVisible, genres }) => (
  <View style={styles.headerContainer}>
    <Image source={require('../images/mymovies-africa-logo.png')} style={styles.logo} />
    <View style={styles.headerButtons}>
      <TouchableOpacity style={styles.requestScreeningButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Request Screening</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.eventsButton}>
        <Text style={styles.buttonText}>Events</Text>
      </TouchableOpacity>
    </View>
    {/*  Added GenreButtonCarousel */}
    <GenreButtonCarousel genres={genres} />
  </View>
);

// GenreButtonCarousel Component
const GenreButtonCarousel = ({ genres }) => {
  return (
    <FlatList
      data={genres}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.genreButton}>
          <Text style={styles.buttonText}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.genreCarousel}
    />
  );
};



const BannerSection = ({ banners }) => (
  // console.log('Banners:', banners),
  // Debug: Log the banners data
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
  // Check if the 'ref' is available, if not fallback to a default URL
  const bannerUrl = banner.ref ? getArtwork(banner.ref).portrait : null;

  return (
    <View style={styles.bannerContainer}>
      <Image
        source={{ uri: bannerUrl }}
        style={styles.bannerImage}
        onError={() => console.log('Error loading banner image:', bannerUrl)}  // Logs error
        defaultSource={defaultPosterImage}  // Fallback image
      />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{banner.title}</Text>
      </View>
    </View>
  );
};


const GenreSection = ({ genres }) => (
  <View>
    {genres.map((genre) => (
      <View key={genre.id} style={styles.genreSection}>
        <Text style={styles.genreTitle}>{genre.name}</Text>
        <FlatList
          data={genre.movies}
          renderItem={({ item }) => <MovieItem movie={item} />}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    ))}
  </View>
);

const MovieItem = ({ movie }) => {
  // Log the movie data
  // console.log('Movie Data:', movie);

  // Get the URL for the poster
  // const posterUrl = getArtwork(movie.poster).portrait;

  const posterUrl = movie.poster || (movie.ref ? getArtwork(movie.ref).portrait : null);


  

  // Log the constructed URL
  // console.log('Movie Poster URL:', posterUrl);

  return (
    <View style={styles.movieContainer}>
      <Image
        source={{ uri: posterUrl }}
        style={styles.moviePoster}
        onError={(error) => {
          console.log('Error loading poster image:', error.nativeEvent.error);
        }}
      />
      <Text style={styles.movieTitle}>{movie.title}</Text>
    </View>
  );
};


const InputField = ({ label, value, onChangeText, placeholder, required, errorMessage, keyboardType }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}{required && <Text style={styles.asterisk}>*</Text>}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
    />
    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
  </View>
);

const PhoneInputField = ({ value, onChangeText }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Phone Number:</Text>
    <View style={styles.phoneInputContainer}>
      <Text style={styles.countryCode}>🇰🇪 +254</Text>
      <TextInput
        style={[styles.input, styles.phoneInput]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
        placeholderTextColor="#999"
      />
    </View>
  </View>
);

const LocationInputField = ({ value, onChangeText }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Location of the Screening: <Text style={styles.asterisk}>*</Text></Text>
    <View style={styles.locationInputContainer}>
      <TextInput
        style={[styles.input, styles.locationInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter screening location"
        placeholderTextColor="#999"
      />
      <Text style={styles.locationIcon}>📍</Text>
    </View>
  </View>
);

const SelectField = ({ label, value, onPress, placeholder, required }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}{required && <Text style={styles.asterisk}>*</Text>}</Text>
    <TouchableOpacity style={styles.selectContainer} onPress={onPress}>
      <Text style={styles.selectText}>{value || placeholder}</Text>
      <Text style={styles.selectIcon}>▼</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#000000',
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'flex-start'
  },
  headerButtons: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#000000',
  },
  requestScreeningButton: {
    backgroundColor: '#3E3E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
    borderColor: '#008080',
    borderWidth: 2,
  },
  eventsButton: {
    backgroundColor: '#3E3E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
    borderColor: '#D648D7',
    borderWidth: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  genreSection: {
    marginVertical: 15,
  },
  genreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 15,
    marginBottom: 5,
  },
  movieContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  movieTitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    width: 120,
  },
  loadMoreButton: {
    backgroundColor: '#3E3E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 20,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  formContainer: {
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 5,
  },
  countryCode: {
    color: '#FFFFFF',
    marginRight: 10,
    paddingLeft: 10,
  },
  phoneInput: {
    flex: 1,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 5,
  },
  locationInput: {
    flex: 1,
  },
  locationIcon: {
    marginRight: 10,
    fontSize: 20,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 5,
    padding: 10,
  },
  selectText: {
    color: '#999',
  },
  selectIcon: {
    color: '#999',
    fontSize: 16,
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
  genreButton: {
    backgroundColor: '#3E3E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  genreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  genreCarousel: {
    marginTop: 10,
    paddingLeft: 15,
  }
});

export default HomePage;