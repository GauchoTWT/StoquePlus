import { useState } from 'react';
import { Bell, HelpCircle, Plus, Play, CheckCircle, Link, Clock } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { AppGallery } from '@/components/AppGallery';
import { StatsCard } from '@/components/StatsCard';
import { TemplateCard } from '@/components/TemplateCard';
import { Toast } from '@/components/Toast';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useToast } from '@/hooks/useToast';
import { WORKFLOW_TEMPLATES, MOCK_STATS } from '@/lib/constants';
import { App, WorkflowTemplate, WorkflowNode } from '@/lib/types';

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { currentWorkflow, addNode, removeNode } = useWorkflows();
  const { toasts, toast, removeToast } = useToast();

  const handleAppDrop = (appId: string, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: Math.random().toString(36).substr(2, 9),
      type: currentWorkflow?.nodes.length === 0 ? 'trigger' : 'action',
      appId,
      position,
      config: {},
    };

    addNode(newNode);
    toast({
      title: 'App added to workflow',
      description: 'Configure your new step to complete the automation',
      type: 'success',
    });
  };

  const handleTemplateUse = (template: WorkflowTemplate) => {
    toast({
      title: `Using ${template.name} template`,
      description: 'Template loaded! Customize it to fit your needs',
      type: 'info',
    });
  };

  const handleAppDrag = (app: App) => {
    // Handle app drag start if needed
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-effect border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Workflow Builder</h1>
              <p className="text-slate-300 text-sm">Create powerful automations between your favorite design tools</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="glass-card p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                <Bell className="w-5 h-5 text-slate-300" />
              </button>
              <button className="glass-card p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                <HelpCircle className="w-5 h-5 text-slate-300" />
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105">
                <Plus className="w-4 h-4 mr-2 inline" />
                New Workflow
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Active Workflows"
                value={MOCK_STATS.activeWorkflows}
                icon={Play}
                iconColor="from-green-500 to-emerald-600"
                trend={{ value: '+2 this week', isPositive: true }}
              />
              <StatsCard
                title="Tasks This Month"
                value={MOCK_STATS.tasksThisMonth}
                icon={CheckCircle}
                iconColor="from-blue-500 to-indigo-600"
                trend={{ value: '+156 today', isPositive: true }}
              />
              <StatsCard
                title="Connected Apps"
                value={MOCK_STATS.connectedApps}
                icon={Link}
                iconColor="from-purple-500 to-pink-600"
              />
              <StatsCard
                title="Time Saved"
                value={MOCK_STATS.timeSaved}
                icon={Clock}
                iconColor="from-amber-500 to-orange-600"
                trend={{ value: 'This month', isPositive: true }}
              />
            </div>

            {/* Workflow Builder Interface */}
            <WorkflowCanvas
              nodes={currentWorkflow?.nodes || []}
              onAddNode={addNode}
              onRemoveNode={removeNode}
              onDrop={handleAppDrop}
            />

            {/* Popular Templates */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Popular Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WORKFLOW_TEMPLATES.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={handleTemplateUse}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* App Gallery */}
          <AppGallery onAppDrag={handleAppDrag} />
        </div>
      </main>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  );
}
