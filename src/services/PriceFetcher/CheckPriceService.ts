import dotenv from 'dotenv';
import bitgetPrivateApi from '../../apis/bitgetApi';
import AppError from '../../errors/AppError';

dotenv.config();

interface PriceData {
  entry: number;
  highest: number;
  lowest: number;
}

class CheckPriceService {
  public static async execute(market: string): Promise<PriceData> {
    console.log('Checking price for: ', market);

    const queryParams = new URLSearchParams({
      productType: 'USDT-FUTURES',
      symbol: market,
      granularity: '5m',
      limit: '1',
    }).toString();

    try {
      const response = await bitgetPrivateApi.get(
        `/api/v2/mix/market/candles?${queryParams}`,
      );

      const price = {
        entry: parseInt(response.data.data[0][1], 10),
        highest: parseInt(response.data.data[0][2], 10),
        lowest: parseInt(response.data.data[0][3], 10),
      };

      return price;
    } catch (error) {
      console.error(error);
      throw new AppError(`Error when fetching price from bitget for ${market}`); // Or handle the error as needed
    }
  }
}

export default CheckPriceService;
