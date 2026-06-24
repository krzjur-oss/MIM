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

  const penColors = [
    { value: '#ef4444', label: 'Czerwony' },
    { value: '#3b82f6', label: 'Niebieski' },
    { value: '#10b981', label: 'Zielony' },
    { value: '#f59e0b', label: 'Bursztynowy' },
    { value: '#8b5cf6', label: 'Fioletowy' },
    { value: '#ec4899', label: 'Różowy' },
    { value: '#111827', label: 'Czarny' },
  ];

  const highlighterColors = [
    { value: '#facc15', label: 'Neon Żółty' },
    { value: '#4ade80', label: 'Neon Zielony' },
    { value: '#f472b6', label: 'Neon Różowy' },
    { value: '#fb923c', label: 'Neon Pomarańczowy' },
    { value: '#38bdf8', label: 'Neon Błękitny' },
  ];

  const thicknessPresets = [
    { value: 2, label: 'Cienka (2px)' },
    { value: 5, label: 'Średnia (5px)' },
    { value: 10, label: 'Gruba (10px)' },
    { value: 16, label: 'Szeroka (16px)' },
  ];

  const activeColors = tool === 'highlighter' ? highlighterColors : penColors;

  return (
    <div id="drawing-overlay-container" ref={containerRef} className="absolute inset-0 z-40 pointer-events-none flex flex-col">
      {/* Drawing Toolbar */}
      <div className="bg-white/95 dark:bg-slate-900/95 shadow-lg border-b border-slate-200 dark:border-slate-800 p-2.5 pointer-events-auto flex flex-col gap-2 rounded-t-xl transition-all duration-200">
        
        {/* Row 1: Tools, Preset sizes and brush preview */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Tool selectors */}
            <button
              id="tool-pen-btn"
              onClick={() => { setTool('pen'); }}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                tool === 'pen'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
              }`}
              title="Pisak - standardowy rysunek"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Pisak</span>
            </button>

            <button
              id="tool-highlighter-btn"
              onClick={() => { setTool('highlighter'); }}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                tool === 'highlighter'
                  ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
              }`}
              title="Zakreślacz - półprzezroczysty marker"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>Zakreślacz</span>
            </button>

            <button
              id="tool-eraser-btn"
              onClick={() => { setTool('eraser'); }}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                tool === 'eraser'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
              }`}
              title="Gumka"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Gumka</span>
            </button>

            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

            {/* Quick Thickness Presets */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-sans text-slate-400 dark:text-slate-500 font-extrabold mr-1 uppercase hidden md:inline">Profile:</span>
              {thicknessPresets.map((preset) => (
                <button
                  key={preset.value}
                  id={`thickness-preset-${preset.value}`}
                  onClick={() => setLineWidth(preset.value)}
                  className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border cursor-pointer transition-all ${
                    lineWidth === preset.value
                      ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-800 dark:border-slate-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800'
                  }`}
                  title={preset.label}
                >
                  {preset.value}px
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions (Undo, Clear, Close) */}
          <div className="flex items-center gap-1.5">
            {/* Brush Live Preview (Beautiful Tip visualization) */}
            <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl shrink-0">
              <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase font-sans hidden sm:inline">Ślad:</span>
              <div className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-950 rounded-lg border border-slate-200/60 dark:border-slate-800 shadow-inner">
                <div 
                  style={{ 
                    width: `${Math.min(24, tool === 'eraser' ? lineWidth * 2 : tool === 'highlighter' ? lineWidth * 1.5 : lineWidth)}px`, 
                    height: `${Math.min(24, tool === 'eraser' ? lineWidth * 2 : tool === 'highlighter' ? lineWidth * 1.5 : lineWidth)}px`,
                    backgroundColor: tool === 'eraser' ? 'transparent' : color,
                    border: tool === 'eraser' ? '2px dashed #f43f5e' : 'none',
                    borderRadius: '50%',
                    opacity: tool === 'highlighter' ? 0.45 : 1
                  }} 
                />
              </div>
            </div>

            <button
              id="undo-draw-btn"
              onClick={undoLast}
              disabled={strokes.length === 0}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-30 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50"
              title="Cofnij ostatnią linię"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              id="clear-draw-btn"
              onClick={clearCanvas}
              disabled={strokes.length === 0}
              className="p-1.5 text-red-500 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/20 disabled:opacity-30 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-red-200/50 dark:hover:border-rose-900/30"
              title="Wyczyść całą tablicę"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              id="close-draw-overlay-btn"
              onClick={onClose}
              className="ml-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 dark:bg-slate-150 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
              <span>Zamknij</span>
            </button>
          </div>
        </div>

        {/* Row 2: Brush properties (Colors, Slider) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Colors palette and Custom picker */}
          <div className="flex items-center gap-2">
            {tool !== 'eraser' ? (
              <>
                <span className="text-[10px] font-sans text-slate-400 dark:text-slate-500 font-extrabold uppercase mr-1">Kolor pisaka:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeColors.map((c) => (
                    <button
                      key={c.value}
                      id={`color-picker-${c.value.replace('#', '')}`}
                      onClick={() => setColor(c.value)}
                      style={{ backgroundColor: c.value }}
                      className={`w-6.5 h-6.5 rounded-full border-2 transition-all cursor-pointer relative ${
                        color === c.value
                          ? 'border-slate-900 dark:border-white scale-110 shadow-md ring-2 ring-slate-400/20'
                          : 'border-transparent hover:scale-105 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                      title={c.label}
                    >
                      {color === c.value && (
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white mix-blend-difference font-black">✓</span>
                      )}
                    </button>
                  ))}

                  <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />

                  {/* Custom Palette HTML5 Color Picker */}
                  <div className="relative flex items-center group/picker cursor-pointer">
                    <input
                      id="custom-color-html-picker"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 cursor-pointer overflow-hidden opacity-0 absolute inset-0 z-10"
                      title="Własny kolor..."
                    />
                    <div 
                      style={{ backgroundColor: color }}
                      className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 hover:border-slate-500 dark:border-slate-700 dark:hover:border-slate-500 flex items-center justify-center text-[10px] shadow-sm transition-all"
                      title="Wybierz własny kolor..."
                    >
                      🎨
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <span className="text-[10px] font-sans text-slate-400 dark:text-slate-500 font-extrabold uppercase">Gumka usuwa narysowane ścieżki</span>
            )}
          </div>

          {/* Slider for fine tuning */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850 px-2.5 py-1 rounded-xl border border-slate-150 dark:border-slate-800/80">
            <span className="text-[10px] font-sans text-slate-400 dark:text-slate-500 font-extrabold uppercase">Grubość suwakiem:</span>
            <input
              id="line-width-slider"
              type="range"
              min="2"
              max="24"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-24 sm:w-32 accent-rose-500 cursor-pointer h-1.5 rounded-lg bg-slate-200 dark:bg-slate-800"
            />
            <span className="text-[11px] font-mono font-extrabold text-rose-500 dark:text-rose-400 min-w-[28px] text-right">{lineWidth}px</span>
          </div>
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
