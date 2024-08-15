import { MigrationInterface, QueryRunner } from "typeorm";

export class Useractive1723736863933 implements MigrationInterface {
    name = 'Useractive1723736863933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "activo" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "activo"`);
    }

}
