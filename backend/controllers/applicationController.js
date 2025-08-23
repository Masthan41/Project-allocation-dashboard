import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import Batch from '../models/Batch.js';
import User from '../models/User.js';

export const createApplication = async (req, res) => {
  try {
    const applicationData = {
      ...req.body,
      user: req.user._id
    };

    const application = await Application.create(applicationData);
    await application.populate(['user', 'project']);

    // Create notification for admin
    await Notification.create({
      recipient: application.project.createdBy,
      title: 'New Project Application',
      message: `${application.user.name} has applied for ${application.project.title}`,
      type: 'application',
      data: { applicationId: application._id }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'You have already applied for this project' 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('project', 'title description technologies')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { status, project } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (project) filter.project = project;

    const applications = await Application.find(filter)
      .populate('user', 'name email profile')
      .populate('project', 'title description')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes, assignedRole, batchName } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        reviewNotes,
        reviewedBy: req.user._id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate(['user', 'project']);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // If approved, handle batch assignment
    if (status === 'approved') {
      await handleApprovedApplication(application, assignedRole, batchName);
    }

    // Create notification for user
    await Notification.create({
      recipient: application.user._id,
      title: `Application ${status}`,
      message: `Your application for ${application.project.title} has been ${status}`,
      type: status === 'approved' ? 'approval' : 'rejection',
      data: { applicationId: application._id }
    });

    res.json({
      message: `Application ${status} successfully`,
      application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleApprovedApplication = async (application, assignedRole, batchName) => {
  try {
    // Find or create batch
    let batch = await Batch.findOne({ name: batchName, project: application.project._id });
    
    if (!batch) {
      batch = await Batch.create({
        name: batchName,
        project: application.project._id,
        members: [{
          user: application.user._id,
          role: assignedRole
        }]
      });
    } else {
      // Add user to existing batch if not full
      if (batch.members.length < batch.maxMembers) {
        batch.members.push({
          user: application.user._id,
          role: assignedRole
        });
        await batch.save();
      }
    }

    // Update user with batch and role
    await User.findByIdAndUpdate(application.user._id, {
      currentBatch: batch._id,
      assignedRole: assignedRole
    });

  } catch (error) {
    console.error('Error handling approved application:', error);
  }
};