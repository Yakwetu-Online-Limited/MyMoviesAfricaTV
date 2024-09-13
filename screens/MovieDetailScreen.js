import React, { useState, useEffect }from 'react';
import { View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { API_URL } from '../store';

const MovieDetailScreen = () => {
    // set useStates
    const [ movie, setMovie ] = useState(null);
    const [ loading, setLoading ]= useState(true);
    const [ error, setError ] = useState(null);

    const movieId = '180'; // Static ID for testing

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



    return (
        <View style={styles.container}>
            <Text>Movie Details</Text>
        </View>
    );
    
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieDetailScreen;
