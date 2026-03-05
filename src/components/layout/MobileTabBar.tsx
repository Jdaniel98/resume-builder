import { PenLine, Eye } from 'lucide-react';

interface MobileTabBarProps {
  activeTab: 'editor' | 'preview';
  onTabChange: (tab: 'editor' | 'preview') => void;
}

export function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  return (
    <div className="mobile-tab-bar flex border-b border-gray-200/80 bg-white shrink-0 shadow-sm">
      <button
        type="button"
        onClick={() => onTabChange('editor')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all relative ${
          activeTab === 'editor'
            ? 'text-blue-600'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <PenLine className="w-4 h-4" />
        Editor
        {activeTab === 'editor' && (
          <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-600 rounded-full" />
        )}
      </button>
      <button
        type="button"
        onClick={() => onTabChange('preview')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all relative ${
          activeTab === 'preview'
            ? 'text-blue-600'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Eye className="w-4 h-4" />
        Preview
        {activeTab === 'preview' && (
          <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-600 rounded-full" />
        )}
      </button>
    </div>
  );
}
