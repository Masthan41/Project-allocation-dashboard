import Batch from '../models/Batch.js';

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('project', 'title description')
      .populate('members.user', 'name email profile')
      .sort({ createdAt: -1 });

    res.json({ batches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('project', 'title description technologies')
      .populate('members.user', 'name email profile');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json({ batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBatchProgress = async (req, res) => {
  try {
    const { progress, status } = req.body;
    
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { progress, status },
      { new: true }
    ).populate('members.user', 'name email');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json({ message: 'Batch updated successfully', batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.user.currentBatch)
      .populate('project', 'title description technologies requirements')
      .populate('members.user', 'name email profile');

    if (!batch) {
      return res.status(404).json({ message: 'No batch assigned' });
    }

    res.json({ batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};