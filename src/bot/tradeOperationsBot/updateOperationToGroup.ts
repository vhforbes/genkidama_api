import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import { bot } from '../initializeBot';

export const updateOperationToGroup = async (
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
    result = '',
    active,
    stop,
  } = tradeOperation;

  const isActive = active ? 'ATIVA' : `FECHADA: ${result}`;

  const messageHtml = `
      <b>OPERAÇÃO ATUALIZADA</b>: ${market}\n
      <b>${isActive}</b> 

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
