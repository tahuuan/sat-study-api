import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDeliveryDate1748018461677 implements MigrationInterface {
    name = 'FixDeliveryDate1748018461677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "estimated_delivery_date"`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "estimated_delivery_date" varchar(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN "estimated_delivery_date"`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD "estimated_delivery_date" timestamp NOT NULL`);
    }

}
