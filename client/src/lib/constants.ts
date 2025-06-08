import { App, WorkflowTemplate, Stats } from './types';

export const APPS: App[] = [
  {
    id: 'figma',
    name: 'Figma',
    category: 'Design Tools',
    icon: 'Figma',
    color: 'from-purple-500 to-pink-500',
    description: 'Design & prototype',
    isConnected: true,
  },
  {
    id: 'adobe-xd',
    name: 'Adobe XD',
    category: 'Design Tools',
    icon: 'Palette',
    color: 'from-blue-600 to-purple-600',
    description: 'UX/UI design',
    isConnected: false,
  },
  {
    id: 'sketch',
    name: 'Sketch',
    category: 'Design Tools',
    icon: 'PenTool',
    color: 'from-orange-500 to-red-500',
    description: 'Vector design',
    isConnected: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    icon: 'MessageSquare',
    color: 'from-purple-600 to-indigo-600',
    description: 'Team messaging',
    isConnected: true,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    icon: 'Mail',
    color: 'from-blue-500 to-blue-600',
    description: 'Email service',
    isConnected: false,
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'Project Management',
    icon: 'Grid3X3',
    color: 'from-orange-500 to-red-600',
    description: 'Project boards',
    isConnected: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Project Management',
    icon: 'Layout',
    color: 'from-purple-500 to-pink-500',
    description: 'All-in-one workspace',
    isConnected: true,
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'File Storage',
    icon: 'HardDrive',
    color: 'from-blue-500 to-green-500',
    description: 'Cloud storage',
    isConnected: true,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'File Storage',
    icon: 'Droplets',
    color: 'from-blue-600 to-blue-700',
    description: 'File sync',
    isConnected: false,
  },
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'figma-to-slack',
    name: 'Figma to Slack',
    description: 'Automatically notify team when design is ready for review',
    apps: ['figma', 'slack'],
    category: 'Design Review',
    popularity: 1200,
    isTrending: true,
  },
  {
    id: 'adobe-to-drive',
    name: 'Adobe to Drive',
    description: 'Auto-backup creative assets to Google Drive',
    apps: ['adobe-xd', 'google-drive'],
    category: 'Asset Backup',
    popularity: 856,
    isNew: false,
  },
  {
    id: 'client-onboarding',
    name: 'Client Onboarding',
    description: 'Create project folders and setup client communication',
    apps: ['notion', 'gmail', 'google-drive'],
    category: 'Project Setup',
    popularity: 423,
    isNew: true,
  },
];

export const MOCK_STATS: Stats = {
  activeWorkflows: 12,
  tasksThisMonth: 1247,
  connectedApps: 8,
  timeSaved: '34h',
};

export const APP_CATEGORIES = [
  'Design Tools',
  'Communication',
  'Project Management',
  'File Storage',
];
