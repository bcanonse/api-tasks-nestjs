import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1730908487794 implements MigrationInterface {
    name = 'Init1730908487794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id")); COMMENT ON COLUMN "projects"."name" IS 'Name of project'; COMMENT ON COLUMN "projects"."description" IS 'Description of project'`);
        await queryRunner.query(`CREATE TYPE "public"."users_projects_access_level_enum" AS ENUM('30', '40', '50')`);
        await queryRunner.query(`CREATE TABLE "users_projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "access_level" "public"."users_projects_access_level_enum" NOT NULL, "user_id" uuid, "project_id" uuid, CONSTRAINT "PK_f3d2d1a584f1bbc6a91d7ea5773" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_entity_role_enum" AS ENUM('BASIC', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "age" integer NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_entity_role_enum" NOT NULL, CONSTRAINT "uq_users_email_name" UNIQUE ("email", "username"), CONSTRAINT "PK_d9b0d3777428b67f460cf8a9b14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_projects" ADD CONSTRAINT "fk_users_projects_user" FOREIGN KEY ("user_id") REFERENCES "users_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_projects" ADD CONSTRAINT "fk_users_projects_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_projects" DROP CONSTRAINT "fk_users_projects_project"`);
        await queryRunner.query(`ALTER TABLE "users_projects" DROP CONSTRAINT "fk_users_projects_user"`);
        await queryRunner.query(`DROP TABLE "users_entity"`);
        await queryRunner.query(`DROP TYPE "public"."users_entity_role_enum"`);
        await queryRunner.query(`DROP TABLE "users_projects"`);
        await queryRunner.query(`DROP TYPE "public"."users_projects_access_level_enum"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
