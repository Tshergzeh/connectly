const ServiceService = require('../services/service.service');

exports.createService = async (req, res) => {
  try {
    const service = await ServiceService.createService({
      providerId: req.user.id,
      ...req.body,
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
    const services = await ServiceService.listServices();
    res.json(services);
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
    const updatedService = await ServiceService.updateService(req.params.id, req.user.id, req.body);

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
