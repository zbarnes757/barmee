import { PolygonObject } from "graphql-geojson";
import { IContext } from "../interfaces/context";

module.exports = {
  Query: {
    currentUser(obj, args, { user }: IContext) {
      return user.toJSON();
    },

    // business(obj, { id }) {
    //   return Business
    //     .forge({ id })
    //     .fetch()
    //     .then((business) => {
    //       return business.toJSON();
    //     });
    // },
  },

  Polygon: PolygonObject,
};
