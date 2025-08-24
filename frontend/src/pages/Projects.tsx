import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Target,
  Plus,
  Search,
  Filter,
  Calendar,
  Code,
  CheckCircle
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { applicationService } from '../services/applicationService';
import { Project } from '../types';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    motivation: '',
    relevantExperience: '',
    preferredRole: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.projects || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToProject = async () => {
    if (!selectedProject) return;

    setIsSubmitting(true);
    try {
      await applicationService.createApplication({
        project: selectedProject._id,
        ...applicationData
      });
      
      toast.success('Application submitted successfully!');
      setShowApplicationModal(false);
      setSelectedProject(null);
      setApplicationData({
        motivation: '',
        relevantExperience: '',
        preferredRole: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || project.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading projects..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Projects</h1>
          <p className="mt-2 text-gray-600">
            Discover and apply to exciting projects that match your skills and interests
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search projects by title, description, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {project.title}
                  </h3>
                  <StatusBadge status={project.status} type="project" />
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Max {project.maxTeamSize} members</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.difficulty}
                    </span>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        <Code className="h-3 w-3 mr-1" />
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Requirements Preview */}
                {project.requirements.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Key Requirements:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {project.requirements.slice(0, 2).map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                          <span className="line-clamp-1">{req}</span>
                        </li>
                      ))}
                      {project.requirements.length > 2 && (
                        <li className="text-xs text-gray-500">
                          +{project.requirements.length - 2} more requirements
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setShowApplicationModal(true);
                    }}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Apply</span>
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200">
                    View Details
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || difficultyFilter !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'No projects are currently available'
              }
            </p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Apply to {selectedProject.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Tell us why you're interested in this project and what you can contribute
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Project Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Project Overview</h4>
                <p className="text-sm text-gray-600 mb-3">{selectedProject.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2 text-gray-600">{selectedProject.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Team Size:</span>
                    <span className="ml-2 text-gray-600">Max {selectedProject.maxTeamSize}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Difficulty:</span>
                    <span className="ml-2 text-gray-600">{selectedProject.difficulty}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Technologies:</span>
                    <span className="ml-2 text-gray-600">{selectedProject.technologies.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Application Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why are you interested in this project? *
                  </label>
                  <textarea
                    value={applicationData.motivation}
                    onChange={(e) => setApplicationData({...applicationData, motivation: e.target.value})}
                    rows={4}
                    required
                    placeholder="Explain your motivation, what excites you about this project, and what you hope to learn or achieve..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Experience
                  </label>
                  <textarea
                    value={applicationData.relevantExperience}
                    onChange={(e) => setApplicationData({...applicationData, relevantExperience: e.target.value})}
                    rows={3}
                    placeholder="Describe any relevant experience, projects, or skills that make you a good fit for this project..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Role
                  </label>
                  <input
                    type="text"
                    value={applicationData.preferredRole}
                    onChange={(e) => setApplicationData({...applicationData, preferredRole: e.target.value})}
                    placeholder="e.g., Frontend Developer, Backend Developer, UI/UX Designer, Project Manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Requirements Checklist */}
              {selectedProject.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Project Requirements</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedProject.requirements.map((req, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedProject(null);
                  setApplicationData({
                    motivation: '',
                    relevantExperience: '',
                    preferredRole: ''
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyToProject}
                disabled={isSubmitting || !applicationData.motivation.trim()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;