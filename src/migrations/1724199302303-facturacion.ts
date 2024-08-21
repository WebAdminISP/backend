import { MigrationInterface, QueryRunner } from "typeorm";

export class Facturacion1724199302303 implements MigrationInterface {
    name = 'Facturacion1724199302303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "UQ_9110d5ef2d8422536a6cbbe933f" UNIQUE ("macEquipo")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "UQ_9110d5ef2d8422536a6cbbe933f"`);
    }

}
