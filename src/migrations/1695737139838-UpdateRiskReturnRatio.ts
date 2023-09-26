/* eslint-disable */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRiskReturnRatio1695737139838 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add new column to the table
    await queryRunner.query(
      `ALTER TABLE "tradeOperations" ADD COLUMN riskReturnRatio DECIMAL DEFAULT NULL`,
    );

    // 2. Update existing rows
    await queryRunner.query(`
            UPDATE "tradeOperations"
            SET riskReturnRatio = percentual / "stopDistance"
            WHERE status = 'fechada' AND "stopDistance" <> 0 AND percentual <> 0
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes
    await queryRunner.query(
      `ALTER TABLE "tradeOperations" DROP COLUMN "riskReturnRatio"`,
    );
  }
}
