export interface ResponseTradeOperationInterface {
  id: string;
  authorId: string;
  market: string;
  status: 'aguardando' | 'ativa' | 'fechada';
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
  maxFollowers?: number;
  tradingViewLink?: string;
  currentFollowers?: number;
  percentual?: string;
  stopDistance?: string;
  history?: ResponseTradeOperationInterface[];
}

export interface PayloadTradeOperationInterface {
  id: string;
  authorId: string;
  market: string;
  status: 'aguardando' | 'ativa' | 'fechada';
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
  maxFollowers?: number;
  tradingViewLink?: string;
  percentual?: string;
  stopDistance?: string;
}

export interface UpdateTradeOperationInterface {
  id: string;
  authorId?: string;
  market?: string;
  status?: 'aguardando' | 'ativa' | 'fechada';
  direction?: string;
  entryOrderOne?: string;
  entryOrderTwo?: string;
  entryOrderThree?: string;
  takeProfitOne: string;
  takeProfitTwo?: string;
  stop?: string;
  createdAt?: string;
  updatedAt?: string;
  result?: string;
  observation?: string;
  maxFollowers?: number;
  tradingViewLink?: string;
  percentual?: string;
  stopDistance?: string;
}
