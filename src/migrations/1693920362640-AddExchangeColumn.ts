/* eslint-disable */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExchangeColumn1630840800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new column 'exchange'
    await queryRunner.query(
      'ALTER TABLE users ADD COLUMN exchange character varying',
    );

    // Copy data from 'role' to 'exchange' where role = 'BITGET'
    await queryRunner.query(
      "UPDATE users SET exchange = 'BITGET' WHERE role = 'BITGET'",
    );

    // Update 'role' to NULL where role = 'BITGET'
    await queryRunner.query(
      "UPDATE users SET role = NULL WHERE role = 'BITGET'",
    );

    // Delete 'BITGET' from 'role'
    await queryRunner.query("DELETE FROM users WHERE role = 'BITGET'");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // If needed, reset 'role' where 'exchange' = 'BITGET'
    await queryRunner.query(
      "UPDATE users SET role = 'BITGET' WHERE exchange = 'BITGET'",
    );

    // Remove 'exchange' column
    await queryRunner.query('ALTER TABLE users DROP COLUMN exchange');
  }
}
