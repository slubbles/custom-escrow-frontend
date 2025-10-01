'use client';

/**
 * Accessibility utilities and helpers for improved user experience
 */

// Keyboard navigation handler
export function handleKeyboardNav(
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void
) {
  if (event.key === 'Enter' && onEnter) {
    event.preventDefault();
    onEnter();
  }
  if (event.key === 'Escape' && onEscape) {
    event.preventDefault();
    onEscape();
  }
}

// Focus trap for modals
export function createFocusTrap(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  function trapFocus(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  element.addEventListener('keydown', trapFocus);
  firstFocusable?.focus();

  return () => {
    element.removeEventListener('keydown', trapFocus);
  };
}

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Screen reader only class
export const srOnly = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

// Generate unique ID for form labels
let idCounter = 0;
export function useUniqueId(prefix: string = 'id'): string {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}

// ARIA label generators
export function getAriaLabel(label: string, hint?: string): { 'aria-label': string } {
  return { 'aria-label': hint ? `${label} ${hint}` : label };
}

export function getAriaDescribedBy(id: string): { 'aria-describedby': string } {
  return { 'aria-describedby': id };
}

// Check if reduced motion is preferred
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches ?? false;
}

// Focus management
export function focusElement(selector: string, delay: number = 0) {
  setTimeout(() => {
    const element = document.querySelector(selector) as HTMLElement;
    element?.focus();
  }, delay);
}

export function saveFocus() {
  return document.activeElement as HTMLElement;
}

export function restoreFocus(element: HTMLElement | null) {
  element?.focus();
}

// Keyboard shortcuts manager
export class KeyboardShortcuts {
  private shortcuts: Map<string, () => void> = new Map();

  register(key: string, handler: () => void) {
    this.shortcuts.set(key.toLowerCase(), handler);
  }

  unregister(key: string) {
    this.shortcuts.delete(key.toLowerCase());
  }

  handleKeyPress(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    const handler = this.shortcuts.get(key);
    
    if (handler && !this.isInputFocused()) {
      event.preventDefault();
      handler();
    }
  }

  private isInputFocused(): boolean {
    const activeElement = document.activeElement;
    return Boolean(
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.hasAttribute('contenteditable')
    );
  }

  destroy() {
    this.shortcuts.clear();
  }
}

// Color contrast checker (basic)
export function hasGoodContrast(foreground: string, background: string): boolean {
  // This is a simplified check. For production, use a proper contrast calculation library
  // Returns true by default - implement actual contrast checking as needed
  return true;
}

// Accessible button component props
export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}

// Accessible link component props
export interface AccessibleLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  'aria-label'?: string;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
}

// Form field accessibility props generator
export function getFormFieldProps(
  label: string,
  error?: string,
  description?: string,
  required: boolean = false
) {
  const id = `field-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  
  return {
    fieldId: id,
    labelProps: {
      htmlFor: id,
    },
    inputProps: {
      id,
      'aria-required': required,
      'aria-invalid': !!error,
      'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
    },
    descriptionProps: descriptionId ? {
      id: descriptionId,
      className: 'text-sm text-mountain-600 mt-1',
    } : undefined,
    errorProps: errorId ? {
      id: errorId,
      className: 'text-sm text-red-600 mt-1',
      role: 'alert',
    } : undefined,
  };
}

// Loading state announcements
export function announceLoadingState(isLoading: boolean, message: string = 'Loading') {
  if (isLoading) {
    announceToScreenReader(message, 'polite');
  }
}

// Success/Error announcements
export function announceSuccess(message: string) {
  announceToScreenReader(`Success: ${message}`, 'polite');
}

export function announceError(message: string) {
  announceToScreenReader(`Error: ${message}`, 'assertive');
}

// Modal accessibility
export function getModalProps(isOpen: boolean, onClose: () => void) {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': 'modal-title',
    'aria-describedby': 'modal-description',
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
  };
}

// Table accessibility
export function getTableProps(caption: string) {
  return {
    role: 'table',
    'aria-label': caption,
  };
}

export function getTableHeaderProps() {
  return {
    role: 'columnheader',
    scope: 'col' as const,
  };
}

export function getTableCellProps() {
  return {
    role: 'cell',
  };
}
