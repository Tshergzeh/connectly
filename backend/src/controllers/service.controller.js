const ServiceService = require('../services/service.service');
const redis = require('../config/redis');

exports.createService = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const service = await ServiceService.createService({
      providerId: req.user.id,
      ...req.body,
      image: req.file ? `uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    console.error('Error creating service', error);
    res.status(400).json({ error: 'Error creating service' });
  }
};

exports.listServices = async (req, res) => {
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
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error fetching services' });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await ServiceService.getService(req.params.id);
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(404).json({ error: 'Error fetching service' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      image: req.file ? `uploads/${req.file.filename}` : undefined,
    };

    const updatedService = await ServiceService.updateService(req.params.id, req.user.id, updates);

    res.json({
      message: 'Service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(403).json({ error: 'Error updating service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await ServiceService.deleteService(req.params.id, req.user.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(403).json({ error: 'Error deleting service' });
  }
};
