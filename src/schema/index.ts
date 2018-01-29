import { makeExecutableSchema } from "graphql-tools";
import resolvers = require("./resolvers");

const typeDefs = `

  scalar Polygon

  type User {
    id: ID!
    email: String!
  }

  type Business {
    id: ID!
    name: String!
    address_1: String!
    address_2: String!
    city: String!
    state: String!
    zip: String!
    country: String!
    boundary: Polygon
  }

  type Query {
    currentUser: User!

    business(id: ID!): Business!
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
