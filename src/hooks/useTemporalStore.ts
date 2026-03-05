import { useSyncExternalStore } from 'react';
import { useResumeStore } from '../store/useResumeStore';

// Subscribe to zundo's temporal store reactively
export function useTemporalStore() {
  const store = useResumeStore.temporal;

  const state = useSyncExternalStore(
    store.subscribe,
    () => store.getState(),
    () => store.getState()
  );

  return {
    pastStates: state.pastStates,
    futureStates: state.futureStates,
  };
}
