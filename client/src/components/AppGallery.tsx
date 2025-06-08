import { useState } from 'react';
import { Search } from 'lucide-react';
import { App } from '@/lib/types';
import { APPS, APP_CATEGORIES } from '@/lib/constants';

interface AppGalleryProps {
  onAppDrag: (app: App) => void;
}

export function AppGallery({ onAppDrag }: AppGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = APPS.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const appsByCategory = APP_CATEGORIES.reduce((acc, category) => {
    acc[category] = filteredApps.filter(app => app.category === category);
    return acc;
  }, {} as Record<string, App[]>);

  const handleDragStart = (e: React.DragEvent, app: App) => {
    e.dataTransfer.setData('application/app-id', app.id);
    onAppDrag(app);
  };

  return (
    <aside className="w-80 glass-card border-l border-slate-700 p-6 overflow-y-auto">
      <h2 className="text-lg font-bold text-white mb-6">App Gallery</h2>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search apps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* App Categories */}
      <div className="space-y-6">
        {APP_CATEGORIES.map(category => {
          const categoryApps = appsByCategory[category];
          if (categoryApps.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">{category}</h3>
              <div className="space-y-2">
                {categoryApps.map(app => (
                  <div
                    key={app.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors app-tile"
                    draggable
                    onDragStart={(e) => handleDragStart(e, app)}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${app.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">
                        {app.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium">{app.name}</p>
                        {app.isConnected && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{app.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
