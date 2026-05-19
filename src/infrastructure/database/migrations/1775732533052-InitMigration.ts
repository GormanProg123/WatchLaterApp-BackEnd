import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1775732533052 implements MigrationInterface {
    name = 'InitMigration1775732533052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ADD "thumbnailUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "thumbnailUrl"`);
    }

}
