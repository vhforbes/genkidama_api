import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import { bot } from '../initializeBot';

export const newOperationToGroup = async (
  chatId: number,
  tradeOperation: PayloadTradeOperationInterface,
) => {
  const {
    market,
    entryOrderOne = `R$${tradeOperation.entryOrderOne}`,
    entryOrderTwo = '-',
    entryOrderThree = '-',
    takeProfitOne,
    takeProfitTwo = '-',
    stop,
  } = tradeOperation;

  // let entryOrdersMessage = `${entryOrderTwo ? entryOrderTwo : '-'}`;

  const messageHtml = `
      <b>NOVA OPERAÇÃO</b>: ${market}\n
      <b>ENTRADAS:</b>
      1. R$${entryOrderOne}
      2. R$${entryOrderTwo}
      3. R$${entryOrderThree}
  
      <b>STOP:</b>
      R$${stop}
  
      <b>TAKE PROFIT</b>
      1. R$${takeProfitOne}
      2. R$${takeProfitTwo}
    `;

  await bot.sendMessage(chatId, messageHtml, { parse_mode: 'HTML' });
};
