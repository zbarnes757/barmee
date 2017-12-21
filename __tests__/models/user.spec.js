const dbReset = require('../../db_reset');
const faker = require('faker');
const User = require('../../models/user');

beforeEach(() => dbReset());

describe('user.save', () => {
  test('should save a user with a hashed password', async () => {
    const password = faker.random.word();
    const user = await new User({ email: faker.internet.email(), password }).save();
    expect(user.get('password')).not.toBe(password);
  });
});

describe('user.comparePassword', () => {
  test('should return true for same passwords', async () => {
    const password = faker.random.word();
    const user = await new User({ email: faker.internet.email(), password }).save();
    const isSame = await user.comparePassword(password);
    expect(isSame).toBe(true);
  });

  test('should return false for different passwords', async () => {
    const user = await new User({ email: faker.internet.email(), password: faker.random.word() }).save();
    const isSame = await user.comparePassword(faker.random.word());
    expect(isSame).toBe(false);
  });
});
