import axios from 'axios';
import { AppDataSource } from '../data-source';
import AppError from '../errors/AppError';
import PaypalAccessToken from '../models/PayPalAccessToken';
import GetPaypalAccessToken from '../services/Paypal/GetPaypalAccessToken';

const paypalPrivateApi = axios.create({});

paypalPrivateApi.defaults.baseURL = 'https://api.paypal.com/v1/';

paypalPrivateApi.interceptors.request.use(
  async config => {
    const paypalAccessTokenRepository =
      AppDataSource.getRepository(PaypalAccessToken);

    const paypalAccessToken = await paypalAccessTokenRepository.find();

    const token = paypalAccessToken[0]?.paypal_access_token;

    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers = {
        // ...config.headers,
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  error => () => new AppError(error.message),
);

paypalPrivateApi.interceptors.response.use(
  response => response,
  async error => {
    const config = error?.config;

    const paypalAccessToken = await GetPaypalAccessToken.execute();

    if (error?.response?.status === (401 || 415) && !config?.sent) {
      config.sent = true;

      if (paypalAccessToken) {
        config.headers = {
          ...config.headers,
          'content-type': 'application/json',
          Authorization: `Bearer ${paypalAccessToken}`,
        };
      }

      return axios(config);
    }
    return Promise.reject(error);
  },
);

export default paypalPrivateApi;
