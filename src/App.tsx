import { useRef, useState } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { GripVertical } from 'lucide-react';
import { Header } from './components/layout/Header';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { EditorPanel } from './components/editor/EditorPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { useIsMobile } from './hooks/useIsMobile';

function ResizeHandle() {
  return (
    <Separator className="group relative w-2 bg-gray-100 hover:bg-blue-100 active:bg-blue-200 transition-colors cursor-col-resize flex items-center justify-center">
      <div className="absolute inset-y-0 flex items-center justify-center pointer-events-none">
        <GripVertical className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
      </div>
    </Separator>
  );
}

function App() {
  const previewRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  return (
    <>
      <Header previewRef={previewRef} />
      {isMobile ? (
        <>
          <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-hidden">
            {activeTab === 'editor' ? (
              <EditorPanel />
            ) : (
              <PreviewPanel ref={previewRef} />
            )}
          </div>
        </>
      ) : (
        <Group orientation="horizontal" className="flex-1">
          <Panel defaultSize="45%" minSize="30%">
            <EditorPanel />
          </Panel>
          <ResizeHandle />
          <Panel defaultSize="55%" minSize="30%">
            <PreviewPanel ref={previewRef} />
          </Panel>
        </Group>
      )}
    </>
  );
}

export default App;
