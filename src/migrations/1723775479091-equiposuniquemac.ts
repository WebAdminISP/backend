import { MigrationInterface, QueryRunner } from "typeorm";

export class Equiposuniquemac1723775479091 implements MigrationInterface {
    name = 'Equiposuniquemac1723775479091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "UQ_9110d5ef2d8422536a6cbbe933f" UNIQUE ("macEquipo")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "UQ_9110d5ef2d8422536a6cbbe933f"`);
    }

}
