import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Calendar,
  FileText,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  User,
  X,       // add this
  Award    // add this
} from 'lucide-react';
import { batchService } from '../services/batchService';
import { Batch } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file';
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdBy: string;
  createdAt: string;
}

const TeamCollaboration: React.FC = () => {
  const { user } = useAuth();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    loadBatchData();
    // Simulate loading messages and tasks
    loadMessages();
    loadTasks();
  }, []);

  const loadBatchData = async () => {
    try {
      const response = await batchService.getMyBatch();
      setBatch(response.batch);
    } catch (error) {
      console.error('Failed to load batch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = () => {
    // Simulate chat messages
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: 'user1',
        senderName: 'Alice Johnson',
        content: 'Hey team! I\'ve started working on the frontend components. Should have the login page ready by tomorrow.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'text'
      },
      {
        id: '2',
        sender: 'user2',
        senderName: 'Bob Smith',
        content: 'Great! I\'m setting up the backend API. The user authentication endpoints are almost done.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        type: 'text'
      },
      {
        id: '3',
        sender: user?.id || 'current',
        senderName: user?.name || 'You',
        content: 'Perfect! I\'ll work on the database schema and models. Let me know if you need any specific endpoints.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        type: 'text'
      }
    ];
    setMessages(mockMessages);
  };

  const loadTasks = () => {
    // Simulate project tasks
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Design User Interface',
        description: 'Create wireframes and mockups for the main application interface',
        assignedTo: 'user1',
        assignedToName: 'Alice Johnson',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: user?.id || 'admin',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Setup Backend API',
        description: 'Initialize Express server and create basic CRUD endpoints',
        assignedTo: 'user2',
        assignedToName: 'Bob Smith',
        status: 'completed',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: user?.id || 'admin',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Database Schema Design',
        description: 'Design and implement the database schema for user management',
        assignedTo: user?.id || 'current',
        assignedToName: user?.name || 'You',
        status: 'pending',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: user?.id || 'admin',
        createdAt: new Date().toISOString()
      }
    ];
    setTasks(mockTasks);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSendingMessage(true);
    try {
      const message: Message = {
        id: Date.now().toString(),
        sender: user?.id || 'current',
        senderName: user?.name || 'You',
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleCreateTask = () => {
    if (!taskForm.title.trim() || !taskForm.assignedTo) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      assignedTo: taskForm.assignedTo,
      assignedToName: batch?.members.find(m => m.user._id === taskForm.assignedTo)?.user.name || 'Unknown',
      status: 'pending',
      dueDate: taskForm.dueDate,
      createdBy: user?.id || 'current',
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, newTask]);
    setShowTaskModal(false);
    setTaskForm({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      status: 'pending'
    });
    toast.success('Task created successfully!');
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus as any } : task
    ));
    toast.success('Task status updated!');
  };

  if (!user?.currentBatch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Team Assigned</h2>
          <p className="text-gray-600">You haven't been assigned to a project team yet.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading team collaboration..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
          <p className="mt-2 text-gray-600">
  Collaborate with your team members on {batch?.project?.title || 'Project not available'}
</p>

        </div>

        {/* Team Info Card */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{batch?.name}</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Progress: <span className="font-medium text-primary-600">{batch?.progress}%</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${batch?.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Project Details</h3>
              <p className="text-gray-600">{batch?.project?.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Team Members</h3>
              <div className="flex -space-x-2">
                {batch?.members.map((member, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center border-2 border-white"
                    title={`${member.user.name} - ${member.role}`}
                  >
                    <span className="text-xs text-white font-medium">
                      {member.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'chat', label: 'Team Chat', icon: MessageSquare },
                { id: 'tasks', label: 'Tasks & Milestones', icon: CheckCircle },
                { id: 'files', label: 'Shared Files', icon: FileText },
                { id: 'timeline', label: 'Project Timeline', icon: Calendar }
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
            {/* Team Chat Tab */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === user?.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-white border border-gray-200'
                        }`}>
                          {message.sender !== user?.id && (
                            <p className="text-xs font-medium text-gray-600 mb-1">
                              {message.senderName}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === user?.id ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isSendingMessage || !newMessage.trim()}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pending Tasks */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                      Pending ({tasks.filter(t => t.status === 'pending').length})
                    </h4>
                    <div className="space-y-3">
                      {tasks.filter(t => t.status === 'pending').map((task) => (
                        <div key={task.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">{task.title}</h5>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {task.assignedToName}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => updateTaskStatus(task.id, 'in-progress')}
                              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded"
                            >
                              Complete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* In Progress Tasks */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                      In Progress ({tasks.filter(t => t.status === 'in-progress').length})
                    </h4>
                    <div className="space-y-3">
                      {tasks.filter(t => t.status === 'in-progress').map((task) => (
                        <div key={task.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">{task.title}</h5>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {task.assignedToName}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-3">
                            <button
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded"
                            >
                              Mark Complete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Completed Tasks */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Completed ({tasks.filter(t => t.status === 'completed').length})
                    </h4>
                    <div className="space-y-3">
                      {tasks.filter(t => t.status === 'completed').map((task) => (
                        <div key={task.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">{task.title}</h5>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {task.assignedToName}
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Shared Files</h3>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                    <Upload className="h-4 w-4" />
                    <span>Upload File</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Mock files */}
                  {[
                    { name: 'Project Requirements.pdf', size: '2.4 MB', uploadedBy: 'Alice Johnson', date: '2 days ago' },
                    { name: 'UI Mockups.fig', size: '15.7 MB', uploadedBy: 'Bob Smith', date: '1 day ago' },
                    { name: 'Database Schema.sql', size: '1.2 MB', uploadedBy: 'You', date: '3 hours ago' }
                  ].map((file, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="h-8 w-8 text-primary-500" />
                        <button className="text-gray-400 hover:text-primary-500">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{file.name}</h4>
                      <p className="text-sm text-gray-600">{file.size}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Uploaded by {file.uploadedBy}</p>
                        <p>{file.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
                
                <div className="flow-root">
                  <ul className="-mb-8">
                    {[
                      { event: 'Project Started', date: '5 days ago', type: 'start' },
                      { event: 'Team Formation Complete', date: '4 days ago', type: 'milestone' },
                      { event: 'Requirements Analysis', date: '3 days ago', type: 'task' },
                      { event: 'UI Design Phase', date: '2 days ago', type: 'task' },
                      { event: 'Backend Development', date: '1 day ago', type: 'current' },
                      { event: 'Integration Testing', date: 'In 2 days', type: 'upcoming' },
                      { event: 'Project Completion', date: 'In 1 week', type: 'upcoming' }
                    ].map((item, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== 6 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                item.type === 'start' ? 'bg-green-500' :
                                item.type === 'milestone' ? 'bg-primary-500' :
                                item.type === 'current' ? 'bg-yellow-500' :
                                item.type === 'upcoming' ? 'bg-gray-300' :
                                'bg-blue-500'
                              }`}>
                                {item.type === 'start' && <CheckCircle className="h-4 w-4 text-white" />}
                                {item.type === 'milestone' && <Award className="h-4 w-4 text-white" />}
                                {item.type === 'current' && <Clock className="h-4 w-4 text-white" />}
                                {item.type === 'upcoming' && <Calendar className="h-4 w-4 text-white" />}
                                {item.type === 'task' && <CheckCircle className="h-4 w-4 text-white" />}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.event}</p>
                                <p className={`text-sm ${
                                  item.type === 'current' ? 'text-yellow-600 font-medium' :
                                  item.type === 'upcoming' ? 'text-gray-500' :
                                  'text-gray-600'
                                }`}>
                                  {item.type === 'current' ? 'Currently in progress' : 
                                   item.type === 'upcoming' ? 'Scheduled' : 'Completed'}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {item.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  rows={3}
                  placeholder="Describe the task..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To *
                </label>
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select team member</option>
                  {batch?.members.map((member) => (
                  <option key={member.user?._id} value={member.user?._id}>
  {member.user?.name} ({member.role})
</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!taskForm.title.trim() || !taskForm.assignedTo}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCollaboration;