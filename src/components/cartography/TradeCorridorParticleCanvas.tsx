import React, { useRef, useEffect, useState } from 'react';
import { DETAILED_KINGDOMS_DATA, TradeCorridorPath } from '../../data/preColonialKingdomsDetailed';

interface TradeCorridorParticleCanvasProps {
  activeCentury?: number | null; // e.g. 14 for 14th century, or null for all
  activeCommodityFilter?: string; // 'all' | 'gold' | 'salt' | 'cowries' | 'copper' | 'kola'
  particleSpeedMultiplier?: number;
  showLabels?: boolean;
  className?: string;
  zoomLevel?: number;
  panOffset?: { x: number; y: number };
}

interface Particle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  pathIndex: number;
  color: string;
  size: number;
  opacity: number;
  trailLength: number;
}

export const TradeCorridorParticleCanvas: React.FC<TradeCorridorParticleCanvasProps> = ({
  activeCentury = null,
  activeCommodityFilter = 'all',
  particleSpeedMultiplier = 1.0,
  showLabels = true,
  className = '',
  zoomLevel = 1.0,
  panOffset = { x: 0, y: 0 }
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Extract all trade corridors
  const allCorridors: TradeCorridorPath[] = React.useMemo(() => {
    const list: TradeCorridorPath[] = [];
    Object.values(DETAILED_KINGDOMS_DATA).forEach(k => {
      k.tradeCorridorPaths.forEach(p => {
        if (!list.some(existing => existing.id === p.id)) {
          list.push(p);
        }
      });
    });
    return list;
  }, []);

  // Filter corridors by active century & commodity
  const visibleCorridors = React.useMemo(() => {
    return allCorridors.filter(c => {
      if (activeCommodityFilter !== 'all' && c.commodity !== activeCommodityFilter) {
        return false;
      }
      if (activeCentury !== null && !c.activeCenturies.includes(activeCentury)) {
        return false;
      }
      return true;
    });
  }, [allCorridors, activeCentury, activeCommodityFilter]);

  // Particle simulation state
  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles when corridors change
  useEffect(() => {
    const newParticles: Particle[] = [];
    const particlesPerPath = 24;

    visibleCorridors.forEach((corridor, pathIdx) => {
      for (let i = 0; i < particlesPerPath; i++) {
        newParticles.push({
          x: 0,
          y: 0,
          progress: i / particlesPerPath,
          speed: (0.0018 + Math.random() * 0.0012) * particleSpeedMultiplier,
          pathIndex: pathIdx,
          color: corridor.color,
          size: 3.5 + Math.random() * 2.5,
          opacity: 0.6 + Math.random() * 0.4,
          trailLength: 5 + Math.floor(Math.random() * 4)
        });
      }
    });

    particlesRef.current = newParticles;
  }, [visibleCorridors, particleSpeedMultiplier]);

  // Helper to interpolate along multi-point bezier / line path
  const getPointOnPath = (points: [number, number][], t: number): [number, number] => {
    if (points.length === 0) return [0, 0];
    if (points.length === 1) return points[0];

    const segmentCount = points.length - 1;
    const scaledT = t * segmentCount;
    const currentSegment = Math.min(segmentCount - 1, Math.floor(scaledT));
    const localT = scaledT - currentSegment;

    const p0 = points[currentSegment];
    const p1 = points[currentSegment + 1];

    return [
      p0[0] + (p1[0] - p0[0]) * localT,
      p0[1] + (p1[1] - p0[1]) * localT
    ];
  };

  // 60 FPS Particle Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      // Coordinate scaling from 5796x5867 SVG coordinate space to canvas resolution
      const scaleX = width / 5796;
      const scaleY = height / 5867;

      ctx.clearRect(0, 0, width, height);

      // Render glowing trade corridor guide tracks
      visibleCorridors.forEach(corridor => {
        if (corridor.points.length < 2) return;

        ctx.save();
        ctx.beginPath();
        const [startX, startY] = corridor.points[0];
        ctx.moveTo(startX * scaleX, startY * scaleY);

        for (let i = 1; i < corridor.points.length; i++) {
          const [px, py] = corridor.points[i];
          ctx.lineTo(px * scaleX, py * scaleY);
        }

        // Faint glowing path
        ctx.strokeStyle = corridor.color;
        ctx.lineWidth = 3.5;
        ctx.globalAlpha = 0.25;
        ctx.stroke();

        // Dash highlight
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 12]);
        ctx.globalAlpha = 0.45;
        ctx.stroke();
        ctx.restore();

        // Optional terminal labels
        if (showLabels) {
          const [sX, sY] = corridor.points[0];
          const [eX, eY] = corridor.points[corridor.points.length - 1];

          ctx.save();
          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = corridor.color;
          ctx.globalAlpha = 0.85;
          ctx.fillText(`● ${corridor.startName}`, sX * scaleX + 6, sY * scaleY - 6);
          ctx.fillText(`◆ ${corridor.endName}`, eX * scaleX + 6, eY * scaleY - 6);
          ctx.restore();
        }
      });

      // Update & Render animated particles
      const particles = particlesRef.current;

      particles.forEach(p => {
        if (p.pathIndex >= visibleCorridors.length) return;
        const corridor = visibleCorridors[p.pathIndex];

        // Advance progress
        p.progress = (p.progress + p.speed) % 1.0;
        const [targetX, targetY] = getPointOnPath(corridor.points, p.progress);

        p.x = targetX * scaleX;
        p.y = targetY * scaleY;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Radiant glow
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        glowGrad.addColorStop(0, p.color);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Core bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.95;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [visibleCorridors, showLabels]);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1920}
      className={`absolute inset-0 w-full h-full pointer-events-none z-15 ${className}`}
      style={{
        transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
        transformOrigin: 'center center'
      }}
    />
  );
};
