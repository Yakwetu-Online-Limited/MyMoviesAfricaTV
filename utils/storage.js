import AsyncStorage from '@react-native-async-storage/async-storage';

// Store purchased movie
export const storePurchasedMovie = async (movie, type) => {
  try {
    // Fetch existing data
    const rentedMovies = await AsyncStorage.getItem('rentedMovies');
    const ownedMovies = await AsyncStorage.getItem('ownedMovies');

    const rentedList = rentedMovies ? JSON.parse(rentedMovies) : [];
    const ownedList = ownedMovies ? JSON.parse(ownedMovies) : [];

    if (type === 'rent') {
      // Add movie to "Rent for 7 Days" category
      rentedList.push({ ...movie, rentedDate: new Date() });
      await AsyncStorage.setItem('rentedMovies', JSON.stringify(rentedList));
    } else if (type === 'own') {
      // Add movie to "Own for Life" category
      ownedList.push(movie);
      await AsyncStorage.setItem('ownedMovies', JSON.stringify(ownedList));
    }
  } catch (error) {
    console.error("Error storing movie:", error);
  }
};
