import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { projectService } from '../services/projectService';
import { batchService } from '../services/batchService';
import { Application, Project, Batch } from '../types';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [myBatch, setMyBatch] = useState<Batch | null>(null);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const promises = [
        user?.role === 'admin' 
          ? applicationService.getAllApplications()
          : applicationService.getMyApplications(),
        projectService.getProjects(),
      ];

      if (user?.currentBatch) {
        promises.push(batchService.getMyBatch());
      }

      if (user?.role === 'admin') {
        promises.push(batchService.getBatches());
      }

      const results = await Promise.all(promises);
      
      setApplications(results[0].applications || []);
      setProjects(results[1].projects || []);
      
      if (user?.currentBatch && results[2]) {
        setMyBatch(results[2].batch);
      }
      
      if (user?.role === 'admin' && results[3]) {
        setAllBatches(results[3].batches || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const stats = user?.role === 'admin' ? {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    totalProjects: projects.length,
    activeBatches: allBatches.filter(batch => batch.status === 'active').length,
  } : {
    myApplications: applications.length,
    approvedApplications: applications.filter(app => app.status === 'approved').length,
    availableProjects: projects.length,
    currentBatch: myBatch ? 1 : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'admin'
              ? 'Post new projects, review student submissions, and allocate projects to batches.'
              : 'Browse available projects and request to join. Track your submissions and allocations.'
            }
          </p>
        </div>

        {/* Admin: Post Project Button */}
        {user?.role === 'admin' && (
          <div className="mb-6">
            <button
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded shadow"
              onClick={() => {
                // Open modal or navigate to project creation page
                // You can implement modal or navigation logic here
                alert('Open project creation modal or page');
              }}
            >
              + Post New Project
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role === 'admin' ? (
            <>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-primary-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-secondary-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-accent-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-accent-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Batches</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeBatches}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-primary-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.myApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.approvedApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-accent-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-accent-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.availableProjects}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-secondary-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Current Batch</p>
                    <p className="text-2xl font-bold text-gray-900">{myBatch ? 'Assigned' : 'None'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.role === 'admin' ? 'Recent Applications' : 'My Recent Applications'}
              </h3>
            </div>
            <div className="p-6">
              {applications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {application.project.title}
                        </h4>
                        {user?.role === 'admin' && (
                          <p className="text-sm text-gray-600">by {application.user.name}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={application.status} type="application" />
                      {/* Admin: Review & Allocate Buttons */}
                      {user?.role === 'admin' && (
                        <div className="ml-4 flex gap-2">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                            onClick={() => {
                              // Implement review logic here
                              alert('Review application');
                            }}
                          >
                            Review
                          </button>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                            onClick={() => {
                              // Implement allocate logic here
                              alert('Allocate to batch');
                            }}
                          >
                            Allocate
                          </button>
                        </div>
                      )}
                      {/* Student: Withdraw/Cancel Button (optional) */}
                      {user?.role !== 'admin' && application.status === 'pending' && (
                        <button
                          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                          onClick={() => {
                            // Implement withdraw logic here
                            alert('Withdraw application');
                          }}
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Batch or Active Projects */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.role === 'admin' ? 'Active Batches' : myBatch ? 'My Current Batch' : 'Available Projects'}
              </h3>
            </div>
            <div className="p-6">
              {user?.role === 'admin' ? (
                allBatches.filter(batch => batch.status === 'active').length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No active batches</p>
                ) : (
                  <div className="space-y-4">
                    {allBatches.filter(batch => batch.status === 'active').slice(0, 5).map((batch) => (
                      <div key={batch._id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{batch.name}</h4>
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
                        {/* Admin: View Batch Details Button */}
                        <div className="mt-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                            onClick={() => {
                              // Implement view batch details logic here
                              alert('View batch details');
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : myBatch ? (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{myBatch.name}</h4>
                    <StatusBadge status={myBatch.status} type="batch" />
                  </div>
                  <p className="text-sm text-gray-600">{myBatch.project.title}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{myBatch.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${myBatch.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Team Members:</p>
                    <div className="space-y-2">
                      {myBatch.members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{member.user.name}</span>
                          <span className="text-gray-500">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project._id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <StatusBadge status={project.status} type="project" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
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
                      {/* Student: Request Submission Button */}
                      <button
                        className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => {
                          // Implement request submission logic here
                          alert('Request to join/submit for this project');
                        }}
                      >
                        Request Submission
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;