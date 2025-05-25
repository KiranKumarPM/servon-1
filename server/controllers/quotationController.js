const Quotation = require('../models/Quotation');
const Requirement = require('../models/Requirement');
const User = require('../models/User');

exports.sendQuotation = async (req, res) => {
  try {
    if (req.user.userType !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can send quotations' });
    }

    if (req.user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const requirement = await Requirement.findById(req.body.requirementId);
    if (!requirement || requirement.status !== 'open') {
      return res.status(404).json({ message: 'Requirement not found or closed' });
    }

    // Check if vendor has already sent a quotation for this requirement
    const existingQuotation = await Quotation.findOne({
      requirementId: requirement._id,
      vendorId: req.user._id
    });

    if (existingQuotation) {
      return res.status(400).json({ message: 'You have already sent a quotation for this requirement' });
    }

    const quotation = new Quotation({
      ...req.body,
      vendorId: req.user._id,
      customerId: requirement.customerId
    });

    // Deduct credit from vendor
    req.user.credits -= 1;
    await req.user.save();

    // Increment quotation count on requirement
    requirement.quotationsCount += 1;
    await requirement.save();

    await quotation.save();

    res.status(201).json({
      quotation,
      remainingCredits: req.user.credits
    });
  } catch (error) {
    res.status(400).json({ message: 'Error sending quotation' });
  }
};

exports.getReceivedQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ customerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('vendorId', 'name businessType')
      .populate('requirementId', 'title');

    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quotations' });
  }
};

exports.getSentQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ vendorId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('customerId', 'name')
      .populate('requirementId', 'title');

    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quotations' });
  }
};

exports.updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      customerId: req.user._id
    });

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    if (!['viewed', 'accepted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    quotation.status = status;
    await quotation.save();

    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating quotation status' });
  }
};
