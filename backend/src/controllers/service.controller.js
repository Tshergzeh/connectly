const { v4: uuidv4 } = require('uuid');
const ServiceModel = require('../models/service.model');

exports.createService = async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;
    const provider_id = req.user.id;

    if (!title || !description || !price || !category || !image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const service = await ServiceModel.createService({
      id: uuidv4(),
      provider_id,
      title,
      description,
      price,
      category,
      image,
    });

    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    console.error('Error creating service', error);
    res.status(500).json({ error: 'Error creating service' });
  }
};

exports.listServices = async (req, res) => {
  try {
    const services = await ServiceModel.getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error fetching services' });
  }
};

exports.getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceModel.getServiceById(id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Error fetching service' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const provider_id = req.user.id;
    const { title, description, price, category, image, is_active } = req.body;

    const existingService = await ServiceModel.getServiceById(id);

    if (!existingService) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (existingService.provider_id !== provider_id) {
      return res.status(403).json({
        error: 'Not authorized to update this service',
      });
    }

    const updatedService = await ServiceModel.updateService(id, {
      title,
      description,
      price,
      category,
      image,
      is_active,
    });

    res.json({
      message: 'Service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Error updating service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const provider_id = req.user.id;

    const existingService = await ServiceModel.getServiceById(id);

    if (!existingService) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (existingService.provider_id !== provider_id) {
      return res.status(403).json({
        error: 'Not authorized to delete this service',
      });
    }

    await ServiceModel.deleteService(id);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Error deleting service' });
  }
};
