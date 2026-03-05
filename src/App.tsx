import { useRef, useState } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { Header } from './components/layout/Header';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { EditorPanel } from './components/editor/EditorPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { useIsMobile } from './hooks/useIsMobile';

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
          <Separator className="w-1.5 bg-gray-200 hover:bg-blue-400 transition-colors cursor-col-resize" />
          <Panel defaultSize="55%" minSize="30%">
            <PreviewPanel ref={previewRef} />
          </Panel>
        </Group>
      )}
    </>
  );
}

export default App;
