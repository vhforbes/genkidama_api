/* eslint-disable */
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class createSubscription1669738765564 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subscriptions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'subscription_id',
            type: 'varchar',
          },
          {
            name: 'plan_id',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            default: 'inactive',
          },
          {
            name: 'current_period_start',
            type: 'timestamp',
          },
          {
            name: 'current_period_end',
            type: 'timestamp',
          },
          {
            name: 'canceled_at',
            type: 'timestamp',
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'subscription_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'UserSubscription',
        columnNames: ['subscription_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'subscriptions',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    const foreignKey = table?.foreignKeys.find(
      fk => fk.columnNames.indexOf('subscription_id') !== -1,
    );

    if (!foreignKey) {
      throw new Error('Foregin keuy not found');
    }

    await queryRunner.dropForeignKey('users', foreignKey);

    await queryRunner.dropTable('subscriptions');
  }
}
