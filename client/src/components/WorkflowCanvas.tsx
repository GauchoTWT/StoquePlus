import { useState, useCallback } from 'react';
import { Plus, MousePointerClick } from 'lucide-react';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowNode as WorkflowNodeType } from '@/lib/types';
import { APPS } from '@/lib/constants';

interface WorkflowCanvasProps {
  nodes: WorkflowNodeType[];
  onAddNode: (node: WorkflowNodeType) => void;
  onRemoveNode: (nodeId: string) => void;
  onDrop: (appId: string, position: { x: number; y: number }) => void;
}

export function WorkflowCanvas({ nodes, onAddNode, onRemoveNode, onDrop }: WorkflowCanvasProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const appId = e.dataTransfer.getData('application/app-id');
    if (!appId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left - 96, // Center the node (width/2)
      y: e.clientY - rect.top - 50,  // Center the node (height/2)
    };

    onDrop(appId, position);
  }, [onDrop]);

  return (
    <div className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Build Your Workflow</h2>
        <div className="flex items-center space-x-3">
          <button className="text-slate-400 hover:text-white transition-colors">
            <span className="text-sm">Save</span>
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <span className="text-sm">Test</span>
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div 
        className={`relative min-h-96 workflow-canvas rounded-xl p-8 border-2 border-dashed border-slate-600 drag-zone ${
          dragOver ? 'drag-over' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Render workflow nodes */}
        {nodes.map(node => (
          <WorkflowNode
            key={node.id}
            node={node}
            onRemove={onRemoveNode}
          />
        ))}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <MousePointerClick className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-lg">Drag apps here to build your workflow</p>
              <p className="text-slate-600 text-sm mt-2">Connect your favorite design tools and automate repetitive tasks</p>
            </div>
          </div>
        )}

        {/* Add more node button */}
        {nodes.length > 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button className="glass-card w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600/20 transition-all">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
