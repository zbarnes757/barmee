// import { Buffer } from 'buffer';
// import * as uuidv4 from 'uuid/v4';
// import Database from '../bookshelf';
// import * as wkx from 'wkx';
// import { polygon } from '@turf/helpers';

// const db = Database.getInstance();
// const bookshelf = db.getBookshelf();
// const st = db.getSt();
// const knex = db.getKnex();

// export default class Business extends bookshelf.Model<Business> {
//   initialize() {
//     this.tableName = 'businesses';
//     this.hasTimestamps = true;
//     // this.geojson = 'boundary';
//     this.on('creating', this.setId, this);
//     this.on('saving', this.saveGeo, this);
//   }

//   toJSON() { // overrides the Bookshelf.Model toJSON method
//     const attrs = bookshelf.Model.prototype.toJSON.apply(this, arguments);
//     const b = new Buffer(attrs.boundary, 'hex');
//     const c = wkx.Geometry.parse(b);
//     attrs.boundary = { lat: c.x, lng: c.y };
//     return attrs;
//   }

//   setId(model) { // eslint-disable-line class-methods-use-this
//     model.set('id', uuidv4());
//     return model;
//   }

//   saveGeo(model, attributes, options) {
//     const boundary = attributes.boundary || model.get('boundary');
//     if (boundary) {
//       model.unset('boundary');
//       delete attributes.boundary;

//       const geoJson = st.geometry(polygon(boundary.coordinates).geometry);

//       return knex
//         .debug(true)
//         .where({ id: model.get('id') })
//         .update({ boundary: geoJson });
//     }
//   }
// }
