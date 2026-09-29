import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { KingdomDetailedRecord, Artifact3DRecord, DETAILED_KINGDOMS_DATA } from '../../data/preColonialKingdomsDetailed';
import { 
  Box, 
  RotateCw, 
  Sun, 
  Sparkles, 
  Maximize2, 
  X, 
  Info, 
  Layers, 
  Award, 
  Scale, 
  Eye, 
  Sliders, 
  Compass, 
  Check, 
  Copy,
  Globe2,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface KingdomArtifact3DViewerModalProps {
  kingdom: KingdomDetailedRecord;
  initialArtifactId?: string;
  onClose: () => void;
}

type LightingPreset = 'studio' | 'gold_warm' | 'museum_dramatic' | 'ambient';
type ViewMode = 'artifact' | 'territory_3d';

export const KingdomArtifact3DViewerModal: React.FC<KingdomArtifact3DViewerModalProps> = ({
  kingdom,
  initialArtifactId,
  onClose
}) => {
  const artifacts = kingdom.artifacts3D || [];
  const hasArtifacts = artifacts.length > 0;

  const [viewMode, setViewMode] = useState<ViewMode>(hasArtifacts ? 'artifact' : 'territory_3d');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact3DRecord | null>(
    artifacts.find(a => a.id === initialArtifactId) || artifacts[0] || null
  );

  const [rotationX, setRotationX] = useState<number>(15);
  const [rotationY, setRotationY] = useState<number>(25);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('studio');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 0.7) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  // Pointer drag controls
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    setRotationY(prev => prev + deltaX * 0.75);
    setRotationX(prev => Math.max(-60, Math.min(60, prev - deltaY * 0.75)));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // High-performance procedural 3D model renderers
  const render3DScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(zoomScale, zoomScale);

    const radY = (rotationY * Math.PI) / 180;
    const radX = (rotationX * Math.PI) / 180;

    // Lighting config
    let lightHex = '#ffffff';
    let lightAlpha = 0.6;
    if (lightingPreset === 'gold_warm') {
      lightHex = '#fef08a';
      lightAlpha = 0.8;
    } else if (lightingPreset === 'museum_dramatic') {
      lightHex = '#fbbf24';
      lightAlpha = 1.0;
    }

    // Pedestal Shadow
    const shadowGrad = ctx.createRadialGradient(0, 150, 10, 0, 150, 200);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
    shadowGrad.addColorStop(0.7, 'rgba(0,0,0,0.18)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, 150, 190, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // MODE 1: 3D TERRITORY EXTENT & MODERN COUNTRY COMPARISON
    if (viewMode === 'territory_3d' || !selectedArtifact) {
      // 3D Isometric Extruded Continental Baseplate
      const plateWidth = 280;
      const plateHeight = 220;
      const depth = 28;

      ctx.save();
      // Apply 3D pitch and yaw
      ctx.transform(
        Math.cos(radY), Math.sin(radX) * Math.sin(radY),
        0, Math.cos(radX),
        0, 0
      );

      // Extruded bottom layers
      for (let d = depth; d > 0; d--) {
        ctx.fillStyle = d === depth ? '#1c1917' : '#292524';
        ctx.beginPath();
        ctx.roundRect(-plateWidth / 2, -plateHeight / 2 + d, plateWidth, plateHeight, 16);
        ctx.fill();
      }

      // Top surface
      const topGrad = ctx.createLinearGradient(-plateWidth / 2, -plateHeight / 2, plateWidth / 2, plateHeight / 2);
      topGrad.addColorStop(0, '#262626');
      topGrad.addColorStop(1, '#171717');
      ctx.fillStyle = topGrad;
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-plateWidth / 2, -plateHeight / 2, plateWidth, plateHeight, 16);
      ctx.fill();
      ctx.stroke();

      // Grid graticule lines on terrain plate
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      for (let gx = -plateWidth / 2 + 30; gx < plateWidth / 2; gx += 30) {
        ctx.beginPath();
        ctx.moveTo(gx, -plateHeight / 2);
        ctx.lineTo(gx, plateHeight / 2);
        ctx.stroke();
      }
      for (let gy = -plateHeight / 2 + 30; gy < plateHeight / 2; gy += 30) {
        ctx.beginPath();
        ctx.moveTo(-plateWidth / 2, gy);
        ctx.lineTo(plateWidth / 2, gy);
        ctx.stroke();
      }

      // Maximum Kingdom Extent Polygon (Glow fill & dashed border)
      ctx.save();
      const polyGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 90);
      polyGrad.addColorStop(0, `${kingdom.color}90`);
      polyGrad.addColorStop(0.7, `${kingdom.color}40`);
      polyGrad.addColorStop(1, `${kingdom.color}15`);
      ctx.fillStyle = polyGrad;
      ctx.strokeStyle = kingdom.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 95, 70, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.restore();

      // Modern Sovereign Countries Pins & Footprints
      kingdom.modernCountries.forEach((cName, idx) => {
        const angle = (idx / kingdom.modernCountries.length) * Math.PI * 2 + 0.4;
        const px = Math.cos(angle) * 65;
        const py = Math.sin(angle) * 45;

        // Pin beacon
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pin Label
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(cName, px + 6, py + 3);
      });

      // Capital Metropolis Pillar
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 11px serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`★ Capital: ${kingdom.capital}`, -45, -20);

      ctx.restore();
      ctx.restore();
      return;
    }

    // MODE 2: BESPOKE 3D ARTIFACT GEOMETRIES
    const artId = selectedArtifact.id;
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    // Apply 3D Rotation Transform Matrix
    ctx.transform(cosY, sinX * sinY, -sinX * sinY * 0.3, cosX, 0, 0);

    // 1. QUEEN MOTHER IDIA IVORY MASK (Benin)
    if (artId.includes('idia-mask')) {
      // Main sculpted head contour
      const ivoryGrad = ctx.createLinearGradient(-70, -110, 70, 110);
      ivoryGrad.addColorStop(0, '#fffbeb');
      ivoryGrad.addColorStop(0.4, '#fef3c7');
      ivoryGrad.addColorStop(0.7, '#fde68a');
      ivoryGrad.addColorStop(1, '#d97706');

      ctx.fillStyle = ivoryGrad;
      ctx.strokeStyle = showWireframe ? '#38bdf8' : '#b45309';
      ctx.lineWidth = 2;

      // Face Oval with Serene Cheekbones and Chin
      ctx.beginPath();
      ctx.moveTo(0, -90);
      ctx.bezierCurveTo(65, -90, 60, 40, 30, 95);
      ctx.bezierCurveTo(15, 115, -15, 115, -30, 95);
      ctx.bezierCurveTo(-60, 40, -65, -90, 0, -90);
      ctx.closePath();
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // High Tiara of Portuguese Heads and Mudfish openwork
      ctx.fillStyle = '#fde68a';
      ctx.strokeStyle = '#92400e';
      ctx.beginPath();
      ctx.moveTo(-60, -90);
      for (let th = -50; th <= 50; th += 16) {
        ctx.lineTo(th - 4, -135);
        ctx.lineTo(th + 4, -135);
        ctx.lineTo(th + 8, -90);
      }
      ctx.closePath();
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Eyes with Iron Pupil Inlays
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.ellipse(-24, -20, 12, 6, 0.1, 0, Math.PI * 2);
      ctx.ellipse(24, -20, 12, 6, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Forehead Scarification Marks
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-6, -55); ctx.lineTo(-6, -40);
      ctx.moveTo(6, -55); ctx.lineTo(6, -40);
      ctx.stroke();

      // Sculpted Nose and Lips
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -25); ctx.lineTo(-7, 25); ctx.lineTo(7, 25);
      ctx.stroke();

      // Lips
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.ellipse(0, 48, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Beaded Coral Neck Collar Lattice
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let cy = 70; cy <= 110; cy += 10) {
        ctx.moveTo(-35, cy);
        ctx.lineTo(35, cy);
      }
      ctx.stroke();
    }
    // 2. GOLDEN STOOL SIKA DWA KOFI (Ashanti)
    else if (artId.includes('golden-stool') || artId.includes('stool')) {
      const goldGrad = ctx.createLinearGradient(-90, -90, 90, 90);
      goldGrad.addColorStop(0, '#fef9c3');
      goldGrad.addColorStop(0.3, '#facc15');
      goldGrad.addColorStop(0.7, '#ca8a04');
      goldGrad.addColorStop(1, '#713f12');

      ctx.fillStyle = goldGrad;
      ctx.strokeStyle = showWireframe ? '#38bdf8' : '#854d0e';
      ctx.lineWidth = 2.5;

      // Stepped Rectangular Base
      ctx.beginPath();
      ctx.roundRect(-80, 70, 160, 30, 8);
      ctx.roundRect(-65, 55, 130, 18, 6);
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Pierced Central Column and 4 Corner Supports
      ctx.beginPath();
      ctx.rect(-18, -30, 36, 85); // central pillar
      ctx.rect(-55, -20, 14, 75); // left pillar
      ctx.rect(41, -20, 14, 75);  // right pillar
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Crescent Curved Seat (The Soul of Asante)
      ctx.beginPath();
      ctx.moveTo(-95, -75);
      ctx.quadraticCurveTo(0, -25, 95, -75);
      ctx.quadraticCurveTo(0, -45, -95, -75);
      ctx.closePath();
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Suspended Golden Bells & Amulets
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#713f12';
      ctx.beginPath();
      ctx.arc(-40, 20, 10, 0, Math.PI * 2);
      ctx.arc(40, 20, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // 3. GOLD COIN OF KING EZANA WITH CROSS (Aksum)
    else if (artId.includes('ezana-gold-coin') || artId.includes('coin')) {
      // Determine Obverse vs Reverse based on 360 rotation angle
      const isReverse = Math.cos(radY) < 0;

      const coinGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 95);
      coinGrad.addColorStop(0, '#fef08a');
      coinGrad.addColorStop(0.4, '#eab308');
      coinGrad.addColorStop(0.8, '#a16207');
      coinGrad.addColorStop(1, '#fef9c3');

      ctx.fillStyle = coinGrad;
      ctx.strokeStyle = showWireframe ? '#38bdf8' : '#713f12';
      ctx.lineWidth = 3;

      // Circular Coin Body with Milled Edge
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Beaded Border Rim
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (!isReverse) {
        // Obverse: Crowned Profile of King Ezana holding Royal Scepter
        ctx.fillStyle = '#713f12';
        ctx.strokeStyle = '#713f12';
        ctx.lineWidth = 2.5;

        // Royal Crown & Profile
        ctx.beginPath();
        ctx.arc(0, -10, 32, 0, Math.PI * 2);
        ctx.fill();

        // Spear
        ctx.beginPath();
        ctx.moveTo(38, -50); ctx.lineTo(38, 50);
        ctx.stroke();

        // Greek Inscription: EZANA BACILEYC
        ctx.font = 'bold 11px serif';
        ctx.fillStyle = '#713f12';
        ctx.textAlign = 'center';
        ctx.fillText('EZANA BACILEYC', 0, 60);
      } else {
        // Reverse: The Christian Cross of Aksum
        ctx.fillStyle = '#713f12';
        ctx.strokeStyle = '#713f12';
        ctx.lineWidth = 6;

        ctx.beginPath();
        ctx.moveTo(0, -45); ctx.lineTo(0, 45);
        ctx.moveTo(-35, -10); ctx.lineTo(35, -10);
        ctx.stroke();

        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('መንግሥተ አክሱም', 0, 60);
      }
    }
    // 4. MONOLITHIC STELE OF AKSUM (Aksum)
    else if (artId.includes('stele') || artId.includes('obelisk')) {
      const graniteGrad = ctx.createLinearGradient(-40, -130, 40, 130);
      graniteGrad.addColorStop(0, '#71717a');
      graniteGrad.addColorStop(0.5, '#3f3f46');
      graniteGrad.addColorStop(1, '#18181b');

      ctx.fillStyle = graniteGrad;
      ctx.strokeStyle = showWireframe ? '#38bdf8' : '#a1a1aa';
      ctx.lineWidth = 2;

      // Tall Tapering Stele Shaft
      ctx.beginPath();
      ctx.moveTo(-32, 130);
      ctx.lineTo(-20, -115);
      // Semicircular Apex Cap
      ctx.arc(0, -115, 20, Math.PI, 0, false);
      ctx.lineTo(32, 130);
      ctx.closePath();
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Multi-story Window Tiers and Monkey-heads
      ctx.strokeStyle = '#d4d4d8';
      ctx.lineWidth = 1.5;
      for (let wy = -90; wy <= 90; wy += 25) {
        ctx.beginPath();
        ctx.rect(-12, wy, 24, 15); // window
        ctx.arc(-16, wy + 7, 2.5, 0, Math.PI * 2); // left beam end
        ctx.arc(16, wy + 7, 2.5, 0, Math.PI * 2);  // right beam end
        ctx.stroke();
      }

      // False Door at Base
      ctx.beginPath();
      ctx.rect(-14, 95, 28, 35);
      ctx.stroke();
    }
    // 5. TIMBUKTU ASTRONOMICAL / ILLUMINATED MANUSCRIPT
    else if (artId.includes('manuscript') || artId.includes('catalan')) {
      const vellumGrad = ctx.createLinearGradient(-90, -110, 90, 110);
      vellumGrad.addColorStop(0, '#fffbeb');
      vellumGrad.addColorStop(0.5, '#fde68a');
      vellumGrad.addColorStop(1, '#d97706');

      ctx.fillStyle = vellumGrad;
      ctx.strokeStyle = showWireframe ? '#38bdf8' : '#78350f';
      ctx.lineWidth = 2;

      // Open Folio / Double Page Book
      ctx.beginPath();
      ctx.roundRect(-95, -115, 190, 230, 8);
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Central Spine
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -115); ctx.lineTo(0, 115);
      ctx.stroke();

      // Left Page: Concentric Planetary Orbit Diagrams
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-48, -20, 32, 0, Math.PI * 2);
      ctx.arc(-48, -20, 22, 0, Math.PI * 2);
      ctx.arc(-48, -20, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Celestial Sun / Earth Core
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(-48, -20, 5, 0, Math.PI * 2);
      ctx.fill();

      // Right Page: Arabic / Ajami Calligraphic Lines
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 2;
      for (let ly = -90; ly <= 80; ly += 14) {
        ctx.beginPath();
        ctx.moveTo(15, ly);
        ctx.lineTo(82, ly);
        ctx.stroke();
      }

      // Illuminated Gold Header Band
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.rect(15, -105, 67, 10);
      ctx.fill();
    }
    // 6. SOAPSTONE ZIMBABWE BIRD (Great Zimbabwe)
    else if (artId.includes('bird')) {
      const stoneGrad = ctx.createLinearGradient(-40, -120, 40, 120);
      stoneGrad.addColorStop(0, '#047857');
      stoneGrad.addColorStop(0.4, '#065f46');
      stoneGrad.addColorStop(1, '#022c22');

      ctx.fillStyle = stoneGrad;
      ctx.strokeStyle = showWireframe ? '#38bdf8' : '#10b981';
      ctx.lineWidth = 2;

      // Monolith Pillar Base with Chevron Carvings
      ctx.beginPath();
      ctx.rect(-28, 40, 56, 90);
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Chevron Zig-Zag Pattern
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-28, 60); ctx.lineTo(0, 75); ctx.lineTo(28, 60);
      ctx.moveTo(-28, 85); ctx.lineTo(0, 100); ctx.lineTo(28, 85);
      ctx.stroke();

      // Sculpted Raptor Body & Crest
      ctx.fillStyle = stoneGrad;
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(-20, 40);
      ctx.bezierCurveTo(-35, -20, -25, -70, -10, -95);
      ctx.bezierCurveTo(0, -115, 25, -115, 30, -90);
      ctx.bezierCurveTo(35, -60, 25, 0, 20, 40);
      ctx.closePath();
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Raptor Eye & Beak
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -85, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    // 7. DEFAULT / BRONZE RELIEF / MAKPO SCEPTER / OTHER
    else {
      const genericGrad = ctx.createLinearGradient(-80, -80, 80, 80);
      genericGrad.addColorStop(0, '#a855f7');
      genericGrad.addColorStop(0.5, '#7e22ce');
      genericGrad.addColorStop(1, '#3b0764');

      ctx.fillStyle = genericGrad;
      ctx.strokeStyle = showWireframe ? '#38bdf8' : '#e9d5ff';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(-75, -95, 150, 190, 14);
      if (!showWireframe) ctx.fill();
      ctx.stroke();

      // Emblem Inscription
      ctx.font = 'bold 13px serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(selectedArtifact.nativeTitle, 0, 0);
    }

    // Specular Highlight Glint
    if (!showWireframe) {
      ctx.fillStyle = lightHex;
      ctx.globalAlpha = lightAlpha * 0.5;
      ctx.beginPath();
      ctx.arc(-40, -40, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    ctx.restore();
  }, [selectedArtifact, viewMode, kingdom, rotationX, rotationY, zoomScale, lightingPreset, showWireframe]);

  useEffect(() => {
    render3DScene();
  }, [render3DScene]);

  const handleCopyCitation = async () => {
    if (!selectedArtifact) return;
    const text = `${selectedArtifact.title} (${selectedArtifact.period}). Preserved at: ${selectedArtifact.currentLocation}. Cultural Heritage of the ${kingdom.name}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    } catch {}
  };

  const currentArtifactIdx = selectedArtifact ? artifacts.findIndex(a => a.id === selectedArtifact.id) : 0;
  const handlePrevArtifact = () => {
    if (artifacts.length === 0) return;
    const nextIdx = (currentArtifactIdx - 1 + artifacts.length) % artifacts.length;
    setSelectedArtifact(artifacts[nextIdx]);
    setViewMode('artifact');
  };
  const handleNextArtifact = () => {
    if (artifacts.length === 0) return;
    const nextIdx = (currentArtifactIdx + 1) % artifacts.length;
    setSelectedArtifact(artifacts[nextIdx]);
    setViewMode('artifact');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-lg select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#141210] border border-stone-800 text-stone-100 shadow-2xl overflow-hidden"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between gap-4 shrink-0 bg-stone-900/60">
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>3D &amp; Material Culture Inspector</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                {kingdom.name} • {viewMode === 'territory_3d' ? 'Territorial Maximum Extent' : selectedArtifact?.period}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-100">
              {viewMode === 'territory_3d' ? `${kingdom.name} — 3D Territorial Extent & Modern Borders` : selectedArtifact?.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-2xl bg-black/40 border border-stone-800 text-xs font-mono font-bold">
              {hasArtifacts && (
                <button
                  type="button"
                  onClick={() => setViewMode('artifact')}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    viewMode === 'artifact' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Artifact 3D
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewMode('territory_3d')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'territory_3d' ? 'bg-purple-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Territorial Extent 3D
              </button>
            </div>

            {/* Pagination between artifacts */}
            {hasArtifacts && viewMode === 'artifact' && artifacts.length > 1 && (
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/40 border border-stone-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={handlePrevArtifact}
                  className="p-1 rounded-lg hover:bg-stone-800 text-stone-300"
                  title="Previous Artifact"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-stone-400 font-bold px-1">
                  {currentArtifactIdx + 1}/{artifacts.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextArtifact}
                  className="p-1 rounded-lg hover:bg-stone-800 text-stone-300"
                  title="Next Artifact"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl hover:bg-rose-950/50 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Close 3D viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main 3D Canvas & Dossier Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
          {/* 3D Canvas Viewport */}
          <div className="lg:col-span-7 relative flex items-center justify-center bg-gradient-to-b from-stone-950 via-[#161412] to-stone-950 p-4 overflow-hidden">
            {/* Interactive 3D Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={520}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-full max-h-[460px] object-contain cursor-grab active:cursor-grabbing touch-none"
            />

            {/* Viewport Floating Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-stone-800 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setIsAutoRotating(a => !a)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  isAutoRotating ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Toggle Auto 360° Rotation"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>360° Orbit</span>
              </button>

              <button
                type="button"
                onClick={() => setShowWireframe(w => !w)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  showWireframe ? 'bg-purple-600 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Toggle Wireframe Mesh"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Wireframe</span>
              </button>
            </div>

            {/* Lighting Preset Selector */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-stone-800 text-[10px] font-mono">
              <span className="text-stone-500 px-2">Lighting:</span>
              <button
                type="button"
                onClick={() => setLightingPreset('studio')}
                className={`px-2 py-1 rounded-lg ${lightingPreset === 'studio' ? 'bg-stone-800 text-white' : 'text-stone-400'}`}
              >
                Studio
              </button>
              <button
                type="button"
                onClick={() => setLightingPreset('gold_warm')}
                className={`px-2 py-1 rounded-lg ${lightingPreset === 'gold_warm' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
              >
                Warm Gold
              </button>
              <button
                type="button"
                onClick={() => setLightingPreset('museum_dramatic')}
                className={`px-2 py-1 rounded-lg ${lightingPreset === 'museum_dramatic' ? 'bg-yellow-600 text-white' : 'text-stone-400'}`}
              >
                Dramatic
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-stone-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setZoomScale(z => Math.max(0.6, z - 0.15))}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-300"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-stone-400 px-1 text-[10px]">{Math.round(zoomScale * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomScale(z => Math.min(1.8, z + 0.15))}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-300"
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>

          {/* Right Column: Provenance or Territorial Breakdown */}
          <div className="lg:col-span-5 p-4 sm:p-5 overflow-y-auto custom-scrollbar border-l border-stone-800 space-y-4 text-left">
            {viewMode === 'territory_3d' || !selectedArtifact ? (
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-purple-400">
                    Geopolitical Spatial Model
                  </span>
                  <h3 className="text-base font-serif font-bold text-stone-100">
                    {kingdom.name} (Peak: {kingdom.peakCentury})
                  </h3>
                  <p className="text-xs font-mono text-stone-400">
                    Dynasty: <strong>{kingdom.dynasty}</strong> • Capital: <strong>{kingdom.capital}</strong>
                  </p>
                </div>

                <p className="text-xs leading-relaxed text-stone-300 font-serif">
                  {kingdom.summaryNarrative}
                </p>

                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono uppercase font-bold text-purple-300 flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>Modern Sovereign Nations in Historical Footprint</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {kingdom.modernCountries.map(c => (
                      <span key={c} className="px-2 py-1 rounded-lg bg-purple-950/60 border border-purple-800 text-purple-200 text-[11px] font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 space-y-1 text-xs">
                  <span className="text-[9px] uppercase font-mono font-bold text-stone-500 block">Governance &amp; Institutions</span>
                  <p className="text-stone-300 text-[11.5px] leading-relaxed">
                    {kingdom.governanceSystem}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-500">
                    Museum Record &amp; Material Analysis
                  </span>
                  <h3 className="text-base font-serif font-bold text-stone-100">
                    {selectedArtifact.title}
                  </h3>
                  <p className="text-xs font-mono text-purple-400">
                    Native Name: <em>{selectedArtifact.nativeTitle}</em>
                  </p>
                </div>

                <p className="text-xs leading-relaxed text-stone-300 font-serif">
                  {selectedArtifact.description}
                </p>

                {/* Material & Physical Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[9px] uppercase font-mono font-bold text-stone-500 block">Dimensions</span>
                    <span className="font-semibold text-stone-200 text-[11px]">{selectedArtifact.dimensions}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[9px] uppercase font-mono font-bold text-stone-500 block">Period</span>
                    <span className="font-semibold text-stone-200 text-[11px]">{selectedArtifact.period}</span>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[9px] uppercase font-mono font-bold text-stone-500 block">Material Composition</span>
                    <span className="font-semibold text-amber-300 text-[11px] block">{selectedArtifact.materialDetails}</span>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-[9px] uppercase font-mono font-bold text-stone-500 block">Current Location / Repository</span>
                    <span className="font-semibold text-stone-200 text-[11px] block">{selectedArtifact.currentLocation}</span>
                  </div>
                </div>

                {/* Historical Significance Callout */}
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-[9.5px] font-mono uppercase font-bold text-amber-300 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Epistemological &amp; Sovereign Significance</span>
                  </span>
                  <p className="text-xs text-stone-300 font-serif leading-relaxed">
                    {selectedArtifact.historicalSignificance}
                  </p>
                </div>

                {/* Copy Citation Button */}
                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Provenance Citation Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Museum Provenance Citation</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
