
import React from 'react';
import { ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface PhotoControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  zoomLevel: number;
}

const PhotoControls: React.FC<PhotoControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  zoomLevel
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
      <h4 className="text-lg font-semibold text-center text-gray-800 mb-4">
        Ajustar Foto
      </h4>
      
      {/* Zoom Controls */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={onZoomOut}
          className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors duration-200"
          disabled={zoomLevel <= 0.5}
        >
          <ZoomOut size={24} className="text-gray-700" />
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Zoom</div>
          <div className="text-lg font-semibold text-gray-800">
            {Math.round(zoomLevel * 100)}%
          </div>
        </div>
        
        <button
          onClick={onZoomIn}
          className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors duration-200"
          disabled={zoomLevel >= 3}
        >
          <ZoomIn size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Position Controls */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-600">Posição</div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        {/* Up Arrow */}
        <button
          onClick={onMoveUp}
          className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
        >
          <ArrowUp size={24} className="text-blue-700" />
        </button>
        
        {/* Left and Right Arrows */}
        <div className="flex gap-8">
          <button
            onClick={onMoveLeft}
            className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
          >
            <ArrowLeft size={24} className="text-blue-700" />
          </button>
          
          <button
            onClick={onMoveRight}
            className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
          >
            <ArrowRight size={24} className="text-blue-700" />
          </button>
        </div>
        
        {/* Down Arrow */}
        <button
          onClick={onMoveDown}
          className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors duration-200"
        >
          <ArrowDown size={24} className="text-blue-700" />
        </button>
      </div>
    </div>
  );
};

export default PhotoControls;
