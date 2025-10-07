import { Router } from 'express';
import { generateMockPets } from '../mocks/mockingPets.js';
import { generateMockUsers } from '../mocks/mockingUsers.js';
import User from '../dao/models/User.js';
import Pet from '../dao/models/Pet.js';

const router = Router();

// GET /api/mocks/mockingpets
router.get('/mockingpets', (req, res) => {
  const count = parseInt(req.query.count) || 100;
  const pets = generateMockPets(count);
  res.json(pets);
});

// GET /api/mocks/mockingusers
router.get('/mockingusers', async (req, res) => {
  const count = parseInt(req.query.count) || 50;
  const users = await generateMockUsers(count);
  res.json(users);
});

// POST /api/mocks/generateData
router.post('/generateData', async (req, res, next) => {
  try {
    const { users = 0, pets = 0 } = req.body;
    const mockUsers = await generateMockUsers(Number(users));
    const mockPets = generateMockPets(Number(pets));


    const insertedUsers = await User.insertMany(mockUsers);
    const insertedPets = await Pet.insertMany(mockPets);

    res.json({
      message: 'Datos generados e insertados correctamente',
      users: insertedUsers.length,
      pets: insertedPets.length
    });
  } catch (error) {
    console.error('Error en /generateData:', error); 
    next(error);
  }
});

export default router;