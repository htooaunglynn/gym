import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const TOTAL_USERS = 10_500;
const BATCH_SIZE = 500;
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password@123';

async function main() {
    console.log(`🌱 Seeding ${TOTAL_USERS} users...`);

    const hashedPassword = await hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    // Seed 1 admin user first
    await prisma.user.upsert({
        where: { email: 'admin@gym.com' },
        update: {},
        create: {
            email: 'admin@gym.com',
            password: hashedPassword,
            name: 'Admin',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user seeded');

    // Seed member users in batches
    let created = 0;
    for (let batch = 0; batch < Math.ceil(TOTAL_USERS / BATCH_SIZE); batch++) {
        const start = batch * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, TOTAL_USERS);

        const users = Array.from({ length: end - start }, (_, i) => {
            const index = start + i + 1;
            return {
                email: `member${index}@gym.com`,
                password: hashedPassword,
                name: `Member ${index}`,
                role: 'MEMBER' as const,
            };
        });

        await prisma.user.createMany({
            data: users,
            skipDuplicates: true,
        });

        created += users.length;
        console.log(`  📦 Batch ${batch + 1}: seeded ${created}/${TOTAL_USERS} users`);
    }

    console.log(`🎉 Seeding complete — ${TOTAL_USERS} member users + 1 admin`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
