import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';


const CollectionPage = () => {
  const [collection, setCollection] = useState([]);
  const [purchasedMovies, setPurchasedMovies] = useState([]);
  const route = useRoute();
  const { userId, username, movieId, walletBalance = 500 } = route.params || { userId: null, username: 'Guest' };

  console.log('Received route params:', route.params); 
  console.log('Received userName in CollectionPage:', username); 
  console.log('Received userId:', userId); 
  console.log('Received walletBalance:', walletBalance);
  console.log('Received movieId:', movieId);

  // Fetch user's collection from API
  useEffect(() => {
    // Fetch purchased movies from your API or local state
    const fetchPurchasedMovies = async () => {
      try {
        const response = await axios.get(`https://api.mymovies.africa/api/v1/purchases/${movieId}`);
        setPurchasedMovies(response.data); // Assuming response contains the list of purchased movies
      } catch (error) {
        console.error('Error fetching purchased movies:', error);
      }
    };

    fetchPurchasedMovies();
  }, [userId]);

  
  const renderMovieItem = ({ item }) => (
    <TouchableOpacity style={styles.movieItem}>
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
      />
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.rentDuration}>Rent for {item.rentDuration} Days</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Add the Header Component */}
      <Header 
        userName={username}
        userId={userId}
        walletBalance={walletBalance} 
      />
      
      <Text style={styles.header}>My Collection</Text>
      
      {collection.length > 0 ? (
        <FlatList
          data={collection}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.movieList}
        />
      ) : (
        <Text style={styles.emptyMessage}>Your collection is empty.</Text>
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
