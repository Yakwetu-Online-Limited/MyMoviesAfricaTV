import AsyncStorage from '@react-native-async-storage/async-storage';

// Store purchased movie
export const storePurchasedMovie = async (movie, userId, type) => {
  try {
    // Fetch existing data
    const rentedMovies = await AsyncStorage.getItem('rentedMovies');
    const ownedMovies = await AsyncStorage.getItem('ownedMovies');

    const rentedList = rentedMovies ? JSON.parse(rentedMovies) : {};
    const ownedList = ownedMovies ? JSON.parse(ownedMovies) : {};

    // Using userId to categorize movies for each user
    if (!rentedList[userId]) rentedList[userId] = [];
    if (!ownedList[userId]) ownedList[userId] = [];

    if (type === 'rent') {
      // Add movie to "Rent for 7 Days" category for the specific user
      rentedList[userId].push({ ...movie, movieId: movie.id, rentedDate: new Date() });
      await AsyncStorage.setItem('rentedMovies', JSON.stringify(rentedList));
    } else if (type === 'own') {
      // Add movie to "Own for Life" category for the specific user
      ownedList[userId].push({ ...movie, movieId: movie.id });
      await AsyncStorage.setItem('ownedMovies', JSON.stringify(ownedList));
    }
  } catch (error) {
    console.error("Error storing movie:", error);
  }
};


// Fetch movies for the user
export const fetchUserMovies = async (userId) => {
  try {
    const rentedMovies = await AsyncStorage.getItem('rentedMovies');
    const ownedMovies = await AsyncStorage.getItem('ownedMovies');

    const rentedList = rentedMovies ? JSON.parse(rentedMovies) : {};
    const ownedList = ownedMovies ? JSON.parse(ownedMovies) : {};

    // Return movies based on userId
    return {
      rented: rentedList[userId] || [],
      owned: ownedList[userId] || [],
    };
  } catch (error) {
    console.error("Error fetching user movies:", error);
    return { rented: [], owned: [] };
  }
};
