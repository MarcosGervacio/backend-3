import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const PASSWORD = 'coder123';

export async function generateMockUsers(count = 50) {
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const roles = ['user', 'admin'];
  return Array.from({ length: count }, () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: roles[Math.floor(Math.random() * roles.length)],
    pets: [],
  }));
}