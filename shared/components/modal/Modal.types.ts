import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { ModalItem } from '@/core/redux-toolkit/slices/miniGameModalSlice';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when modal should be closed */
  onClose: () => void;
  /** Modal title */
  title?: React.ReactNode;
  /** Modal description */
  description?: React.ReactNode;
  /** Modal content */
  children: React.ReactNode;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether to close modal when clicking outside */
  closeOnOverlayClick?: boolean;
  /** Whether to close modal when pressing escape key */
  closeOnEscape?: boolean;
  /** Custom close button element */
  closeButton?: React.ReactNode;
  /** Custom close button size */
  closeButtonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Custom close button className */
  closeButtonClassName?: string;
  /** Custom header element */
  header?: React.ReactNode;
  /** Custom footer element */
  footer?: React.ReactNode;
  /** Whether to show overlay */
  showOverlay?: boolean;
  /** Custom overlay className */
  overlayClassName?: string;
  /** Custom modal className */
  modalClassName?: string;
  /** Custom content className */
  contentClassName?: string;
  /** Custom header className */
  headerClassName?: string;
  /** Custom footer className */
  footerClassName?: string;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Animation type */
  animationType?: 'fade' | 'slide' | 'zoom' | 'flip';
  /** Animation direction for slide animation */
  slideDirection?: 'top' | 'bottom' | 'left' | 'right';
  /** Whether to prevent body scroll when modal is open */
  preventBodyScroll?: boolean;
  /** Custom z-index */
  zIndex?: number;
  /** Whether modal is loading */
  isLoading?: boolean;
  /** Loading spinner component */
  loadingSpinner?: React.ReactNode;
  /** Whether to show loading overlay */
  showLoadingOverlay?: boolean;
  /** Custom loading overlay className */
  loadingOverlayClassName?: string;
  /** Callback when modal opens */
  onOpen?: () => void;
  /** Callback when modal closes */
  onAfterClose?: () => void;
  /** Whether to focus first focusable element on open */
  autoFocus?: boolean;
  /** Whether to restore focus to trigger element on close */
  restoreFocus?: boolean;
  /** Custom trigger element ref for focus restoration */
  triggerRef?: React.RefObject<any>;
  /** Whether to trap focus within modal */
  trapFocus?: boolean;
  /** Custom portal container */
  portalContainer?: any;
  /** Whether to render modal in portal */
  usePortal?: boolean;
  /** Custom data attributes */
  dataAttributes?: Record<string, string>;
  /** Custom aria attributes */
  ariaAttributes?: Record<string, string>;
  /** Custom main className */
  mainClassName?: string;
  /** Callback when modal is submitted */
  onSubmit?: () => void;
  /** Whether to make the modal draggable */
  isDraggable?: boolean;
  /** Custom drag handle selector */
  dragHandle?: string;
  /** Whether to show drag indicator */
  showDragIndicator?: boolean;
  /** Custom drag constraints */
  dragConstraints?: { top?: number; bottom?: number; left?: number; right?: number };
  /** Whether to reset position on close */
  resetPositionOnClose?: boolean;
  /** Callback when drag starts */
  onDragStart?: () => void;
  /** Callback when drag ends */
  onDragEnd?: (_e: any) => void;

  isViewVertical?: boolean;
  /** Default drag position */
  defaultDragPosition?: { x: number; y: number };

  modal?: ModalItem;
}

// Size variants using cva
export const modalSizeVariants = cva('w-full', {
  variants: {
    size: {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
      full: 'max-w-full h-full max-h-full rounded-none',
      screen: 'max-w-screen-sm'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

// Position variants using cva
export const modalPositionVariants = cva('flex', {
  variants: {
    position: {
      center: 'items-center justify-center',
      top: 'items-start justify-center pt-16',
      bottom: 'items-end justify-center pb-16',
      left: 'items-center justify-start pl-16',
      right: 'items-center justify-end pr-16',
      'top-left': 'items-start justify-start pt-16 pl-16',
      'top-right': 'items-start justify-end pt-16 pr-16',
      'bottom-left': 'items-end justify-start pb-16 pl-16',
      'bottom-right': 'items-end justify-end pb-16 pr-16'
    }
  },
  defaultVariants: {
    position: 'center'
  }
});

// Style variants using cva
export const modalVariantVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-toshi_body border border-gray-500/60',
      glass: 'bg-toshi_body/80 backdrop-blur-md border border-white/20',
      card: 'bg-toshi_body border border-gray-500/60 shadow-2xl',
      minimal: 'bg-transparent border-0',
      neon: 'bg-toshi_body border border-toshi-green-neon shadow-glow',
      gradient: 'bg-toshi_gradient_1 border border-gray-500/60'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface ModalSizeProps extends VariantProps<typeof modalSizeVariants> {}
export interface ModalPositionProps extends VariantProps<typeof modalPositionVariants> {}
export interface ModalVariantProps extends VariantProps<typeof modalVariantVariants> {}

export type ModalSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | 'full'
  | 'screen';
export type ModalPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
export type ModalVariant = 'default' | 'glass' | 'card' | 'minimal' | 'neon' | 'gradient';
