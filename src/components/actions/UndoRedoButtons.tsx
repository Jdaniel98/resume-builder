import { Undo2, Redo2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useTemporalStore } from '../../hooks/useTemporalStore';

export function UndoRedoButtons() {
  const { pastStates, futureStates } = useTemporalStore();
  const undo = () => useResumeStore.temporal.getState().undo();
  const redo = () => useResumeStore.temporal.getState().redo();

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={!canRedo}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
}
