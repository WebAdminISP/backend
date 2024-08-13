import { MigrationInterface, QueryRunner } from 'typeorm';

export class Inicial1723567911055 implements MigrationInterface {
  name = 'Inicial1723567911055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "codArea" character varying NOT NULL DEFAULT '261'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "tipoDocum" character varying(20) NOT NULL DEFAULT 'DNI'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "documento"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "documento" character varying(20) NOT NULL DEFAULT '00000000'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "documento"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "documento" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tipoDocum"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "codArea"`);
  }
}
