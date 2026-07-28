'use client';

import { type CSSProperties, type FC, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type DesktopSearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  widthPx?: number;
  zIndex?: number;
  offsetY?: number;
  topOffsetPx?: number;
  matchAnchorWidth?: boolean;
  contentVisible?: boolean;
  forceOpenAbove?: boolean;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  children?: React.ReactNode;
};

const DesktopSearchOverlay: FC<DesktopSearchOverlayProps> = ({
  open,
  onClose,
  anchorRef,
  widthPx = 962.734,
  zIndex = 1449,
  offsetY = 8,
  topOffsetPx = 68,
  matchAnchorWidth = true,
  contentVisible = false,
  forceOpenAbove,
  overlayClassName,
  overlayStyle,
  contentClassName,
  contentStyle,
  children
}) => {
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
  const [anchorWidth, setAnchorWidth] = useState<number>(widthPx);
  const rafRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);

  const updatePosition = () => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = rect.left + window.scrollX;
    const top = (forceOpenAbove ? rect.top : rect.bottom) + window.scrollY + (forceOpenAbove ? -offsetY : offsetY);
    setCoords({ left, top });
    if (matchAnchorWidth) {
      setAnchorWidth(rect.width);
    }
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    // trigger fade-in on mount
    setVisible(false);
    rafRef.current = window.requestAnimationFrame(() => setVisible(true));
    const handle = () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame(updatePosition);
    };
    window.addEventListener('resize', handle);
    window.addEventListener('scroll', handle, true);
    return () => {
      window.removeEventListener('resize', handle);
      window.removeEventListener('scroll', handle, true);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      setVisible(false);
    };
  }, [open]);

  if (!open || !coords) return null;

  const node = (
    <>
      <div
        className={`search-overlay-main desktop fixed inset-0 ${overlayClassName ?? ''}`}
        style={{
          zIndex,
          background: 'rgba(6, 14, 32, 0.70)',
          top: `${topOffsetPx}px`,
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms ease-out',
          ...overlayStyle
        }}
        onClick={onClose}
        aria-hidden
      />
      <div
        data-portal="true"
        data-popper-placement="bottom"
        className={`search-content scrollY desktop ${contentClassName ?? ''}`}
        style={{
          zIndex,
          width: `${matchAnchorWidth ? anchorWidth : widthPx}px`,

          position: 'fixed',
          inset: '0px auto auto 0px',
          margin: 0,
          transform: `translate3d(${coords.left}px, ${coords.top}px, 0px)${forceOpenAbove ? ' translateY(-100%)' : ''}`,
          opacity: visible && contentVisible ? 1 : 0,
          transition: 'opacity 160ms ease-out',
          pointerEvents: contentVisible ? ('auto' as const) : ('none' as const),
          ...contentStyle
        }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  );

  if (typeof document !== 'undefined') {
    return createPortal(node, document.body);
  }
  return node;
};

export default DesktopSearchOverlay;
