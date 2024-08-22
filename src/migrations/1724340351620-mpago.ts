import { MigrationInterface, QueryRunner } from "typeorm";

export class Mpago1724340351620 implements MigrationInterface {
    name = 'Mpago1724340351620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facturacion" ALTER COLUMN "observaciones" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "facturacion" ALTER COLUMN "tipoPago" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facturacion" ALTER COLUMN "tipoPago" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "facturacion" ALTER COLUMN "observaciones" SET NOT NULL`);
    }

}
