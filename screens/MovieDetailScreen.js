import React, { useState, useEffect }from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image} from 'react-native';
import { API_URL, paymentUrl } from '../store';
import { getArtwork } from '../utils/media';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation,  } from '@react-navigation/native';
import axios from 'axios';
import { Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import { Button, Modal, Portal } from 'react-native-paper';


const { width } = Dimensions.get('window');

const MovieDetailScreen = ({route}) => {
    // set useStates
    
    const [ movie, setMovie ] = useState(null);
    const [ loading, setLoading ]= useState(true);
    const [ error, setError ] = useState(null);
    const [ similarMovies, setSimilarMovies ] = useState([]);
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ rentalPrice, setRentalPrice ] = useState(null);
    const [ ownPrice, setOwnPrice ] = useState (null);
    const [ purchaseType, setPurchaseType ] = useState (null);
    const [trailerUrl, setTrailerUrl ] = useState (null);
    const [url, setUrl] = useState(null);
   
    const { movieId, userId, walletBalance: initialWalletBalance  } = route.params;
    const [walletBalance, setWalletBalance] = useState(initialWalletBalance);
    console.log("Movie ID received in MovieDetailScreen: ", movieId);
    console.log("MovieDetailScreen - userId:", userId);
    console.log("MovieDetailScreen - walletBalance:", walletBalance);
    const navigation = useNavigation();

    //const movieId = '184'; // Static ID for testing

    // Fetch the movie data from the API
    useEffect(() => {
        //Function to fetch movie data from the api
        if (!userId || !movieId) {
          console.error('Missing parameters for MovieDetailScreen');
          return;
        }
        const fetchMovieData = async() => {
            try {
                const response = await fetch (API_URL);
                const data = await response.json();
                const movieData = data.content.find(movie => movie.id === movieId);
                if (!movieData) {

                    throw new Error ('Movie not found');

                }
                setMovie(movieData);

                // Set rental and purchase prices from the API response
                const rentalPriceData = JSON.parse(movieData.rental_price)?.kenya;
                const estPriceData = JSON.parse(movieData.est_price)?.kenya;

                // Set the rental and own prices
                setRentalPrice(rentalPriceData);
                setOwnPrice(estPriceData);

                //set trailer Url if available
                if (movieData.trailer_url) {
                  setTrailerUrl(movieData.trailer_url) // store the trailer url provided by the api

                }

                //Filter similar movies
                const currentGenres = JSON.parse(movieData.genres);// convert genres from string to Array
                const filteredMovies = data.content.filter(m =>
                  // EXclude the current movie

                  m.id !== movieId && 
                  JSON.parse(m.genres).some (genre => currentGenres.includes(genre))
                  //Limit to 8 movies.

                ).slice(0,8);
                setSimilarMovies(filteredMovies);

                setLoading(false);
            } catch(error) {
                setError(error.message); 
                setLoading(false);
            }
        };
        fetchMovieData();
    }, [movieId]);

    

    // Render loading state.
    if (loading) {
        return <ActivityIndicator size = "large" color="#0000ff" alignItems="center" />
    }
    // Render error state
    if (error) {
        return <Text>Error fetching movie data: {error}</Text>
    }

    // Fetch the movie poster using getArtwork
    const posterUrl = getArtwork(movie.ref).portrait;

    // Construct the full YouTube URL for the trailer
    const videoUrl = `https://www.youtube.com/embed/${trailerUrl}`;//Embed URL format from youtube


    // Check if the movie is free
    const isMovieFree = movie.genres && movie.genres.includes('Watch these Movies for FREE!');
    const handleRentOrOwn = (type) => {
      setPurchaseType(type);
      
      // Determine the amount based on the type
      const amount = type === 'rent' ? rentalPrice : ownPrice;
      
      // Check if wallet balance is sufficient
      if (walletBalance >= amount) {
        handlePurchase(amount, movie.ref, type);
    } else {
        const remainingBalance = amount - walletBalance;
        alert(`Your wallet balance is insufficient. You need KSH. ${remainingBalance} more.`);
        setModalVisible(true);
    }
    };

    const handlePurchase = async (amount, movieRef, purchaseType) => {
      const purchaseObj = {
          user_id: userId,
          ref: movieRef,
          purchase_type: purchaseType,
          source: 1,
      };
  
      try {
          const response = await axios.post('https://api.mymovies.africa/api/v1/users/buy', purchaseObj);
          console.log('Purchase successful:', response.data);
          // Optionally update the wallet balance after purchase
          setWalletBalance((prevBalance) => prevBalance - amount);
          alert(`Purchase successful! You've been charged KSH. ${amount}.`);
      } catch (error) {
          console.error('Error making purchase:', error);
      }
  };
    
  const handleModalTopUp = () => {
    // Determine the required amount based on purchaseType
    const amount = purchaseType === 'rent' ? rentalPrice : ownPrice;

        const remainingBalance = amount - walletBalance;
        const url = `https://api.mymovies.africa/api/v1/payment/gate/${userId}/?amount=${remainingBalance}&purchase_type=${purchaseType}&ref=${movie.ref}`;
        
        Linking.openURL(url)
            .catch((err) => console.error('Failed to open URL:', err));
        alert(`Your wallet balance is insufficient. Please top-up to cover KSH. ${remainingBalance}.`);
    
};
    

    const addMovieToCollection = async (movie, rentDuration) => {
      try {
        const response = await axios.post('https://app.mymovies.africa/api/purchases', {
          movieId: movie.id,
          title: movie.title,
          rentDuration: rentDuration,
          poste: getArtwork(movie.ref).portrait,
        });
        console.log('Full API response:', response);
        console.log('Movie added to collection:', response.data);
      } catch (error) {
        console.error('Error adding movie to collection:', error);
      }
    };
    const HeaderSection = ({ setModalVisible, genres, onGenreSelect }) => (
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
      </View>
    );

    const renderSimilarMovie = ({item, userId}) => {
      const similarPosterUrl = getArtwork(item.ref).portrait;
      return(
        <TouchableOpacity 
        onPress={()=> navigation.push ('MovieDetail',{movieId: item.id, userId: userId }) }>
          <Image source={{uri:similarPosterUrl}}
        style={styles.similarMoviePoster} />

        </TouchableOpacity>
        
      );
    };


    return (
        <ScrollView style={styles.container}>
            <HeaderSection />
            {/* <Text style={styles.walletBalance}>Wallet Balance: ${walletBalance}</Text> */}
            {/* Display movie trailer if available  */}
            {trailerUrl ? (
              <View style={styles.videoContainer}>
                <WebView 
                style={styles.video}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: videoUrl}}
                />
              </View>
            ) : (
              <Text style={styles.noTrailerText}>No Trailer Available </Text>
            )}
                  
            <View style={styles.buttonContainer}>

            <TouchableOpacity style={[isMovieFree ? styles.watchNowButton : styles.rentButton]} onPress={() => handleRentOrOwn('rent')}>
                <Text style={styles.buttonText}>
                  {isMovieFree ? 'Watch Now' : `Rent For 7 Days KSH. ${rentalPrice}`}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ownButton} onPress={() => handleRentOrOwn('own')} >
                <Text style={styles.buttonText}>{`Own for Life KSH. ${ownPrice}`}</Text>
            </TouchableOpacity>
            </View>

           {/* Modal for Payment Confirmation */}
           <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={styles.modalContent}
                >
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Insufficient Account Balance</Text>
                    <Text style={styles.modalMessage}>
                      {purchaseType === 'rent' && rentalPrice && (
                        <Text style={styles.modalMessage}>
                            Rent this movie for KSH. {rentalPrice}
                            {walletBalance < rentalPrice && 
                                `\nYour wallet balance is insufficient. You need KSH. ${rentalPrice - walletBalance} more to rent this movie. Please top-up to continue.`}
                        </Text>
                    )}
                    {purchaseType === 'own' && ownPrice && (
                        <Text style={styles.modalMessage}>
                            Own this movie for KSH. {ownPrice}
                            {walletBalance < ownPrice && 
                                `\nYour wallet balance is insufficient. You need KSH. ${ownPrice - walletBalance} more to own this movie. Please top-up to continue.`}
                        </Text>
                    )}
                    {!rentalPrice && !ownPrice && (
                        <Text style={styles.modalMessage}>Loading price...</Text>
                    )}
                    </Text>
                    <View style={styles.modalButtons}>
                        <Button
                            mode="contained"
                            onPress={() => setModalVisible(false)}
                            style={styles.closeModalButton}
                        >
                            Close
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleModalTopUp}
                            style={styles.topUpButton}
                        >
                            Top-up now
                        </Button>
                    </View>
                </Modal>
            </Portal>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.meta}>{movie.year} | {movie.duration} minutes | {movie.classification}</Text>
            <Text style={styles.cast}>{movie.tags}</Text>
            <Text style={{ color:'#008080', fontWeight: 'bold',marginTop: 15 }}> Synopsis </Text>
            <Text style={styles.synopsis}>{movie.synopsis}</Text>

            <Text style={styles.title}>Watch More Like This </Text>

            <FlatList
            data={similarMovies}
            renderItem={({ item }) => renderSimilarMovie({ item, userId })}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.similarMoviesContainer}
            />
        </ScrollView>
    );
};  

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop:30,
    flex: 1,
    backgroundColor:"black",
    color:"white",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: 'bold',

  },
  synopsis: {
    color: "white",
    fontSize: 16,
    marginVertical: 10,

  },
  walletBalance: { 
    fontSize: 18, 
    color: '#FFCC00', 
    marginBottom: 20 
  },
  cast:{
    color: "white",
    marginTop: 10,
    backgroundColor:'grey',
    padding: 10,
  },
  meta: {
    color:"white",
    paddingTop: 5,

  },
  buttonContainer:{
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
   
  },
  rentButton:{
    backgroundColor: 'grey',
    borderColor: '#008080',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 16,
    alignItems: "center", 
    width: 160,
    
  },
  buttonWatchNow: {
    backgroundColor: '#f4c430',
    borderColor: '#f4c430',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 16,
    alignItems: "center",
},
ownButton: {
    borderColor: '#d648d7',
    backgroundColor: 'black',
    borderWidth:2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 16,
    alignItems: "center", 
    width: 160,

  },
  watchNowButton: {
    backgroundColor: '#f4c430',
    borderColor: '#f4c430',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 16,
    alignItems: "center", 
    
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    
  },
  modalContainer:{
    flex: '1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  topUpButton: {
    backgroundColor: '#008080',
    padding: 10,
  },
  closeModalButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  video: {
    width: width * 0.9,
    height: 200,
    marginTop: 16,
    backgroundColor:"black",
  },
  noTrailerText: {
    color: "white",
    marginTop: 16,
    textAlign: 'center',
  },
  posterContainer: {
    alignItems: "center",
  },
  poster: {
    width:'100%',
    height: 500,
    borderRadius: 10,
    resizeMode: 'contain',
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
    marginTop: 0,
    marginBottom: 10,
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
  similarMoviesContainer: {
    marginBottom: 20,
    marginTop: 15,
  },
  similarMoviePoster: {
    width: 100,
    height: 150,
    borderRadius: 5,
    marginRight: 10,
    width: 100,
  }
});

export default MovieDetailScreen;
