/* eslint-disable no-param-reassign */
import axios from 'axios';
import dotenv from 'dotenv';
import AppError from '../errors/AppError';
import { generateSignature } from '../utils/generateBitgetSignature';

// Assuming you have a function to generate the signature

dotenv.config();

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
      'ACCESS-KEY': process.env.BITGET_ACCESS_KEY as string,
      'ACCESS-SIGN': signature,
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-PASSPHRASE': process.env.BITGET_ACCESS_PASSPHRASE as string,
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
