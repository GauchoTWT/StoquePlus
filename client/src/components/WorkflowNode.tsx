import { X, Settings } from 'lucide-react';
import { WorkflowNode as WorkflowNodeType } from '@/lib/types';
import { APPS } from '@/lib/constants';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  onRemove: (nodeId: string) => void;
  onConfigure?: (nodeId: string) => void;
}

export function WorkflowNode({ node, onRemove, onConfigure }: WorkflowNodeProps) {
  const app = APPS.find(a => a.id === node.appId);
  
  if (!app) return null;

  const getTypeColor = () => {
    switch (node.type) {
      case 'trigger':
        return 'from-green-500 to-emerald-600';
      case 'action':
        return 'from-blue-500 to-indigo-600';
      case 'condition':
        return 'from-yellow-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = () => {
    switch (node.type) {
      case 'trigger':
        return '▶';
      case 'action':
        return '⚡';
      case 'condition':
        return '?';
      default:
        return '◆';
    }
  };

  return (
    <div 
      className="glass-card rounded-lg p-4 w-48 workflow-node"
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
      }}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-8 h-8 bg-gradient-to-r ${getTypeColor()} rounded-lg flex items-center justify-center`}>
          <span className="text-white text-sm">{getTypeIcon()}</span>
        </div>
        <span className="text-white font-medium capitalize">{node.type}</span>
        <div className="ml-auto flex space-x-1">
          {onConfigure && (
            <button
              onClick={() => onConfigure(node.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onRemove(node.id)}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-6 h-6 bg-gradient-to-r ${app.color} rounded flex items-center justify-center`}>
          <span className="text-white text-xs">{app.name.charAt(0)}</span>
        </div>
        <span className="text-sm text-slate-300">{app.name}</span>
      </div>
      
      <p className="text-xs text-slate-400">
        {node.config?.description || `${app.description} automation`}
      </p>
    </div>
  );
}
