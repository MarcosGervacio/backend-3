import { faker } from '@faker-js/faker';

export function generateMockPet() {
  return {
    name: faker.person.firstName(),
    specie: faker.animal.type(),
    breed: faker.animal.dog(),
    age: faker.number.int({ min: 1, max: 15 }),
    adopted: false,
    owner: null,
  };
}

export function generateMockPets(count = 100) {
  return Array.from({ length: count }, generateMockPet);
}