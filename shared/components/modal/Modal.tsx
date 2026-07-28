'use client';

import { cva } from 'class-variance-authority';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { ChevronDownIcon, RectangleHorizontalIcon } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';

import CloseBtn from '../../ui/buttons/CloseBtn';

import {
  type ModalPositionProps,
  type ModalProps,
  type ModalSizeProps,
  type ModalVariantProps,
  modalPositionVariants,
  modalSizeVariants,
  modalVariantVariants
} from './Modal.types';
import { PAGE } from '@/core/config/public-page.config';
import { cn } from '@/core/lib/utils';
import { setModalWidth, toggleModalCollapsed } from '@/core/redux-toolkit/slices/miniGameModalSlice';
import { Link } from '@/shared/ui/LoadingLink';
import { formatHeader } from '@/shared/utils/gamesUtils';

// Animation variants
const modalAnimationVariants = cva('transition-all duration-300 ease-out', {
  variants: {
    animationType: {
      fade: 'opacity-0 data-[state=open]:opacity-100',
      slide: 'opacity-0 translate-y-4 data-[state=open]:opacity-100 data-[state=open]:translate-y-0',
      zoom: 'opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100',
      flip: 'opacity-0 rotate-y-90 data-[state=open]:opacity-100 data-[state=open]:rotate-y-0'
    },
    slideDirection: {
      top: 'translate-y-[-100%] data-[state=open]:translate-y-0',
      bottom: 'translate-y-[100%] data-[state=open]:translate-y-0',
      left: 'translate-x-[-100%] data-[state=open]:translate-x-0',
      right: 'translate-x-[100%] data-[state=open]:translate-x-0'
    }
  },
  defaultVariants: {
    animationType: 'fade',
    slideDirection: 'bottom'
  }
});

// Overlay animation variants
const overlayAnimationVariants = cva('transition-opacity duration-300 ease-out', {
  variants: {
    isOpen: {
      true: 'opacity-100',
      false: 'opacity-0'
    }
  },
  defaultVariants: {
    isOpen: false
  }
});

// Focus trap hook
function useFocusTrap(containerRef: React.RefObject<HTMLDivElement>, isActive: boolean) {
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] ?? null;
    const lastElement = focusableElements[focusableElements.length - 1] ?? null;

    // Store the previously focused element
    if (!previousActiveElement.current) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
    }

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // Restore focus to previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    };
  }, [isActive, containerRef]);
}

function useBodyScrollLock(isLocked: boolean) {
  React.useEffect(() => {
    if (!isLocked) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
}

// Escape key handler hook
function useEscapeKey(handler: () => void, isActive: boolean) {
  React.useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handler();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handler, isActive]);
}

// Default loading spinner component
const DefaultLoadingSpinner = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center justify-center', className)}>
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-toshi-primary border-t-transparent" />
  </div>
);

// Drag constraints hook for better performance
function useDragConstraints(
  modalRef: React.RefObject<HTMLDivElement | null>,
  isDraggable: boolean,
  isVisible: boolean,
  isViewVertical: boolean
) {
  const [constraints, setConstraints] = React.useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  const updateConstraints = React.useCallback(() => {
    if (!isDraggable || !modalRef.current || !isVisible) return;

    const modal = modalRef.current;
    // Modalın en güncel konumunu ölçmeden önce render'ın tamamlanmasını bekle
    window.requestAnimationFrame(() => {
      const rect = modal.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const maxLeft = vw - rect.width;
      const maxTop = vh - rect.height;

      // Framer Motion için constraint sınırlarını belirle
      setConstraints({
        top: -rect.top,
        bottom: maxTop - rect.top,
        left: -rect.left,
        right: maxLeft - rect.left
      });

      // Eğer modal görünüm dışına taşmışsa düzelt
      let offsetX = 0;
      let offsetY = 0;

      if (rect.left < 10) offsetX = 10 - rect.left;
      else if (rect.right > vw - 10) offsetX = vw - 10 - rect.right;

      if (rect.top < 10) offsetY = 10 - rect.top;
      else if (rect.bottom > vh - 10) offsetY = vh - 10 - rect.bottom;

      if (offsetX !== 0 || offsetY !== 0) {
        modal.style.transition = 'transform 0.2s ease-out';
        modal.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        // 200ms sonra transition'u kaldır
        setTimeout(() => {
          if (modal) modal.style.transition = '';
        }, 250);
      }
    });
  }, [isDraggable, isVisible, modalRef, isViewVertical]);

  React.useEffect(() => {
    if (!isDraggable || !isVisible) return;

    const timer = setTimeout(updateConstraints, 150);
    window.addEventListener('resize', updateConstraints);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateConstraints);
    };
  }, [isDraggable, isVisible, updateConstraints]);

  return constraints;
}

function useAutoRepositionOnResize(modalRef: React.RefObject<HTMLDivElement>, x: any, y: any, isViewVertical: boolean) {
  React.useEffect(() => {
    const handleResize = () => {
      if (!modalRef.current) return;

      const rect = modalRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let newX = x.get();
      let newY = y.get();

      // X yönü kontrolü
      if (rect.left < 10) newX += 10 - rect.left;
      else if (rect.right > vw - 10) newX -= rect.right - (vw - 10);

      // Y yönü kontrolü
      if (rect.top < 10) newY += 10 - rect.top;
      else if (rect.bottom > vh - 10) newY -= rect.bottom - (vh - 10);

      // Eğer modal görünüm dışında kaldıysa motion değerlerini güncelle
      if (newX !== x.get()) x.set(newX);
      if (newY !== y.get()) y.set(newY);
    };

    handleResize(); // Mount olduğunda bir kez çalıştır
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [modalRef, x, y, isViewVertical]);
}

// Optimized drag state management
function useDragState(
  isDraggable: boolean,
  onDragStart?: () => void,
  onDragEnd?: (_e: any) => void,
  resetPositionOnClose?: boolean,
  defaultDragPosition?: { x: number; y: number }
) {
  const x = useMotionValue(defaultDragPosition?.x || 0);
  const y = useMotionValue(defaultDragPosition?.y || 0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDragReady, setIsDragReady] = React.useState(false);

  const dragControls = useDragControls();

  // Initialize drag controls when component mounts and isDraggable is true
  React.useEffect(() => {
    if (isDraggable) {
      // Small delay to ensure everything is properly initialized
      const timer = setTimeout(() => {
        setIsDragReady(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsDragReady(false);
    }
  }, [isDraggable]);

  const startDrag = React.useCallback(
    (event: React.PointerEvent) => {
      if (!isDraggable || !isDragReady) return;
      setIsDragging(true);
      onDragStart?.();
      // start accepts a PointerEvent (from react) — framer handles it
      dragControls.start(event as unknown as PointerEvent);
    },
    [isDraggable, isDragReady, dragControls, onDragStart]
  );

  const endDrag = React.useCallback(() => {
    setIsDragging(false);
    onDragEnd?.({ y: y.get(), x: x.get() });
  }, [onDragEnd, y, x]);

  const resetPosition = React.useCallback(() => {
    if (resetPositionOnClose) {
      x.set(0);
      y.set(0);
    }
  }, [resetPositionOnClose, x, y]);

  return {
    x,
    y,
    isDragging,
    isDragReady,
    dragControls,
    startDrag,
    endDrag,
    resetPosition
  };
}

// Main Modal component
const Modal = React.forwardRef<HTMLDivElement, ModalProps & ModalSizeProps & ModalPositionProps & ModalVariantProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      closeButton,
      closeButtonSize = 'xs',
      closeButtonClassName,
      header,
      footer,
      showOverlay = true,
      overlayClassName,
      modalClassName,
      contentClassName,
      headerClassName,
      footerClassName,
      animationDuration = 300,
      animationType = 'fade',
      slideDirection = 'bottom',
      preventBodyScroll = true,
      zIndex = 1550,
      isLoading = false,
      loadingSpinner,
      showLoadingOverlay = true,
      loadingOverlayClassName,
      onOpen,
      onAfterClose,
      autoFocus: _autoFocus = true,
      restoreFocus: _restoreFocus = true,
      triggerRef: _triggerRef,
      trapFocus = true,
      portalContainer,
      usePortal = true,
      dataAttributes = {},
      ariaAttributes = {},
      size = 'md',
      position = 'center',
      variant = 'default',
      mainClassName,
      onSubmit,
      isDraggable = false,
      dragHandle: _dragHandle,
      showDragIndicator = false,
      dragConstraints: customDragConstraints,
      resetPositionOnClose = false,
      defaultDragPosition = { x: 0, y: 0 },
      onDragStart,
      onDragEnd,
      modal,

      isViewVertical = false,
      ...props
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    // Optimized drag functionality
    const { x, y, isDragging, isDragReady, dragControls, startDrag, endDrag, resetPosition } = useDragState(
      isDraggable,
      onDragStart,
      onDragEnd,
      resetPositionOnClose,
      defaultDragPosition
    );
    const defaultDragConstraints = useDragConstraints(
      modalRef as React.RefObject<HTMLDivElement | null>,
      isDraggable,
      isVisible,
      isViewVertical
    );
    const dragConstraints = customDragConstraints || defaultDragConstraints;
    useAutoRepositionOnResize(modalRef as React.RefObject<HTMLDivElement>, x, y, isViewVertical);

    // Combine refs
    const combinedRef = React.useMemo(() => {
      if (ref && typeof ref === 'function') {
        return (node: HTMLDivElement | null) => {
          (ref as (_node: HTMLDivElement | null) => void)(node ?? null);
          modalRef.current = node;
        };
      } else {
        // If ref is object or null, we still want to set modalRef.current
        return (node: HTMLDivElement | null) => {
          if (ref && typeof ref === 'object' && 'current' in ref) {
            // @ts-expect-error assign to forwarded ref
            (ref as React.RefObject<HTMLDivElement>).current = node;
          }
          modalRef.current = node;
        };
      }
    }, [ref]);

    // Handle open/close animations
    React.useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
        setIsAnimating(true);
        onOpen?.();

        // Trigger animation after a small delay
        const timer = window.setTimeout(() => {
          setIsAnimating(false);
        }, 50);

        return () => window.clearTimeout(timer);
      } else {
        setIsAnimating(true);

        // Wait for animation to complete before hiding
        const timer = window.setTimeout(() => {
          setIsVisible(false);
          setIsAnimating(false);
          resetPosition(); // Reset drag position when closing (safe)
          onAfterClose?.();
        }, animationDuration);

        return () => window.clearTimeout(timer);
      }
    }, [isOpen, animationDuration, onOpen, onAfterClose, resetPosition]);

    // Focus management
    useFocusTrap(modalRef as React.RefObject<HTMLDivElement>, isOpen && trapFocus);
    useBodyScrollLock(isOpen && preventBodyScroll);
    useEscapeKey(onClose, isOpen && closeOnEscape);

    // Handle overlay click - prevent closing when dragging
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget && !isDragging) {
        onClose();
      }
    };

    // Handle overlay key down - ignore when typing in inputs/contenteditable
    const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const tag = target?.tagName;
      const isTypingTarget = tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable;
      if (isTypingTarget) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSubmit?.();
      }
    };

    // Handle modal click (prevent closing when clicking inside modal)
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
    };

    // Don't render if not visible
    if (!isVisible) return null;

    const modalContent = (
      <div
        className={cn(
          'fixed inset-0 flex p-4',
          mainClassName,
          modalPositionVariants({ position }),
          overlayAnimationVariants({ isOpen: isOpen && !isAnimating }),
          isDragging && 'cursor-grabbing',
          isDraggable && 'pointer-events-none'
        )}
        style={{ zIndex }}
        onKeyDown={isDraggable ? undefined : handleOverlayKeyDown}
        data-state={isOpen ? 'open' : 'closed'}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        {...dataAttributes}
        {...ariaAttributes}
      >
        {/* Overlay */}
        {showOverlay && (
          <div
            className={cn('fixed inset-0 bg-bg_color/70 ', isDraggable && 'pointer-events-none', overlayClassName)}
            onClick={isDraggable ? undefined : handleOverlayClick}
            onKeyDown={
              isDraggable
                ? undefined
                : e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOverlayClick(e as any);
                    }
                  }
            }
            role={isDraggable ? undefined : 'button'}
            tabIndex={isDraggable ? undefined : 0}
            aria-label={isDraggable ? undefined : 'Close modal'}
          />
        )}

        {/* Modal (always motion.div - conditional drag props passed) */}
        <motion.div
          ref={combinedRef}
          className={cn(
            'relative w-full max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl pointer-events-auto',
            modalSizeVariants({ size }),
            modalVariantVariants({ variant }),
            modalAnimationVariants({
              animationType: animationType as 'fade' | 'slide' | 'zoom' | 'flip',
              slideDirection: slideDirection as 'top' | 'bottom' | 'left' | 'right'
            }),
            modalClassName
          )}
          // Drag props only meaningful when isDraggable true and ready
          drag={isDraggable && isDragReady}
          dragControls={isDraggable && isDragReady ? dragControls : undefined}
          dragConstraints={isDraggable && isDragReady ? dragConstraints : undefined}
          dragElastic={isDraggable && isDragReady ? 0.1 : undefined}
          dragMomentum={isDraggable && isDragReady ? false : undefined}
          dragPropagation={isDraggable && isDragReady ? false : undefined}
          onDragEnd={
            isDraggable && isDragReady
              ? (e: any) => {
                  endDrag();
                  onDragEnd?.(e);
                }
              : undefined
          }
          onClick={handleModalClick}
          onPointerDown={undefined}
          style={{
            x: isDraggable && isDragReady ? x : undefined,
            y: isDraggable && isDragReady ? y : undefined,
            zIndex
          }}
          data-state={isOpen ? 'open' : 'closed'}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          tabIndex={isDraggable ? 0 : undefined}
          {...props}
        >
          {/* Loading overlay */}
          {isLoading && showLoadingOverlay && (
            <div
              className={cn(
                'absolute inset-0 z-[1550] flex items-center justify-center bg-toshi_body/80 backdrop-blur-sm',
                loadingOverlayClassName
              )}
            >
              {loadingSpinner || <DefaultLoadingSpinner />}
            </div>
          )}

          {/* Close button */}
          {showCloseButton && !isLoading && (
            <div className="absolute top-4 right-4 z-[1550]">
              {closeButton || <CloseBtn onClick={onClose} size={closeButtonSize} className={closeButtonClassName} />}
            </div>
          )}

          {/* Drag indicator */}
          {isDraggable && showDragIndicator && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1550]">
              <div className="w-8 h-1 bg-gray-400 rounded-full opacity-50" />
            </div>
          )}

          {/* Header */}
          {(title || description || header) && (
            <div
              className={cn(
                'border-b border-gray-500 px-6 py-4 uppercase font-byrd text-base font-semibold',
                isDraggable && isDragReady && 'cursor-grab active:cursor-grabbing select-none',
                headerClassName
              )}
              onPointerDown={isDraggable && isDragReady ? startDrag : undefined}
              role={isDraggable && isDragReady ? 'button' : 'region'}
              tabIndex={isDraggable && isDragReady ? 0 : undefined}
              aria-label={isDraggable && isDragReady ? 'Drag handle' : undefined}
            >
              {header || (
                <>
                  {title && (
                    <h2 id="modal-title" className="text-xl font-semibold text-white">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="modal-description" className="mt-1 text-sm text-gray-400">
                      {description}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Drab Header */}
          {modal && isDraggable && (
            <div
              onPointerDown={isDraggable ? startDrag : undefined}
              className="h-[35px] flex justify-between items-start py-1 px-2 border-b border-gray-500 mb-2 cursor-grab active:cursor-grabbing pointer-events-auto"
            >
              <Link
                href={`${PAGE.CASINO_GAME(modal.type?.toString()?.toLowerCase()?.replaceAll(' ', '-'))}`}
                id="modal-title"
                className="text-sm font-semibold text-white"
              >
                {formatHeader(modal.type?.toString())}
              </Link>
              <div className="flex gap-0.5">
                {!modal.isViewVertical ? (
                  <RectangleHorizontalIcon
                    className="text-white w-6 h-6 px-1 cursor-pointer"
                    onClick={() => dispatch(setModalWidth({ id: Number(modal.id), width: '400px' }))}
                  />
                ) : (
                  <RectangleHorizontalIcon
                    className="text-white w-6 h-6 px-1 cursor-pointer rotate-90"
                    onClick={() => dispatch(setModalWidth({ id: Number(modal.id), width: '800px' }))}
                  />
                )}
                <ChevronDownIcon
                  className="text-white w-6 h-6 px-1 cursor-pointer"
                  onClick={() => dispatch(toggleModalCollapsed(Number(modal.id)))}
                />
                <CloseBtn onClick={onClose} size="xs" className="!px-1" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className={cn('flex-1 overflow-y-scroll px-6 py-4 no-scrollbar', contentClassName)}>{children}</div>

          {/* Footer */}
          {footer && <div className={cn('border-t border-gray-500/20 px-6 py-4', footerClassName)}>{footer}</div>}
        </motion.div>
      </div>
    );

    // Render in portal or directly
    if (usePortal) {
      const container = portalContainer || document.body;
      return createPortal(modalContent, container);
    }

    return modalContent;
  }
);

Modal.displayName = 'Modal';

// Export sub-components for more flexibility
export const ModalHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('border-b border-gray-500/20 px-6 py-4', className)} {...props} />
  )
);
ModalHeader.displayName = 'ModalHeader';

export const ModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-xl font-semibold text-white', className)} {...props} />
  )
);
ModalTitle.displayName = 'ModalTitle';

export const ModalDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('mt-1 text-sm text-gray-400', className)} {...props} />
);
ModalDescription.displayName = 'ModalDescription';

export const ModalContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-y-scroll no-scrollbar px-6 py-4 h-auto', className)} {...props} />
  )
);
ModalContent.displayName = 'ModalContent';

export const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('border-t border-gray-500/20 px-6 py-4', className)} {...props} />
  )
);
ModalFooter.displayName = 'ModalFooter';

export type { ModalPosition, ModalProps, ModalSize, ModalVariant } from './Modal.types';
export { Modal };
