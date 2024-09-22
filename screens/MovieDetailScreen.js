import React, { useState, useEffect }from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image} from 'react-native';
import { API_URL } from '../store';
import { getArtwork } from '../utils/media';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
// import  Video  from 'react-native-video';
import { useNavigation,  } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MovieDetailScreen = ({route}) => {
    // set useStates
    const [ movie, setMovie ] = useState(null);
    const [ loading, setLoading ]= useState(true);
    const [ error, setError ] = useState(null);
    const [ similarMovies, setSimilarMovies ] = useState([]);

    const { movieId } = route.params;
    const navigation = useNavigation();

    //const movieId = '184'; // Static ID for testing

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
    }, []);
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

    const handleRent = (purchaseType) => {
        const url = `https://api.mymovies.africa/api/v1/payment/gate/10/?amount=${purchaseType === 'RENTAL' ? 149 : 349}&purchase_type=${purchaseType}&ref=${movie.ref}`;
        console.log('Redirect to:', url);
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

    const renderSimilarMovie = ({item}) => {
      const similarPosterUrl = getArtwork(item.ref).portrait;
      return(
        <TouchableOpacity 
        onPress={()=> navigation.push ('MovieDetailScreen',{movieId: item.id }) }>
          <Image source={{uri:similarPosterUrl}}
        style={styles.similarMoviePoster} />

        </TouchableOpacity>
        
      );
    };


    return (
        <ScrollView style={styles.container}>
            <HeaderSection />
          
            <View style={styles.posterContainer}>
                <Image source={{ uri:posterUrl }} style={styles.poster} />
            </View>

            {/* Display movie tariler if available 

            {movie.trailer_url ? (
                <Video source={{ uri: movie.trailer_url }}
                controls={true}
                resizeMode="cover"
                paused={false}
                onError={(err) => console.error('Video error: ', err)}
                style={styles.video}  
                />

            ) : (
                <Text> No trailer available.</Text>
            )}
                */}
             
                
                
            <View style={styles.buttonContainer}>

            <TouchableOpacity style={styles.buttonRent} onPress={() => handleRent('RENTAL')}>
                <Text style={styles.buttonText}>Rent for 7 Days</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonOwn} onPress={() => handleRent('EST')} >
                <Text style={styles.buttonText}>Own for Life</Text>
            </TouchableOpacity>

            </View>

            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.meta}>{movie.year} | {movie.duration} minutes | {movie.classification}</Text>
            <Text style={styles.cast}>{movie.tags}</Text>
            <Text style={{ color:'#008080', fontWeight: 'bold',marginTop: 15 }}> Synopsis </Text>
            <Text style={styles.synopsis}>{movie.synopsis}</Text>

            <Text style={styles.title}>Watch More Like This </Text>

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
  buttonRent:{
    backgroundColor: 'grey',
    borderColor: '#008080',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 16,
    alignItems: "center", 
    
  },
  buttonOwn: {
    borderColor: '#d648d7',
    backgroundColor: 'black',
    borderWidth:2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 16,
    alignItems: "center", 

  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  video: {
    width: "100%",
    height: 200,
    marginTop: 16,
    backgroundColor:"black",
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
  similarMovieItem: {
    
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
