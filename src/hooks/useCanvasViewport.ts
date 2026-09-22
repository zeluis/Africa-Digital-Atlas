import { useState, useRef, useCallback, useEffect } from 'react';

export interface ViewportPosition {
  x: number;
  y: number;
}

export interface UseCanvasViewportOptions {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  baseFitScale?: number;
  onAnnounce?: (msg: string) => void;
}

export function useCanvasViewport(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseCanvasViewportOptions = {}
) {
  const {
    initialZoom = 1.0,
    minZoom = 0.64,
    maxZoom = 6.0,
    baseFitScale = 0.65,
    onAnnounce
  } = options;

  const [zoom, setZoom] = useState<number>(initialZoom);
  const [fitScale, setFitScale] = useState<number>(baseFitScale);
  const [pos, setPos] = useState<ViewportPosition>({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState<boolean>(false);

  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number; startX: number; startY: number; moved: boolean }>({
    x: 0, y: 0, startX: 0, startY: 0, moved: false
  });
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartZoom = useRef<number>(1);
  const velocityTracker = useRef<{ vx: number; vy: number; lastTime: number; lastX: number; lastY: number }>({
    vx: 0, vy: 0, lastTime: 0, lastX: 0, lastY: 0
  });
  const momentumAnimId = useRef<number | null>(null);

  // Zoom by factor centered on viewport
  const handleZoomDelta = useCallback((factor: number) => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    const next = Math.min(Math.max(zoom * factor, minZoom), maxZoom);
    const currentScale = fitScale * zoom;
    const nextScale = fitScale * next;
    const currentCenterSvgX = (w / 2 - pos.x) / currentScale;
    const currentCenterSvgY = (h / 2 - pos.y) / currentScale;
    setZoom(next);
    setPos({
      x: w / 2 - currentCenterSvgX * nextScale,
      y: h / 2 - currentCenterSvgY * nextScale
    });
  }, [containerRef, fitScale, minZoom, maxZoom, pos.x, pos.y, zoom]);

  // Pan smoothly to specific SVG coordinates
  const panToCoordinates = useCallback((targetX: number, targetY: number, targetZoom = 1.8, customOffset?: { xOffset?: number; yOffset?: number }) => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    const boundedZoom = Math.min(Math.max(targetZoom, minZoom), maxZoom);
    const scale = fitScale * boundedZoom;
    const targetCenterX = customOffset?.xOffset !== undefined ? (w - customOffset.xOffset) / 2 : w / 2;
    const targetCenterY = customOffset?.yOffset !== undefined ? (h - customOffset.yOffset) / 2 : h / 2;
    const nextX = targetCenterX - targetX * scale;
    const nextY = targetCenterY - targetY * scale;

    setZoom(boundedZoom);
    setPos({ x: nextX, y: nextY });
  }, [containerRef, fitScale, minZoom, maxZoom]);

  // Fit an arbitrary bounding box cleanly into the viewport with padding and optional drawer offset
  const fitToBounds = useCallback((
    bounds: { minX: number; minY: number; maxX: number; maxY: number },
    options: { padding?: number; maxZoom?: number; minZoom?: number; drawerWidth?: number } = {}
  ) => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    const {
      padding = 70,
      maxZoom: maxZ = 3.2,
      minZoom: minZ = 0.75,
      drawerWidth = (w > 1024 ? 380 : w > 768 ? 320 : 0)
    } = options;

    const bboxW = Math.max(bounds.maxX - bounds.minX, 40);
    const bboxH = Math.max(bounds.maxY - bounds.minY, 40);
    const centerX = bounds.minX + bboxW / 2;
    const centerY = bounds.minY + bboxH / 2;

    const effectiveWidth = Math.max(w - drawerWidth - padding * 2, 180);
    const effectiveHeight = Math.max(h - padding * 2, 180);

    const scaleX = effectiveWidth / bboxW;
    const scaleY = effectiveHeight / bboxH;
    const targetScale = Math.min(scaleX, scaleY);

    const boundedZoom = Math.min(Math.max(targetScale / (fitScale || 1), minZ), maxZ);
    const scale = fitScale * boundedZoom;

    const viewportCenterX = (w - drawerWidth) / 2;
    const viewportCenterY = h / 2;

    const nextX = viewportCenterX - centerX * scale;
    const nextY = viewportCenterY - centerY * scale;

    setZoom(boundedZoom);
    setPos({ x: nextX, y: nextY });
  }, [containerRef, fitScale]);

  // Pointer Down
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, a, .no-drag')) return;

    if (momentumAnimId.current) {
      cancelAnimationFrame(momentumAnimId.current);
      momentumAnimId.current = null;
    }

    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size === 1) {
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        startX: pos.x,
        startY: pos.y,
        moved: false
      };
      velocityTracker.current = {
        vx: 0,
        vy: 0,
        lastTime: performance.now(),
        lastX: e.clientX,
        lastY: e.clientY
      };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } else if (activePointers.current.size === 2) {
      isDragging.current = false;
      setIsPinching(true);
      const points = Array.from(activePointers.current.values());
      const dist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      pinchStartDist.current = dist;
      pinchStartZoom.current = zoom;
    }
  }, [pos.x, pos.y, zoom]);

  // Pointer Move
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (activePointers.current.has(e.pointerId)) {
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Two-finger Pinch Zoom
    if (activePointers.current.size === 2 && pinchStartDist.current !== null && containerRef.current) {
      const points = Array.from(activePointers.current.values());
      const currentDist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      const pinchMidX = (points[0].x + points[1].x) / 2;
      const pinchMidY = (points[0].y + points[1].y) / 2;

      const rect = containerRef.current.getBoundingClientRect();
      const focalX = pinchMidX - rect.left;
      const focalY = pinchMidY - rect.top;

      const scaleMultiplier = currentDist / pinchStartDist.current;
      const nextZoom = Math.min(Math.max(pinchStartZoom.current * scaleMultiplier, minZoom), maxZoom);

      const currentScale = fitScale * zoom;
      const nextScale = fitScale * nextZoom;

      setPos(prev => ({
        x: focalX - (focalX - prev.x) * (nextScale / currentScale),
        y: focalY - (focalY - prev.y) * (nextScale / currentScale)
      }));
      setZoom(nextZoom);
      return;
    }

    // Single pointer drag
    if (!isDragging.current) return;
    const now = performance.now();
    const dt = Math.max(now - velocityTracker.current.lastTime, 8);
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const instVx = (e.clientX - velocityTracker.current.lastX) / dt;
    const instVy = (e.clientY - velocityTracker.current.lastY) / dt;
    velocityTracker.current = {
      vx: velocityTracker.current.vx * 0.3 + instVx * 0.7,
      vy: velocityTracker.current.vy * 0.3 + instVy * 0.7,
      lastTime: now,
      lastX: e.clientX,
      lastY: e.clientY
    };

    if (Math.hypot(dx, dy) > 4) {
      dragStart.current.moved = true;
    }
    setPos({
      x: dragStart.current.startX + dx,
      y: dragStart.current.startY + dy
    });
  }, [containerRef, fitScale, minZoom, maxZoom, zoom]);

  // Pointer Up
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2) {
      pinchStartDist.current = null;
      setIsPinching(false);
    }

    if (activePointers.current.size === 0) {
      isDragging.current = false;

      let vx = velocityTracker.current.vx * 14;
      let vy = velocityTracker.current.vy * 14;
      const speed = Math.hypot(vx, vy);

      if (speed > 1.2) {
        const friction = 0.92;
        const stepKinetic = () => {
          vx *= friction;
          vy *= friction;
          if (Math.hypot(vx, vy) < 0.2) {
            momentumAnimId.current = null;
            return;
          }
          setPos(prev => ({
            x: prev.x + vx,
            y: prev.y + vy
          }));
          momentumAnimId.current = requestAnimationFrame(stepKinetic);
        };
        momentumAnimId.current = requestAnimationFrame(stepKinetic);
      }
    }
  }, []);

  // Mouse Wheel Zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const currentScale = fitScale * zoom;
    const nextZoom = Math.min(Math.max(zoom * zoomFactor, minZoom), maxZoom);
    const nextScale = fitScale * nextZoom;

    setPos(prev => ({
      x: mouseX - (mouseX - prev.x) * (nextScale / currentScale),
      y: mouseY - (mouseY - prev.y) * (nextScale / currentScale)
    }));
    setZoom(nextZoom);
  }, [containerRef, fitScale, minZoom, maxZoom, zoom]);

  // Keyboard navigation & accessibility controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input/textarea/select
      if ((e.target as HTMLElement)?.closest('input, textarea, select')) return;

      const step = 48;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setPos(prev => ({ ...prev, y: prev.y + step }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setPos(prev => ({ ...prev, y: prev.y - step }));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setPos(prev => ({ ...prev, x: prev.x + step }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setPos(prev => ({ ...prev, x: prev.x - step }));
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomDelta(1.15);
          break;
        case '-':
        case '_':
          e.preventDefault();
          handleZoomDelta(0.85);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomDelta]);

  return {
    zoom,
    setZoom,
    fitScale,
    setFitScale,
    pos,
    setPos,
    isDragging,
    dragStart,
    isPinching,
    handleZoomDelta,
    panToCoordinates,
    fitToBounds,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel
  };
}
