'use client';

import * as React from 'react';

import { Modal, ModalContent, ModalFooter } from './Modal';

export function ModalDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<'default' | 'glass' | 'neon' | 'gradient'>('default');
  const [modalSize, setModalSize] = React.useState<
    'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'screen'
  >('md');
  const [animationType, setAnimationType] = React.useState<'fade' | 'slide' | 'zoom' | 'flip'>('fade');
  const [position, setPosition] = React.useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'>(
    'center'
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleLoadingTest = () => {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-toshi_body p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Modal Component Demo</h1>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Variant</label>
            <select
              value={modalType}
              onChange={e => setModalType(e.target.value as any)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="default">Default</option>
              <option value="glass">Glass</option>
              <option value="neon">Neon</option>
              <option value="gradient">Gradient</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
            <select
              value={modalSize}
              onChange={e => setModalSize(e.target.value as any)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
              <option value="2xl">2X Large</option>
              <option value="3xl">3X Large</option>
              <option value="4xl">4X Large</option>
              <option value="5xl">5X Large</option>
              <option value="6xl">6X Large</option>
              <option value="7xl">7X Large</option>
              <option value="full">Full</option>
              <option value="screen">Screen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Animation</label>
            <select
              value={animationType}
              onChange={e => setAnimationType(e.target.value as any)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="zoom">Zoom</option>
              <option value="flip">Flip</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
            <select
              value={position}
              onChange={e => setPosition(e.target.value as any)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="center">Center</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={openModal}
              className="w-full px-4 py-2 bg-toshi-primary text-white rounded hover:bg-toshi-primary/80 transition-colors"
            >
              Open Modal
            </button>
          </div>
        </div>

        {/* Demo Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setModalType('default');
              setModalSize('md');
              setAnimationType('fade');
              openModal();
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Default Modal
          </button>

          <button
            onClick={() => {
              setModalType('glass');
              setModalSize('lg');
              setAnimationType('slide');
              openModal();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Glass Modal
          </button>

          <button
            onClick={() => {
              setModalType('neon');
              setModalSize('xl');
              setAnimationType('zoom');
              openModal();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Neon Modal
          </button>

          <button
            onClick={() => {
              setModalType('gradient');
              setModalSize('2xl');
              setAnimationType('flip');
              openModal();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Gradient Modal
          </button>
        </div>

        {/* Loading Test */}
        <div className="mt-8">
          <button
            onClick={handleLoadingTest}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Test Loading State
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Modal Demo"
        description="This is a comprehensive modal component with full customization options."
        size={modalSize}
        variant={modalType}
        animationType={animationType}
        isLoading={isLoading}
        showCloseButton={true}
        closeOnOverlayClick={true}
        closeOnEscape={true}
        preventBodyScroll={true}
        trapFocus={true}
        autoFocus={true}
        restoreFocus={true}
        position={position}
        showOverlay={true}
      >
        <ModalContent>
          <div className="space-y-4">
            <p className="text-gray-300">This modal demonstrates all the features of the Modal component:</p>

            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Fully customizable with props</li>
              <li>Multiple size variants (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, full, screen)</li>
              <li>Multiple position variants (center, top, bottom, left, right, corners)</li>
              <li>Multiple style variants (default, glass, card, minimal, neon, gradient)</li>
              <li>Smooth animations (fade, slide, zoom, flip)</li>
              <li>Accessibility features (focus trap, escape key, ARIA attributes)</li>
              <li>Loading states with customizable spinner</li>
              <li>Body scroll prevention</li>
              <li>Portal rendering</li>
              <li>Customizable overlay and styling</li>
            </ul>

            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Fully customizable with props</li>
              <li>Multiple size variants (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, full, screen)</li>
              <li>Multiple position variants (center, top, bottom, left, right, corners)</li>
              <li>Multiple style variants (default, glass, card, minimal, neon, gradient)</li>
              <li>Smooth animations (fade, slide, zoom, flip)</li>
              <li>Accessibility features (focus trap, escape key, ARIA attributes)</li>
              <li>Loading states with customizable spinner</li>
              <li>Body scroll prevention</li>
              <li>Portal rendering</li>
              <li>Customizable overlay and styling</li>
            </ul>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Fully customizable with props</li>
              <li>Multiple size variants (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, full, screen)</li>
              <li>Multiple position variants (center, top, bottom, left, right, corners)</li>
              <li>Multiple style variants (default, glass, card, minimal, neon, gradient)</li>
              <li>Smooth animations (fade, slide, zoom, flip)</li>
              <li>Accessibility features (focus trap, escape key, ARIA attributes)</li>
              <li>Loading states with customizable spinner</li>
              <li>Body scroll prevention</li>
              <li>Portal rendering</li>
              <li>Customizable overlay and styling</li>
            </ul>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Current Settings:</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>
                  Variant: <span className="text-toshi-primary">{modalType}</span>
                </p>
                <p>
                  Size: <span className="text-toshi-primary">{modalSize}</span>
                </p>
                <p>
                  Animation: <span className="text-toshi-primary">{animationType}</span>
                </p>
                <p>
                  Loading: <span className="text-toshi-primary">{isLoading ? 'Yes' : 'No'}</span>
                </p>
              </div>
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-toshi-primary text-white rounded hover:bg-toshi-primary/80 transition-colors"
            >
              Confirm
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
