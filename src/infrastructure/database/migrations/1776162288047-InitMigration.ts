import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1776162288047 implements MigrationInterface {
    name = 'InitMigration1776162288047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "deletedAt"`);
    }

}
