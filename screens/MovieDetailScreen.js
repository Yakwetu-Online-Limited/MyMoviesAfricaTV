import React, { useState, useEffect }from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Dimensions} from 'react-native';
import { API_URL } from '../store';
import { getArtwork } from '../utils/media';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const MovieDetailScreen = () => {
    // set useStates
    const [ movie, setMovie ] = useState(null);
    const [ loading, setLoading ]= useState(true);
    const [ error, setError ] = useState(null);

    const movieId = '211'; // Static ID for testing

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
            } catch(error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMovieData();
    }, []);
    // Render loading state.
    if (loading) {
        return <ActivityIndicator size = "large" color="#0000ff" />
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
            <Image 
            source={{ uri: posterUrl }} 
            style={{ width: '100%', height: 400, marginTop: 16 }} 
            resizeMode="cover" 
            />
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleRent('RENTAL')}>
                <Text style={styles.buttonText}>Rent for 7 Days</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => handleRent('EST')} >
                <Text style={styles.buttonText}>Own for Life</Text>
            </TouchableOpacity>

            </View>

            

            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.meta}>{movie.year} | {movie.duration} minutes | {movie.classification}</Text>
            <Text style={styles.cast}>{movie.tags}</Text>
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

  },
  synopsis: {
    color: "white",
    fontSize: 16,
    marginVertical: 10,

  },
  cast:{
    color: "#888",
    marginTop: 10,
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
  button:{
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 16,
    alignItems: "center",
    
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default MovieDetailScreen;
