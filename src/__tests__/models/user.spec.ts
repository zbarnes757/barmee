const faker = require('faker');

const dbReset = require('../../db_reset');
import User from '../../models/user'

beforeEach(() => dbReset());

describe('user.save', () => {
  test('should save a user with a hashed password', () => {
    const password = faker.random.word();
    return new User()
      .forge({
        email: faker.internet.email(),
        password,
      })
      .save()
      .then(user => expect(user.get('password')).not.toBe(password));
  });
});

describe('user.comparePassword', () => {
  test('should return true for same passwords', () => {
    const password = faker.random.word();
    return new User()
      .forge({
        email: faker.internet.email(),
        password,
      })
      .save()
      .then(user => user.comparePassword(password))
      .then(isSame => expect(isSame).toBe(true));
  });

  test('should return false for different passwords', () => new User()
    .forge({
      email: faker.internet.email(),
      password: faker.random.word(),
    })
    .save()
    .then(user => user.comparePassword(faker.random.word()))
    .then(isSame => expect(isSame).toBe(false)));
});
