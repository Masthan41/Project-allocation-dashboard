import User from '../models/User.js';
import Project from '../models/Project.js'; // if you have a Project model

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find(); // adjust fields as needed
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
