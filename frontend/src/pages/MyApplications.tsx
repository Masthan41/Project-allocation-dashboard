import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { Application } from '../types';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationService.getMyApplications();
      setApplications(response.applications || []);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusMessage = (application: Application) => {
    switch (application.status) {
      case 'pending':
        return 'Your application is being reviewed by the admin team.';
      case 'approved':
        return `Congratulations! Your application has been approved${application.reviewedBy ? ` by ${application.reviewedBy.name}` : ''}.`;
      case 'rejected':
        return `Your application was not approved${application.reviewedBy ? ` by ${application.reviewedBy.name}` : ''}.`;
      default:
        return 'Application status unknown.';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your applications..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">
            Track the status of your project applications and view feedback
          </p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't applied to any projects yet. Browse available projects to get started!
            </p>
            <div className="mt-6">
              <a
                href="/projects"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Browse Projects
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(application.status)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.project.title}
                      </h3>
                    </div>
                    <StatusBadge status={application.status} type="application" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        {getStatusMessage(application)}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                        {application.reviewedAt && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Reviewed on {new Date(application.reviewedAt).toLocaleDateString()}
                          </div>
                        )}
                        {application.reviewedBy && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Reviewed by {application.reviewedBy.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Project Details</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {application.project.description}
                      </p>
                    </div>
                  </div>

                  {/* Review Notes */}
                  {application.reviewNotes && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Admin Feedback</p>
                          <p className="text-sm text-gray-600">{application.reviewNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {application.preferredRole && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Preferred: {application.preferredRole}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowDetailsModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Application Details
                </h3>
                <StatusBadge status={selectedApplication.status} type="application" />
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Project Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Project Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Title:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedApplication.project.title}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Description:</span>
                    <p className="mt-1 text-sm text-gray-600">{selectedApplication.project.description}</p>
                  </div>
                </div>
              </div>

              {/* Your Application */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Your Application</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Motivation:</span>
                    <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedApplication.motivation}
                    </p>
                  </div>
                  
                  {selectedApplication.relevantExperience && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Relevant Experience:</span>
                      <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedApplication.relevantExperience}
                      </p>
                    </div>
                  )}
                  
                  {selectedApplication.preferredRole && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Preferred Role:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedApplication.preferredRole}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Information */}
              {(selectedApplication.reviewedBy || selectedApplication.reviewNotes) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Review Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {selectedApplication.reviewedBy && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Reviewed by:</span>
                        <span className="ml-2 text-sm text-gray-900">{selectedApplication.reviewedBy.name}</span>
                      </div>
                    )}
                    {selectedApplication.reviewedAt && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Reviewed on:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {new Date(selectedApplication.reviewedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedApplication.reviewNotes && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Feedback:</span>
                        <p className="mt-1 text-sm text-gray-600">{selectedApplication.reviewNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Timeline</h4>
                <div className="flow-root">
                  <ul className="-mb-8">
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                              <FileText className="h-4 w-4 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Application submitted
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {new Date(selectedApplication.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    
                    {selectedApplication.reviewedAt && (
                      <li>
                        <div className="relative">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                selectedApplication.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                {selectedApplication.status === 'approved' ? (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-white" />
                                )}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Application {selectedApplication.status}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {new Date(selectedApplication.reviewedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedApplication(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;