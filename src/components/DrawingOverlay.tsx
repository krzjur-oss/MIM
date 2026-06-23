import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Trash2, RotateCcw, Highlighter, Eraser, X } from 'lucide-react';

interface DrawingOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
  type: 'pen' | 'highlighter' | 'eraser';
}

export default function DrawingOverlay({ isActive, onClose }: DrawingOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ef4444'); // default red
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [lineWidth, setLineWidth] = useState(4);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  // Initialize canvas size based on content container
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    redrawAll(canvas, strokes);
  };

  useEffect(() => {
    if (isActive) {
      // Small timeout to ensure container is fully rendered and sized
      const timer = setTimeout(() => {
        resizeCanvas();
      }, 100);

      window.addEventListener('resize', resizeCanvas);
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        clearTimeout(timer);
      };
    }
  }, [isActive, strokes]);

  const redrawAll = (canvas: HTMLCanvasElement, allStrokes: Stroke[]) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    allStrokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.type === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = stroke.width * 2;
      } else if (stroke.type === 'highlighter') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width * 3;
        // Make sure color is in rgba format for the highlighter feel
        ctx.globalAlpha = 0.35;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.globalAlpha = 1.0;
      }

      ctx.stroke();
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over'; // restore
    });
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const pt = getCoordinates(e);
    if (!pt) return;

    setIsDrawing(true);
    setCurrentPoints([pt]);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = lineWidth * 2;
      } else if (tool === 'highlighter') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth * 3;
        ctx.globalAlpha = 0.35;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = 1.0;
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    // Prevent scrolling when drawing on touchscreen mobile devices
    if (e.cancelable) {
      e.preventDefault();
    }

    const pt = getCoordinates(e);
    if (!pt) return;

    const nextPoints = [...currentPoints, pt];
    setCurrentPoints(nextPoints);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length > 0) {
      const newStroke: Stroke = {
        points: currentPoints,
        color,
        width: lineWidth,
        type: tool,
      };
      const updated = [...strokes, newStroke];
      setStrokes(updated);
    }
    setCurrentPoints([]);
  };

  const clearCanvas = () => {
    setStrokes([]);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const undoLast = () => {
    if (strokes.length === 0) return;
    const updated = strokes.slice(0, -1);
    setStrokes(updated);
    
    const canvas = canvasRef.current;
    if (canvas) {
      redrawAll(canvas, updated);
    }
  };

  if (!isActive) return null;

  const colors = [
    { value: '#ef4444', label: 'Czerwony' },
    { value: '#3b82f6', label: 'Niebieski' },
    { value: '#10b981', label: 'Zielony' },
    { value: '#f59e0b', label: 'Żółty' },
    { value: '#8b5cf6', label: 'Fioletowy' },
    { value: '#111827', label: 'Czarny' },
  ];

  return (
    <div id="drawing-overlay-container" ref={containerRef} className="absolute inset-0 z-40 pointer-events-none flex flex-col">
      {/* Drawing Toolbar */}
      <div className="bg-white/95 dark:bg-slate-900/95 shadow-lg border-b border-slate-200 dark:border-slate-800 p-2 pointer-events-auto flex flex-wrap items-center justify-between gap-2 rounded-t-xl transition-all duration-200">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Tool selectors */}
          <button
            id="tool-pen-btn"
            onClick={() => { setTool('pen'); }}
            className={`p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-all ${
              tool === 'pen'
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
            }`}
            title="Pisak"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Pisak</span>
          </button>

          <button
            id="tool-highlighter-btn"
            onClick={() => { setTool('highlighter'); }}
            className={`p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-all ${
              tool === 'highlighter'
                ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50'
                : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
            }`}
            title="Zakreślacz"
          >
            <Highlighter className="w-4 h-4" />
            <span className="hidden sm:inline">Zakreślacz</span>
          </button>

          <button
            id="tool-eraser-btn"
            onClick={() => { setTool('eraser'); }}
            className={`p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-all ${
              tool === 'eraser'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
                : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
            }`}
            title="Gumka"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Gumka</span>
          </button>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Color Palettes (only if not eraser) */}
          {tool !== 'eraser' && (
            <div className="flex items-center gap-1">
              {colors.map((c) => (
                <button
                  key={c.value}
                  id={`color-picker-${c.value.replace('#', '')}`}
                  onClick={() => setColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    color === c.value
                      ? 'border-slate-800 dark:border-white scale-110 shadow-sm'
                      : 'border-transparent hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          )}

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Thickness */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs font-mono text-slate-400 hidden md:inline">Grubość:</span>
            <input
              id="line-width-slider"
              type="range"
              min="2"
              max="16"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 sm:w-20 accent-rose-500 cursor-pointer h-1.5 rounded-lg bg-slate-200 dark:bg-slate-800"
            />
            <span className="text-xs font-mono font-medium text-slate-500 w-4 inline-block">{lineWidth}px</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="undo-draw-btn"
            onClick={undoLast}
            disabled={strokes.length === 0}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
            title="Cofnij"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="clear-draw-btn"
            onClick={clearCanvas}
            disabled={strokes.length === 0}
            className="p-2 text-red-500 dark:text-red-400 hover:rose-50 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
            title="Wyczyść wszystko"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            id="close-draw-overlay-btn"
            onClick={onClose}
            className="ml-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-slate-200 dark:border-slate-700"
          >
            <X className="w-3.5 h-3.5" />
            <span>Zamknij tablicę</span>
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      <canvas
        id="multibook-drawing-canvas"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="flex-1 w-full pointer-events-auto cursor-crosshair"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
