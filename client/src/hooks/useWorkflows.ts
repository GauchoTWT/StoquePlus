import { useState, useCallback } from 'react';
import { Workflow, WorkflowNode, WorkflowConnection } from '@/lib/types';

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);

  const createWorkflow = useCallback((name: string, description?: string) => {
    const newWorkflow: Workflow = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      isActive: false,
      nodes: [],
      connections: [],
      stats: {
        runs: 0,
        successRate: 0,
        avgDuration: 0,
      },
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setCurrentWorkflow(newWorkflow);
    return newWorkflow;
  }, []);

  const updateWorkflow = useCallback((id: string, updates: Partial<Workflow>) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    if (currentWorkflow?.id === id) {
      setCurrentWorkflow(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentWorkflow]);

  const addNode = useCallback((node: WorkflowNode) => {
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes, node],
    };

    updateWorkflow(currentWorkflow.id, updatedWorkflow);
  }, [currentWorkflow, updateWorkflow]);

  const removeNode = useCallback((nodeId: string) => {
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: currentWorkflow.nodes.filter(n => n.id !== nodeId),
      connections: currentWorkflow.connections.filter(
        c => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
      ),
    };

    updateWorkflow(currentWorkflow.id, updatedWorkflow);
  }, [currentWorkflow, updateWorkflow]);

  const addConnection = useCallback((connection: WorkflowConnection) => {
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      connections: [...currentWorkflow.connections, connection],
    };

    updateWorkflow(currentWorkflow.id, updatedWorkflow);
  }, [currentWorkflow, updateWorkflow]);

  const removeConnection = useCallback((connectionId: string) => {
    if (!currentWorkflow) return;

    const updatedWorkflow = {
      ...currentWorkflow,
      connections: currentWorkflow.connections.filter(c => c.id !== connectionId),
    };

    updateWorkflow(currentWorkflow.id, updatedWorkflow);
  }, [currentWorkflow, updateWorkflow]);

  return {
    workflows,
    currentWorkflow,
    setCurrentWorkflow,
    createWorkflow,
    updateWorkflow,
    addNode,
    removeNode,
    addConnection,
    removeConnection,
  };
}
