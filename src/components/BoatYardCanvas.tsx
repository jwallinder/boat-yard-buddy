import React, { useRef, useEffect, useState } from 'react';
import { Boat, Crane, Obstacle } from '@/types/boat';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cranesList, cranesSortedByDistance } from '@/lib/crane';

interface CanvasProps {
  boats: Boat[];
  cranes: Crane[];
  obstacles: Obstacle[];
  onBoatSelect: (boat: Boat) => void;
  onBoatMove: (boatId: string, x: number, y: number) => void;
  selectedBoat?: Boat;
}

const PIXELS_PER_METER = 10;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const SNAP_DISTANCE = 2; // meters
const SNAP_GRID_SIZE = 1; // meters

export const BoatCanvas: React.FC<CanvasProps> = ({
  boats,
  cranes,
  obstacles,
  onBoatSelect,
  onBoatMove,
  selectedBoat
}) => {

  const sortedCranes = selectedBoat
    ? cranesSortedByDistance(cranes, selectedBoat)
    : cranesList(cranes)

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBoat, setDraggedBoat] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [snapTarget, setSnapTarget] = useState<{ x: number; y: number; boatId?: string } | null>(null);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'hsl(214, 20%, 90%)';
    ctx.lineWidth = 0.5;
    
    const gridSize = PIXELS_PER_METER;
    const startX = ((-pan.x) % gridSize) * zoom;
    const startY = ((-pan.y) % gridSize) * zoom;
    
    for (let x = startX; x < CANVAS_WIDTH; x += gridSize * zoom) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    for (let y = startY; y < CANVAS_HEIGHT; y += gridSize * zoom) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  };

  const worldToScreen = (worldX: number, worldY: number) => ({
    x: (worldX * PIXELS_PER_METER + pan.x) * zoom,
    y: (worldY * PIXELS_PER_METER + pan.y) * zoom
  });

  const screenToWorld = (screenX: number, screenY: number) => ({
    x: (screenX / zoom - pan.x) / PIXELS_PER_METER,
    y: (screenY / zoom - pan.y) / PIXELS_PER_METER
  });

  const calculateSnapPosition = (x: number, y: number, draggedBoatId: string) => {
    const draggedBoatData = boats.find(b => b.id === draggedBoatId);
    if (!draggedBoatData) return { x, y, snapTarget: null };

    let snapX = x;
    let snapY = y;
    let snapTarget: { x: number; y: number; boatId?: string } | null = null;

    // Snap to grid
    const gridSnapX = Math.round(x / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
    const gridSnapY = Math.round(y / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
    
    if (Math.abs(x - gridSnapX) < SNAP_DISTANCE / 2) {
      snapX = gridSnapX;
    }
    if (Math.abs(y - gridSnapY) < SNAP_DISTANCE / 2) {
      snapY = gridSnapY;
    }

    // Snap to other boats - side by side positioning
    for (const boat of boats) {
      if (boat.id === draggedBoatId) continue;

      const distance = Math.sqrt(
        Math.pow(x - boat.position.x, 2) + Math.pow(y - boat.position.y, 2)
      );

      if (distance < SNAP_DISTANCE * 2) {
        // Calculate horizontal side-by-side positions only
        const totalWidth = (draggedBoatData.width + boat.width) / 2;
        
        // Check which horizontal side is closer
        const leftDistance = Math.abs(x - (boat.position.x - totalWidth));
        const rightDistance = Math.abs(x - (boat.position.x + totalWidth));
        
        const minDistance = Math.min(leftDistance, rightDistance);
        
        if (minDistance < SNAP_DISTANCE) {
          if (minDistance === leftDistance) {
            // Snap to left side - keep current Y position
            snapX = boat.position.x - totalWidth;
            snapY = y; // Keep the dragged Y position
          } else {
            // Snap to right side - keep current Y position
            snapX = boat.position.x + totalWidth;
            snapY = y; // Keep the dragged Y position
          }
          
          snapTarget = { x: snapX, y: snapY, boatId: boat.id };
          break;
        }
      }
    }

    return { x: snapX, y: snapY, snapTarget };
  };

  const drawBoat = (ctx: CanvasRenderingContext2D, boat: Boat) => {
    const screenPos = worldToScreen(boat.position.x, boat.position.y);
    const width = boat.width * PIXELS_PER_METER * zoom;
    const height = boat.length * PIXELS_PER_METER * zoom;
    
    // Boat rectangle
    ctx.fillStyle = boat.type === 'motorboat' 
      ? 'hsl(214, 85%, 35%)' 
      : 'hsl(27, 87%, 67%)';
    
    if (selectedBoat?.id === boat.id) {
      ctx.fillStyle = 'hsl(214, 85%, 45%)';
      ctx.shadowColor = 'hsl(214, 85%, 35%)';
      ctx.shadowBlur = 10;
    }
    
    ctx.fillRect(screenPos.x - width/2, screenPos.y - height/2, width, height);
    ctx.shadowBlur = 0;
    
    // Border
    ctx.strokeStyle = 'hsl(214, 30%, 12%)';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenPos.x - width/2, screenPos.y - height/2, width, height);
    
    // Boat name
    ctx.fillStyle = 'white';
    ctx.font = `${Math.max(8, 12 * zoom)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(boat.name, screenPos.x, screenPos.y);
    
    // Mast indicator
    if (boat.hasMast) {
      ctx.strokeStyle = 'hsl(214, 30%, 12%)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(screenPos.x, screenPos.y - height/2);
      ctx.lineTo(screenPos.x, screenPos.y - height/2 - 15 * zoom);
      ctx.stroke();
    }
  };

  const drawCrane = (ctx: CanvasRenderingContext2D, crane: Crane, canLift: boolean) => {
    const screenPos = worldToScreen(crane.position.x, crane.position.y);
    const size = 15 * zoom;
    
    const color = canLift ? 'hsl(120, 100.00%, 50.00%)' : 'hsl(0, 75%, 50%)';
    // Crane base
    ctx.fillStyle = color;
    ctx.fillRect(screenPos.x - size/2, screenPos.y - size/2, size, size);
    
    // Crane arm
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(screenPos.x, screenPos.y);
    ctx.lineTo(screenPos.x + 30 * zoom, screenPos.y - 20 * zoom);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = 'hsl(214, 30%, 12%)';
    ctx.font = `${Math.max(8, 10 * zoom)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(crane.name, screenPos.x, screenPos.y + size + 15);
  };

  const drawObstacle = (ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    const screenPos = worldToScreen(obstacle.position.x, obstacle.position.y);
    const width = obstacle.width * PIXELS_PER_METER * zoom;
    const height = obstacle.height * PIXELS_PER_METER * zoom;
    
    ctx.fillStyle = 'hsl(0, 0%, 70%)';
    ctx.fillRect(screenPos.x - width/2, screenPos.y - height/2, width, height);
    
    ctx.strokeStyle = 'hsl(0, 0%, 50%)';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenPos.x - width/2, screenPos.y - height/2, width, height);
    
    // Label
    ctx.fillStyle = 'hsl(214, 30%, 12%)';
    ctx.font = `${Math.max(6, 8 * zoom)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(obstacle.name, screenPos.x, screenPos.y);
  };

  const drawSnapIndicators = (ctx: CanvasRenderingContext2D) => {
    if (!snapTarget || !draggedBoat) return;

    const screenPos = worldToScreen(snapTarget.x, snapTarget.y);
    const draggedBoatData = boats.find(b => b.id === draggedBoat);
    
    if (!draggedBoatData) return;
    
    // Draw snap target position outline
    const snapWidth = draggedBoatData.width * PIXELS_PER_METER * zoom;
    const snapHeight = draggedBoatData.length * PIXELS_PER_METER * zoom;
    
    ctx.strokeStyle = 'hsl(120, 100%, 50%)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.strokeRect(
      screenPos.x - snapWidth/2, 
      screenPos.y - snapHeight/2, 
      snapWidth, 
      snapHeight
    );
    ctx.setLineDash([]);

    // Draw snap target crosshair
    ctx.strokeStyle = 'hsl(120, 100%, 50%)';
    ctx.lineWidth = 2;
    const crosshairSize = 8 * zoom;
    ctx.beginPath();
    ctx.moveTo(screenPos.x - crosshairSize, screenPos.y);
    ctx.lineTo(screenPos.x + crosshairSize, screenPos.y);
    ctx.moveTo(screenPos.x, screenPos.y - crosshairSize);
    ctx.lineTo(screenPos.x, screenPos.y + crosshairSize);
    ctx.stroke();
    
    // Draw connection line to target boat
    const targetBoat = boats.find(b => b.id === snapTarget.boatId);
    if (targetBoat) {
      const targetScreenPos = worldToScreen(targetBoat.position.x, targetBoat.position.y);
      ctx.strokeStyle = 'hsl(120, 100%, 50%)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(screenPos.x, screenPos.y);
      ctx.lineTo(targetScreenPos.x, targetScreenPos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Save context
    ctx.save();
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw obstacles
    obstacles.forEach(obstacle => drawObstacle(ctx, obstacle));
    

    // Draw cranes
    sortedCranes.forEach(crane => drawCrane(ctx, crane.crane, crane.canLift));
    
    // Draw boats
    boats.forEach(boat => drawBoat(ctx, boat));
    
    // Draw snap indicators
    drawSnapIndicators(ctx);
    
    // Restore context
    ctx.restore();
  }, [boats, cranes, obstacles, zoom, pan, selectedBoat, snapTarget, draggedBoat]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldPos = screenToWorld(x, y);
    
    // Check if clicking on a boat
    const clickedBoat = boats.find(boat => {
      const boatWidth = boat.width;
      const boatHeight = boat.length;
      return worldPos.x >= boat.position.x - boatWidth/2 &&
             worldPos.x <= boat.position.x + boatWidth/2 &&
             worldPos.y >= boat.position.y - boatHeight/2 &&
             worldPos.y <= boat.position.y + boatHeight/2;
    });
    
    if (clickedBoat) {
      onBoatSelect(clickedBoat);
      setDraggedBoat(clickedBoat.id);
    }
    
    setIsDragging(true);
    setMousePos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isDragging) {
      if (draggedBoat) {
        const worldPos = screenToWorld(x, y);
        const snapResult = calculateSnapPosition(worldPos.x, worldPos.y, draggedBoat);
        setSnapTarget(snapResult.snapTarget);
        onBoatMove(draggedBoat, snapResult.x, snapResult.y);
      } else {
        // Pan the canvas
        const deltaX = x - mousePos.x;
        const deltaY = y - mousePos.y;
        setPan(prev => ({
          x: prev.x + deltaX / zoom,
          y: prev.y + deltaY / zoom
        }));
      }
    }
    
    setMousePos({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedBoat(null);
    setSnapTarget(null);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 50, y: 50 });
  };

  return (
    <div className="relative bg-background border border-border rounded-lg shadow-technical overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleZoom(0.2)}
          className="shadow-elevated"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleZoom(-0.2)}
          className="shadow-elevated"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={resetView}
          className="shadow-elevated"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-card border border-border rounded px-3 py-1 text-sm font-mono shadow-technical">
        Zoom: {(zoom * 100).toFixed(0)}% | 1m = {PIXELS_PER_METER * zoom}px
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};