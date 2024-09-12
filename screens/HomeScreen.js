import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import defaultPosterImage from '../images/default.jpg'; // Default image for failed poster loads

const { width } = Dimensions.get('window'); // Get device width for responsive design

const HomePage = () => {
  // State variables for genres, banners, and loading
  const [genres, setGenres] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies from API function placeholder
  const fetchMovies = async () => {
    // Code for fetching data will be added here
  };

  // Format genres function placeholder
  const formatGenres = (moviesData) => {
    // Code for formatting genres will be added here
  };

  // useEffect to call fetchMovies when component mounts
  useEffect(() => {
    fetchMovies();
  }, []);

  // Loader display while data is being fetched
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Main component render placeholder
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
