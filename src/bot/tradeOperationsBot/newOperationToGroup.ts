import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import { bot } from '../initializeBot';

const groupId = process.env.GROUP_ID as string;

export const newOperationToGroup = async (
  tradeOperation: PayloadTradeOperationInterface,
) => {
  const {
    market,
    direction,
    entryOrderOne = `$ ${tradeOperation.entryOrderOne}`,
    entryOrderTwo = '-',
    entryOrderThree = '-',
    takeProfitOne,
    takeProfitTwo = '-',
    stop,
    observation = '',
  } = tradeOperation;

  // let entryOrdersMessage = `${entryOrderTwo ? entryOrderTwo : '-'}`;

  const messageHtml = `
      <b>NOVA OPERAÇÃO</b>: ${market}\n
      ${direction}

      ${observation && `<b>Obs:  ${observation}</b>\n`}
      <b>ENTRADAS:</b>
      1. $ ${entryOrderOne}
      2. $ ${entryOrderTwo}
      3. $ ${entryOrderThree}
  
      <b>STOP:</b>
      $ ${stop}
  
      <b>TAKE PROFIT</b>
      1. $ ${takeProfitOne}
      2. $ ${takeProfitTwo}
    `;

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};
