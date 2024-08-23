import { MigrationInterface, QueryRunner } from "typeorm";

export class Asistencias1724446610017 implements MigrationInterface {
    name = 'Asistencias1724446610017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facturacion" ADD "referenciaId" integer`);
        await queryRunner.query(`ALTER TABLE "facturacion" ADD "fechaPago" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facturacion" DROP COLUMN "fechaPago"`);
        await queryRunner.query(`ALTER TABLE "facturacion" DROP COLUMN "referenciaId"`);
    }

}
