import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useRoute } from '@react-navigation/native';
import { getUserBundle } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getArtwork } from '../components/imageUtils';

const CollectionPage = () => {
  const [content, setContent] = useState(null);
  const route = useRoute();
  const { username, walletBalance } = route.params || { username: 'Guest' };
  const [isPressed, setIsPressed] = useState(false);

  console.log('Received route params in CollectionPage:', route.params);
  

  useEffect(() => {
    (async function () {
      // Fetch userId from AsyncStorage
      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('Fetched userId from AsyncStorage:', storedUserId); // Check if this matches the userId from login
      
      if (storedUserId || route?.params?.userId) {
        let data = await getUserBundle({ user_id: storedUserId || route?.params?.userId });
        //console.log(data, 'fetched movies')
        return setContent(data);
      }
    })();
  }, []);

  const moviesByPurchaseType = content?.purchases?.reduce((acc, movie) => {
    if (movie.purchase_type === 'BULK OFFLINE SCREENING') {
      return acc;
    }

    const purchaseType = movie.purchase_type.toLowerCase().includes('offline')
      ? 'RENTAL' : movie.purchase_type;
    if (purchaseType in acc) {
      acc[purchaseType].push(movie);
    } else {
      acc[purchaseType] = [movie];
    }
    return acc;
  }, {});


  const renderMovieItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.movieItem}
      onPress={()=> console.log(item.ref)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <Image
        source={{uri: getArtwork(item.ref).portrait}}
        style={[styles.moviePoster, isPressed && styles.moviePosterPressed]}
        onError={(error) => {
          console.log("Error loading poster image:", error.nativeEvent.error);
        }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header 
        username={username}
        walletBalance={walletBalance} 
      />
      
      <Text style={styles.header}>My Collection</Text>

      {content &&
      content?.purchases &&
      Object.keys(moviesByPurchaseType).length > 0 ? (
        <View>
          {Object.entries(moviesByPurchaseType).map(
            ([purchaseType, movies], index) => (
                <View key={index}>
                  <Text style={styles.genreTitle}>
                    {purchaseType === 'RENTAL'
                      ? '#RentFor7Days'
                      : purchaseType === 'PVOD'
                      ? '#RentFor2Days'
                      : '#OwnForLife'}
                  </Text>
                  
                  <FlatList
                    data={movies}
                    renderItem={renderMovieItem}
                    keyExtractor={(item, index) => item.ref.toString()+index.toString()}
                    contentContainerStyle={styles.movieList}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                  
              </View> 
            )
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.emptyMessage}>
            Movies you #RentFor2Days or #RentFor7Days are Stored here, till
            they Expire. 😊
          </Text>
          <Text style={styles.emptyMessage}>
            Movies you #OwnForLife are Stored here Forever. 😎
          </Text>
          {/* <Link href="/home" className="text-center"> */}
          <Text style={styles.emptyMessage}>
              Click here to Browse for Movies youd like to Rent or Own.
          </Text>
          {/* </Link> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 10,
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
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 20
  },
  genreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  moviePosterPressed: {
    transform: [{ scale: 0.9 }],
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
