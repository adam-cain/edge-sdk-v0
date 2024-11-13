// Cursors.tsx
import React, { useMemo } from 'react';
import Cursor from './Cursor';
import { JamState } from '../types';

interface CursorsProps {
  state: JamState;
  currentPeerId: string;
  scale: number;
  panOffset: { x: number; y: number };
}

const Cursors: React.FC<CursorsProps> = ({ state, currentPeerId, scale, panOffset }) => {
  const cursorElements = useMemo(() => {
    return Object.values(state.cursors)
      .filter((cursor) => cursor.peerId !== currentPeerId)
      .map((cursor) => {
        const screenX = cursor.x * scale + panOffset.x;
        const screenY = cursor.y * scale + panOffset.y;
        return (
          <Cursor
            key={cursor.peerId}
            x={screenX}
            y={screenY}
            name={state.names[cursor.peerId] || 'Anonymous'}
            peerId={cursor.peerId}
          />
        );
      });
  }, [state.cursors, state.names, currentPeerId, scale, panOffset]);

  return <>{cursorElements}</>;
};

export default React.memo(Cursors);
