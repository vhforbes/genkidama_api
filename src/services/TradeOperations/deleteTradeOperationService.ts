import { deleteOperation } from '../../bot/tradeOperationsBot/deleteOperation';
import AppError from '../../errors/AppError';
import TradeOperation from '../../models/TradeOperation';
import TradeOperationsRepository from '../../repositories/TradeOperationsRepository';

interface DeleteTradeOperationRequest {
  id: string;
}

class DeleteTradeOperationService {
  public static async execute({
    id,
  }: DeleteTradeOperationRequest): Promise<TradeOperation | null> {
    const tradeOperationsRepository = TradeOperationsRepository;

    const tradeOperation = await tradeOperationsRepository.findOne({
      where: {
        id: id as string,
      },
    });

    if (!tradeOperation) {
      throw new AppError('Could not find trade operation to delete');
    }

    const result = await tradeOperationsRepository.remove(tradeOperation);

    result.id = id as string;

    await deleteOperation(result);

    return result;
  }
}

export default DeleteTradeOperationService;
