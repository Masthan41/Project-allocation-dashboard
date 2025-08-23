export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profile?: {
    phone?: string;
    skills?: string[];
    experience?: string;
    bio?: string;
    profileImage?: string;
  };
  currentBatch?: string;
  assignedRole?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  maxTeamSize: number;
  requirements: string[];
  status: 'active' | 'inactive' | 'completed';
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  user: User;
  project: Project;
  status: 'pending' | 'approved' | 'rejected';
  motivation: string;
  relevantExperience?: string;
  preferredRole?: string;
  reviewedBy?: User;
  reviewNotes?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  _id: string;
  name: string;
  project: Project;
  members: Array<{
    user: User;
    role: string;
    joinedAt: string;
  }>;
  maxMembers: number;
  status: 'forming' | 'active' | 'completed';
  startDate?: string;
  endDate?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: 'application' | 'approval' | 'rejection' | 'meeting' | 'assignment';
  read: boolean;
  data?: any;
  createdAt: string;
}