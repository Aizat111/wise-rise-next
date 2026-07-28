'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { openModal } from '@/core/redux-toolkit/slices/modalSlice';

export const useConnectorModalInterceptor = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interceptedModals = new WeakSet<HTMLElement>();

    const extractModalContent = (
      modalElement: HTMLElement
    ): { title?: string; content: string; buttons?: Array<{ text: string; onClick?: () => void }> } => {
      const content: { title?: string; content: string; buttons?: Array<{ text: string; onClick?: () => void }> } = {
        content: ''
      };

      const clonedElement = modalElement.cloneNode(true) as HTMLElement;

      const titleElement =
        clonedElement.querySelector(
          'h1, h2, h3, [class*="title"], [class*="Title"], [class*="header"], [class*="Header"]'
        ) || clonedElement.querySelector('[role="heading"]');

      if (titleElement) {
        content.title = titleElement.textContent?.trim() || '';

        titleElement.remove();
      }

      const buttonsToRemove = clonedElement.querySelectorAll(
        'button, [role="button"], a[class*="button"], [class*="button"]'
      );
      buttonsToRemove.forEach(btn => btn.remove());

      // Extract text content from remaining elements
      const textContent = clonedElement.textContent?.trim() || '';

      // Clean up the text (remove extra whitespace, newlines)
      content.content = textContent
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      // Extract buttons from original element (not cloned) and store their handlers
      const buttonElements = Array.from(modalElement.querySelectorAll('button, [role="button"], a[class*="button"]'));
      if (buttonElements.length > 0) {
        content.buttons = buttonElements.map((btn, index) => {
          const buttonText = btn.textContent?.trim() || '';
          const originalButton = btn as HTMLElement;

          // Store the button's parent modal for later access
          const modalPortal = modalElement.closest('[class*="ReactModalPortal"]') as HTMLElement;

          return {
            text: buttonText || (index === buttonElements.length - 1 ? 'OK' : 'Cancel'),
            onClick: () => {
              // Temporarily show the modal, click the button, then hide again
              if (modalPortal && originalButton) {
                const originalDisplay = modalPortal.style.display;
                const originalVisibility = modalPortal.style.visibility;

                // Temporarily show to allow click
                modalPortal.style.display = '';
                modalPortal.style.visibility = 'visible';
                modalPortal.style.opacity = '0';
                modalPortal.style.pointerEvents = 'auto';

                // Trigger the click
                originalButton.click();

                // Hide again immediately
                setTimeout(() => {
                  modalPortal.style.display = originalDisplay || 'none';
                  modalPortal.style.visibility = originalVisibility || 'hidden';
                  modalPortal.style.opacity = '0';
                  modalPortal.style.pointerEvents = 'none';
                }, 50);
              }
            }
          };
        });
      }

      return content;
    };

    // Function to hide the original modal and extract content
    const interceptModal = (modalPortal: HTMLElement) => {
      // Skip if already intercepted
      if (interceptedModals.has(modalPortal)) return;

      // Find the modal content element
      const modalContent = modalPortal.querySelector(
        '[class*="ReactModal__Content"], [class*="StyledBox"]'
      ) as HTMLElement;

      if (!modalContent) return;

      // Mark as intercepted
      interceptedModals.add(modalPortal);

      // Extract content before hiding (store button references)
      const extractedContent = extractModalContent(modalContent);

      // Hide the original modal (CSS already does this, but ensure it)
      modalPortal.style.display = 'none';
      modalPortal.style.visibility = 'hidden';
      modalContent.style.display = 'none';
      modalContent.style.visibility = 'hidden';

      // Show custom modal with extracted content
      if (extractedContent.content || extractedContent.title) {
        dispatch(
          openModal({
            modalName: 'connectorMessage',
            type: 'info',
            props: {
              title: extractedContent.title || 'Notification',
              content: extractedContent.content,
              buttons: extractedContent.buttons
            }
          })
        );
      }
    };

    // Use MutationObserver to watch for ReactModal portals being added
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;

            // Check if it's a ReactModal portal
            if (
              element.classList.contains('ReactModalPortal') ||
              element.querySelector('[class*="ReactModalPortal"]') ||
              element.querySelector('[class*="ReactModal__Content"]')
            ) {
              // Small delay to ensure content is rendered
              setTimeout(() => {
                interceptModal(element);
              }, 100);
            }

            // Also check for nested ReactModal content
            const modalPortals = element.querySelectorAll(
              '[class*="ReactModalPortal"], [class*="ReactModal__Content"]'
            );
            modalPortals.forEach(portal => {
              setTimeout(() => {
                interceptModal(portal as HTMLElement);
              }, 100);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const existingModals = document.querySelectorAll('[class*="ReactModalPortal"], [class*="ReactModal__Content"]');
    existingModals.forEach(modal => {
      setTimeout(() => {
        interceptModal(modal as HTMLElement);
      }, 100);
    });

    return () => {
      observer.disconnect();
    };
  }, [dispatch]);
};
