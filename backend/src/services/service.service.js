const { v4: uuidv4 } = require('uuid');

const ServiceModel = require('../models/service.model');
const redis = require('../config/redis');

class ServiceService {
  static async createService({ providerId, title, description, price, category, image }) {
    if (!title || !description || !price || !category || !image) {
      throw new Error('Missing required fields');
    }

    return await ServiceModel.createService({
      id: uuidv4(),
      provider_id: providerId,
      title,
      description,
      price,
      category,
      image,
    });
  }

  static async listServices({ limit, cursor }) {
    let services = [];
    const redisKey = `servicesService:list:cursor:${cursor || 'NULL'}:limit:${limit}`;
    let cached = await redis.get(redisKey);
    if (cached) {
      services = JSON.parse(cached);
    } else {
      services = await ServiceModel.getAllServices({ limit, cursor });
      await redis.set(redisKey, JSON.stringify(services));
      await redis.expire(redisKey, 60);
    }
    return services;
  }

  static async getService(id) {
    const service = await ServiceModel.getServiceById(id);

    if (!service) {
      throw new Error('Service not found');
    }

    return service;
  }

  static async updateService(id, providerId, updates) {
    const existingService = await ServiceModel.getServiceById(id);

    if (!existingService) {
      throw new Error('Service not found');
    }

    if (existingService.provider_id !== providerId) {
      throw new Error('Not authorized to update this service');
    }

    return await ServiceModel.updateService(id, updates);
  }

  static async deleteService(id, providerId) {
    const existingService = await ServiceModel.getServiceById(id);

    if (!existingService) {
      throw new Error('Service not found');
    }

    if (existingService.provider_id !== providerId) {
      throw new Error('Not authorized to delete this service');
    }

    await ServiceModel.deleteService(id);
    return true;
  }
}

module.exports = ServiceService;
