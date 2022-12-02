import axios from 'axios';
import dotenv from 'dotenv';

/*
[] Check if a auth token already exists ou is expired
[] Get auth token
[] Save it somewhere
[]
*/

class GetPaypalAccessToken {
  public static async execute(): Promise<{}> {
    dotenv.config();

    const response = await axios({
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

    const token = response.data.access_token;

    return token;
  }
}

export default GetPaypalAccessToken;
