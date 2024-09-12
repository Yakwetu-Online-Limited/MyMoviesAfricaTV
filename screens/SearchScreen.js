import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';

const API_URL = 'https://app.mymovies.africa/api/cache';

const SearchScreen = () =>  {

    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMovies = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            console.log('API Response:', data);

            // Check if 'content' key exists and is an array
            if (data.content && Array.isArray(data.content)) {
                setMovies(data.content);
                setFilteredMovies(data.content);
            } else {
                setMovies([]);
                setFilteredMovies([]);
                setError('Unexpected data format.');
            }
        } catch (err) {
            console.error('Error fetching movies:', err);
            setError('Failed to fetch movies.');
        } finally {
            setLoading(false);
        }
    };


};

export default SearchScreen;
