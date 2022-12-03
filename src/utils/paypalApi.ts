import axios from 'axios';
import AppError from '../errors/AppError';
import GetPaypalAccessToken from '../services/Paypal/GetPaypalAccessToken';

axios.defaults.baseURL = 'https://api.sandbox.paypal.com/v1/';

axios.interceptors.request.use(
  async config => {
    const paypalAccessToken = '';

    if (paypalAccessToken) {
      // eslint-disable-next-line no-param-reassign
      config.headers = {
        // ...config.headers,
        'content-type': 'application/json',
        Authorization: `Bearer ${paypalAccessToken}`,
      };
    }

    return config;
  },
  error => () => new AppError(error.message),
);

axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;

      const paypalAccessToken = await GetPaypalAccessToken.execute();

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

const paypalApi = axios;

export default paypalApi;
