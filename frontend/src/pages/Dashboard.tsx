// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { 
//   BookOpen, 
//   Users, 
//   Clock, 
//   CheckCircle,
//   TrendingUp,
//   Calendar,
//   Target,
//   Award
// } from 'lucide-react';
// import { applicationService } from '../services/applicationService';
// import { projectService } from '../services/projectService';
// import { batchService } from '../services/batchService';
// import { Application, Project, Batch } from '../types';
// import StatusBadge from '../components/StatusBadge';
// import LoadingSpinner from '../components/LoadingSpinner';

// const Dashboard: React.FC = () => {
//   const { user } = useAuth();
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [myBatch, setMyBatch] = useState<Batch | null>(null);
//   const [allBatches, setAllBatches] = useState<Batch[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadDashboardData();
//   }, [user]);

//   const loadDashboardData = async () => {
//     try {
//       const promises = [
//         user?.role === 'admin' 
//           ? applicationService.getAllApplications()
//           : applicationService.getMyApplications(),
//         projectService.getProjects(),
//       ];

//       if (user?.currentBatch) {
//         promises.push(batchService.getMyBatch());
//       }

//       if (user?.role === 'admin') {
//         promises.push(batchService.getBatches());
//       }

//       const results = await Promise.all(promises);
      
//       setApplications(results[0].applications || []);
//       setProjects(results[1].projects || []);
      
//       if (user?.currentBatch && results[2]) {
//         setMyBatch(results[2].batch);
//       }
      
//       if (user?.role === 'admin' && results[3]) {
//         setAllBatches(results[3].batches || []);
//       }
//     } catch (error) {
//       console.error('Failed to load dashboard data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <LoadingSpinner size="lg" text="Loading dashboard..." />
//       </div>
//     );
//   }

//   const stats = user?.role === 'admin' ? {
//     totalApplications: applications.length,
//     pendingApplications: applications.filter(app => app.status === 'pending').length,
//     totalProjects: projects.length,
//     activeBatches: allBatches.filter(batch => batch.status === 'active').length,
//   } : {
//     myApplications: applications.length,
//     approvedApplications: applications.filter(app => app.status === 'approved').length,
//     availableProjects: projects.length,
//     currentBatch: myBatch ? 1 : 0,
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {user?.name}!
//           </h1>
//           <p className="mt-2 text-gray-600">
//             {user?.role === 'admin'
//               ? 'Post new projects, review student submissions, and allocate projects to batches.'
//               : 'Browse available projects and request to join. Track your submissions and allocations.'
//             }
//           </p>
//         </div>

//         {/* Admin: Post Project Button */}
//         {user?.role === 'admin' && (
//           <div className="mb-6">
//             <button
//               className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded shadow"
//               onClick={() => {
//                 // Open modal or navigate to project creation page
//                 // You can implement modal or navigation logic here
//                 alert('Open project creation modal or page');
//               }}
//             >
//               + Post New Project
//             </button>
//           </div>
//         )}

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {user?.role === 'admin' ? (
//             <>
//               <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <Clock className="h-8 w-8 text-primary-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Pending Applications</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <BookOpen className="h-8 w-8 text-secondary-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Applications</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6 border-l-4 border-accent-500">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <Target className="h-8 w-8 text-accent-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Active Projects</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <Users className="h-8 w-8 text-green-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Active Batches</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.activeBatches}</p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <BookOpen className="h-8 w-8 text-primary-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">My Applications</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.myApplications}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <CheckCircle className="h-8 w-8 text-green-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Approved</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.approvedApplications}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6 border-l-4 border-accent-500">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <Target className="h-8 w-8 text-accent-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Available Projects</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.availableProjects}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <Users className="h-8 w-8 text-secondary-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Current Batch</p>
//                     <p className="text-2xl font-bold text-gray-900">{myBatch ? 'Assigned' : 'None'}</p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Recent Applications */}
//           <div className="bg-white rounded-lg shadow">
//             <div className="p-6 border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {user?.role === 'admin' ? 'Recent Applications' : 'My Recent Applications'}
//               </h3>
//             </div>
//             <div className="p-6">
//               {applications.length === 0 ? (
//                 <p className="text-gray-500 text-center py-4">No applications yet</p>
//               ) : (
//                 <div className="space-y-4">
//                   {applications.slice(0, 5).map((application) => (
//                     <div key={application._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                       <div className="flex-1">
//                         <h4 className="font-medium text-gray-900">
//                           {application.project.title}
//                         </h4>
//                         {user?.role === 'admin' && (
//                           <p className="text-sm text-gray-600">by {application.user.name}</p>
//                         )}
//                         <p className="text-xs text-gray-500 mt-1">
//                           {new Date(application.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <StatusBadge status={application.status} type="application" />
//                       {/* Admin: Review & Allocate Buttons */}
//                       {user?.role === 'admin' && (
//                         <div className="ml-4 flex gap-2">
//                           <button
//                             className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
//                             onClick={() => {
//                               // Implement review logic here
//                               alert('Review application');
//                             }}
//                           >
//                             Review
//                           </button>
//                           <button
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
//                             onClick={() => {
//                               // Implement allocate logic here
//                               alert('Allocate to batch');
//                             }}
//                           >
//                             Allocate
//                           </button>
//                         </div>
//                       )}
//                       {/* Student: Withdraw/Cancel Button (optional) */}
//                       {user?.role !== 'admin' && application.status === 'pending' && (
//                         <button
//                           className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
//                           onClick={() => {
//                             // Implement withdraw logic here
//                             alert('Withdraw application');
//                           }}
//                         >
//                           Withdraw
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Current Batch or Active Projects */}
//           <div className="bg-white rounded-lg shadow">
//             <div className="p-6 border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {user?.role === 'admin' ? 'Active Batches' : myBatch ? 'My Current Batch' : 'Available Projects'}
//               </h3>
//             </div>
//             <div className="p-6">
//               {user?.role === 'admin' ? (
//                 allBatches.filter(batch => batch.status === 'active').length === 0 ? (
//                   <p className="text-gray-500 text-center py-4">No active batches</p>
//                 ) : (
//                   <div className="space-y-4">
//                     {allBatches.filter(batch => batch.status === 'active').slice(0, 5).map((batch) => (
//                       <div key={batch._id} className="p-4 border border-gray-200 rounded-lg">
//                         <div className="flex items-center justify-between mb-2">
//                           <h4 className="font-medium text-gray-900">{batch.name}</h4>
//                           <StatusBadge status={batch.status} type="batch" />
//                         </div>
//                         <p className="text-sm text-gray-600">{batch.project.title}</p>
//                         <div className="mt-2 flex items-center justify-between">
//                           <span className="text-xs text-gray-500">
//                             {batch.members.length}/{batch.maxMembers} members
//                           </span>
//                           {/* Tracking Level */}
//                           {/* batch.level removed because it does not exist on type Batch */}
//                           {/* Options: Document, Code, etc. */}
//                           {batch.options && batch.options.length > 0 && (
//                             <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
//                               {batch.options.join(', ')}
//                             </span>
//                           )}
//                           <div className="flex items-center text-xs text-gray-500">
//                             <TrendingUp className="h-4 w-4 mr-1" />
//                             {batch.progress}%
//                           </div>
//                         </div>
//                         {/* Admin: View Batch Details Button */}
//                         <div className="mt-2">
//                           <button
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
//                             onClick={() => {
//                               // Implement view batch details logic here
//                               alert('View batch details');
//                             }}
//                           >
//                             View Details
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )
//               ) : myBatch ? (
//                 <div className="p-4 border border-gray-200 rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-medium text-gray-900">{myBatch.name}</h4>
//                     <StatusBadge status={myBatch.status} type="batch" />
//                   </div>
//                   <p className="text-sm text-gray-600">{myBatch.project.title}</p>
//                   <div className="mt-4">
//                     <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
//                       <span>Progress</span>
//                       <span>{myBatch.progress}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-primary-500 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${myBatch.progress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="mt-4">
//                     <p className="text-sm text-gray-600 mb-2">Team Members:</p>
//                     <div className="space-y-2">
//                       {myBatch.members.map((member, index) => (
//                         <div key={index} className="flex items-center justify-between text-sm">
//                           <span className="font-medium">{member.user.name}</span>
//                           <span className="text-gray-500">{member.role}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {projects.slice(0, 3).map((project) => (
//                     <div key={project._id} className="p-4 border border-gray-200 rounded-lg">
//                       <div className="flex items-center justify-between mb-2">
//                         <h4 className="font-medium text-gray-900">{project.title}</h4>
//                         <StatusBadge status={project.status} type="project" />
//                       </div>
//                       <p className="text-sm text-gray-600 mb-2">{project.description}</p>
//                       <div className="flex flex-wrap gap-1 mb-2">
//                         {project.technologies.slice(0, 3).map((tech) => (
//                           <span
//                             key={tech}
//                             className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
//                           >
//                             {tech}
//                           </span>
//                         ))}
//                         {project.technologies.length > 3 && (
//                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                             +{project.technologies.length - 3} more
//                           </span>
//                         )}
//                       </div>
//                       {/* Project Tracking System */}
//                       <div className="mb-2">
//                         <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
//                           <span>Progress</span>
//                           <span>{project.progress ? `${project.progress}%` : '0%'}</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div
//                             className="bg-primary-500 h-2 rounded-full transition-all duration-300"
//                             style={{ width: `${project.progress || 0}%` }}
//                           ></div>
//                         </div>
//                         {project.milestones && project.milestones.length > 0 && (
//                           <div className="mt-2">
//                             <p className="text-xs text-gray-500 mb-1">Milestones:</p>
//                             <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
//                               {project.milestones.map((milestone: { name: string; completed: boolean }, idx: number) => (
//                                 <li key={idx} className={milestone.completed ? "line-through text-green-600" : ""}>
//                                   {milestone.name}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                       {/* Student: Request Submission Button */}
//                       <button
//                         className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-xs"
//                         onClick={() => {
//                           // Implement request submission logic here
//                           alert('Request to join/submit for this project');
//                         }}
//                       >
//                         Request Submission
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };   <StatusBadge status={batch.status} type="batch" />
//                         </div>
//                         <p className="text-sm text-gray-600">{batch.project.title}</p>
//                         <div className="mt-2 flex items-center justify-between">
//                           <span className="text-xs text-gray-500">
//                             {batch.members.length}/{batch.maxMembers} members
//                           </span>
//                           {/* Tracking Level */}
//                           {/* batch.level removed because it does not exist on type Batch */}
//                           {/* Options: Document, Code, etc. */}
//                           {batch.options && batch.options.length > 0 && (
//                             <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
//                               {batch.options.join(', ')}
//                         <div className="mt-3 space-y-2">
//                           <div className="flex items-center justify-between text-xs text-gray-600">
//                             <div className="flex items-center">
//                               <Users className="h-4 w-4 mr-1.5" />
//                               <span>{batch.members.length}/{batch.maxMembers} Members</span>
//                             </div>
//                             {/* Tracking Level - NOTE: You'll need to add 'level' to your Batch type and data */}
//                             {(batch as any).level && (
//                               <div className="flex items-center">
//                                 <Award className="h-4 w-4 mr-1.5 text-yellow-500" />
//                                 <span>{(batch as any).level}</span>
//                               </div>
//                             )}
//                             <div className="flex items-center">
//                               <TrendingUp className="h-4 w-4 mr-1.5" />
//                               <span>{batch.progress}% Progress</span>
//                             </div>
//                           </div>
//                           {batch.options && batch.options.length > 0 && (
//                             <div className="flex items-center gap-1 flex-wrap">
//                               <span className="text-xs text-gray-500">Options:</span>
//                               {batch.options.map((opt) => (
//                                 <span key={opt} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                   {opt}
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                         {/* Admin: View Batch Details Button */}
//                         <div className="mt-4 text-right">
//                           <button
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
//                             onClick={() => {
//                               // Implement view batch details logic here
//                               alert('View batch details');
//                             }}
//                           >
//                             View Details
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )
//               ) : myBatch ? (
//                 <div className="p-4 border border-gray-200 rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-medium text-gray-900">{myBatch.name}</h4>
//                     <StatusBadge status={myBatch.status} type="batch" />
//                   </div>
//                   <p className="text-sm text-gray-600">{myBatch.project.title}</p>
//                   <div className="mt-4">
//                     <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
//                       <span>Overall Progress</span>
//                       <span>{myBatch.progress}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-primary-500 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${myBatch.progress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   {/* Project Milestones Tracking */}
//                   {myBatch.project.milestones && myBatch.project.milestones.length > 0 && (
//                     <div className="mt-4">
//                       <p className="text-sm text-gray-600 mb-2">Project Milestones:</p>
//                       <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
//                         {myBatch.project.milestones.map((milestone: { name: string; completed: boolean }, idx: number) => (
//                           <li key={idx} className={milestone.completed ? "line-through text-green-600" : ""}>
//                             {milestone.name}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                   <div className="mt-4">
//                     <p className="text-sm text-gray-600 mb-2">Team Members:</p>
//                     <div className="space-y-2">
//                       {myBatch.members.map((member, index) => (
//                         <div key={index} className="flex items-center justify-between text-sm">
//                           <span className="font-medium">{member.user.name}</span>
//                           <span className="text-gray-500">{member.role}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {projects.slice(0, 3).map((project) => {
//                     const totalMilestones = project.milestones?.length || 0;
//                     const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;

//                     return (
//                       <div key={project._id} className="p-4 border border-gray-200 rounded-lg">
//                         <div className="flex items-center justify-between mb-2">
//                           <h4 className="font-medium text-gray-900">{project.title}</h4>
//                           <StatusBadge status={project.status} type="project" />
//                         </div>
//                         <p className="text-sm text-gray-600 mb-2">{project.description}</p>
//                         <div className="flex flex-wrap gap-1 mb-2">
//                           {project.technologies.slice(0, 3).map((tech) => (
//                             <span
//                               key={tech}
//                               className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
//                             >
//                               {tech}
//                             </span>
//                           ))}
//                           {project.technologies.length > 3 && (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                               +{project.technologies.length - 3} more
//                             </span>
//                           )}
//                           <div className="flex items-center text-xs text-gray-500">
//                             <TrendingUp className="h-4 w-4 mr-1" />
//                             {batch.progress}%
//                           </div>
//                         </div>
//                         {/* Admin: View Batch Details Button */}
//                         <div className="mt-2">
//                           <button
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
//                             onClick={() => {
//                               // Implement view batch details logic here
//                               alert('View batch details');
//                             }}
//                           >
//                             View Details
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )
//               ) : myBatch ? (
//                 <div className="p-4 border border-gray-200 rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-medium text-gray-900">{myBatch.name}</h4>
//                     <StatusBadge status={myBatch.status} type="batch" />
//                   </div>
//                   <p className="text-sm text-gray-600">{myBatch.project.title}</p>
//                   <div className="mt-4">
//                     <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
//                       <span>Progress</span>
//                       <span>{myBatch.progress}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-primary-500 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${myBatch.progress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="mt-4">
//                     <p className="text-sm text-gray-600 mb-2">Team Members:</p>
//                     <div className="space-y-2">
//                       {myBatch.members.map((member, index) => (
//                         <div key={index} className="flex items-center justify-between text-sm">
//                           <span className="font-medium">{member.user.name}</span>
//                           <span className="text-gray-500">{member.role}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {projects.slice(0, 3).map((project) => (
//                     <div key={project._id} className="p-4 border border-gray-200 rounded-lg">
//                       <div className="flex items-center justify-between mb-2">
//                         <h4 className="font-medium text-gray-900">{project.title}</h4>
//                         <StatusBadge status={project.status} type="project" />
//                       </div>
//                       <p className="text-sm text-gray-600 mb-2">{project.description}</p>
//                       <div className="flex flex-wrap gap-1 mb-2">
//                         {project.technologies.slice(0, 3).map((tech) => (
//                           <span
//                             key={tech}
//                             className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
//                           >
//                             {tech}
//                           </span>
//                         ))}
//                         {project.technologies.length > 3 && (
//                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                             +{project.technologies.length - 3} more
//                           </span>
//                         )}
//                       </div>
//                       {/* Project Tracking System */}
//                       <div className="mb-2">
//                         <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
//                           <span>Progress</span>
//                           <span>{project.progress ? `${project.progress}%` : '0%'}</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div
//                             className="bg-primary-500 h-2 rounded-full transition-all duration-300"
//                             style={{ width: `${project.progress || 0}%` }}
//                           ></div>
//                         </div>
//                         {project.milestones && project.milestones.length > 0 && (
//                           <div className="mt-2">
//                             <p className="text-xs text-gray-500 mb-1">Milestones:</p>
//                             <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
//                               {project.milestones.map((milestone: { name: string; completed: boolean }, idx: number) => (
//                                 <li key={idx} className={milestone.completed ? "line-through text-green-600" : ""}>
//                                   {milestone.name}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                       {/* Student: Request Submission Button */}
//                       <button
//                         className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-xs"
//                         onClick={() => {
//                           // Implement request submission logic here
//                           alert('Request to join/submit for this project');
//                         }}
//                       >
//                         Request Submission
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  X, 
  Eye, 
  Calendar,
  User,
  MessageSquare,
  Star,
  Zap,
  Trophy,
  Check
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockApplications = [
  {
    id: 1,
    projectTitle: "Project Allocations",
    projectDescription: "A comprehensive project management system for tracking student applications and batch allocations.",
    status: "approved",
    appliedDate: "2025-08-24",
    reviewedDate: "2025-08-24",
    reviewedBy: "admin",
    adminFeedback: "Ok!",
    preferredRole: "frontend",
    projectDetails: {
      title: "Project Allocations",
      description: "mmm",
      technologies: ["React", "Node.js", "MongoDB"],
      difficulty: "Intermediate"
    },
    levels: [
      {
        id: 1,
        name: "Level 1",
        description: "Foundation & Setup",
        requirements: [
          "Project setup and initialization",
          "Basic configuration",
          "Initial documentation setup"
        ],
        completed: false,
        completedTasks: [false, false, false]
      },
      {
        id: 2,
        name: "Level 2", 
        description: "Development & Implementation",
        requirements: [
          "Core functionality development",
          "Feature implementation",
          "Unit testing setup"
        ],
        completed: false,
        completedTasks: [false, false, false]
      },
      {
        id: 3,
        name: "Level 3",
        description: "Completion & Deployment",
        requirements: [
          "Final testing and QA",
          "Complete documentation",
          "Production deployment"
        ],
        completed: false,
        completedTasks: [false, false, false]
      }
    ],
    currentLevel: 2
  },
  {
    id: 2,
    projectTitle: "E-Commerce Platform",
    projectDescription: "Full-stack e-commerce solution with payment integration.",
    status: "pending",
    appliedDate: "2025-08-23",
    reviewedDate: null,
    reviewedBy: null,
    adminFeedback: null,
    preferredRole: "fullstack",
    projectDetails: {
      title: "E-Commerce Platform",
      description: "Modern e-commerce platform with React frontend and Node.js backend",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      difficulty: "Advanced"
    },
    levels: [
      {
        id: 1,
        name: "Level 1",
        description: "Foundation & Setup",
        requirements: [
          "Project architecture planning",
          "Development environment setup",
          "Database schema design"
        ],
        completed: false,
        completedTasks: [false, false, false]
      },
      {
        id: 2,
        name: "Level 2",
        description: "Development & Implementation", 
        requirements: [
          "Frontend development",
          "Backend API development",
          "Payment integration"
        ],
        completed: false,
        completedTasks: [false, false, false]
      },
      {
        id: 3,
        name: "Level 3",
        description: "Completion & Deployment",
        requirements: [
          "Security implementation",
          "Performance optimization",
          "Production deployment"
        ],
        completed: false,
        completedTasks: [false, false, false]
      }
    ],
    currentLevel: 1
  }
];

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return { color: 'bg-green-100 text-green-800', text: 'Approved' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', text: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
    }
  };

  const config = getStatusConfig();
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

const LevelTracker = ({ levels, currentLevel, onTaskToggle, applicationId }) => {
  const getLevelIcon = (levelId) => {
    switch (levelId) {
      case 1:
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 3:
        return <Trophy className="h-5 w-5 text-green-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <h4 className="font-medium text-gray-900">Project Level Progress</h4>
      {levels.map((level) => {
        const isCurrentLevel = level.id === currentLevel;
        const isCompleted = level.completed;
        const isPastLevel = level.id < currentLevel;
        const completedTasksCount = level.completedTasks.filter(Boolean).length;
        const progressPercentage = (completedTasksCount / level.requirements.length) * 100;

        return (
          <div
            key={level.id}
            className={`border rounded-lg p-4 ${
              isCurrentLevel ? 'border-blue-500 bg-blue-50' : 
              isCompleted || isPastLevel ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getLevelIcon(level.id)}
                <div>
                  <h5 className={`font-medium ${
                    isCurrentLevel ? 'text-blue-900' : 
                    isCompleted || isPastLevel ? 'text-green-900' : 'text-gray-700'
                  }`}>
                    {level.name}
                  </h5>
                  <p className="text-sm text-gray-600">{level.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {(isCompleted || isPastLevel) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                <span className="text-sm font-medium">
                  {completedTasksCount}/{level.requirements.length}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted || isPastLevel ? 'bg-green-500' :
                    isCurrentLevel ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Task Checklist */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Requirements:</p>
              {level.requirements.map((requirement, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-white hover:bg-opacity-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={level.completedTasks[index]}
                    onChange={() => onTaskToggle(applicationId, level.id, index)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isPastLevel && isCompleted}
                  />
                  <span className={`text-sm ${
                    level.completedTasks[index] ? 'line-through text-gray-500' : 'text-gray-700'
                  }`}>
                    {requirement}
                  </span>
                  {level.completedTasks[index] && (
                    <Check className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MyApplications = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleTaskToggle = (applicationId, levelId, taskIndex) => {
    setApplications(prevApplications =>
      prevApplications.map(app => {
        if (app.id === applicationId) {
          const updatedLevels = app.levels.map(level => {
            if (level.id === levelId) {
              const newCompletedTasks = [...level.completedTasks];
              newCompletedTasks[taskIndex] = !newCompletedTasks[taskIndex];
              
              const allCompleted = newCompletedTasks.every(Boolean);
              
              return {
                ...level,
                completedTasks: newCompletedTasks,
                completed: allCompleted
              };
            }
            return level;
          });

          return {
            ...app,
            levels: updatedLevels
          };
        }
        return app;
      })
    );
  };

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="mt-2 text-gray-600">
              Track the status of your project applications and view feedback
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.projectTitle}
                        </h3>
                        <p className="text-gray-600">{application.projectDescription}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={application.status} />
                      <button
                        onClick={() => viewApplicationDetails(application)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Application Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Applied on {new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                    {application.reviewedDate && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Reviewed on {new Date(application.reviewedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {application.reviewedBy && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Reviewed by {application.reviewedBy}</span>
                      </div>
                    )}
                  </div>

                  {/* Admin Feedback */}
                  {application.adminFeedback && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Admin Feedback</p>
                          <p className="text-gray-600">{application.adminFeedback}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 mb-2">{application.projectDetails.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-600">Technologies: </span>
                          <div className="inline-flex flex-wrap gap-1 mt-1">
                            {application.projectDetails.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          Preferred: <span className="font-medium">{application.preferredRole}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Level Tracking - Only show for approved applications */}
                  {application.status === 'approved' && (
                    <LevelTracker
                      levels={application.levels}
                      currentLevel={application.currentLevel}
                      onTaskToggle={handleTaskToggle}
                      applicationId={application.id}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Application Details</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Project: {selectedApplication.projectTitle}</h4>
                  <p className="text-gray-600 mt-1">{selectedApplication.projectDetails.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className="mt-1">
                      <StatusBadge status={selectedApplication.status} />
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Difficulty:</span>
                    <p className="text-gray-900 font-medium">{selectedApplication.projectDetails.difficulty}</p>
                  </div>
                </div>

                {selectedApplication.status === 'approved' && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Current Progress</h4>
                    <p className="text-sm text-gray-600">
                      Currently working on Level {selectedApplication.currentLevel} of 3
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;