const NODE_ENV = process.env.NODE_ENV || 'development';
const dbconfig = require('./knexfile');

import * as Knex from 'knex';
import * as Bookshelf from 'bookshelf';

export default class Database {

  private static _instance: Database = new Database();

  protected _knex: any = null;

  protected _bookshelf: any = null;

  constructor() {
    if (Database._instance) {
      throw new Error("Error: Instantiation failed: Use Database.getInstance() instead of new.");
    }

    this._knex = Knex(dbconfig[NODE_ENV]);

    this._bookshelf = Bookshelf(this._knex);

    this._bookshelf.plugin('visibility');

    Database._instance = this;
  }

  public static getInstance(): Database {
    return Database._instance;
  }

  public getKnex(): any {
    return this._knex;
  }

  public getBookshelf() {
    return this._bookshelf;
  }
}
