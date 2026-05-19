import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1774998332028 implements MigrationInterface {
    name = 'InitMigration1774998332028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying, "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "displayName" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."items_platform_enum" AS ENUM('youtube', 'movies', 'series', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."items_status_enum" AS ENUM('want', 'watching', 'done')`);
        await queryRunner.query(`CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying, "title" character varying, "description" character varying, "platform" "public"."items_platform_enum" NOT NULL DEFAULT 'other', "status" "public"."items_status_enum" NOT NULL DEFAULT 'want', "remindAt" TIMESTAMP WITH TIME ZONE, "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reminders_channel_enum" AS ENUM('email', 'push', 'in_app')`);
        await queryRunner.query(`CREATE TABLE "reminders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "userId" uuid NOT NULL, "remindAt" TIMESTAMP WITH TIME ZONE NOT NULL, "channel" "public"."reminders_channel_enum" NOT NULL DEFAULT 'in_app', "sent" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_38715fec7f634b72c6cf7ea4893" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item_tags" ("item_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_c77c2056c78ecfeecd875046803" PRIMARY KEY ("item_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d1bba39d4371f56d3e5e4ee9b8" ON "item_tags" ("item_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_986c538d3231d4fc0c2bdfc15a" ON "item_tags" ("tag_id") `);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_92e67dc508c705dd66c94615576" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_40e681891fea5a4b3c5c2546d15" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminders" ADD CONSTRAINT "FK_4671dd4ccd398185206e74d9b9b" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminders" ADD CONSTRAINT "FK_f8e4bc520d9e692652afaf3308b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_tags" ADD CONSTRAINT "FK_d1bba39d4371f56d3e5e4ee9b80" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "item_tags" ADD CONSTRAINT "FK_986c538d3231d4fc0c2bdfc15ae" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_tags" DROP CONSTRAINT "FK_986c538d3231d4fc0c2bdfc15ae"`);
        await queryRunner.query(`ALTER TABLE "item_tags" DROP CONSTRAINT "FK_d1bba39d4371f56d3e5e4ee9b80"`);
        await queryRunner.query(`ALTER TABLE "reminders" DROP CONSTRAINT "FK_f8e4bc520d9e692652afaf3308b"`);
        await queryRunner.query(`ALTER TABLE "reminders" DROP CONSTRAINT "FK_4671dd4ccd398185206e74d9b9b"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_40e681891fea5a4b3c5c2546d15"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_92e67dc508c705dd66c94615576"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_986c538d3231d4fc0c2bdfc15a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1bba39d4371f56d3e5e4ee9b8"`);
        await queryRunner.query(`DROP TABLE "item_tags"`);
        await queryRunner.query(`DROP TABLE "reminders"`);
        await queryRunner.query(`DROP TYPE "public"."reminders_channel_enum"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TYPE "public"."items_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."items_platform_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
