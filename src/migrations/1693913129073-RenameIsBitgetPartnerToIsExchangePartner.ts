/* eslint-disable */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameIsBitgetPartnerToIsExchangePartner1693913129073
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('users', 'bitgetPartner', 'exchangePartner');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('users', 'exchangePartner', 'bitgetPartner');
  }
}
