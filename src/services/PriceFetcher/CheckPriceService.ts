import dotenv from 'dotenv';
import bitgetPrivateApi from '../../apis/bitgetApi';
import AppError from '../../errors/AppError';
import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';

dotenv.config();

interface PriceData {
  entry: number;
  highest: number;
  lowest: number;
}

class CheckPriceService {
  public static async execute(
    tradeOperation: PayloadTradeOperationInterface,
  ): Promise<PriceData> {
    console.log('Checking price for: ', tradeOperation.market);

    let queryParams = {};

    let url = '';

    queryParams = new URLSearchParams({
      productType: 'USDT-FUTURES',
      symbol: tradeOperation.market,
      granularity: '15min',
      limit: '1',
    }).toString();

    url = `/api/v2/mix/market/candles`;

    if (tradeOperation.marketLocation === 'spot') {
      queryParams = new URLSearchParams({
        symbol: tradeOperation.market,
        granularity: '15min',
        limit: '1',
      }).toString();

      url = '/api/v2/spot/market/candles';
    }

    try {
      const response = await bitgetPrivateApi.get(`${url}?${queryParams}`);

      const price = {
        entry: parseFloat(response.data.data[0][1]),
        highest: parseFloat(response.data.data[0][2]),
        lowest: parseFloat(response.data.data[0][3]),
      };

      return price;
    } catch (error: any) {
      console.error(error.response);
      throw new AppError(
        `Error when fetching price from bitget for ${tradeOperation.market}`,
      ); // Or handle the error as needed
    }
  }
}

export default CheckPriceService;
