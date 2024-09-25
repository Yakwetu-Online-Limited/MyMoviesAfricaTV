import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Modal, Portal, Button, Provider as PaperProvider } from 'react-native-paper';
import { API_URL } from '../store';
import { getArtwork } from '../utils/media';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MovieDetailScreen = ({ route }) => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [rentalPrice, setRentalPrice] = useState(null);
    const [ownPrice, setOwnPrice] = useState(null);
    const [purchaseType, setPurchaseType] = useState(null);

    const { movieId, userId } = route.params;
    console.log("Movie ID received in MovieDetailScreen: ", movieId);
    console.log("MovieDetailScreen - userId:", userId);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                const movieData = data.content.find(movie => movie.id === movieId);
                if (!movieData) {
                    throw new Error('Movie not found');
                }
                setMovie(movieData);

                // Set rental and purchase prices from the API response
                const rentalPriceData = JSON.parse(movieData.rental_price)?.kenya;
                const estPriceData = JSON.parse(movieData.est_price)?.kenya;

                // Set the rental and own prices
                setRentalPrice(rentalPriceData);
                setOwnPrice(estPriceData);

                const rentalPriceData = JSON.parse(movieData.rental_price)?.kenya;
                const estPriceData = JSON.parse(movieData.est_price)?.kenya;

                setRentalPrice(rentalPriceData);
                setOwnPrice(estPriceData);

                const currentGenres = typeof movieData.genres === 'string' ? JSON.parse(movieData.genres) : movieData.genres;
                const filteredMovies = data.content
                    .filter(m => m.id !== movieId && JSON.parse(m.genres).some(genre => currentGenres.includes(genre)))
                    .slice(0, 8);
                setSimilarMovies(filteredMovies);

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchMovieData();
    }, [movieId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error fetching movie data: {error}</Text>;
    }

    const posterUrl = getArtwork(movie.ref).portrait;
    const isMovieFree = movie.genres && movie.genres.includes('Watch these Movies for FREE!');

    const handleRentOrOwn = (type) => {
        setPurchaseType(type);
        setModalVisible(true);
    };

    const handlePayment = () => {
        setModalVisible(false);
        navigation.navigate('Payment', {
            movieId: movie.id,
            purchaseType: purchaseType,
            price: purchaseType === 'rent' ? rentalPrice : ownPrice
        });
    };

    const HeaderSection = () => (
        <View style={styles.headerContainer}>
            <Image source={require('../images/mymovies-africa-logo.png')} style={styles.logo} />
            <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.requestScreeningButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Request Screening</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.eventsButton}>
                    <Text style={styles.buttonText}>Events</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSimilarMovie = ({ item }) => {
        const similarPosterUrl = getArtwork(item.ref).portrait;
        return (
            <TouchableOpacity onPress={() => navigation.push('MovieDetailScreen', { movieId: item.id })}>
                <Image source={{ uri: similarPosterUrl }} style={styles.similarMoviePoster} />
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <HeaderSection />
          
            <View style={styles.posterContainer}>
                <Image source={{ uri: posterUrl }} style={styles.poster} />
            </View>
             
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[isMovieFree ? styles.watchNowButton : styles.rentButton]} 
                    onPress={() => handleRentOrOwn('rent')}
                >
                    <Text style={styles.buttonText}>
                        {isMovieFree ? 'Watch Now' : `Rent For 7 Days KSH. ${rentalPrice}`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.ownButton} onPress={() => handleRentOrOwn('own')}>
                    <Text style={styles.buttonText}>{`Own for Life KSH. ${ownPrice}`}</Text>
                </TouchableOpacity>
            </View>

            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={styles.modalContent}
                >
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Insufficient Account Balance</Text>
                    <Text style={styles.modalMessage}>
                        You do not have enough money in your wallet. Pay KES 119 to continue.
                    </Text>
                    <View style={styles.modalButtons}>
                        <Button
                            mode="contained"
                            onPress={() => setModalVisible(false)}
                            style={styles.closeModalButton}
                        >
                            Close
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handlePayment}
                            style={styles.topUpButton}
                        >
                            Top-up now
                        </Button>
                    </View>
                </Modal>
            </Portal>

            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.meta}>{movie.year} | {movie.duration} minutes | {movie.classification}</Text>
            <Text style={styles.cast}>{movie.tags}</Text>
            <Text style={styles.synopsisHeader}>Synopsis</Text>
            <Text style={styles.synopsis}>{movie.synopsis}</Text>

            <Text style={styles.title}>Watch More Like This</Text>

            <FlatList
                data={similarMovies}
                renderItem={renderSimilarMovie}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.similarMoviesContainer}
            />
        </ScrollView>
    );
};  

const MovieDetailScreenWrapper = (props) => (
    <PaperProvider>
        <MovieDetailScreen {...props} />
    </PaperProvider>
);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 30,
        flex: 1,
        backgroundColor: "black",
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        color: "white",
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    synopsis: {
        color: "white",
        fontSize: 16,
        marginVertical: 10,
    },
    synopsisHeader: {
        color: '#008080',
        fontWeight: 'bold',
        marginTop: 15,
    },
    cast: {
        color: "white",
        marginTop: 10,
        backgroundColor: 'grey',
        padding: 10,
    },
    meta: {
        color: "white",
        paddingTop: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 20,
    },
    rentButton: {
        backgroundColor: 'grey',
        borderColor: '#008080',
        borderWidth: 2,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 50,
        marginTop: 16,
        alignItems: "center", 
        width: 160,
    },
    ownButton: {
        borderColor: '#d648d7',
        backgroundColor: 'black',
        borderWidth: 2,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 50,
        marginTop: 16,
        alignItems: "center", 
        width: 160,
    },
    watchNowButton: {
        backgroundColor: '#f4c430',
        borderColor: '#f4c430',
        borderWidth: 2,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 50,
        marginTop: 16,
        alignItems: "center", 
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    closeModalButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
    },
    topUpButton: {
        backgroundColor: '#008080',
        padding: 10,
    },
    posterContainer: {
        alignItems: "center",
    },
    poster: {
        width: '100%',
        height: 500,
        borderRadius: 10,
        resizeMode: 'contain',
    },
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#000000',
    },
    logo: {
        resizeMode: 'contain',
        alignSelf: 'flex-start'
    },
    headerButtons: {
        flexDirection: 'row',
        marginTop: 0,
        marginBottom: 10,
        backgroundColor: '#000000',
    },
    requestScreeningButton: {
        backgroundColor: '#3E3E3E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginHorizontal: 10,
        borderColor: '#008080',
        borderWidth: 2,
    },
    eventsButton: {
        backgroundColor: '#3E3E3E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginHorizontal: 10,
        borderColor: '#D648D7',
        borderWidth: 2,
    },
    similarMoviesContainer: {
        marginBottom: 20,
        marginTop: 15,
    },
    similarMoviePoster: {
        width: 100,
        height: 150,
        borderRadius: 5,
        marginRight: 10,
    }
});

export default MovieDetailScreenWrapper;