/* eslint-disable @typescript-eslint/naming-convention */
import TradeOperation from '../../models/TradeOperation';
import UsersRepository from '../../repositories/UsersRepository';
import sendMessageToGroup from '../utils/sendMessageToGroup';
import sendMessageToUsers from '../utils/sendMessageToUsers';

export const deleteOperation = async (tradeOperation: TradeOperation) => {
  const { market } = tradeOperation;

  const messageHtml = `
<b>OPERAÇÃO CANCELADA</b>: 
<b>${market}</b> | CANCELADA
`;

  const users = await UsersRepository.memberList();

  await sendMessageToUsers({ users, messageHtml });
  await sendMessageToGroup(messageHtml);
};
