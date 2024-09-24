import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';


const CollectionPage = () => {
  const [collection, setCollection] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const route = useRoute();
  const { userId, username } = route.params || { userId: null, username: 'Guest' };

  console.log('Received route params:', route.params); 
  console.log('Received userName in CollectionPage:', username); 
  console.log('Received userId:', userId); 


  // Fetch user's collection from API
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get('https://api.mymovies.africa/api/cache');
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection: ", error);
      }
    };
    
    fetchCollection();
  }, []);

  // Fetch wallet balance from API
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.post('https://api.mymovies.africa/api/v1/users/wallet', null, {
          params: { user_id: userId },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        setWalletBalance(response.data.balance || '0'); // Assuming the API returns an object with the balance
      } catch (error) {
        console.error("Error fetching wallet balance: ", error);
      }
    };

    if (userId) {
      fetchWalletBalance();
    }
  }, [userId]); // Fetch balance whenever userId changes
  
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

  

  const onTopUp = () => {
    // Handle top-up action here
    console.log('Top Up Pressed');
  };

  return (
    <View style={styles.container}>
      {/* Add the Header Component */}
      <Header 
        userName={username}
        userId={userId}
        walletBalance={walletBalance}
        onTopUp={onTopUp}
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
    marginTop: 20, // Adjust this as needed to space it from the header
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
