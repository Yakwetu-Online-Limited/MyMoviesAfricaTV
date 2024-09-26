import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CollectionPage = () => {
  const [collection, setCollection] = useState([]);
  const [purchasedMovies, setPurchasedMovies] = useState([]);
  const [rentedMovies, setRentedMovies] = useState([]);
  const [ownedMovies, setOwnedMovies] = useState([]);
  const route = useRoute();
  const { userId, username, movieId, walletBalance } = route.params || { userId: null, username: 'Guest' };

  console.log('Received route params:', route.params); 
  console.log('Received userName in CollectionPage:', username); 
  console.log('Received userId:', userId); 
  console.log('Received walletBalance:', walletBalance);
  console.log('Received movieId:', movieId);

  // Fetch user's collection from API
  // useEffect(() => {
  //   // Fetch purchased movies from your API or local state
  //   const fetchPurchasedMovies = async () => {
  //     try {
  //       const response = await axios.get(`https://api.mymovies.africa/api/v1/purchases?userId=${userId}&movieId=${movieId}`);
  //       setPurchasedMovies(response.data); 
  //     } catch (error) {
  //       console.error('Error fetching purchased movies:', error);
  //     }
  //   };

  //   fetchPurchasedMovies();
  // }, [userId]);

  // Replace the API call in useEffect
useEffect(() => {
  const fetchPurchasedMovies = async () => {
    try {
      // Fetch purchased movies from AsyncStorage
      const purchased = await AsyncStorage.getItem('purchasedMovies');
      setPurchasedMovies(purchased ? JSON.parse(purchased) : []);
    } catch (error) {
      console.error('Error fetching purchased movies from AsyncStorage:', error);
    }
  };

  fetchPurchasedMovies();
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
      {/* Add the Header Component */}
      <Header 
        userName={username}
        userId={userId}
        walletBalance={walletBalance} 
      />
      
      <Text style={styles.header}>My Collection</Text>
      
      <Text style={styles.subHeader}>Rented Movies</Text>
      {rentedMovies.length > 0 ? (
        <FlatList
          data={rentedMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item, index) => index.toString()}
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
          keyExtractor={(item, index) => index.toString()}
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
