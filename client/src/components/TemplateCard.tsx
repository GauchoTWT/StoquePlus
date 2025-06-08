import { WorkflowTemplate } from '@/lib/types';
import { APPS } from '@/lib/constants';

interface TemplateCardProps {
  template: WorkflowTemplate;
  onUse: (template: WorkflowTemplate) => void;
}

export function TemplateCard({ template, onUse }: TemplateCardProps) {
  const templateApps = APPS.filter(app => template.apps.includes(app.id));

  return (
    <div 
      className="glass-card rounded-lg p-4 workflow-node cursor-pointer"
      onClick={() => onUse(template)}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex -space-x-2">
          {templateApps.slice(0, 3).map((app, index) => (
            <div
              key={app.id}
              className={`w-8 h-8 bg-gradient-to-r ${app.color} rounded-lg flex items-center justify-center border-2 border-slate-900`}
              style={{ zIndex: templateApps.length - index }}
            >
              <span className="text-white text-xs">
                {app.name.charAt(0)}
              </span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-white font-medium">{template.name}</h3>
          <p className="text-xs text-slate-400">{template.category}</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-300 mb-3">{template.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {template.isNew && (
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">New</span>
          )}
          {template.isTrending && (
            <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">Trending</span>
          )}
        </div>
        <span className="text-xs text-slate-400">{template.popularity} uses</span>
      </div>
    </div>
  );
}
