const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type User {
    id: ID!
    email: String!
  }

  type Query {
    currentUser: User!
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
