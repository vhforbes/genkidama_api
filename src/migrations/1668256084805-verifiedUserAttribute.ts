/* eslint-disable */
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class verifiedUserAttribute1668256084805 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const verified = new TableColumn({
      name: 'verified',
      type: 'bool',
      default: false,
    });

    await queryRunner.addColumn('users', verified);

    await queryRunner.createTable(
      new Table({
        name: 'tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'verified');
    await queryRunner.dropTable('tokens');
  }
}
