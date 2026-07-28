'use client';

import { ChevronDownIcon, RectangleHorizontalIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PAGE } from '@/core/config/public-page.config';
import {
  ModalItem,
  closeMiniGameModal,
  setModalWidth,
  setPositions,
  toggleModalCollapsed
} from '@/core/redux-toolkit/slices/miniGameModalSlice';
import { Link } from '@/shared/ui/LoadingLink';
import CloseBtn from '@/shared/ui/buttons/CloseBtn';
import { formatHeader } from '@/shared/utils/gamesUtils';

const Draggable = dynamic(() => import('react-draggable').then(mod => mod.default), {
  ssr: false
});

type DraggableMiniGameModalProps = {
  children: React.ReactNode;
  modal: ModalItem;
};

export const DraggableMiniGameModal: React.FC<DraggableMiniGameModalProps> = ({ children, modal }) => {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 0 });

  const handleResize = (modal: any) => {
    const currentWidth = parseInt(modal.width.replace('px', ''));
    const newWidth = currentWidth === 400 ? 800 : 400;
    const screenWidth = window.innerWidth;

    const currentX = position?.x ?? screenWidth - 400;
    let newX = currentX + (currentWidth === 400 ? -400 : 400);

    // ekran dışına taşmayı engelle
    if (newX < 0) newX = 0;
    if (newX + newWidth > screenWidth) newX = screenWidth - newWidth;

    setPosition(prev => ({
      ...prev,
      [modal.id]: {
        x: newX,
        y: prev?.y ?? window.innerHeight - 500
      }
    }));

    dispatch(
      setModalWidth({
        id: modal.id,
        width: `${newWidth}px`
      })
    );
    dispatch(
      setPositions({
        id: modal.id,
        position: {
          x: newX,
          y: position?.y ?? window.innerHeight - 500
        }
      })
    );
  };

  const handleStop = (e: any, data: any, id: number) => {
    dispatch(setPositions({ id, position: { x: data.x, y: data.y } }));
  };

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    if (modal.position) {
      setPosition({ x: modal.position.x, y: modal.position.y });
      return;
    }

    const ref = modalRef.current;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const modalWidth = parseInt(modal.width || '400px'.replace('px', ''));

    if (!position && ref) {
      const rect = ref.getBoundingClientRect();
      const height = rect.height || 400;

      const newX = screenWidth - modalWidth;
      const newY = screenHeight - height - 20; // 20px padding from bottom

      setPosition({ x: newX, y: newY < 0 ? 0 : newY });
    }
  }, [modal.position]);

  return (
    <div
      className="fixed h-full w-full inset-0 z-[1501]"
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
        onStop={(e, data) => handleStop(e, data, modal.id)}
      >
        <div
          ref={modalRef}
          className={`!overflow-hidden max-h-[95vh] border handle-mini-game border-gray-400 pointer-events-auto rounded-lg`}
          style={{
            width: `${modal.width}`,
            backgroundColor: '#1F2538'
          }}
        >
          <div className="h-[35px] flex justify-between items-start py-1 px-2 border-b border-gray-500 mb-2 cursor-grab active:cursor-grabbing pointer-events-auto">
            <Link
              href={`${PAGE.CASINO_GAME(modal.gameSlug || modal.type)}`}
              id="modal-title"
              className="text-sm font-semibold text-white"
            >
              {formatHeader(modal.type?.toString())}
            </Link>
            <div className="flex gap-0.5">
              {!modal.isViewVertical ? (
                <RectangleHorizontalIcon
                  className="text-white w-6 h-6 px-1 cursor-pointer"
                  onClick={() => handleResize(modal)}
                />
              ) : (
                <RectangleHorizontalIcon
                  className="text-white w-6 h-6 px-1 cursor-pointer rotate-90"
                  onClick={() => handleResize(modal)}
                />
              )}

              <ChevronDownIcon
                className="text-white w-6 h-6 px-1 cursor-pointer"
                onClick={() => dispatch(toggleModalCollapsed(modal.id))}
              />
              <CloseBtn onClick={() => dispatch(closeMiniGameModal(modal.id))} size="xs" className="!px-1" />
            </div>
          </div>
          <div className="max-h-[90vh] overflow-y-hidden no-scrollbar">{children}</div>
        </div>
      </Draggable>
    </div>
  );
};
