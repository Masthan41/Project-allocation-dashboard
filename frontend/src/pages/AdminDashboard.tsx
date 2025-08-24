import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  UserPlus,
  Settings,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Edit,
  Trash2
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { projectService } from '../services/projectService';
import { batchService } from '../services/batchService';
import { Application, Project, Batch } from '../types';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: 'pending',
    reviewNotes: '',
    assignedRole: '',
    batchName: ''
  });
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    duration: '',
    difficulty: 'Beginner',
    maxTeamSize: 4,
    requirements: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      const [applicationsRes, projectsRes, batchesRes] = await Promise.all([
        applicationService.getAllApplications(),
        projectService.getProjects(),
        batchService.getBatches()
      ]);
      
      setApplications(applicationsRes.applications || []);
      setProjects(projectsRes.projects || []);
      setBatches(batchesRes.batches || []);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewApplication = async () => {
    if (!selectedApplication) return;

    try {
      await applicationService.reviewApplication(selectedApplication._id, reviewData);
      toast.success(`Application ${reviewData.status} successfully`);
      setShowReviewModal(false);
      setSelectedApplication(null);
      setReviewData({
        status: 'pending',
        reviewNotes: '',
        assignedRole: '',
        batchName: ''
      });
      loadAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to review application');
    }
  };

  const handleCreateProject = async () => {
    try {
      const projectData = {
        ...newProject,
        technologies: newProject.technologies.split(',').map(tech => tech.trim()),
        requirements: newProject.requirements.split('\n').filter(req => req.trim())
      };
      
      await projectService.createProject(projectData);
      toast.success('Project created successfully');
      setShowCreateProjectModal(false);
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        duration: '',
        difficulty: 'Beginner',
        maxTeamSize: 4,
        requirements: ''
      });
      loadAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    approvedApplications: applications.filter(app => app.status === 'approved').length,
    rejectedApplications: applications.filter(app => app.status === 'rejected').length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalBatches: batches.length,
    activeBatches: batches.filter(b => b.status === 'active').length
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage applications, projects, and student allocations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-secondary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Batches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBatches}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Target },
                { id: 'applications', label: 'Applications', icon: Users },
                { id: 'projects', label: 'Projects', icon: BookOpen },
                { id: 'batches', label: 'Batches', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Applications */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                    <div className="space-y-3">
                        {applications.slice(0, 5).map((application) => (
                            <div key={application._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{application.user.name}</p>
                                    <p className="text-sm text-gray-600">{application.project.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(application.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <StatusBadge status={application.status} type="application" />
                                    <button
                                        className="text-primary-600 hover:text-primary-900 px-2"
                                        title="Review"
                                        onClick={() => {
                                            setSelectedApplication(application);
                                            setShowReviewModal(true);
                                        }}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    {application.status === 'pending' && (
                                        <button
                                            className="text-green-600 hover:text-green-900 px-2"
                                            title="Allocate"
                                            onClick={() => {
                                                setSelectedApplication(application);
                                                setReviewData({
                                                    status: 'approved',
                                                    reviewNotes: '',
                                                    assignedRole: 'Developer',
                                                    batchName: `${application.project.title}-Batch-${Date.now()}`
                                                });
                                                setShowReviewModal(true);
                                            }}
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Button to create new project */}
                        <div className="pt-2">
                            <button
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
                                onClick={() => setShowCreateProjectModal(true)}
                            >
                                <Plus className="h-4 w-4" />
                                <span>Post New Project</span>
                            </button>
                        </div>
                    </div>
                  </div>

                  {/* Active Batches */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Batches</h3>
                    <div className="space-y-3">
                      {batches.filter(b => b.status === 'active').slice(0, 5).map((batch) => (
                        <div key={batch._id} className="p-3 bg-white rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900">{batch.name}</p>
                            <StatusBadge status={batch.status} type="batch" />
                          </div>
                          <p className="text-sm text-gray-600">{batch.project.title}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {batch.members.length}/{batch.maxMembers} members
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {batch.progress}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search by student name or project..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <div className="sm:w-48">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Applications List */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applied Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredApplications.map((application) => (
                          <tr key={application._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                      {application.user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {application.user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {application.user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {application.project.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.project.difficulty}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={application.status} type="application" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(application.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setShowReviewModal(true);
                                }}
                                className="text-primary-600 hover:text-primary-900 mr-3"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {application.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setReviewData({
                                      status: 'approved',
                                      reviewNotes: '',
                                      assignedRole: 'Developer',
                                      batchName: `${application.project.title}-Batch-${Date.now()}`
                                    });
                                    setShowReviewModal(true);
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Projects</h3>
                  <button
                    onClick={() => setShowCreateProjectModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Project</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project._id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                        <StatusBadge status={project.status} type="project" />
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {project.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          Max {project.maxTeamSize} members
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Target className="h-4 w-4 mr-2" />
                          {project.difficulty}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors duration-200">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Batches Tab */}
            {activeTab === 'batches' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Manage Batches</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {batches.map((batch) => (
                    <div key={batch._id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{batch.name}</h4>
                        <StatusBadge status={batch.status} type="batch" />
                      </div>
                      <p className="text-gray-600 mb-4">{batch.project.title}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{batch.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${batch.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Members */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Team Members ({batch.members.length}/{batch.maxMembers})
                        </p>
                        <div className="space-y-2">
                          {batch.members.map((member, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-medium">
                                    {member.user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="font-medium">{member.user.name}</span>
                              </div>
                              <span className="text-gray-500">{member.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-primary-100 hover:bg-primary-200 text-primary-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors duration-200">
                          <Settings className="h-4 w-4" />
                          <span>Manage</span>
                        </button>
                        <button className="flex-1 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors duration-200">
                          <TrendingUp className="h-4 w-4" />
                          <span>Update Progress</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Application Modal */}
      {showReviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Review Application</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Application Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Student:</span> {selectedApplication.user.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedApplication.user.email}</p>
                  <p><span className="font-medium">Project:</span> {selectedApplication.project.title}</p>
                  <p><span className="font-medium">Applied:</span> {new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Motivation */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Motivation</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedApplication.motivation}
                </p>
              </div>

              {/* Relevant Experience */}
              {selectedApplication.relevantExperience && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Relevant Experience</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.relevantExperience}
                  </p>
                </div>
              )}

              {/* Review Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Decision
                  </label>
                  <select
                    value={reviewData.status}
                    onChange={(e) => setReviewData({...reviewData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>

                {reviewData.status === 'approved' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Role
                      </label>
                      <input
                        type="text"
                        value={reviewData.assignedRole}
                        onChange={(e) => setReviewData({...reviewData, assignedRole: e.target.value})}
                        placeholder="e.g., Frontend Developer, Backend Developer, UI/UX Designer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Name
                      </label>
                      <input
                        type="text"
                        value={reviewData.batchName}
                        onChange={(e) => setReviewData({...reviewData, batchName: e.target.value})}
                        placeholder="e.g., Project-Alpha-Batch-1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewData.reviewNotes}
                    onChange={(e) => setReviewData({...reviewData, reviewNotes: e.target.value})}
                    rows={3}
                    placeholder="Add any notes about your decision..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedApplication(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewApplication}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newProject.duration}
                    onChange={(e) => setNewProject({...newProject, duration: e.target.value})}
                    placeholder="e.g., 8 weeks"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newProject.difficulty}
                    onChange={(e) => setNewProject({...newProject, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    value={newProject.maxTeamSize}
                    onChange={(e) => setNewProject({...newProject, maxTeamSize: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements (one per line)
                </label>
                <textarea
                  value={newProject.requirements}
                  onChange={(e) => setNewProject({...newProject, requirements: e.target.value})}
                  rows={4}
                  placeholder="Basic knowledge of JavaScript&#10;Understanding of React concepts&#10;Familiarity with REST APIs"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateProjectModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;