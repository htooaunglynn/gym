import 'dotenv/config';
import pg from 'pg';
import { hash } from 'bcrypt';

const { Client } = pg;

const TOTAL_MEMBERS = 500_000;
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password@123';

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL! });
    await client.connect();

    const startTime = performance.now();
    console.log(`🌱 Seeding ${TOTAL_MEMBERS.toLocaleString()} members + 1 admin...`);

    // Hash once — bcrypt is the real bottleneck if called per-row
    const hashedPassword = await hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    // --- Run everything in a single transaction ---
    await client.query('BEGIN');

    try {
        // 1. Truncate for a clean slate (fastest way to clear)
        await client.query('TRUNCATE TABLE "users" CASCADE');
        console.log('🗑️  Table truncated');

        // 2. Temporarily drop the unique index to avoid per-row index checks
        await client.query('DROP INDEX IF EXISTS "users_email_key"');
        console.log('📉 Dropped email unique index');

        // 3. Seed admin user
        await client.query(
            `INSERT INTO "users" ("id", "email", "password", "name", "role", "created_at", "updated_at")
             VALUES (gen_random_uuid(), 'admin@gym.com', $1, 'Admin', 'ADMIN'::"Role", now(), now())`,
            [hashedPassword],
        );
        console.log('✅ Admin user seeded');

        // 4. Bulk-insert members using generate_series() — runs entirely in PostgreSQL
        //    Zero JS→DB data transfer (only the hashed password string is sent once).
        await client.query(
            `INSERT INTO "users" ("id", "email", "password", "name", "role", "created_at", "updated_at")
             SELECT
                 gen_random_uuid(),
                 'member' || g || '@gym.com',
                 $1,
                 'Member ' || g,
                 'MEMBER'::"Role",
                 now(),
                 now()
             FROM generate_series(1, $2::int) AS g`,
            [hashedPassword, TOTAL_MEMBERS],
        );
        console.log(`✅ ${TOTAL_MEMBERS.toLocaleString()} members inserted via generate_series`);

        // 5. Recreate the unique index (building once on the full dataset is faster
        //    than maintaining it during inserts)
        await client.query(
            'CREATE UNIQUE INDEX "users_email_key" ON "users" ("email")',
        );
        console.log('📈 Recreated email unique index');

        // 6. Run ANALYZE so the query planner has up-to-date statistics
        await client.query('ANALYZE "users"');

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        await client.end();
    }

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(
        `🎉 Seeding complete — ${(TOTAL_MEMBERS + 1).toLocaleString()} users in ${elapsed}s`,
    );
}

main().catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
});
