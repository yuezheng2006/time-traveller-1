import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onClose: () => void;
  onDownload?: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt, onClose, onDownload }) => {
  const { t } = useTranslation();
  const [scale, setScale] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const imageRef = React.useRef<HTMLImageElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setScale(prev => Math.min(prev + 0.25, 5));
      } else if (e.key === '-') {
        e.preventDefault();
        setScale(prev => Math.max(prev - 0.25, 0.5));
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setRotation(prev => (prev + 90) % 360);
      } else if (e.key === '0') {
        e.preventDefault();
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(5, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => {
        if (e.target === containerRef.current) {
          onClose();
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-cyber-900/90 hover:bg-cyber-800 border border-cyber-700 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(14,165,233,0.6)] group"
        title={t('common.close') || 'Close (ESC)'}
      >
        <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Control toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-cyber-900/90 backdrop-blur-md border border-cyber-700 rounded-lg p-2">
        <button
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-cyber-800 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        
        <div className="px-3 py-1 text-white font-mono text-sm min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </div>
        
        <button
          onClick={handleZoomIn}
          disabled={scale >= 5}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-cyber-800 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-cyber-700"></div>

        <button
          onClick={handleRotate}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-cyber-800 rounded transition-all"
          title="Rotate (R)"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-cyber-700"></div>

        <button
          onClick={handleReset}
          className="px-3 py-1 text-white font-mono text-xs hover:bg-cyber-800 rounded transition-all"
          title="Reset (0)"
        >
          Reset
        </button>

        {onDownload && (
          <>
            <div className="w-px h-6 bg-cyber-700"></div>
            <button
              onClick={onDownload}
              className="w-10 h-10 flex items-center justify-center text-white hover:bg-cyber-800 rounded transition-all"
              title={t('view_screen.download') || 'Download'}
            >
              <Download className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Image container */}
      <div
        className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        style={{
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt || 'Preview'}
          className="max-w-full max-h-[90vh] object-contain select-none"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          draggable={false}
        />
      </div>

      {/* Help text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-cyber-900/80 backdrop-blur-md border border-cyber-700 rounded-lg px-4 py-2">
        <p className="text-xs text-slate-400 font-mono text-center">
          <span className="text-cyber-400">滚轮缩放</span> • <span className="text-cyber-400">拖拽移动</span> • <span className="text-cyber-400">ESC 关闭</span> • <span className="text-cyber-400">R 旋转</span> • <span className="text-cyber-400">0 重置</span>
        </p>
      </div>
    </div>
  );
};
