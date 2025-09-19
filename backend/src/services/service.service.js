const { v4: uuidv4 } = require('uuid');
const ServiceModel = require('../models/service.model');

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
    return await ServiceModel.getAllServices({ limit, cursor });
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
