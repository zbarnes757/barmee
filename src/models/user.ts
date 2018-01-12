import * as bcrypt from 'bcrypt';
import * as uuidv4 from 'uuid/v4';
import Database from '../bookshelf';

const db = Database.getInstance();
const bookshelf = db.getBookshelf();

export default class User extends bookshelf.Model<User> {
  get tableName() { return 'users'; } // eslint-disable-line class-methods-use-this

  get hasTimestamps() { return true; } // eslint-disable-line class-methods-use-this

  get hidden() { return ['password']; } // eslint-disable-line class-methods-use-this

  initialize() {
    this.on('creating', this.hashPassword, this);
    this.on('creating', this.setId, this);
  }

  async hashPassword(model: User): Promise<User> { // eslint-disable-line class-methods-use-this
    const hash = await bcrypt.hash(model.attributes.password, 10);
    model.set('password', hash);
    return model;
  }

  setId(model: User): User { // eslint-disable-line class-methods-use-this
    model.set('id', uuidv4());
    return model;
  }

  comparePassword(inputPassword: String): Promise<boolean> {
    return bcrypt.compare(inputPassword, this.attributes.password);
  }
}