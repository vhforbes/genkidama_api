import axios from 'axios';
import dotenv from 'dotenv';
import { AppDataSource } from '../../data-source';
import PaypalAccessToken from '../../models/PayPalAccessToken';

dotenv.config();

const paypalTokenApi = axios.create({});

class GetPaypalAccessToken {
  public static async execute(): Promise<{}> {
    const paypalAccessTokenRepository =
      AppDataSource.getRepository(PaypalAccessToken);

    const paypalAccessToken = await paypalAccessTokenRepository.find();

    if (paypalAccessToken[0]) {
      paypalAccessTokenRepository.delete(paypalAccessToken[0]);
    }

    const response = await paypalTokenApi({
      url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.PAYPAL_USERNAME as string,
        password: process.env.PAYPAL_PASSWORD as string,
      },
      params: {
        grant_type: 'client_credentials',
      },
    });

    const paypalToken = response.data.access_token;

    const createdPaypalAccessToken = paypalAccessTokenRepository.create({
      paypal_access_token: paypalToken,
    });

    await paypalAccessTokenRepository.save(createdPaypalAccessToken);

    return paypalToken as string;
  }
}

export default GetPaypalAccessToken;
