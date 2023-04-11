/* eslint-disable @typescript-eslint/naming-convention */
import TradeOperation from '../../models/TradeOperation';
import { bot } from '../initializeBot';

const groupId = process.env.GROUP_ID as string;

export const newOperationToGroup = async (tradeOperation: TradeOperation) => {
  const {
    market,
    direction,
    entry_order_one = `$ ${tradeOperation.entry_order_one}`,
    entry_order_two = '-',
    entry_order_three = '-',
    take_profit_one,
    take_profit_two = '-',
    status,
    stop,

    observation = '',
  } = tradeOperation;

  // let entryOrdersMessage = `${entryOrderTwo ? entryOrderTwo : '-'}`;

  const messageHtml = `
      <b>NOVA OPERAÇÃO</b>: ${market} - ${direction}\n
      
      ${status}

      ${observation && `<b>Obs:  ${observation}</b>\n`}
      <b>ENTRADAS:</b>
      1. $ ${entry_order_one}
      2. $ ${entry_order_two}
      3. $ ${entry_order_three}
  
      <b>STOP:</b>
      $ ${stop}
  
      <b>TAKE PROFIT</b>
      1. $ ${take_profit_one}
      2. $ ${take_profit_two}
    `;

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};
