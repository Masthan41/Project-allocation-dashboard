import React from 'react';
import { CheckCircle, Clock, XCircle, Users, Play, Trophy } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'application' | 'project' | 'batch';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'application' }) => {
  const getStatusConfig = () => {
    const configs = {
      application: {
        pending: {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Pending'
        },
        approved: {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Approved'
        },
        rejected: {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Rejected'
        }
      },
      project: {
        active: {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Play,
          label: 'Active'
        },
        inactive: {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          label: 'Inactive'
        },
        completed: {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Trophy,
          label: 'Completed'
        }
      },
      batch: {
        forming: {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Users,
          label: 'Forming'
        },
        active: {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Play,
          label: 'Active'
        },
        completed: {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Trophy,
          label: 'Completed'
        }
      }
    };

    return configs[type]?.[status] || {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: Clock,
      label: status
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default StatusBadge;