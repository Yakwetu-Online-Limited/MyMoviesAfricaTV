import AsyncStorage from '@react-native-async-storage/async-storage';
import URL from '../store';
import axios from 'axios';

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

const buildFormData = (obj)=>{
  const formData = new URLSearchParams(obj);
  return formData
} 

export async function addNewUser(user) {
  const res = await axios.post('/api/new-user', { user });
  return res.data;
}
// set axios base URL and c
axios.defaults.baseURL = URL.baseAPI;
axios.defaults.timeout = 15000;

const stageBase = 'https://mymovies-africa-pwa-git-ft-drm-proxy-mctv-frontend.vercel.app/';
const prodBase = 'https://app.mymovies.africa/'

const awsStreamUrl = 'http://localhost:3000/' + URL.awsStreamRequest;
const stagingAwsStreamUrl =
  stageBase +
  URL.awsStreamRequest;

const awsStreamClipUrl = 'http://localhost:3000/' + URL.awsStreamClipRequest;
const stagingAwsStreamClipUrl =
  stageBase +
  URL.awsStreamClipRequest;

function clipStreamUrl() {
  if (process.env.NODE_ENV == 'development') {
    return awsStreamClipUrl;
  }
  return stagingAwsStreamClipUrl;
}

function streamUrl() {
  if (process.env.NODE_ENV == 'development') {
    return awsStreamUrl;
  }
  return stagingAwsStreamUrl;
}

/**
 *
 * USERS
 *
 */
export const login = (user) => {
  return axios.post(URL.login, buildFormData(user));
};

export const logUser = async (user) => {
  const res = await axios.post(URL.login, buildFormData(user));
  return res.data;
};

export const updateProfile = async (user) => {
  let res = await axios.post(URL.updateUser, buildFormData(user));
  return res.data;
};

export const getUserBundle = async (userObj) => {
  let res = await axios.post(URL.bundle, buildFormData(userObj));
  return res.data;
};

export const getUserWallet = (userObj) => {
  return axios.post(URL.wallet, buildFormData(userObj));
};

export const getUserFavourites = (userObj) => {
  return axios.post(URL.favourites, buildFormData(userObj));
};

export const toggleFavourites = (favObj) => {
  return axios.post(URL.favouritesToggle, buildFormData(favObj));
};

export const getUserDownloads = (userObj) => {
  return axios.post(URL.downloads, buildFormData(userObj));
};
export const getUserId = async (email) => {
  const res = await axios.post(URL.id, buildFormData({ email }));
  return res.data;
};
export const getRefCode = async (refcode) => {
  const res = await axios.post(URL.ref, buildFormData({ refcode }));
  return res.data;
};
export const getWallet = async (user_id) => {
  let res = await axios.post(URL.wallet, buildFormData({ user_id }));
  return res.data;
};
export const checkPhone = async (obj) => {
  const res = await axios.post(URL.phone, buildFormData(obj));
  return res.data;
};
export const OTP = async (obj) => {
  const res = await axios.post(URL.sms, buildFormData(obj));
  return res.data;
};
export const createMultipleAccounts = async (obj) => {
  const res = await axios.post(URL.createMultipleAccounts, buildFormData(obj));
  return res.data;
};
export const getCustomerByEmail = async (obj) => {
  const res = await axios.post(URL.customerByEmail, buildFormData(obj));
  return res.data;
};

export const postRefreshmentsData = async (obj, id) => {
  const res = await axios.post(
    URL.postRefreshments + id,
    buildFormData({ refreshments: obj })
  );
  return res.data;
};



/**
 *
 * Content
 *
 */
export const getContent = async () => {
  let response = await axios.post(
    URL.content,
    buildFormData({ is_updated: 'true' })
  );
  return response.data;
};

export const getContentInfo = (ref, user_id) => {
  return axios.post(URL.content, buildFormData({ ref, user_id }));
};
export const contentInfo = async (ref, user_id) => {
  let res = axios.post(URL.content, buildFormData({ ref, user_id }));
  return res;
};

export const findContent = (filter) => {
  return axios.post(URL.websearch, buildFormData(filter));
};

export const getGenres = () => {
  return axios.get(URL.genres);
};

export const getRecommendations = (criteria) => {
  return axios.post(URL.recommendations, buildFormData(criteria));
};

export const storeView = (view) => {
  return axios.post(URL.views, buildFormData(view));
};

export const getScreenings = async () => {
  const res = axios.get(URL.screenings);
  return res;
};
/**
 *
 * PAYMENTS
 *
 */
export const getUserPayments = async (filter) => {
  let res = await axios.post(URL.payments, buildFormData(filter));
  return res.data;
};

export const getUserPurchases = async (filter) => {
  let res = await axios.post(URL.purchases, buildFormData(filter));
  return res.data;
};

export const topupAccount = (amount, mobile) => {
  return axios.post(URL.topup, buildFormData({ amount, mobile }));
};

export const buyContent = async (buyObj) => {
  let res = await axios.post(URL.buy, buildFormData(buyObj));
  return res;
};

export const buyLoyaltyContent = async (buyObj) => {
  const res = await axios.post(URL.buy, buildFormData(buyObj));
  return res.data;
};
export const initMookhPay = (obj) => {
  return axios.post(URL.mookhInit, buildFormData(obj));
};

/**
 *
 * STREAM
 *
 */
export const requestStream = (streamObj) => {
  return axios.post(URL.streamRequest, buildFormData(streamObj), {timeout: 75000});
};
export const requestContentStream = async (streamObj) => {
  let res = await axios.post(URL.streamRequest, buildFormData(streamObj), {timeout: 75000});
  return res.data;
};
export const requestAwsContentStream = async (streamObj) => {
  let res = await axios.post(streamUrl(), streamObj, {timeout: 75000});
  return res.data;
};
export const requestAwsClipStream = async (streamObj) => {
  let res = await axios.post(clipStreamUrl(), streamObj, {timeout: 75000});
  return res.data;
};
export const setStreamProgress = async (streamObj) => {
  let res = await axios.post(URL.storeView, buildFormData(streamObj));
  return res;
};
export const getViewData = async (obj) => {
  const res = await axios.post(
    URL.movieViews,
    buildFormData(obj)
  );
  return res.data;
};

/** 
 Screening post request
*/
export const submitEnterpriseScreening = async (payloadObj) => {
  let res = await axios.post(URL.enterprisePayload, buildFormData(payloadObj));
  return res;
};



