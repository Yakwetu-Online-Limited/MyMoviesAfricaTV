import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { storePurchasedMovie, getPurchasedMovies } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CollectionPage = () => {
  const [rentedMovies, setRentedMovies] = useState([]);
  const [ownedMovies, setOwnedMovies] = useState([]);
  const route = useRoute();
  const { username, walletBalance } = route.params || { username: 'Guest' };

  console.log('Received route params in CollectionPage:', route.params);

  // Fetch user's collection from API and AsyncStorage
  useEffect(() => {
    const fetchUserMovies = async () => {
      try {
        // Fetch userId from AsyncStorage
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('Fetched userId from AsyncStorage:', storedUserId); // Check if this matches the userId from login
        
        if (storedUserId) {
          // Fetch rented movies from API
          const rentedResponse = await axios.get(`https://api.mymovies.africa/api/v1/purchases/rented?userId=${storedUserId}`);
          setRentedMovies(rentedResponse.data || []);

          // Fetch owned movies from API
          const ownedResponse = await axios.get(`https://api.mymovies.africa/api/v1/purchases/owned?userId=${storedUserId}`);
          setOwnedMovies(ownedResponse.data || []);

          // Fetch purchased movies from AsyncStorage
          const purchasedMovies = await getPurchasedMovies(storedUserId);
          console.log('Fetched purchased movies from AsyncStorage:', purchasedMovies);

          // Log the movieIds from purchased movies
          const movieIds = purchasedMovies.map(movie => movie.movieId);
          console.log('Movie IDs fetched from AsyncStorage:', movieIds);
        }
      } catch (error) {
        console.error('Error fetching user movies:', error);
      }
    };

    fetchUserMovies();
  }, []);

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity style={styles.movieItem}>
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
      />
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        {item.rentDuration && <Text style={styles.rentDuration}>Rent for {item.rentDuration} Days</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header 
        username={username}
        walletBalance={walletBalance} 
      />
      
      <Text style={styles.header}>My Collection</Text>
      
      <Text style={styles.subHeader}>Rented Movies</Text>
      {rentedMovies.length > 0 ? (
        <FlatList
          data={rentedMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.movieId.toString()}
          contentContainerStyle={styles.movieList}
        />
      ) : (
        <Text style={styles.emptyMessage}>You haven't rented any movies yet.</Text>
      )}

      <Text style={styles.subHeader}>Owned Movies</Text>
      {ownedMovies.length > 0 ? (
        <FlatList
          data={ownedMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.movieId.toString()}
          contentContainerStyle={styles.movieList}
        />
      ) : (
        <Text style={styles.emptyMessage}>You don't own any movies yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 10,
  },
  movieList: {
    paddingBottom: 50,
  },
  movieItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieDetails: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  rentDuration: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  emptyMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default CollectionPage;
