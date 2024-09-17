import React, { useState, useEffect }from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image} from 'react-native';
import { API_URL } from '../store';
import { getArtwork } from '../utils/media';
import { TouchableOpacity } from 'react-native-gesture-handler';
import  Video  from 'react-native-video';

const { width } = Dimensions.get('window');

const MovieDetailScreen = ({route}) => {
    // set useStates
    const [ movie, setMovie ] = useState(null);
    const [ loading, setLoading ]= useState(true);
    const [ error, setError ] = useState(null);

    //const { movieId } = route.params;

    const movieId = '184'; // Static ID for testing

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


    return (
        <ScrollView style={styles.container}>

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
        </ScrollView>
    );
};  

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop:40,
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
  }
});

export default MovieDetailScreen;
