// Tests funcionales para adoption.router.js
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

const fakeId = '000000000000000000000000';

function extractCookieToken(setCookie) {
  // setCookie puede ser array o string, buscamos la cookie coderCookie
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  const ck = cookies.find(c => typeof c === 'string' && c.startsWith('coderCookie='));
  if (!ck) return null;

  const raw = ck.split(';')[0];
  const token = raw.split('=')[1];
  return token || null;
}

function decodeJwtPayload(token) {
  try {
    const base64url = token.split('.')[1];
    const json = Buffer.from(base64url, 'base64url').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

async function findUserIdByEmail(email) {
  const list = await request(app).get('/api/users');
  const arr = list.body?.payload || list.body?.users || list.body?.data || [];
  const found = arr.find(u => u?.email === email);
  return found?._id || null;
}


describe('Adoptions Router', function () {
  this.timeout(40000);

  after(async () => {
    await mongoose.connection.close();
  });

  it('GET /api/adoptions debe listar adopciones', async () => {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('payload').that.is.an('array');
  });

  it('GET /api/adoptions/:aid con id inexistente debe devolver 404', async () => {
    const res = await request(app).get(`/api/adoptions/${fakeId}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('status').that.is.oneOf(['error', 'fail']);
  });

  describe('Flujo de adopción', () => {
    let userId;
    let petId;
    let testingEmail;

    it('Debe registrar y obtener el _id del usuario (vía lista de users si /current no lo trae)', async () => {
      testingEmail = `user_${Date.now()}@example.com`;

      // register
      const reg = await request(app)
        .post('/api/sessions/register')
        .send({
          first_name: 'Test',
          last_name: 'User',
          email: testingEmail,
          password: 'coder123'
        });
      expect(reg.status).to.be.oneOf([200, 201]);

      // login
      const login = await request(app)
        .post('/api/sessions/login')
        .send({ email: testingEmail, password: 'coder123' });
      expect(login.status).to.equal(200);

      // intentamos /current para extraer email desde la cookie (por si no trae _id)
      const cookie = login.headers['set-cookie'];
      const token = extractCookieToken(cookie);
      let emailFromToken = null;
      if (token) {
        const payload = decodeJwtPayload(token);
        emailFromToken = payload?.email || payload?.user?.email || null;
      }

      // si /current existe, al menos verificamos que responda 200
      const current = await request(app).get('/api/sessions/current').set('Cookie', cookie || []);
      expect(current.status).to.equal(200);

      // buscamos el _id por email (del token, o el que usamos para registrar)
      const email = emailFromToken || testingEmail;
      userId = await findUserIdByEmail(email);

      // Afirmamos que ahora sí tenemos un _id
      expect(userId, 'No pude obtener el _id del usuario').to.exist;
    });

    it('Debe crear una mascota', async () => {
      const res = await request(app)
        .post('/api/pets')
        .send({
          name: `Pet_${Date.now()}`,
          specie: 'dog',
          birthDate: '2000-12-30'
        });
      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body).to.have.property('payload');
      petId = res.body.payload._id;
      expect(petId).to.exist;
    });

    it('POST /api/adoptions/:uid/:pid debe adoptar la mascota', async () => {
      const res = await request(app).post(`/api/adoptions/${userId}/${petId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('message').that.matches(/adopt/i);
    });

    it('No debe permitir adoptar la misma mascota de nuevo (400/409)', async () => {
      const res = await request(app).post(`/api/adoptions/${userId}/${petId}`);
      expect(res.status).to.be.oneOf([400, 409]);
      expect(res.body).to.have.property('status').that.is.oneOf(['error', 'fail']);
    });

    it('No debe permitir adoptar con usuario inexistente (404/400)', async () => {
      const res = await request(app).post(`/api/adoptions/${fakeId}/${petId}`);
      expect(res.status).to.be.oneOf([404, 400]);
    });

    it('No debe permitir adoptar una mascota inexistente (404/400)', async () => {
      const res = await request(app).post(`/api/adoptions/${userId}/${fakeId}`);
      expect(res.status).to.be.oneOf([404, 400]);
    });
  });
});
