const { v4: uuidv4 } = require('uuid');

const AppError = require('../utils/AppError');
const ServiceModel = require('../models/service.model');
const redis = require('../config/redis');
const cloudinary = require('../config/cloudinary');

class ServiceService {
  static async createService({ providerId, title, description, price, category, image }) {
    if (!title || !description || !price || !category || !image) {
      throw new Error('Missing required fields');
    }

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'services',
      use_filename: true,
      unique_filename: false,
    });

    return await ServiceModel.createService({
      id: uuidv4(),
      provider_id: providerId,
      title,
      description,
      price,
      category,
      image: uploadResult.secure_url,
    });
  }

  static async listServices({ limit, cursor, filters = {} }) {
    const redisKey = `servicesService:list:cursor:${cursor || 'NULL'}:limit:${limit}:filters:${JSON.stringify(filters)}`;
    let cached = await redis.get(redisKey);

    if (cached) return JSON.parse(cached);

    const rows = await ServiceModel.getAllServices({ limit, cursor, filters });

    const hasNext = rows.length > limit;
    const services = rows.slice(0, limit);
    const nextCursor = hasNext ? services[services.length - 1].created_at : null;

    const result = { services, nextCursor };

    await redis.set(redisKey, JSON.stringify(result));
    await redis.expire(redisKey, 60);

    return result;
  }

  static async getService(id) {
    if (!id) {
      throw new AppError('Missing service ID', 400);
    }

    const service = await ServiceModel.getServiceById(id);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    return service;
  }

  static async updateService(id, providerId, updates) {
    if (!id) {
      throw new AppError('Missing service ID', 400);
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError('No updates provided', 400);
    }
    const existingService = await ServiceModel.getServiceById(id);

    if (!existingService) {
      throw new AppError('Service not found', 404);
    }

    if (existingService.provider_id !== providerId) {
      throw new AppError('Not authorized to update this service', 403);
    }

    return await ServiceModel.updateService(id, updates);
  }

  static async deleteService(id, providerId) {
    if (!id) {
      throw new AppError('Missing service ID', 400);
    }

    if (!providerId) {
      throw new AppError('Missing provider ID', 400);
    }

    const existingService = await ServiceModel.getServiceById(id);

    if (!existingService) {
      throw new AppError('Service not found', 404);
    }

    if (existingService.provider_id !== providerId) {
      throw new AppError('Not authorized to delete this service', 403);
    }

    await ServiceModel.deleteService(id);
    return true;
  }
}

module.exports = ServiceService;
