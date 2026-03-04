import { useRef } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { Header } from './components/layout/Header';
import { EditorPanel } from './components/editor/EditorPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';

function App() {
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Header previewRef={previewRef} />
      <Group orientation="horizontal" className="flex-1">
        <Panel defaultSize="45%" minSize="30%">
          <EditorPanel />
        </Panel>
        <Separator className="w-1.5 bg-gray-200 hover:bg-blue-400 transition-colors cursor-col-resize" />
        <Panel defaultSize="55%" minSize="30%">
          <PreviewPanel ref={previewRef} />
        </Panel>
      </Group>
    </>
  );
}

export default App;
