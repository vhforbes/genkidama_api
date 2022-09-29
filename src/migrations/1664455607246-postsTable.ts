import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class postsTable1664455607246 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createTable(
      new Table({
        name: "posts",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "date",
            type: "timestamp with time zone",
            isNullable: false,
          },
          {
            name: "author",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "title",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "content",
            type: "Text",
            isNullable: false,
          },
          {
            name: "image",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "video",
            type: "varchar",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("posts");
  }
}
