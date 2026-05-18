import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const required = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for production seeding.`);
  }

  return value;
};

const main = async () => {
  if (process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    throw new Error('Set ALLOW_PRODUCTION_SEED=true to run production seed.');
  }

  const email = required('SEED_ADMIN_EMAIL').toLowerCase();
  const password = required('SEED_ADMIN_PASSWORD');
  const name = process.env.SEED_ADMIN_NAME ?? 'CRM Admin';
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS ?? 12),
  );

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      deletedAt: null,
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log(`Production admin seed ensured for ${email}. Rotate this password after first login.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
