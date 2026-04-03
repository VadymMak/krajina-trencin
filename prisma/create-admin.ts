import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma  = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('Admin2026!', 12);
  const user = await prisma.user.upsert({
    where:  { email: 'admin@krajina.eu' },
    update: {},
    create: {
      email:    'admin@krajina.eu',
      name:     'Admin',
      password,
      role:     'admin',
    },
  });
  console.log('✓ Admin created:', user.email, '/ Admin2026!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
