const UserModel = require('../models/user.model');
const ServiceModel = require('../models/service.model');
const AuthService = require('../services/auth.service');
const ServiceService = require('../services/service.service');

const resolvers = {
  Query: {
    me: async (_, __, { user }) => (user ? await UserModel.findUserById(user.id) : null),
    user: async (_, { id }) => await UserModel.findUserById(id),
    services: async () => await ServiceService.listServices(),
    service: async (_, { id }) => await ServiceService.getService(id),
    servicesByProvider: async (_, { providerid }) =>
      await ServiceModel.getServicesByProivder(providerid),
  },

  Mutation: {
    signup: async (_, { input }) => {
      const user = await AuthService.signup({
        name: input.name,
        email: input.email,
        password: input.password,
        isProvider: input.isProvider,
        isCustomer: input.isCustomer,
      });

      const { accessToken, refreshToken } = await AuthService.login({
        email: input.email,
        password: input.password,
      });

      return { accessToken, refreshToken, user };
    },

    login: async (_, { input }) => {
      const { user, accessToken, refreshToken } = await AuthService.login({
        email: input.email,
        password: input.password,
      });

      return { accessToken, refreshToken, user };
    },

    refreshToken: async (_, { refreshToken }) => {
      const { accessToken, user } = await AuthService.refreshToken(refreshToken);
      return { accessToken, refreshToken, user };
    },

    createService: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      return await ServiceService.createService({
        providerId: user.id,
        ...input,
      });
    },

    updateService: async (_, { id, input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      return await ServiceService.updateService(id, user.id, input);
    },

    deleteService: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      return await ServiceService.deleteService(id, user.id);
    },
  },

  Service: {
    provider: async (service) => await UserModel.getById(service.provider_id),
  },
};

module.exports = resolvers;
