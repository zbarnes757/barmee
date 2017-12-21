const faker = require('faker');
const jwt = require('jsonwebtoken');
const request = require('supertest');

const app = require('../../app');
const dbReset = require('../../db_reset');
const User = require('../../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'kitty-kats';

beforeEach(() => dbReset());

describe('GET /sessions/_current', () => {
  test('should return the current user based on jwt', async () => {
    const user = await new User({
        email: faker.internet.email(),
        password: faker.random.word()
      })
      .save();

    const token = jwt.sign({ id: user.get('id') }, JWT_SECRET, { expiresIn: "1 day" });

    const { body, statusCode } = await request(app)
      .get('/sessions/_current')
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(200);
    expect(body.user.id).toBe(user.get('id'));
    expect(body.user.email).toBe(user.get('email'));
    expect(body.user.created_at).toBeDefined();
    expect(body.user.updated_at).toBeDefined();
  });

  test('should return 401 if no valid user associated with jwt', () => {
    const token = jwt.sign({ id: faker.random.uuid() }, JWT_SECRET, { expiresIn: "1 day" });

    return request(app)
      .get('/sessions/_current')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});

describe('POST /sessions/signup', () => {
  test('should create a new user', async () => {
    const email = faker.internet.email();
    const response = await request(app)
      .post('/sessions/signup')
      .send({
        email,
        password: faker.random.word()
      })
      .set('Content-Type', 'application/json')
      .expect(201);

      expect(response.body.token).toBeDefined();

      const user = await new User({ email }).fetch();
      expect(user).toBeDefined();
  });

  test('should 400 if missing values', () => {
    return request(app)
      .post('/sessions/signup')
      .send({ password: faker.random.word() })
      .set('Content-Type', 'application/json')
      .expect(400);
  });
});

describe('POST /sessions/login', () => {
  test('should return a token after sign in', async () => {
    const password = faker.random.word();
    const user = await new User({
        email: faker.internet.email(),
        password
      })
      .save();

    const response = await request(app)
      .post('/sessions/login')
      .send({ email: user.get('email'), password })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  test('should 404 if user email does not exist', () => {
    return request(app)
      .post('/sessions/login')
      .send({
        email: faker.internet.email(),
        password: faker.random.word()
      })
      .expect(404);
  });

  test('should 401 if password is incorrect', async () => {
    const user = await new User({
      email: faker.internet.email(),
      password: faker.random.word()
    })
    .save();

    const response = await request(app)
      .post('/sessions/login')
      .send({
        email: user.get('email'),
        password: faker.random.word()
      })
      .expect(401);
  });
});
