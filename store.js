export const API_URL = 'https://app.mymovies.africa/api/cache';

export const baseURL = 'https://api.mymovies.africa/';

export const mediaURL = baseURL + 'content/uploads/';

export const paymentUrl = `https://api.mymovies.africa/api/v1/payment/gate/10/?amount=${purchaseType === 'RENTAL' ? 149 : 349}&purchase_type=${purchaseType}&ref=${movie.ref}`


