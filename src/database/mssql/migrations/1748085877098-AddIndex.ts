import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndex1748085877098 implements MigrationInterface {
    name = 'AddIndex1748085877098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8536b8b85c06969f84f0c098b0" ON "customers" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_8536b8b85c06969f84f0c098b0" ON "customers"`);
    }

}
