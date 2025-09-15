const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const decodeUser = require('../middleware/auth.helper');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = decodeUser(req);
    return { user };
  },
});

module.exports = server;
