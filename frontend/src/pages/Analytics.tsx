import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen,
  Calendar,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { projectService } from '../services/projectService';
import { batchService } from '../services/batchService';
import { Application, Project, Batch } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
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
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access analytics.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  // Calculate analytics
  const totalStudents = new Set(applications.map(app => app.user.email)).size;
  const approvalRate = applications.length > 0 ? 
    Math.round((applications.filter(app => app.status === 'approved').length / applications.length) * 100) : 0;
  const averageTeamSize = batches.length > 0 ? 
    Math.round(batches.reduce((sum, batch) => sum + batch.members.length, 0) / batches.length) : 0;
  const averageProgress = batches.length > 0 ? 
    Math.round(batches.reduce((sum, batch) => sum + batch.progress, 0) / batches.length) : 0;

  // Project difficulty distribution
  const difficultyStats = projects.reduce((acc, project) => {
    acc[project.difficulty] = (acc[project.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Application status distribution
  const statusStats = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Monthly application trends (last 6 months)
  const monthlyTrends = applications.reduce((acc, app) => {
    const month = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Stats for summary cards
  const stats = {
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    activeProjects: projects.filter(
      project => project.status === 'active' || project.status === 'open'
    ).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive insights into system performance and student engagement
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900">{approvalRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-secondary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Team Size</p>
                <p className="text-2xl font-bold text-gray-900">{averageTeamSize}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-accent-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-accent-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
            <div className="space-y-4">
              {Object.entries(statusStats).map(([status, count]) => {
                const percentage = Math.round((count / applications.length) * 100);
                const colors = {
                  pending: 'bg-yellow-500',
                  approved: 'bg-green-500',
                  rejected: 'bg-red-500'
                };
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                        {status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {status === 'rejected' && <XCircle className="h-4 w-4 text-red-500" />}
                        <span className="text-sm font-medium text-gray-900 capitalize">{status}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {count} ({percentage}%)
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${colors[status as keyof typeof colors] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Difficulty Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Difficulty Distribution</h3>
            <div className="space-y-4">
              {Object.entries(difficultyStats).map(([difficulty, count]) => {
                const percentage = Math.round((count / projects.length) * 100);
                const colors = {
                  Beginner: 'bg-green-500',
                  Intermediate: 'bg-yellow-500',
                  Advanced: 'bg-red-500'
                };
                
                return (
                  <div key={difficulty} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{difficulty}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {count} ({percentage}%)
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${colors[difficulty as keyof typeof colors] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Progress Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Progress Overview</h3>
            <div className="space-y-4">
              {batches.slice(0, 6).map((batch) => (
                <div key={batch._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{batch.name}</p>
                      <p className="text-xs text-gray-500">{batch.project.title}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {batch.progress}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${batch.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {batches.length === 0 && (
                <p className="text-gray-500 text-center py-4">No teams created yet</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {applications.slice(0, 8).map((application) => (
                <div key={application._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {application.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {application.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {application.status === 'rejected' && <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {application.user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Applied to {application.project.title}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100">System Health</p>
                <p className="text-2xl font-bold">
                  {stats.pendingApplications === 0 ? 'Excellent' : 'Good'}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary-200" />
            </div>
            <p className="mt-2 text-sm text-primary-100">
              {stats.pendingApplications === 0 
                ? 'All applications reviewed' 
                : `${stats.pendingApplications} pending reviews`
              }
            </p>
          </div>

          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100">Engagement Rate</p>
                <p className="text-2xl font-bold">{approvalRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-secondary-200" />
            </div>
            <p className="mt-2 text-sm text-secondary-100">
              Student application approval rate
            </p>
          </div>

          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Active Projects</p>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-200" />
            </div>
            <p className="mt-2 text-sm text-orange-100">
              Projects currently accepting applications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;