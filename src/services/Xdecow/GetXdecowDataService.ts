import axios from 'axios';
import AppError from '../../errors/AppError';

interface XdecowData {
  id: string;
  timestamp: number;
  current_cycle: number;
  next_cycle: number;
  summary: null;
  radar: boolean;
  data: {
    symbol: string;
    mv_15_xmean: number;
    oi_60_delta: number;
    funding_rate: number;
  };
}

interface Response {
  symbol: string;
  mv_15_xmean: number;
  oi_60_delta: number;
  funding_rate: number;
}

const fiveMinutesAppart = (timestamp1: number, timestamp2: number): boolean => {
  const diffInSeconds = Math.abs(timestamp1 - timestamp2);
  const fiveMinutesInSeconds = 5 * 60;
  return diffInSeconds >= fiveMinutesInSeconds;
};

let xdecowTime = 0;

let xdecowData = {} as XdecowData;

class GetXdecowDataService {
  public static async execute(): Promise<Response> {
    const serverTime = new Date().getTime() / 1000; // Get in seconds

    if (fiveMinutesAppart(serverTime, xdecowTime)) {
      try {
        console.log('MAKING XDECOW REQUEST');
        const response = await axios.get(
          'https://xdecow.com/api/report/pvt/btc-summary/Psuleuf2ZAPqFvGRAWCM4hVmY3xj1dSb',
        );

        xdecowData = response.data as XdecowData;

        xdecowTime = xdecowData.timestamp;

        return xdecowData.data;
      } catch (error) {
        throw new AppError('Could not get xdecow data');
      }
    }

    return xdecowData.data;
  }
}

export default GetXdecowDataService;
