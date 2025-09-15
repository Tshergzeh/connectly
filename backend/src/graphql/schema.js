const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar DateTime

  ### USER ###
  type User {
    id: ID!
    name: String!
    email: String!
    isProvider: Boolean!
    isCustomer: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    isProvider: Boolean!
    isCustomer: Boolean!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  ### SERVICE ###
  type Service {
    id: ID!
    provider: User!
    title: String!
    description: String!
    price: Float!
    category: String!
    image: String!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input UpdateServiceInput {
    title: String
    description: String
    price: Float
    category: String
    image: String
    isActive: Boolean
  }

  ### QUERIES ###
  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    services: [Service!]!
    service(id: ID!): Service
    servicesByProvider(providerId: ID!): [Service!]!
  }

  ### MUTATIONS ###
  type Mutation {
    signup(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
    createService(input: createServiceInput!): Service!
    updateService(id: ID!, input: UpdateServiceInput!): Service!
    deleteService(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
