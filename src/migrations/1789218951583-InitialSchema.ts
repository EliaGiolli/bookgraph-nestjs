import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1789218951583 implements MigrationInterface {
    name = 'InitialSchema1789218951583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "authors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "bio" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_tags" ("bookId" uuid NOT NULL, "tagId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e150bf8feac063853c2f7397b61" PRIMARY KEY ("bookId", "tagId"))`);
        await queryRunner.query(`CREATE TABLE "book_connections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sourceBookId" uuid NOT NULL, "discoveredBookId" uuid NOT NULL, "discoveryMethod" character varying(100), "suggestedBy" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3872752c335d00e1846e055e2c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."books_status_enum" AS ENUM('read', 'reading', 'wishlist')`);
        await queryRunner.query(`CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "publishedDate" date, "genre" character varying(100), "coverImg" character varying, "isbn" character varying(20), "status" "public"."books_status_enum" NOT NULL DEFAULT 'wishlist', "userId" uuid NOT NULL, "authorId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "username" character varying(50) NOT NULL, "hashedPassword" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_92e67dc508c705dd66c94615576" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_tags" ADD CONSTRAINT "FK_fb0dcd0aa910991f5b6e12545b8" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_tags" ADD CONSTRAINT "FK_8ac2abe3c4afa41f2968ddd4271" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_connections" ADD CONSTRAINT "FK_21fd070cb46556d67296ab22387" FOREIGN KEY ("sourceBookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_connections" ADD CONSTRAINT "FK_35e0172858e2906ad2a20ac14e3" FOREIGN KEY ("discoveredBookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books" ADD CONSTRAINT "FK_bb8627d137a861e2d5dc8d1eb20" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books" ADD CONSTRAINT "FK_54f49efe2dd4d2850e736e9ab86" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP CONSTRAINT "FK_54f49efe2dd4d2850e736e9ab86"`);
        await queryRunner.query(`ALTER TABLE "books" DROP CONSTRAINT "FK_bb8627d137a861e2d5dc8d1eb20"`);
        await queryRunner.query(`ALTER TABLE "book_connections" DROP CONSTRAINT "FK_35e0172858e2906ad2a20ac14e3"`);
        await queryRunner.query(`ALTER TABLE "book_connections" DROP CONSTRAINT "FK_21fd070cb46556d67296ab22387"`);
        await queryRunner.query(`ALTER TABLE "book_tags" DROP CONSTRAINT "FK_8ac2abe3c4afa41f2968ddd4271"`);
        await queryRunner.query(`ALTER TABLE "book_tags" DROP CONSTRAINT "FK_fb0dcd0aa910991f5b6e12545b8"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_92e67dc508c705dd66c94615576"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TYPE "public"."books_status_enum"`);
        await queryRunner.query(`DROP TABLE "book_connections"`);
        await queryRunner.query(`DROP TABLE "book_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "authors"`);
    }

}
