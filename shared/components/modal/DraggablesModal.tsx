'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useState } from 'react';

import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { RootState } from '@/core/redux-toolkit/store';

const Draggable = dynamic(() => import('react-draggable').then(mod => mod.default), {
  ssr: false
});

type DraggablesModalProps = {
  children: React.ReactNode;
  header: React.ReactNode;
  width: number;
};

export const DraggablesModal: React.FC<DraggablesModalProps> = ({ children, header, width }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: window.innerWidth - width, y: 0 });
  const { liveStatsOpacity } = useAppSelector((state: RootState) => state.ui);

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <div
      className="fixed h-full w-full inset-0 z-[2100]"
      style={{
        pointerEvents: 'none'
      }}
    >
      <Draggable
        nodeRef={modalRef}
        bounds="parent"
        handle=".handle-mini-game"
        position={position}
        onDrag={(e, data) => handleDrag(e, data)}
      >
        <div
          ref={modalRef}
          className={`!overflow-hidden max-h-[95vh] border pointer-events-auto border-linebreak rounded-lg`}
          style={{
            width: `${width}px`,
            backgroundColor: '#1F2538',
            opacity: liveStatsOpacity
          }}
        >
          <div className="handle-mini-game">{header}</div>

          <div className="max-h-[90vh] overflow-y-hidden no-scrollbar">{children}</div>
        </div>
      </Draggable>
    </div>
  );
};
