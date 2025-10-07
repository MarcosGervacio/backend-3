import { Router } from 'express';
import { generateMockPets } from '../mocks/mockingPets.js';

const router = Router();

router.get('/', (req, res) => {
  const count = parseInt(req.query.count) || 100;
  const pets = generateMockPets(count);
  res.json(pets);
});

export default router;