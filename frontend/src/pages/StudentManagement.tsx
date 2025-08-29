import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Search, 
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Award,
  Calendar,
  Eye,
  MessageSquare,
  Settings,
  Download,
  Upload,
  FileText,
  BarChart3,
  X,
  Send,
  Shield,
  Clock
} from 'lucide-react';
import { User } from '../types';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentManagement: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user',
    assignedRole: '',
    currentBatch: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      // Mock student data - in real app, this would come from API
      const mockStudents: User[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'user',
          profile: {
            phone: '+1 (555) 123-4567',
            skills: ['React', 'JavaScript', 'CSS', 'UI/UX Design'],
            experience: 'Frontend developer with 2 years experience in React and modern web technologies.',
            bio: 'Passionate about creating beautiful and functional user interfaces.'
          },
          currentBatch: 'batch1',
          assignedRole: 'Frontend Developer'
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'user',
          profile: {
            phone: '+1 (555) 987-6543',
            skills: ['Node.js', 'Express', 'MongoDB', 'Python'],
            experience: 'Backend developer with experience in API development and database design.',
            bio: 'Love building scalable backend systems and working with databases.'
          },
          currentBatch: 'batch1',
          assignedRole: 'Backend Developer'
        },
        {
          id: '3',
          name: 'Carol Davis',
          email: 'carol@example.com',
          role: 'user',
          profile: {
            skills: ['Java', 'Spring Boot', 'MySQL'],
            experience: 'Computer Science student with strong programming fundamentals.',
            bio: 'Eager to learn and contribute to meaningful projects.'
          },
          currentBatch: undefined,
          assignedRole: undefined
        },
        {
          id: '4',
          name: 'David Wilson',
          email: 'david@example.com',
          role: 'user',
          profile: {
            phone: '+1 (555) 456-7890',
            skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
            experience: 'Full-stack developer with 3 years experience in web development.',
            bio: 'Passionate about clean code and scalable architecture.'
          },
          currentBatch: 'batch2',
          assignedRole: 'Full Stack Developer'
        }
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Failed to load student data');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedStudent || !messageContent.trim()) return;
    
    try {
      // In real app, this would send via API
      toast.success(`Message sent to ${selectedStudent.name}`);
      setShowMessageModal(false);
      setMessageContent('');
      setSelectedStudent(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

const handleEditStudent = () => {
  if (!selectedStudent) return;

  setStudents(prev => prev.map(s => 
    s.id === selectedStudent.id 
      ? {
          ...s,
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
          assignedRole: editForm.assignedRole || undefined,
          currentBatch: editForm.currentBatch || undefined
        }
      : s
  ));

  toast.success('Student updated successfully');
  setShowEditModal(false);
  setSelectedStudent(null);
};


  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    toast.success('Student removed successfully');
  };

  const exportStudentData = () => {
    const csvData = students.map(student => ({
      Name: student.name,
      Email: student.email,
      Role: student.role,
      'Current Batch': student.currentBatch || 'Unassigned',
      'Assigned Role': student.assignedRole || 'None',
      Skills: student.profile?.skills?.join(', ') || 'None',
      Phone: student.profile?.phone || 'Not provided'
    }));
    
    console.log('Exporting student data:', csvData);
    toast.success('Student data exported successfully');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || student.role === roleFilter;
    const matchesBatch = batchFilter === 'all' || 
                        (batchFilter === 'assigned' && student.currentBatch) ||
                        (batchFilter === 'unassigned' && !student.currentBatch);
    return matchesSearch && matchesRole && matchesBatch;
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access student management.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading student data..." />
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
              <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
              <p className="mt-2 text-gray-600">
                Manage student profiles, assignments, and communication
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportStudentData}
                className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </button>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <UserPlus className="h-4 w-4" />
                <span>Add Student</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.currentBatch).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => !s.currentBatch).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-secondary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((students.filter(s => s.currentBatch).length / students.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="user">Students</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
            <div>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Students</option>
                <option value="assigned">Assigned to Batch</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                          {student.profile?.phone && (
                            <div className="text-xs text-gray-400">{student.profile.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.profile?.skills?.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {(student.profile?.skills?.length || 0) > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{(student.profile?.skills?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.currentBatch ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">Assigned</div>
                          <div className="text-sm text-gray-500">{student.assignedRole}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.currentBatch 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.currentBatch ? 'Active' : 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDetailsModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowMessageModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                          title="Send Message"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setEditForm({
                              name: student.name,
                              email: student.email,
                              role: student.role,
                              assignedRole: student.assignedRole || '',
                              currentBatch: student.currentBatch || ''
                            });
                            setShowEditModal(true);
                          }}
                          className="text-secondary-600 hover:text-secondary-900 p-1 rounded hover:bg-secondary-50 transition-colors duration-200"
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${student.name}?`)) {
                              handleDeleteStudent(student.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                          title="Remove Student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || roleFilter !== 'all' || batchFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No students have registered yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Student Profile</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedStudent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {selectedStudent.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedStudent.name}</h4>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  {selectedStudent.profile?.phone && (
                    <p className="text-gray-500 text-sm">{selectedStudent.profile.phone}</p>
                  )}
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedStudent.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {selectedStudent.role === 'admin' ? 'Administrator' : 'Student'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Assignment Status</h5>
                {selectedStudent.currentBatch ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Batch:</span>
                      <span className="text-sm font-medium text-gray-900">Team Alpha</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Role:</span>
                      <span className="text-sm font-medium text-primary-600">{selectedStudent.assignedRole}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Not assigned to any batch</p>
                )}
              </div>

              {/* Skills */}
              {selectedStudent.profile?.skills && selectedStudent.profile.skills.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {selectedStudent.profile?.experience && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Experience</h5>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedStudent.profile.experience}
                  </p>
                </div>
              )}

              {/* Bio */}
              {selectedStudent.profile?.bio && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Bio</h5>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedStudent.profile.bio}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedStudent(selectedStudent);
                  setShowMessageModal(true);
                  setShowDetailsModal(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Send Message</span>
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Student: {selectedStudent.name}
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStudent(null);
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
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="user">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Role
                </label>
                <input
                  type="text"
                  value={editForm.assignedRole}
                  onChange={(e) => setEditForm({...editForm, assignedRole: e.target.value})}
                  placeholder="e.g., Frontend Developer, Backend Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditStudent}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Update Student</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Send Message to {selectedStudent.name}
                </h3>
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setSelectedStudent(null);
                    setMessageContent('');
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
                  Message
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                  placeholder="Type your message here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedStudent(null);
                  setMessageContent('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                disabled={!messageContent.trim()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;