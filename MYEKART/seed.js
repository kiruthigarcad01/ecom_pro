const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const hashedPassword = await bcrypt.hash('admin@123', 10); 

  const admin = await prisma.admin.upsert({
    where: { emailAddress: 'admin@gmail.com' }, 
    update: {}, 
    create: {
    username : 'admin',
      emailAddress: 'admin@gmail.com', 
      password: hashedPassword,
    },
  });

  console.log('Admin user seeded:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });