/* eslint-disable no-param-reassign */
import axios from 'axios';
import AppError from '../errors/AppError';
import { generateSignature } from '../utils/generateBitgetSignature';

// Assuming you have a function to generate the signature

const bitgetPrivateApi = axios.create({});

bitgetPrivateApi.defaults.baseURL = 'https://api.bitget.com';

bitgetPrivateApi.interceptors.request.use(
  async config => {
    const method = config.method?.toUpperCase() ?? 'GET';
    const timestamp = Date.now().toString();
    const signature = generateSignature(
      timestamp,
      method,
      config.url ?? '',
      JSON.stringify(config.data),
      '', // Add query string if applicable
    );

    // Directly assign necessary headers
    config.headers.set({
      'ACCESS-KEY': 'bg_9f590483c3b8da7d49ebaef91662af29',
      'ACCESS-SIGN': signature,
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-PASSPHRASE': '170496hugo',
      'Content-Type': 'application/json',
      locale: 'en-US',
    });

    return config;
  },
  error => {
    console.error('Error in request setup:', error);
    throw new AppError(error.message);
  },
);

bitgetPrivateApi.interceptors.response.use(
  response => response,
  async error => {
    // Handle specific Bitget API error responses here
    return Promise.reject(error);
  },
);

export default bitgetPrivateApi;
