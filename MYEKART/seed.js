const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 


const JWT_SECRET = process.env.JWT_SECRET; 

const generateToken = (adminId, email) => {
  return jwt.sign(
    { 
      id: adminId,
      email: email,
      role: 'admin'
    },
    JWT_SECRET,
    { expiresIn: '1h' } 
  );
};

async function main() {
  const hashedPassword = await bcrypt.hash('admin@1234', 10);

  const admin = await prisma.admin.upsert({
    where: { emailAddress: 'admin@yahoo.com' },
    update: {},
    create: {
      username: 'admin',
      emailAddress: 'admin@yahoo.com',
      password: hashedPassword,
    },
  });


  const token = generateToken(admin.id, admin.emailAddress);

  console.log('Admin user seeded:', admin);
  console.log('JWT Token:', token);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });