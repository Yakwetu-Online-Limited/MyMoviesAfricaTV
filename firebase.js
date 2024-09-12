// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDElGZdR65WAMLQZ3vNMIYr0xZ7BWjZ6JI",
  authDomain: "my-movies-79784.firebaseapp.com",
  projectId: "my-movies-79784",
  storageBucket: "my-movies-79784.appspot.com",
  messagingSenderId: "500064335145",
  appId: "1:500064335145:web:f1f4bb7cf949549f4ab338",
  measurementId: "G-S1MB6L1WVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

