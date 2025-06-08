export interface App {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  isConnected: boolean;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  appId: string;
  position: { x: number; y: number };
  config: Record<string, any>;
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  triggerApp?: string;
  stats: {
    runs: number;
    successRate: number;
    avgDuration: number;
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  apps: string[];
  category: string;
  popularity: number;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface Stats {
  activeWorkflows: number;
  tasksThisMonth: number;
  connectedApps: number;
  timeSaved: string;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
