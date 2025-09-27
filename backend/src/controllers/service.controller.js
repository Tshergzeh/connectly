const ServiceService = require('../services/service.service');
const redis = require('../config/redis');
const logger = require('../utils/logger');

exports.createService = async (req, res, next) => {
  try {
    const service = await ServiceService.createService({
      providerId: req.user.id,
      ...req.body,
      image: req.file ? `uploads/${req.file.filename}` : null,
    });

    logger.info('Service created successfully:', {
      serviceId: service.id,
      providerId: req.user.id,
    });
    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    next(error);
  }
};

exports.listServices = async (req, res, next) => {
  try {
    const { limit = 10, cursor } = req.query;

    let services = [];

    const redisKey = `servicesController:list:cursor:${cursor || 'NULL'}:limit:${limit}`;
    let cached = await redis.get(redisKey);
    if (cached) {
      services = JSON.parse(cached);
    } else {
      services = await ServiceService.listServices({
        limit: parseInt(limit, 10),
        cursor: cursor || null,
      });
      await redis.set(redisKey, JSON.stringify(services));
      await redis.expire(redisKey, 60);
    }

    res.json({
      data: services,
      nextCursor: services.length > 0 ? services[services.length - 1].created_at : null,
    });
  } catch (error) {
    next(error);
  }
};

exports.getService = async (req, res, next) => {
  try {
    const service = await ServiceService.getService(req.params.id);
    res.json(service);
  } catch (error) {
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const updates = {
      ...req.body,
      image: req.file ? `uploads/${req.file.filename}` : undefined,
    };

    const updatedService = await ServiceService.updateService(req.params.id, req.user.id, updates);

    logger.info('Service updated successfully:', {
      serviceId: updatedService.id,
      providerId: req.user.id,
    });
    res.json({
      message: 'Service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    await ServiceService.deleteService(req.params.id, req.user.id);
    logger.info('Service deleted successfully:', {
      serviceId: req.params.id,
      providerId: req.user.id,
    });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};
