/* eslint-disable @typescript-eslint/naming-convention */
import TradeOperation from '../../models/TradeOperation';
import User from '../../models/User';
import sendMessageToUsers from '../utils/sendMessageToUsers';

// const groupId = process.env.GROUP_ID as string;

export const updateOperationToGroup = async (
  tradeOperation: TradeOperation,
  users: User[],
) => {
  const {
    market,
    direction,
    // entry_order_one = `$ ${tradeOperation.entry_order_one}`,
    // entry_order_two = '-',
    // entry_order_three = '-',
    // take_profit_one,
    // take_profit_two = '-',
    result = '',
    status,
    // stop,
    observation,
  } = tradeOperation;

  const messageHtml = `
<b>OPERAÇÃO ATUALIZADA</b>: 
<b>${market}</b> | ${direction} | ${status} | ${result || ''}
${`<b>Obs:  ${observation}</b>\n`}
`;

  await sendMessageToUsers({ users, messageHtml });
};

// IF NEEDED IN THE FUTURE 03/05
// <b>ENTRADAS:</b>
// 1. $ ${entry_order_one}
// 2. $ ${entry_order_two}
// 3. $ ${entry_order_three}

// <b>STOP:</b>
// $ ${stop}

// <b>TAKE PROFIT</b>
// 1. $ ${take_profit_one}
// 2. $ ${take_profit_two}
