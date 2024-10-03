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
import { eventsData } from "../events";
import Events from "../components/Events";
import Screening from "../components/Screening";
import { Provider as PaperProvider, Button, Modal, Portal } from 'react-native-paper';
import { storePurchasedMovie } from '../utils/storage';

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
   
    const { movieId, userId, walletBalance: initialWalletBalance, username  } = route.params;
    const [walletBalance, setWalletBalance] = useState(initialWalletBalance);
    console.log("Movie ID received in MovieDetailScreen: ", movieId);
    console.log("MovieDetailScreen - userId:", userId, "username:", username);	
    console.log("MovieDetailScreen - walletBalance:", walletBalance);
    const [currentEvents, setCurrentEvents] = useState([]);
    const navigation = useNavigation();


    // Fetch the movie data from the API
    useEffect(() => {
        //Function to fetch movie data from the api
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
                const rentalPriceData = parseFloat(JSON.parse(movieData.rental_price)?.kenya);
                const estPriceData = parseFloat(JSON.parse(movieData.est_price)?.kenya);


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

                ).slice(0,12);
                setSimilarMovies(filteredMovies);

                setLoading(false);

            } catch(error) {
                setError(error.message); 
                setLoading(false);
            }
        };
        fetchMovieData();
   
      }, [movieId]);

    const updateCurrentEvents = () => {
      const now = new Date();
      const filteredEvents = eventsData.filter((event) => {
          const endDate = new Date(event.endDate);
          return endDate > now;
      });
      setCurrentEvents(filteredEvents);
  };
    

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
    const videoUrl = `https://www.youtube.com/embed/${trailerUrl}?autoplay=0&modestbranding=1&showinfo=0&controls=1&fullscreen=1`;//Embed URL format from youtube

   
    // Check if the movie is free
    const isMovieFree = movie.genres && movie.genres.includes('Watch these Movies for FREE!');

    // Handle Watch Now Button for free movies
    const handleWatchNow = async () => {
      try {
        // Tag the movie as "Free Movie"
        const freeMovieTag = "Free Movie";
        await addToCollection(movie, freeMovieTag);
    
        // Navigate to the player or collection screen after adding the movie
        navigation.navigate('Collection', { userId: userId, username: username, movieId: movieId, walletBalance, purchaseSuccess: true });
      } catch (error) {
        console.error('Error adding movie to collection:', error);
        alert("There was an error adding the movie to your collection.");
      }
    };

    // Updated function to add a movie to the collection
const addToCollection = async (movie, freeMovieTag) => {
  try {
    const response = await axios.post(`https://api.mymovies.africa/api/v1/purchases?userId=${userId}&movieId=${movieId}`, {
      user_id: userId,
      ref: movie.ref,
      purchase_type: 'rent', // Rent for 7 days
      title: movie.title,
      poster: getArtwork(movie.ref).portrait,
      tag: freeMovieTag, // Add "Free Movie" tag
    });
    console.log('Movie added to collection:', response.data);
  } catch (error) {
    console.error('Error adding movie to collection:', error);
  }
};

    const handleRentOrOwn = (type) => {
      setPurchaseType(type);
      
      // Determine the amount based on the type
      const amount = type === 'rent' ? rentalPrice : ownPrice;

      console.log("Rental Price:", rentalPrice, "Own Price:", ownPrice);
      console.log("Calculated Amount:", amount);
      console.log("Wallet Balance:", walletBalance);

      // Check if the amount is valid
      if (typeof amount !== 'number' || isNaN(amount)) {
        console.error("Calculated amount is NaN", amount);
        alert("There was an error calculating the amount. Please try again.");
        return; // Exit the function if the amount is invalid
      }
      
      // Check if wallet balance is sufficient
      if (walletBalance >= amount) {
        handlePurchase(amount, movie.ref, type);
    } else {
        const remainingBalance = amount - walletBalance;
        alert(`Your wallet balance is insufficient. You need KSH. ${remainingBalance} more.`);
        setModalVisible(true);
    }
    };

    const handlePurchase = async (amount, movie, purchaseType) => {
      const purchaseObj = {
          user_id: userId,
          ref: movie.ref,
          purchase_type: purchaseType,
          source: 1,
      };
  
      try {
          const response = await axios.post('https://api.mymovies.africa/api/v1/users/buy', purchaseObj);
          console.log('Purchase successful:', response.data);
          // update the wallet balance after purchase
          setWalletBalance((prevBalance) => prevBalance - amount);
          alert(`Purchase successful! You've been charged KSH. ${amount}.`);
          
          // Store purchased movie locally
          await storePurchasedMovie(movie, purchaseType === 'rent' ? 'rent' : 'own');

          // await addMovieToCollection(movie, purchaseType === 'RENTAL' ? 7 : null, purchaseType); 

          // Navigate to the CollectionScreen to show updated collection
          setTimeout(() => {
            navigation.navigate('Collection', { userId: userId, username: username, movieId: movieId, walletBalance });
        }, 3000);
      } catch (error) {
          console.error('Error making purchase:', error);
      }
  };
    
  const handleModalTopUp = () => {
    // Determine the required amount based on purchaseType
    const amount = purchaseType === 'rent' ? rentalPrice : ownPrice;

        const remainingBalance = amount - walletBalance;
        if (isNaN(remainingBalance)) {
          console.error("Remaining balance is NaN", remainingBalance);
          alert("There was an error calculating the remaining balance. Please try again.");
          return; // Exit the function if the remaining balance is invalid
        }

        
        const url = `https://api.mymovies.africa/api/v1/payment/gate/${userId}/?amount=${remainingBalance}&purchase_type=${purchaseType}&ref=${movie.ref}`;
        
        Linking.openURL(url)
            .catch((err) => console.error('Failed to open URL:', err));
        alert(`Your wallet balance is insufficient. Please top-up to cover KSH. ${remainingBalance}.`);
        console.log("Payment URL:", url);

        console.log("Rental Price:", rentalPrice);
        console.log("Own Price:", ownPrice);
        console.log("Wallet Balance:", walletBalance);
        console.log("Remaining Balance:", remainingBalance);
        console.log("Final Payment URL:", url);


};
    

    const addMovieToCollection = async (movie, rentDuration, purchaseType) => {
      try {
        const response = await axios.post(`https://api.mymovies.africa/api/v1/purchases?userId=${userId}&movieId=${movieId}`, {
          user_id: userId, 
          ref: movie.ref,  
          purchase_type: purchaseType, 
          title: movie.title,
          poste: getArtwork(movie.ref).portrait,
        });
        // console.log('Full API response:', response);
        console.log('Movie added to collection:', response.data);
        console.log('Movie ID:', movieId);
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

    const renderSimilarMovie = ({item, userId, walletBalance}) => {
      const similarPosterUrl = getArtwork(item.ref).portrait;
      return(
        <TouchableOpacity 
        onPress={()=> navigation.push ('MovieDetail',{movieId: item.id, userId: userId, walletBalance }) }>
          <Image source={{uri:similarPosterUrl}}
        style={styles.similarMoviePoster} />

        </TouchableOpacity>
        
      );
    };


    return (
        <PaperProvider>
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

            { isMovieFree ? (
              <>
              
              <TouchableOpacity style={styles.watchNowButton} onPress={handleWatchNow}>
                <Text style={styles.buttonText}>WATCH NOW </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.ownButton} onPress={() => handleRentOrOwn('own')} >
              <Text style={styles.buttonText}>{`OWN FOR LIFE KSH. ${ownPrice}`}</Text>
              </TouchableOpacity>
              </>
            ) : (
              <>
              <TouchableOpacity style={styles.rentButton} onPress={() => handleRentOrOwn('rent')}>
                <Text style={styles.buttonText}>{`RENT FOR 7 DAYS KSH. ${rentalPrice} `}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.ownButton} onPress={() => handleRentOrOwn('own')} >
                <Text style={styles.buttonText}>{`OWN FOR LIFE KSH. ${ownPrice}`}</Text>
              </TouchableOpacity>

              </>
            )}

            
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
                            style={styles.cancelModalButton}
                        >
                            CANCEL
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleModalTopUp}
                            style={styles.topUpButton}
                        >
                            TOP-UP NOW
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
            renderItem={({ item }) => renderSimilarMovie({ item, userId, walletBalance })}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.similarMoviesContainer}
            />
            
        </ScrollView>
         </PaperProvider>
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
    backgroundColor:'grey',
    borderWidth: 2,
    padding: 10,
    borderRadius: 50,
    borderColor: '#008080'
  },
  cancelModalButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 50,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoContainer: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  video: {
    width: width,
    height: 300,
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


