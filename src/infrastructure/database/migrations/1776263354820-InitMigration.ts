import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1776263354820 implements MigrationInterface {
    name = 'InitMigration1776263354820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "pushToken" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "notificationsEnabled" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "notificationsEnabled"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pushToken"`);
    }

}
