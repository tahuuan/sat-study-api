import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDB1748017515401 implements MigrationInterface {
    name = 'InitDB1748017515401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_133ec679a801fab5e070f73d3ea" DEFAULT NEWSEQUENTIALID(), "created_at" datetime2 NOT NULL CONSTRAINT "DF_a8fcf679692db1c886e7f15d2ba" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_386a5e03676dab6b7bf4bf020bd" DEFAULT getdate(), "deleted_at" datetime2, "name" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "address" varchar(255), "phone_number" varchar(255), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "delivery_partners" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_282c55e1a8d521fe45bd419a191" DEFAULT NEWSEQUENTIALID(), "created_at" datetime2 NOT NULL CONSTRAINT "DF_1fd45674e7731f21cdf2bb76f52" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_db8d2ae686b593125933a5c06cb" DEFAULT getdate(), "deleted_at" datetime2, "name" varchar(255) NOT NULL, "service_type" varchar(255) NOT NULL, "contact_phone" varchar(20) NOT NULL, "contact_email" varchar(255) NOT NULL, CONSTRAINT "PK_282c55e1a8d521fe45bd419a191" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouses" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_56ae21ee2432b2270b48867e4be" DEFAULT NEWSEQUENTIALID(), "created_at" datetime2 NOT NULL CONSTRAINT "DF_d458d3ad7d187ba7e4d4139cd69" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_ab4fbe34a8db9971f42a0628452" DEFAULT getdate(), "deleted_at" datetime2, "name" varchar(255) NOT NULL, "capacity" int NOT NULL, "location" varchar(255) NOT NULL, CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_b9535a98350d5b26e7eb0c26af4" DEFAULT NEWSEQUENTIALID(), "created_at" datetime2 NOT NULL CONSTRAINT "DF_e1f508d74b2f061e0248c2769cf" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_37738e835c865a9caf4635757fe" DEFAULT getdate(), "deleted_at" datetime2, "name" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "phone_number" varchar(255) NOT NULL, "type" varchar(255) CONSTRAINT CHK_c799ceecb01f3508430558eeaf_ENUM CHECK(type IN ('manager','staff')) NOT NULL CONSTRAINT "DF_a0acc597f8e6ccebe3859c98c16" DEFAULT 'staff', "salary" decimal(10,2) NOT NULL, "warehouse_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f099a75450ac2905b378f7c740" ON "employees" ("warehouse_id") `);
        await queryRunner.query(`CREATE TABLE "shipments" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_6deda4532ac542a93eab214b564" DEFAULT NEWSEQUENTIALID(), "created_at" datetime2 NOT NULL CONSTRAINT "DF_a7017e8920bde2638310718ad86" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_f78b482473b99b3b1a20733f471" DEFAULT getdate(), "deleted_at" datetime2, "status" varchar(50) NOT NULL, "estimated_delivery_date" timestamp NOT NULL, "carrier_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_6deda4532ac542a93eab214b564" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_710e2d4957aa5878dfe94e4ac2f" DEFAULT NEWSEQUENTIALID(), "created_at" datetime2 NOT NULL CONSTRAINT "DF_c884e321f927d5b86aac7c8f9ef" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_44eaa1eacc7a091d5d3e2a6c828" DEFAULT getdate(), "deleted_at" datetime2, "status" varchar(50) CONSTRAINT CHK_507d0ab3a6ca6dbb4c33de38ce_ENUM CHECK(status IN ('PROCESSING','SHIPPING','SUCCESS','CANCELLED')) NOT NULL, "order_date" datetime NOT NULL, "total_amount" int NOT NULL, "customer_id" uniqueidentifier NOT NULL, "warehouse_id" uniqueidentifier NOT NULL, "shipment_id" uniqueidentifier, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_772d0ce0473ac2ccfa26060dbe" ON "orders" ("customer_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_b17a0214fe7415e3cdc38923a4" ON "orders" ("shipment_id") WHERE "shipment_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_0806c755e0aca124e67c0cf6d7d" DEFAULT NEWSEQUENTIALID(), "created_at" datetime2 NOT NULL CONSTRAINT "DF_995d8194c43edfc98838cabc5ab" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_655479822939d59ee88d665d7bb" DEFAULT getdate(), "deleted_at" datetime2, "name" varchar(255) NOT NULL, "price" decimal(10,2) NOT NULL, "category" varchar(255) CONSTRAINT CHK_a5192be20a752c87c30e162b73_ENUM CHECK(category IN ('FOOD','ELECTRONICS','FASHION','APPLIANCES')) NOT NULL, "is_available" bit NOT NULL CONSTRAINT "DF_c54524c7e4f7409fd7ff2974f23" DEFAULT 1, "version" int NOT NULL CONSTRAINT "DF_01d5a9fbcc9680cf56e87bc8345" DEFAULT 1, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4c9fb58de893725258746385e1" ON "products" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_c3932231d2385ac248d0888d95" ON "products" ("category") `);
        await queryRunner.query(`CREATE TABLE "order_details" ("order_id" uniqueidentifier NOT NULL, "product_id" uniqueidentifier NOT NULL, CONSTRAINT "UQ_b2a13944a814f28f54b46f8754f" UNIQUE ("order_id", "product_id"), CONSTRAINT "PK_ce1f689e43b39edd9330cadaeb8" PRIMARY KEY ("product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3ff3367344edec5de2355a562e" ON "order_details" ("order_id") `);
        await queryRunner.query(`CREATE TABLE "suppliers" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_b70ac51766a9e3144f778cfe81e" DEFAULT NEWSEQUENTIALID(), "created_at" datetime2 NOT NULL CONSTRAINT "DF_9f44246fb458d4367d206b1c9a9" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_04a653cd3684cbd2539a3dad3b6" DEFAULT getdate(), "deleted_at" datetime2, "name" varchar(255) NOT NULL, "country" varchar(255) NOT NULL, "contact_phone" varchar(20) NOT NULL, "contact_email" varchar(255) NOT NULL, CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supplier_products" ("supplier_id" uniqueidentifier NOT NULL, "product_id" uniqueidentifier NOT NULL, CONSTRAINT "UQ_bb18600cc0829bc122f097b4f09" UNIQUE ("supplier_id", "product_id"), CONSTRAINT "PK_9ff2b133160a708a047cbce49d2" PRIMARY KEY ("product_id"))`);
        await queryRunner.query(`CREATE TABLE "stores" ("warehouse_id" uniqueidentifier NOT NULL, "product_id" uniqueidentifier NOT NULL, CONSTRAINT "UQ_e865400b003532b37a33bd4a94e" UNIQUE ("warehouse_id", "product_id"), CONSTRAINT "PK_283e84d8d251099ddc8871e1d08" PRIMARY KEY ("product_id"))`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_f099a75450ac2905b378f7c740a" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD CONSTRAINT "FK_4f17b95585cca970248ddbbf0ab" FOREIGN KEY ("carrier_id") REFERENCES "delivery_partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a1fd4de5944756bdb80799b00bc" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b17a0214fe7415e3cdc38923a49" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD CONSTRAINT "FK_3ff3367344edec5de2355a562ee" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD CONSTRAINT "FK_ce1f689e43b39edd9330cadaeb8" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_products" ADD CONSTRAINT "FK_4286173e1486a5c528f89dc798c" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_products" ADD CONSTRAINT "FK_9ff2b133160a708a047cbce49d2" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_78b7ba62df09e3b7eb2b915f28f" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_283e84d8d251099ddc8871e1d08" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_283e84d8d251099ddc8871e1d08"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_78b7ba62df09e3b7eb2b915f28f"`);
        await queryRunner.query(`ALTER TABLE "supplier_products" DROP CONSTRAINT "FK_9ff2b133160a708a047cbce49d2"`);
        await queryRunner.query(`ALTER TABLE "supplier_products" DROP CONSTRAINT "FK_4286173e1486a5c528f89dc798c"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP CONSTRAINT "FK_ce1f689e43b39edd9330cadaeb8"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP CONSTRAINT "FK_3ff3367344edec5de2355a562ee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b17a0214fe7415e3cdc38923a49"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a1fd4de5944756bdb80799b00bc"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP CONSTRAINT "FK_4f17b95585cca970248ddbbf0ab"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_f099a75450ac2905b378f7c740a"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "supplier_products"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP INDEX "IDX_3ff3367344edec5de2355a562e" ON "order_details"`);
        await queryRunner.query(`DROP TABLE "order_details"`);
        await queryRunner.query(`DROP INDEX "IDX_c3932231d2385ac248d0888d95" ON "products"`);
        await queryRunner.query(`DROP INDEX "IDX_4c9fb58de893725258746385e1" ON "products"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "REL_b17a0214fe7415e3cdc38923a4" ON "orders"`);
        await queryRunner.query(`DROP INDEX "IDX_772d0ce0473ac2ccfa26060dbe" ON "orders"`);
        await queryRunner.query(`DROP INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "shipments"`);
        await queryRunner.query(`DROP INDEX "IDX_f099a75450ac2905b378f7c740" ON "employees"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TABLE "warehouses"`);
        await queryRunner.query(`DROP TABLE "delivery_partners"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
