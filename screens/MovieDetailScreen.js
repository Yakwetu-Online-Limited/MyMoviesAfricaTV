import React, { useState, useEffect }from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { API_URL } from '../store';

const MovieDetailScreen = () => {
    // set useStates
    const [ movie, setMovie ] = useState(null);
    const [ loading, setLoading ]= useState(true);



    return (
        <View style={styles.container}>
            <Text>Movie Details</Text>
        </View>
    );
    
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieDetailScreen;
