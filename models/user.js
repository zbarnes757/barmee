const bcrypt = require('bcrypt');
const Bookshelf = require('../bookshelf');
const uuidv4 = require('uuid/v4');

class User extends Bookshelf.Model {
  get tableName() { return 'users'; } // eslint-disable-line class-methods-use-this

  get hasTimestamps() { return true; } // eslint-disable-line class-methods-use-this

  get hidden() { return ['password']; } // eslint-disable-line class-methods-use-this

  initialize() {
    this.on('creating', this.hashPassword, this);
    this.on('creating', this.setId, this);
  }

  async hashPassword(model) { // eslint-disable-line class-methods-use-this
    const hash = await bcrypt.hash(model.attributes.password, 10);
    model.set('password', hash);
    return model;
  }

  setId(model) { // eslint-disable-line class-methods-use-this
    model.set('id', uuidv4());
    return model;
  }

  comparePassword(inputPassword) {
    return bcrypt.compare(inputPassword, this.attributes.password);
  }
}

module.exports = User;
