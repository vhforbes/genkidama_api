export interface TradeOperationInterface {
  id: string;
  authorId: string;
  market: string;
  active: boolean;
  direction: string;
  entryOrderOne: number;
  entryOrderTwo?: number;
  entryOrderThree?: number;
  takeProfitOne: number;
  takeProfitTwo?: number;
  stop: number;
  createdAt?: string;
  updatedAt?: string;
  result?: string;
  observation?: string;
}

export interface PayloadTradeOperationInterface {
  id: string;
  authorId: string;
  market: string;
  active: boolean;
  direction: string;
  entryOrderOne: string;
  entryOrderTwo?: string;
  entryOrderThree?: string;
  takeProfitOne: string;
  takeProfitTwo?: string;
  stop: string;
  createdAt?: string;
  updatedAt?: string;
  result?: string;
  observation?: string;
  percentual?: number;
}
