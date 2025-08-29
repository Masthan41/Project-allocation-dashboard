import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Users,
  Target,
  Award,
  TrendingUp,
  FileText,
  Settings,
  X,
  Save
} from 'lucide-react';
import { Project, Batch } from '../types';
import { projectService } from '../services/projectService';
import { batchService } from '../services/batchService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedBatch?: string;
  batchName?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const ProjectTimeline: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedBatch: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadTimelineData();
    loadMockMilestones();
  }, []);

  const loadTimelineData = async () => {
    try {
      const [projectsRes, batchesRes] = await Promise.all([
        projectService.getProjects(),
        user?.role === 'admin' ? batchService.getBatches() : Promise.resolve({ batches: [] })
      ]);
      
      setProjects(projectsRes.projects || []);
      setBatches(batchesRes.batches || []);
    } catch (error) {
      console.error('Failed to load timeline data:', error);
      toast.error('Failed to load timeline data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockMilestones = () => {
    const mockMilestones: Milestone[] = [
      {
        id: '1',
        title: 'Project Kickoff',
        description: 'Initial team meeting and project setup',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        assignedBatch: 'batch1',
        batchName: 'Team Alpha',
        priority: 'high',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Requirements Analysis',
        description: 'Complete analysis of project requirements and user stories',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        assignedBatch: 'batch1',
        batchName: 'Team Alpha',
        priority: 'high',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'UI/UX Design Phase',
        description: 'Create wireframes, mockups, and design system',
        dueDate: new Date().toISOString(),
        status: 'in-progress',
        assignedBatch: 'batch1',
        batchName: 'Team Alpha',
        priority: 'medium',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        title: 'Backend Development',
        description: 'Implement API endpoints and database integration',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        assignedBatch: 'batch1',
        batchName: 'Team Alpha',
        priority: 'high',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        title: 'Frontend Implementation',
        description: 'Build React components and integrate with backend',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        assignedBatch: 'batch1',
        batchName: 'Team Alpha',
        priority: 'high',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        title: 'Testing & QA',
        description: 'Comprehensive testing and quality assurance',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        assignedBatch: 'batch1',
        batchName: 'Team Alpha',
        priority: 'medium',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    setMilestones(mockMilestones);
  };

  const handleCreateMilestone = () => {
    if (!milestoneForm.title.trim()) return;
    
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: milestoneForm.title,
      description: milestoneForm.description,
      dueDate: milestoneForm.dueDate,
      status: 'pending',
      assignedBatch: milestoneForm.assignedBatch,
      batchName: batches.find(b => b._id === milestoneForm.assignedBatch)?.name || '',
      priority: milestoneForm.priority as any,
      createdAt: new Date().toISOString()
    };
    
    setMilestones(prev => [...prev, newMilestone]);
    setShowMilestoneModal(false);
    setMilestoneForm({
      title: '',
      description: '',
      dueDate: '',
      assignedBatch: '',
      priority: 'medium'
    });
    toast.success('Milestone created successfully!');
  };

  const updateMilestoneStatus = (milestoneId: string, newStatus: string) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === milestoneId ? { ...milestone, status: newStatus as any } : milestone
    ));
    toast.success('Milestone status updated!');
  };

  const deleteMilestone = (milestoneId: string) => {
    setMilestones(prev => prev.filter(m => m.id !== milestoneId));
    toast.success('Milestone deleted successfully!');
  };

  const filteredMilestones = selectedProject === 'all' 
    ? milestones 
    : milestones.filter(m => m.assignedBatch === selectedProject);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading project timeline..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Timeline</h1>
              <p className="mt-2 text-gray-600">
                Track project milestones, deadlines, and team progress
              </p>
            </div>
            <div className="flex space-x-3">
              <div className="flex bg-white rounded-lg shadow border border-gray-200">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 ${
                    viewMode === 'timeline'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 ${
                    viewMode === 'calendar'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Calendar
                </button>
              </div>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowMilestoneModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Milestone</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Project/Team
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Projects</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name} - {batch.project.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Overdue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {filteredMilestones.map((milestone, index) => (
                  <li key={milestone.id}>
                    <div className="relative pb-8">
                      {index !== filteredMilestones.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(milestone.status)}`}>
                            {milestone.status === 'completed' && <CheckCircle className="h-4 w-4 text-white" />}
                            {milestone.status === 'in-progress' && <Clock className="h-4 w-4 text-white" />}
                            {milestone.status === 'pending' && <Calendar className="h-4 w-4 text-white" />}
                            {milestone.status === 'overdue' && <AlertCircle className="h-4 w-4 text-white" />}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(milestone.priority)}`}>
                                  {milestone.priority}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                </div>
                                {milestone.batchName && (
                                  <div className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {milestone.batchName}
                                  </div>
                                )}
                              </div>
                            </div>
                            {user?.role === 'admin' && (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedMilestone(milestone);
                                    setMilestoneForm({
                                      title: milestone.title,
                                      description: milestone.description,
                                      dueDate: milestone.dueDate.split('T')[0],
                                      assignedBatch: milestone.assignedBatch || '',
                                      priority: milestone.priority
                                    });
                                    setShowMilestoneModal(true);
                                  }}
                                  className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this milestone?')) {
                                      deleteMilestone(milestone.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          {milestone.status !== 'completed' && (
                            <div className="mt-3 flex space-x-2">
                              {milestone.status === 'pending' && (
                                <button
                                  onClick={() => updateMilestoneStatus(milestone.id, 'in-progress')}
                                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full"
                                >
                                  Start
                                </button>
                              )}
                              <button
                                onClick={() => updateMilestoneStatus(milestone.id, 'completed')}
                                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full"
                              >
                                Mark Complete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {filteredMilestones.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No milestones found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedProject === 'all' 
                    ? 'No milestones have been created yet'
                    : 'No milestones for the selected project'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`rounded-lg p-4 border-l-4 ${
                    milestone.status === 'completed' ? 'border-green-500 bg-green-50' :
                    milestone.status === 'in-progress' ? 'border-blue-500 bg-blue-50' :
                    milestone.status === 'overdue' ? 'border-red-500 bg-red-50' :
                    'border-gray-400 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(milestone.priority)}`}>
                      {milestone.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </div>
                    {milestone.batchName && (
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {milestone.batchName}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      milestone.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {milestone.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                      {milestone.status === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {milestone.status === 'pending' && <Calendar className="h-3 w-3 mr-1" />}
                      {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                    </span>
                    {user?.role === 'admin' && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setSelectedMilestone(milestone);
                            setMilestoneForm({
                              title: milestone.title,
                              description: milestone.description,
                              dueDate: milestone.dueDate.split('T')[0],
                              assignedBatch: milestone.assignedBatch || '',
                              priority: milestone.priority
                            });
                            setShowMilestoneModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this milestone?')) {
                              deleteMilestone(milestone.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {milestones.filter(m => m.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {milestones.filter(m => m.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-gray-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {milestones.filter(m => m.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {milestones.filter(m => m.status === 'overdue').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedMilestone ? 'Edit Milestone' : 'Create New Milestone'}
                </h3>
                <button
                  onClick={() => {
                    setShowMilestoneModal(false);
                    setSelectedMilestone(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({...milestoneForm, title: e.target.value})}
                  placeholder="Enter milestone title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({...milestoneForm, description: e.target.value})}
                  rows={3}
                  placeholder="Describe the milestone..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={milestoneForm.dueDate}
                  onChange={(e) => setMilestoneForm({...milestoneForm, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Team
                </label>
                <select
                  value={milestoneForm.assignedBatch}
                  onChange={(e) => setMilestoneForm({...milestoneForm, assignedBatch: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Teams</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name} - {batch.project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={milestoneForm.priority}
                  onChange={(e) => setMilestoneForm({...milestoneForm, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowMilestoneModal(false);
                  setSelectedMilestone(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMilestone}
                disabled={!milestoneForm.title.trim() || !milestoneForm.dueDate}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{selectedMilestone ? 'Update' : 'Create'} Milestone</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTimeline;