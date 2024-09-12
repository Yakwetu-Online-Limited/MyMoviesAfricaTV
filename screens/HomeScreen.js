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

  const formatGenres = (moviesData) => {
    // Code for formatting genres will be added here
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Components for banners and genres will be added here */}
    </ScrollView>
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
});

export default HomePage;
