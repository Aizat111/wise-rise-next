'use client';

import React, { useState } from 'react';

import { Modal } from './Modal';

export const DraggableModalDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const [showDragIndicator, setShowDragIndicator] = useState(true);
  const [resetPositionOnClose, setResetPositionOnClose] = useState(false);

  const handleDragStart = () => {
    console.log('Drag started');
  };

  const handleDragEnd = () => {
    console.log('Drag ended');
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-white">Draggable Modal Demo</h1>

      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-white">
          <input type="checkbox" checked={isDraggable} onChange={e => setIsDraggable(e.target.checked)} />
          <span>Enable Dragging</span>
        </label>

        <label className="flex items-center space-x-2 text-white">
          <input type="checkbox" checked={showDragIndicator} onChange={e => setShowDragIndicator(e.target.checked)} />
          <span>Show Drag Indicator</span>
        </label>

        <label className="flex items-center space-x-2 text-white">
          <input
            type="checkbox"
            checked={resetPositionOnClose}
            onChange={e => setResetPositionOnClose(e.target.checked)}
          />
          <span>Reset Position on Close</span>
        </label>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Open Draggable Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Draggable Modal"
        description="This modal can be dragged around the screen. Try dragging it by the header!"
        isDraggable={isDraggable}
        showDragIndicator={showDragIndicator}
        resetPositionOnClose={resetPositionOnClose}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        size="lg"
        variant="glass"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            This is a draggable modal with improved performance and better user experience.
          </p>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Features:</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• Smooth drag animations</li>
              <li>• Proper boundary constraints</li>
              <li>• Performance optimized</li>
              <li>• Accessibility support</li>
              <li>• Visual drag indicators</li>
              <li>• Position reset on close</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Close Modal
            </button>
            <button
              onClick={() => {
                setIsDraggable(!isDraggable);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Toggle Dragging
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
