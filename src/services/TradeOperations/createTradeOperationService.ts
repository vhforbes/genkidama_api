import { AppDataSource } from '../../data-source';
import TradeOperation from '../../models/TradeOperation';

interface Request {
  authorId: string;
  market: string;
  active: boolean;
  direction: string;
  entryZoneStart: number;
  entryZoneEnd: number;
  stop: number;
}

class CreateTradeOperationService {
  public static async execute({
    authorId,
    market,
    active,
    direction,
    entryZoneStart,
    entryZoneEnd,
    stop,
  }: Request): Promise<TradeOperation | null> {
    const tradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    const tradeOperation = tradeOperationsRepository.create({
      author_id: authorId,
      market,
      active,
      direction,
      entry_zone_start: entryZoneStart,
      entry_zone_end: entryZoneEnd,
      stop,
    });

    const results = await tradeOperationsRepository.save(tradeOperation);

    return results;
  }
}

export default CreateTradeOperationService;
