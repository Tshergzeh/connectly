const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const authenticate = require('../middleware/auth.middleware');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = authenticate(req, null, () => null); // tweak: authenticate should return decoded user
    return { user };
  },
});

module.exports = server;
