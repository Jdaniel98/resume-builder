import { PenLine, Eye } from 'lucide-react';

interface MobileTabBarProps {
  activeTab: 'editor' | 'preview';
  onTabChange: (tab: 'editor' | 'preview') => void;
}

export function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  return (
    <div className="mobile-tab-bar flex border-b border-gray-200 bg-white shrink-0">
      <button
        type="button"
        onClick={() => onTabChange('editor')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
          activeTab === 'editor'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <PenLine className="w-4 h-4" />
        Editor
      </button>
      <button
        type="button"
        onClick={() => onTabChange('preview')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
          activeTab === 'preview'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
    </div>
  );
}
