import AsyncStorage from '@react-native-async-storage/async-storage';

// Store the purchased movie
export const storePurchasedMovie = async (movieId, userId, type) => {
  try {
    const key = `purchasedMovies_${userId}`;
    const storedMovies = await AsyncStorage.getItem(key);
    let movies = storedMovies ? JSON.parse(storedMovies) : [];

    // Check if the movie is already purchased
    const movieExists = movies.some((movie) => movie.movieId === movieId);
    if (!movieExists) {
      movies.push({ movieId, type });
    }

    await AsyncStorage.setItem(key, JSON.stringify(movies));
  } catch (error) {
    console.error('Error storing purchased movie:', error);
  }
};

// Get the purchased movies
export const getPurchasedMovies = async (userId) => {
  try {
    const key = `purchasedMovies_${userId}`;
    const storedMovies = await AsyncStorage.getItem(key);
    return storedMovies ? JSON.parse(storedMovies) : [];
  } catch (error) {
    console.error('Error fetching purchased movies:', error);
    return [];
  }
};
