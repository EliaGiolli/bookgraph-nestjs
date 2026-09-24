import { MigrationInterface, QueryRunner } from "typeorm";

// Consolidates the two entity classes that were both mapped to
// `book_connections` onto the one the API actually uses:
//   + userId       — ownership, which every read and delete filters on
//   + description  — why the books are linked (was `discoveryMethod`)
//   - discoveryMethod, suggestedBy
// `createdAt` is kept: it already exists, costs nothing, and matches the other
// entities. Generated columns are reordered by hand so existing rows survive —
// `ADD "userId" uuid NOT NULL` on a populated table fails outright.
export class ConsolidateBookConnection1790243650939 implements MigrationInterface {
    name = 'ConsolidateBookConnection1790243650939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Carry `discoveryMethod` over to `description` before dropping it.
        await queryRunner.query(`ALTER TABLE "book_connections" ADD "description" character varying(100)`);
        await queryRunner.query(`UPDATE "book_connections" SET "description" = "discoveryMethod" WHERE "discoveryMethod" IS NOT NULL`);

        // 2. Add ownership nullable, backfill it from the source book's owner,
        //    then enforce NOT NULL. The FK on sourceBookId guarantees every row
        //    resolves to exactly one book, so no row is left null.
        await queryRunner.query(`ALTER TABLE "book_connections" ADD "userId" uuid`);
        await queryRunner.query(`
            UPDATE "book_connections" AS c
            SET "userId" = b."userId"
            FROM "books" AS b
            WHERE b."id" = c."sourceBookId"
        `);
        await queryRunner.query(`ALTER TABLE "book_connections" ALTER COLUMN "userId" SET NOT NULL`);

        // 3. Drop the columns that only the removed entity declared.
        await queryRunner.query(`ALTER TABLE "book_connections" DROP COLUMN "discoveryMethod"`);
        await queryRunner.query(`ALTER TABLE "book_connections" DROP COLUMN "suggestedBy"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_connections" ADD "suggestedBy" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "book_connections" ADD "discoveryMethod" character varying(100)`);
        await queryRunner.query(`UPDATE "book_connections" SET "discoveryMethod" = "description" WHERE "description" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "book_connections" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "book_connections" DROP COLUMN "description"`);
    }

}
