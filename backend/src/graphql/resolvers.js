const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const UserModel = require('../models/user.model');
const ServiceModel = require('../models/service.model');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const resolvers = {
  Query: {
    me: async (_, __, { user }) => (user ? await UserModel.getById(user.id) : null),
    users: async () => await UserModel.getAll(),
    user: async (_, { id }) => await UserModel.getById(id),
    services: async () => await ServiceModel.getAllServices(),
    service: async (_, { id }) => await ServiceModel.getServiceById(id),
    servicesByProvider: async (_, { providerid }) =>
      await ServiceModel.getServicesByProivder(providerid),
  },

  Mutation: {
    signup: async (_, { input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await UserModel.createUser({
        ...input,
        id: uuidv4(),
        hashedPassword: hashedPassword,
      });

      const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '15m',
      });

      const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      return { accessToken, refreshToken, user };
    },

    login: async (_, { input }) => {
      const user = await UserModel.getByEmail(input.email);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await bcrypt.compare(input.password, user.hashed_password);

      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '15m',
      });

      const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      return { accessToken, refreshToken, user };
    },

    refreshToken: async (_, { refreshToken }) => {
      try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await UserModel.getById(decoded.id);

        const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
          expiresIn: '15m',
        });

        return { accessToken, refreshToken, user };
      } catch (error) {
        throw new Error('Invalid or expired refresh token');
      }
    },

    createService: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      const service = await ServiceModel.createService({
        id: uuidv4(),
        provider_id: user.id,
        ...input,
      });

      return service;
    },

    updateService: async (_, { id, input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      const service = await ServiceModel.getServiceById(id);
      if (!service) throw new Error('Service not found');
      if (service.provider_id !== user.id) throw new Error('Not authorized');

      return await ServiceModel.updateService(id, input);
    },

    deleteService: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      const service = await ServiceModel.getServiceById(id);
      if (!service) throw new Error('Service not found');
      if (service.provider_id !== user.id) throw new Error('Not authorized');

      await ServiceModel.deleteService(id);
      return true;
    },
  },

  Service: {
    provider: async (service) => await UserModel.getById(service.provider_id),
  },
};

module.exports = resolvers;
