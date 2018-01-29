import * as faker from 'faker';
import * as request from 'supertest';
import User from '../../models/user';

const app = require('../../app');
const dbReset = require('../../db_reset');

beforeEach(() => dbReset());

describe('POST /sessions/signup', () => {
  test('should create a new user', async () => {
    const email = faker.internet.email();
    const response = await request(app)
      .post('/sessions/signup')
      .send({
        email,
        password: faker.random.word(),
      })
      .set('Content-Type', 'application/json')
      .expect(201);

    expect(response.body.token).toBeDefined();

    const user = await User.forge({ email }).fetch();
    expect(user).toBeDefined();
  });

  test('should 400 if missing values', () => request(app)
    .post('/sessions/signup')
    .send({ password: faker.random.word() })
    .set('Content-Type', 'application/json')
    .expect(400));
});

describe('POST /sessions/login', () => {
  test('should return a token after sign in', async () => {
    const password = faker.random.word();
    const user = await User
      .forge({
        email: faker.internet.email(),
        password,
      })
      .save();

    const response = await request(app)
      .post('/sessions/login')
      .send({ email: user.get('email'), password })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  test('should 404 if user email does not exist', async () => await request(app)
    .post('/sessions/login')
    .send({
      email: faker.internet.email(),
      password: faker.random.word(),
    })
    .expect(404));

  test('should 401 if password is incorrect', async () => {
    const user = await User
      .forge({
        email: faker.internet.email(),
        password: faker.random.word(),
      })
      .save();

    await request(app)
      .post('/sessions/login')
      .send({
        email: user.get('email'),
        password: faker.random.word(),
      })
      .expect(401);
  });
});
