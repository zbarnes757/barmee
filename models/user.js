const bcrypt = require('bcrypt');
const Bookshelf = require('../bookshelf');
const uuidv4 = require('uuid/v4');

class User extends Bookshelf.Model {
  get tableName() { return 'users'; }

  get hasTimestamps() { return true; }

  get hidden() { return [ 'password' ]; }

  initialize() {
    this.on('creating', this.hashPassword, this);
    this.on('creating', this.setId, this);
  }

  async hashPassword(model, attrs, opts) {
    const hash = await bcrypt.hash(model.attributes.password, 10);
    model.set('password', hash);
    return model;
  }

  setId(model, attrs, opts) {
    model.set('id', uuidv4());
    return model;
  }

  async comparePassword(inputPassword) {
    const res = await bcrypt.compare(inputPassword, this.attributes.password);
    console.log('inputPassword', inputPassword);
    console.log('hash', this.attributes);
    console.log('result', res);
    return res;
  }
}

module.exports = User;
