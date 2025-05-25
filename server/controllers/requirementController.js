const Requirement = require('../models/Requirement');
const User = require('../models/User');

exports.createRequirement = async (req, res) => {
  try {
    if (req.user.userType !== 'customer') {
      return res.status(403).json({ message: 'Only customers can post requirements' });
    }

    const requirement = new Requirement({
      ...req.body,
      customerId: req.user._id
    });

    await requirement.save();
    res.status(201).json(requirement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating requirement' });
  }
};

exports.getRequirements = async (req, res) => {
  try {
    const { category, location } = req.query;
    const query = { status: 'open' };

    if (category) query.category = category;
    if (location) query.location = location;

    const requirements = await Requirement.find(query)
      .sort({ createdAt: -1 })
      .populate('customerId', 'name')
      .limit(50);

    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requirements' });
  }
};

exports.getMyRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find({ customerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('customerId', 'name');

    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requirements' });
  }
};

exports.updateRequirementStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requirement = await Requirement.findOne({
      _id: req.params.id,
      customerId: req.user._id
    });

    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }

    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    requirement.status = status;
    await requirement.save();

    res.json(requirement);
  } catch (error) {
    res.status(500).json({ message: 'Error updating requirement status' });
  }
};
