import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import placeholderImage from '../images/default.jpg';
import { getArtwork } from '../utils/media';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fuse from 'fuse.js';

const API_URL = 'https://app.mymovies.africa/api/cache';

const SearchScreen = ({ navigation }) => {
    const [movies, setMovies] = useState([]);
    const [rankedMovies, setRankedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        rankMovies();
    }, [searchQuery, movies]);

    const fetchMovies = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            //console.log('API Response:', data);

            if (data.content && Array.isArray(data.content)) {
                setMovies(data.content);
                setRankedMovies(data.content);
            } else {
                setMovies([]);
                setRankedMovies([]);
                setError('Unexpected data format.');
            }
        } catch (err) {
            console.error('Error fetching movies:', err);
            setError('Failed to fetch movies.');
        } finally {
            setLoading(false);
        }
    };

    const rankMovies = () => {
        if (searchQuery.trim() === '') {
            setRankedMovies(movies);
        } else {
            const fuse = new Fuse(movies, {
                keys: ['title', 'genre'],
                includeScore: true,
                threshold: 0.3, // Adjust for fuzziness
            });

            const results = fuse.search(searchQuery);

            results.sort((a, b) => a.score - b.score);

            setRankedMovies(results.map(result => result.item));
        }
    };

    const truncateSynopsis = (synopsis) => {
        return synopsis.length > 100 ? synopsis.substring(0, 100) + '...' : synopsis;
    };

    const handlePress = (item) => {
        navigation.navigate('MovieDetail', { movie: item });
    };

    const renderItem = ({ item }) => {
        const posterUrl = getArtwork(item.ref)?.portrait || placeholderImage;

        return (
            <TouchableOpacity onPress={() => handlePress(item)}>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Image source={{ uri: posterUrl }} style={styles.image} />
                        <View style={styles.cardContent}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.synopsis}>{truncateSynopsis(item.synopsis)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="purple" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchBarContainer}>
                <Icon name="search" size={20} color="#aaaaaa" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search Content by Title, Genre..."
                    placeholderTextColor="#aaaaaa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={rankedMovies}
                keyExtractor={(item) => item.id.toString()} // Ensure ID is a string
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#000',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, // Increased margin for better spacing
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderColor: 'grey',
        backgroundColor: 'white',
        borderWidth: 2,
        paddingHorizontal: 40, 
        color: 'black',
        borderRadius: 25,
        fontSize: 16,
    },
    searchIcon: {
        position: 'absolute',
        left: 15,
        zIndex: 1
    },
    card: {
        backgroundColor: 'rgb(37, 38, 43)',
        borderRadius: 8,
        elevation: 3,
        marginBottom: 10,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
        marginRight: 10,
    },
    cardContent: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#e0e0e0',
    },
    synopsis: {
        fontSize: 14,
        color: '#555',
    },
});

export default SearchScreen;
