const ServiceService = require('../services/service.service');
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
    const { limit = 10, cursor, keyword, category, priceMin, priceMax, ratingMin } = req.query;

    const filters = {
      keyword,
      category,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      ratingMin: ratingMin ? parseFloat(ratingMin) : undefined,
    };

    const { services, nextCursor } = await ServiceService.listServices({
      limit: parseInt(limit, 10),
      cursor: cursor || null,
      filters,
    });

    res.json({
      data: services,
      nextCursor,
    });
  } catch (error) {
    next(error);
  }
};

exports.listServicesByProvider = async (req, res, next) => {
  try {
    const { limit = 10, cursor } = req.query;

    const { services, nextCursor } = await ServiceService.listServicesByProvider({
      providerId: req.user.id,
      limit: parseInt(limit, 10),
      cursor: cursor || null,
    });

    res.json({
      data: services,
      nextCursor,
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
