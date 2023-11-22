import dotenv from 'dotenv';
import bitgetPrivateApi from '../../apis/bitgetApi';

dotenv.config();

class CheckPriceService {
  public static async execute(market: string): Promise<any> {
    console.log('Checking price for: ', market);

    const queryParams = new URLSearchParams({
      productType: 'USDT-FUTURES',
      symbol: market,
      granularity: '1m',
      limit: '1',
    }).toString();

    try {
      const response = await bitgetPrivateApi.get(
        `/api/v2/mix/market/candles?${queryParams}`,
      );

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching market price:', error);
      throw error; // Or handle the error as needed
    }
  }
}

export default CheckPriceService;
