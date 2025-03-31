import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migrate1708037140243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        schema: "public",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "63",
          },
          {
            name: "email",
            type: "varchar",
            length: "127",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
            length: "127",
          },
          {
            name: "birthAt",
            type: "date",
            isNullable: true,
          },
          {
            name: "role",
            type: "int",
            default: 1,
          },
          {
            name: "createdAt",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
