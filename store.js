export const API_URL = 'https://app.mymovies.africa/api/cache';

export const baseURL = 'https://api.mymovies.africa/';
export const baseAPI = baseURL + 'api/v1/';

export const mediaURL = baseURL + 'content/uploads/';
export const streamURL = 'https://cdn.mymovies.africa/';

const URL = {
  baseAPI,
  streamURL,
  mediaURL,

  banners: mediaURL + 'banners/',

  /* Content */
  content: 'content',
  search: 'search',
  websearch: 'websearch',
  genres: 'genres',
  recommendations: 'recommendations',
  views: 'views/store',

  /* Content Rating */
  rateContent: 'rate',
  getContentRating: 'rate/',

  /*movie requests */
  addRequest: 'add/request/',

  /*content form */
  addContentForm: 'add/contentForm/',

  /* Screenings Check-ins */
  screenings: 'screening',
  checkIn: 'screening/checkIn',
  enterprisePayload: 'bulkscreenings',

  /* Payments */
  payments: 'users/payments',
  purchases: 'purchases',

  topup: 'mps/checkout',
  mookhInit: 'mk/init',
  payGate: 'payment/gate',

  /* Streaming */
  streamRequest: 'content/stream/request',
  storeView: 'views/store',
  awsStreamRequest: 'api/content/v1/request',
  awsStreamClipRequest: 'api/content/clip/request',
  movieViews: '/users/allviews',


  /* Users */
  login: 'users/login',
  updateUser: 'users/update',
  buy: 'users/buy',
  id: 'users/customerid',
  ref: 'screening/isRefCodeValid',
  sms: 'users/sendMessage',
  createMultipleAccounts: 'users/createMultipleAccounts',
  customerByEmail: 'users/customerid',
  postRefreshments: '/screening/groupRefreshments/',
  

  /*rewards*/
  addReward: 'reward/add',
  redeem: 'handleVoucherTransaction',

  bundle: 'users/bundle',

  wallet: 'users/wallet',
  favourites: 'users/favourites',
  favouritesToggle: 'users/favourites/toggle',
  phone: 'users/phone',

  downloads: 'users/downloads',

  /*rewards*/
  releases: 'media',
  singleRelease: 'media?id=',
  /*Ticketing*/
};

export default URL;





