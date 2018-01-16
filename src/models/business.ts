import * as uuidv4 from 'uuid/v4';
import Database from '../bookshelf';

const db = Database.getInstance();
const bookshelf = db.getBookshelf();

export default class Business extends bookshelf.Model<Business> {
  initialize() {
    this.tableName = 'businesses';
    this.hasTimestamps = true;
    this.on('creating', this.setId, this);
  }

  setId(model: Business): Business { // eslint-disable-line class-methods-use-this
    model.set('id', uuidv4());
    return model;
  }
}
