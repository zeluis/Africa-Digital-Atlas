import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ChevronRight,
  Download,
  ShieldCheck,
  BookOpen,
  Camera
} from 'lucide-react';

interface KingdomArtifact3DViewerModalProps {
  kingdom: KingdomDetailedRecord;
  initialArtifactId?: string;
  onClose: () => void;
}

type LightingPreset = 'studio' | 'gold_warm' | 'museum_dramatic' | 'midnight';
type CameraAnglePreset = 'front' | 'isometric' | 'profile' | 'top';

export const KingdomArtifact3DViewerModal: React.FC<KingdomArtifact3DViewerModalProps> = ({
  kingdom,
  initialArtifactId,
  onClose
}) => {
  const artifacts = kingdom.artifacts3D || [];
  const hasArtifacts = artifacts.length > 0;

  const [selectedArtifact, setSelectedArtifact] = useState<Artifact3DRecord | null>(
    artifacts.find(a => a.id === initialArtifactId) || artifacts[0] || null
  );

  const [rotationX, setRotationX] = useState<number>(12);
  const [rotationY, setRotationY] = useState<number>(25);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('museum_dramatic');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [showParticleSparkles, setShowParticleSparkles] = useState<boolean>(true);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'materiality' | 'provenance' | 'significance'>('overview');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Auto-rotation loop with smooth delta
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 0.6) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  // Pointer drag controls
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    setRotationY(prev => (prev + deltaX * 0.75) % 360);
    setRotationX(prev => Math.max(-65, Math.min(65, prev - deltaY * 0.75)));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Preset camera angle views
  const applyCameraPreset = (preset: CameraAnglePreset) => {
    setIsAutoRotating(false);
    if (preset === 'front') {
      setRotationX(0);
      setRotationY(0);
    } else if (preset === 'isometric') {
      setRotationX(20);
      setRotationY(35);
    } else if (preset === 'profile') {
      setRotationX(0);
      setRotationY(90);
    } else if (preset === 'top') {
      setRotationX(65);
      setRotationY(0);
    }
  };

  // High-Resolution PNG Export
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${selectedArtifact ? selectedArtifact.id : kingdom.id}-3d-artifact.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Copy Chicago Style Citation
  const handleCopyCitation = () => {
    if (!selectedArtifact) return;
    const citation = `"${selectedArtifact.title} (${selectedArtifact.nativeTitle})." ${selectedArtifact.period}, ${selectedArtifact.provenance}. Currently curated at ${selectedArtifact.currentLocation}. Africalia Archival Database.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2400);
  };

  // 3D Rendering Engine with true depth, specular lighting and material shaders
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
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    // 1. Lighting & Ambient Atmosphere
    let lightColor = '#ffffff';
    let lightIntensity = 0.7;
    let bgAmbient = 'rgba(24, 24, 27, 0.4)';

    if (lightingPreset === 'gold_warm') {
      lightColor = '#fbbf24';
      lightIntensity = 0.9;
      bgAmbient = 'rgba(217, 119, 6, 0.15)';
    } else if (lightingPreset === 'museum_dramatic') {
      lightColor = '#fef08a';
      lightIntensity = 1.0;
      bgAmbient = 'rgba(0, 0, 0, 0.5)';
    } else if (lightingPreset === 'midnight') {
      lightColor = '#38bdf8';
      lightIntensity = 0.85;
      bgAmbient = 'rgba(2, 6, 23, 0.6)';
    }

    // Pedestal Shadow with dynamic perspective
    const shadowScale = 1.0 + (rotationX / 180) * 0.4;
    const shadowGrad = ctx.createRadialGradient(0, 160, 10, 0, 160, 200 * shadowScale);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.7)');
    shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, 160, 190 * shadowScale, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3D Circular Pedestal Plinth with bevel
    const plinthY = 145;
    const plinthRadius = 150;
    const plinthDepth = 20;

    // Extruded cylinder plinth
    for (let d = plinthDepth; d >= 0; d--) {
      ctx.fillStyle = d === 0 ? '#27272a' : '#18181b';
      ctx.beginPath();
      ctx.ellipse(0, plinthY + d, plinthRadius, plinthRadius * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Plinth Graticule Ring & Inscription
    ctx.strokeStyle = `${kingdom.color}60`;
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.ellipse(0, plinthY, plinthRadius - 15, (plinthRadius - 15) * 0.28, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Sparkle particles in 3D orbit
    if (showParticleSparkles) {
      const numSparkles = 12;
      const time = Date.now() * 0.002;
      for (let i = 0; i < numSparkles; i++) {
        const sAngle = (i / numSparkles) * Math.PI * 2 + time * 0.5;
        const sRadius = 130 + Math.sin(time + i) * 30;
        const sx = Math.cos(sAngle) * sRadius * cosY;
        const sy = (Math.sin(sAngle) * sRadius * 0.35 * cosX) - 20 + Math.cos(time * 2 + i) * 20;
        const sAlpha = 0.3 + 0.7 * Math.abs(Math.sin(time * 3 + i));

        ctx.fillStyle = `${lightColor}`;
        ctx.globalAlpha = sAlpha;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    // 2. ARTIFACT PROCEDURAL 3D GEOMETRY RENDERING
    if (!selectedArtifact) {
      // Fallback: Imperial Heritage Pedestal & Monolith
      ctx.save();
      ctx.transform(cosY, sinX * sinY, 0, cosX, 0, 0);

      // Monolithic Obelisk Pillar
      const monoGrad = ctx.createLinearGradient(-40, -140, 40, 140);
      monoGrad.addColorStop(0, '#3f3f46');
      monoGrad.addColorStop(0.5, '#18181b');
      monoGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = monoGrad;
      ctx.strokeStyle = kingdom.color;
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(-45, 120);
      ctx.lineTo(-30, -110);
      ctx.lineTo(0, -140);
      ctx.lineTo(30, -110);
      ctx.lineTo(45, 120);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Imperial Gold Seal Medallion
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, -20, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 12px serif';
      ctx.fillStyle = '#78350f';
      ctx.textAlign = 'center';
      ctx.fillText('★', 0, -16);

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(kingdom.name.toUpperCase(), 0, 40);

      ctx.font = '9px monospace';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(`${kingdom.peakCentury} • ${kingdom.capital}`, 0, 60);

      ctx.restore();
      ctx.restore();
      return;
    }

    const artId = selectedArtifact.id.toLowerCase();

    // Multi-layer 3D transformation matrix
    ctx.save();
    ctx.transform(cosY, sinX * sinY, -sinX * sinY * 0.25, cosX, 0, 0);

    // Dynamic 3D depth extrusion multiplier
    const depthLayers = showWireframe ? 1 : 12;
    const depthStep = 2.2;

    // A. BENIN IDIA IVORY MASK
    if (artId.includes('idia')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const ivoryGrad = ctx.createLinearGradient(-70, -110 + offset, 70, 110 + offset);
        if (d === 0) {
          ivoryGrad.addColorStop(0, '#fffdfa');
          ivoryGrad.addColorStop(0.3, '#fef3c7');
          ivoryGrad.addColorStop(0.7, '#fde68a');
          ivoryGrad.addColorStop(1, '#d97706');
        } else {
          ivoryGrad.addColorStop(0, '#b45309');
          ivoryGrad.addColorStop(1, '#78350f');
        }

        ctx.fillStyle = ivoryGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#92400e' : '#451a03';
        ctx.lineWidth = d === 0 ? 2.5 : 1;

        // Face Oval
        ctx.beginPath();
        ctx.moveTo(0, -90 + offset);
        ctx.bezierCurveTo(68, -90 + offset, 62, 40 + offset, 32, 95 + offset);
        ctx.bezierCurveTo(16, 115 + offset, -16, 115 + offset, -32, 95 + offset);
        ctx.bezierCurveTo(-62, 40 + offset, -68, -90 + offset, 0, -90 + offset);
        ctx.closePath();
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Tiara of Portuguese Heads & Mudfish openwork
      ctx.fillStyle = '#fde68a';
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
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

      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.ellipse(0, 48, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Coral Beaded Collar Lattice
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let cy = 70; cy <= 110; cy += 10) {
        ctx.moveTo(-35, cy);
        ctx.lineTo(35, cy);
      }
      ctx.stroke();
    }

    // B. BENIN BRONZE COURT PLAQUE / EQUESTRIAN
    else if (artId.includes('bronze') || artId.includes('plaque')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const bronzeGrad = ctx.createLinearGradient(-90, -115 + offset, 90, 115 + offset);
        if (d === 0) {
          bronzeGrad.addColorStop(0, '#92400e');
          bronzeGrad.addColorStop(0.3, '#b45309');
          bronzeGrad.addColorStop(0.7, '#78350f');
          bronzeGrad.addColorStop(1, '#451a03');
        } else {
          bronzeGrad.addColorStop(0, '#451a03');
          bronzeGrad.addColorStop(1, '#1c1917');
        }

        ctx.fillStyle = bronzeGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#f59e0b' : '#292524';
        ctx.lineWidth = d === 0 ? 2.5 : 1;

        ctx.beginPath();
        ctx.roundRect(-90, -115 + offset, 180, 230, 10);
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Quatrefoil River Leaves in Corners
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      [[-60, -85], [60, -85], [-60, 85], [60, 85]].forEach(([rx, ry]) => {
        ctx.beginPath();
        ctx.arc(rx, ry, 12, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Oba Central Figure & High Coral Crown
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#991b1b';
      ctx.beginPath();
      ctx.rect(-24, -90, 48, 32);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(0, -45, 22, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ceremonial Eben Fan Sword
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(15, 10);
      ctx.lineTo(50, -40);
      ctx.lineTo(60, -25);
      ctx.closePath();
      ctx.stroke();

      // High Relief Attendants
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-70, -20, 26, 75);
      ctx.fillRect(44, -20, 26, 75);
    }

    // C. ASHANTI GOLDEN STOOL (Sika Dwa Kofi)
    else if (artId.includes('golden-stool') || artId.includes('stool')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const goldGrad = ctx.createLinearGradient(-90, -90 + offset, 90, 90 + offset);
        if (d === 0) {
          goldGrad.addColorStop(0, '#fef9c3');
          goldGrad.addColorStop(0.3, '#facc15');
          goldGrad.addColorStop(0.7, '#ca8a04');
          goldGrad.addColorStop(1, '#854d0e');
        } else {
          goldGrad.addColorStop(0, '#713f12');
          goldGrad.addColorStop(1, '#451a03');
        }

        ctx.fillStyle = goldGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#854d0e' : '#451a03';
        ctx.lineWidth = d === 0 ? 2.5 : 1;

        // Stepped Base
        ctx.beginPath();
        ctx.roundRect(-80, 65 + offset, 160, 30, 8);
        ctx.roundRect(-65, 50 + offset, 130, 18, 6);
        if (!showWireframe) ctx.fill();
        ctx.stroke();

        // 5 Pillars
        ctx.beginPath();
        ctx.rect(-18, -30 + offset, 36, 85);
        ctx.rect(-55, -20 + offset, 14, 75);
        ctx.rect(41, -20 + offset, 14, 75);
        if (!showWireframe) ctx.fill();
        ctx.stroke();

        // Curved Crescent Seat
        ctx.beginPath();
        ctx.moveTo(-95, -75 + offset);
        ctx.quadraticCurveTo(0, -25 + offset, 95, -75 + offset);
        ctx.quadraticCurveTo(0, -45 + offset, -95, -75 + offset);
        ctx.closePath();
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Hanging Golden Bells
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#713f12';
      ctx.beginPath();
      ctx.arc(-40, 20, 12, 0, Math.PI * 2);
      ctx.arc(40, 20, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // D. AKSUM MONOLITHIC OBELISK / STELE
    else if (artId.includes('stele') || artId.includes('obelisk')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const granGrad = ctx.createLinearGradient(-35, -130 + offset, 35, 130 + offset);
        if (d === 0) {
          granGrad.addColorStop(0, '#a1a1aa');
          granGrad.addColorStop(0.5, '#52525b');
          granGrad.addColorStop(1, '#27272a');
        } else {
          granGrad.addColorStop(0, '#27272a');
          granGrad.addColorStop(1, '#18181b');
        }

        ctx.fillStyle = granGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#d4d4d8' : '#3f3f46';
        ctx.lineWidth = d === 0 ? 2 : 1;

        ctx.beginPath();
        ctx.moveTo(-32, 130 + offset);
        ctx.lineTo(-20, -115 + offset);
        ctx.arc(0, -115 + offset, 20, Math.PI, 0, false);
        ctx.lineTo(32, 130 + offset);
        ctx.closePath();
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Multi-story Window Tiers
      ctx.strokeStyle = '#f4f4f5';
      ctx.lineWidth = 1.5;
      for (let wy = -90; wy <= 90; wy += 25) {
        ctx.beginPath();
        ctx.rect(-12, wy, 24, 15);
        ctx.arc(-16, wy + 7, 2.5, 0, Math.PI * 2);
        ctx.arc(16, wy + 7, 2.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // E. AKSUM GOLD COIN OF KING EZANA
    else if (artId.includes('coin') || artId.includes('ezana')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const coinGrad = ctx.createRadialGradient(0, offset, 10, 0, offset, 95);
        if (d === 0) {
          coinGrad.addColorStop(0, '#fef08a');
          coinGrad.addColorStop(0.4, '#eab308');
          coinGrad.addColorStop(0.8, '#a16207');
          coinGrad.addColorStop(1, '#ca8a04');
        } else {
          coinGrad.addColorStop(0, '#713f12');
          coinGrad.addColorStop(1, '#451a03');
        }

        ctx.fillStyle = coinGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#fde047' : '#713f12';
        ctx.lineWidth = d === 0 ? 3 : 1;

        ctx.beginPath();
        ctx.arc(0, offset, 90, 0, Math.PI * 2);
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Obverse: Inscription & King Profile
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -10, 32, 0, Math.PI * 2);
      ctx.stroke();

      // Christian Cross
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -40); ctx.lineTo(0, 20);
      ctx.moveTo(-25, -10); ctx.lineTo(25, -10);
      ctx.stroke();

      ctx.font = 'bold 11px serif';
      ctx.fillStyle = '#713f12';
      ctx.textAlign = 'center';
      ctx.fillText('EZANA BACILEYC', 0, 58);
    }

    // F. GREAT ZIMBABWE SOAPSTONE BIRD (Shiri yaMwari)
    else if (artId.includes('bird') || artId.includes('soapstone')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const stoneGrad = ctx.createLinearGradient(-40, -120 + offset, 40, 120 + offset);
        if (d === 0) {
          stoneGrad.addColorStop(0, '#059669');
          stoneGrad.addColorStop(0.5, '#047857');
          stoneGrad.addColorStop(1, '#064e3b');
        } else {
          stoneGrad.addColorStop(0, '#064e3b');
          stoneGrad.addColorStop(1, '#022c22');
        }

        ctx.fillStyle = stoneGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#34d399' : '#065f46';
        ctx.lineWidth = d === 0 ? 2 : 1;

        // Pillar Base
        ctx.beginPath();
        ctx.rect(-28, 40 + offset, 56, 90);
        if (!showWireframe) ctx.fill();
        ctx.stroke();

        // Bird Raptor Body
        ctx.beginPath();
        ctx.moveTo(-20, 40 + offset);
        ctx.bezierCurveTo(-35, -20 + offset, -25, -70 + offset, -10, -95 + offset);
        ctx.bezierCurveTo(0, -115 + offset, 25, -115 + offset, 30, -90 + offset);
        ctx.bezierCurveTo(35, -60 + offset, 25, 0 + offset, 20, 40 + offset);
        ctx.closePath();
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Chevron Carvings
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-28, 60); ctx.lineTo(0, 75); ctx.lineTo(28, 60);
      ctx.moveTo(-28, 85); ctx.lineTo(0, 100); ctx.lineTo(28, 85);
      ctx.stroke();
    }

    // G. MAPUNGUBWE / ZIMBABWE GOLDEN RHINOCEROS
    else if (artId.includes('rhino')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const goldGrad = ctx.createLinearGradient(-90, -60 + offset, 90, 60 + offset);
        if (d === 0) {
          goldGrad.addColorStop(0, '#fef9c3');
          goldGrad.addColorStop(0.3, '#facc15');
          goldGrad.addColorStop(0.7, '#eab308');
          goldGrad.addColorStop(1, '#854d0e');
        } else {
          goldGrad.addColorStop(0, '#854d0e');
          goldGrad.addColorStop(1, '#451a03');
        }

        ctx.fillStyle = goldGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#fde047' : '#713f12';
        ctx.lineWidth = d === 0 ? 2.5 : 1;

        // Rhinoceros Muscular Torso
        ctx.beginPath();
        ctx.moveTo(-80, 0 + offset);
        ctx.bezierCurveTo(-75, -45 + offset, -20, -55 + offset, 40, -35 + offset);
        ctx.bezierCurveTo(75, -20 + offset, 85, 10 + offset, 70, 30 + offset);
        ctx.bezierCurveTo(40, 45 + offset, -40, 45 + offset, -80, 20 + offset);
        ctx.closePath();
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Golden Snout Horn
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(65, -15);
      ctx.lineTo(105, -45);
      ctx.lineTo(75, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gold Tack Pins
      ctx.fillRect(-60, 25, 18, 50);
      ctx.fillRect(-25, 25, 18, 50);
      ctx.fillRect(20, 25, 18, 50);
      ctx.fillRect(45, 25, 18, 50);
    }

    // H. KONGO NKANGI KIDITU BRASS CRUCIFIX
    else if (artId.includes('crucifix') || artId.includes('nkangi')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const brassGrad = ctx.createLinearGradient(-60, -100 + offset, 60, 100 + offset);
        if (d === 0) {
          brassGrad.addColorStop(0, '#ca8a04');
          brassGrad.addColorStop(0.5, '#78350f');
          brassGrad.addColorStop(1, '#451a03');
        } else {
          brassGrad.addColorStop(0, '#451a03');
          brassGrad.addColorStop(1, '#1c1917');
        }

        ctx.fillStyle = brassGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#fbbf24' : '#292524';
        ctx.lineWidth = d === 0 ? 2.5 : 1;

        ctx.beginPath();
        ctx.rect(-12, -120 + offset, 24, 240);
        ctx.rect(-75, -45 + offset, 150, 24);
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Christ & Attendant Figures
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.ellipse(0, -45, 14, 14, 0, 0, Math.PI * 2);
      ctx.rect(-8, -30, 16, 45);
      ctx.fill();
    }

    // I. KONGO RAFFIA VELVET TEXTILE / MANUSCRIPTS / CHARTERS
    else if (artId.includes('raffia') || artId.includes('manuscript') || artId.includes('charter') || artId.includes('timbuktu')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const vellumGrad = ctx.createLinearGradient(-95, -115 + offset, 95, 115 + offset);
        if (d === 0) {
          vellumGrad.addColorStop(0, '#fffbeb');
          vellumGrad.addColorStop(0.5, '#fde68a');
          vellumGrad.addColorStop(1, '#d97706');
        } else {
          vellumGrad.addColorStop(0, '#78350f');
          vellumGrad.addColorStop(1, '#451a03');
        }

        ctx.fillStyle = vellumGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#92400e' : '#451a03';
        ctx.lineWidth = d === 0 ? 2.5 : 1;

        ctx.beginPath();
        ctx.roundRect(-95, -115 + offset, 190, 230, 8);
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Spine & Astronomy Diagrams
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-48, -20, 32, 0, Math.PI * 2);
      ctx.arc(-48, -20, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Calligraphy Text Lines
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 2;
      for (let ly = -85; ly <= 80; ly += 14) {
        ctx.beginPath();
        ctx.moveTo(15, ly); ctx.lineTo(80, ly);
        ctx.stroke();
      }
    }

    // J. OYO ADE NLA BEADED CROWN
    else if (artId.includes('crown') || artId.includes('ade-nla')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const crownGrad = ctx.createLinearGradient(-60, -110 + offset, 60, 110 + offset);
        if (d === 0) {
          crownGrad.addColorStop(0, '#16a34a');
          crownGrad.addColorStop(0.4, '#22c55e');
          crownGrad.addColorStop(0.8, '#eab308');
          crownGrad.addColorStop(1, '#15803d');
        } else {
          crownGrad.addColorStop(0, '#14532d');
          crownGrad.addColorStop(1, '#052e16');
        }

        ctx.fillStyle = crownGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#facc15' : '#14532d';
        ctx.lineWidth = d === 0 ? 2 : 1;

        ctx.beginPath();
        ctx.moveTo(-50, 40 + offset);
        ctx.lineTo(-20, -100 + offset);
        ctx.lineTo(20, -100 + offset);
        ctx.lineTo(50, 40 + offset);
        ctx.closePath();
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Beaded Okin Bird at Apex
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(0, -115, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hanging Fringe Seed-Bead Veil
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      for (let vx = -45; vx <= 45; vx += 7) {
        ctx.beginPath();
        ctx.moveTo(vx, 40); ctx.lineTo(vx, 120);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // K. DAHOMEY KING GLELE LION / MAKPO SCEPTER / BAS-RELIEF
    else if (artId.includes('lion') || artId.includes('makpo') || artId.includes('relief')) {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const lionGrad = ctx.createLinearGradient(-80, -90 + offset, 80, 90 + offset);
        if (d === 0) {
          lionGrad.addColorStop(0, '#fef08a');
          lionGrad.addColorStop(0.3, '#ca8a04');
          lionGrad.addColorStop(0.7, '#854d0e');
          lionGrad.addColorStop(1, '#451a03');
        } else {
          lionGrad.addColorStop(0, '#713f12');
          lionGrad.addColorStop(1, '#292524');
        }

        ctx.fillStyle = lionGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#f59e0b' : '#713f12';
        ctx.lineWidth = d === 0 ? 2.5 : 1;

        ctx.beginPath();
        ctx.moveTo(-50, 70 + offset);
        ctx.lineTo(-40, -10 + offset);
        ctx.bezierCurveTo(-45, -60 + offset, -20, -85 + offset, 10, -85 + offset);
        ctx.bezierCurveTo(45, -85 + offset, 55, -55 + offset, 45, 0 + offset);
        ctx.lineTo(55, 70 + offset);
        ctx.closePath();
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Spiky Stylized Mane Radial Crest
      ctx.fillStyle = '#a16207';
      for (let a = -Math.PI; a <= 0; a += 0.35) {
        const mx = Math.cos(a) * 48 + 10;
        const my = Math.sin(a) * 48 - 60;
        ctx.beginPath();
        ctx.arc(mx, my, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // L. DEFAULT / OTHER ROYAL ARTIFACTS (Equestrian, Chainmail, Gold Weights, etc.)
    else {
      for (let d = depthLayers; d >= 0; d--) {
        const offset = d * depthStep;
        const defaultGrad = ctx.createLinearGradient(-70, -100 + offset, 70, 100 + offset);
        if (d === 0) {
          defaultGrad.addColorStop(0, '#facc15');
          defaultGrad.addColorStop(0.5, '#b45309');
          defaultGrad.addColorStop(1, '#451a03');
        } else {
          defaultGrad.addColorStop(0, '#713f12');
          defaultGrad.addColorStop(1, '#1c1917');
        }

        ctx.fillStyle = defaultGrad;
        ctx.strokeStyle = showWireframe ? '#38bdf8' : d === 0 ? '#fde047' : '#713f12';
        ctx.lineWidth = d === 0 ? 2.5 : 1;

        ctx.beginPath();
        ctx.roundRect(-70, -80 + offset, 140, 160, 16);
        if (!showWireframe) ctx.fill();
        ctx.stroke();
      }

      // Intricate Geometric Filigree
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(-25, -25, 50, 50);
    }

    ctx.restore();
    ctx.restore();
  }, [
    selectedArtifact,
    rotationX,
    rotationY,
    zoomScale,
    lightingPreset,
    showWireframe,
    showParticleSparkles,
    kingdom
  ]);

  // Request Animation Frame loop
  useEffect(() => {
    const loop = () => {
      render3DScene();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [render3DScene]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoRotating(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden text-left"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-6xl h-[92vh] max-h-[900px] flex flex-col rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden text-zinc-100"
      >
        {/* 1. Header Toolbar */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/90 bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shadow-[0_0_12px_rgba(234,179,8,0.6)]"
              style={{ backgroundColor: kingdom.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>360° Material Culture &amp; Artifact Inspector</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {kingdom.name}
                  </span>
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                {selectedArtifact ? selectedArtifact.title : `Imperial Heritage Monolith • ${kingdom.capital}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPNG}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 border border-zinc-700 cursor-pointer shadow-xs"
              title="Export high-resolution PNG render"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export PNG</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Close inspector (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Main Body (Split 3D Canvas & Dossier Panel) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT: 3D Interactive Viewport (7 cols) */}
          <div className="lg:col-span-7 relative h-full bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 flex flex-col items-center justify-center select-none overflow-hidden">
            {/* 3D Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={560}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
            />

            {/* Top Left Viewport HUD: Camera Presets */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-xl z-10">
              <span className="text-[10px] font-mono text-zinc-400 font-bold px-2">VIEW:</span>
              {(['front', 'isometric', 'profile', 'top'] as CameraAnglePreset[]).map(preset => (
                <button
                  key={preset}
                  onClick={() => applyCameraPreset(preset)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold uppercase transition-all bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Top Right Viewport HUD: Lighting Presets */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-xl z-10">
              <Sun className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
              {(['museum_dramatic', 'studio', 'gold_warm', 'midnight'] as LightingPreset[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLightingPreset(l)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    lightingPreset === l
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {l === 'museum_dramatic' ? 'Spotlight' : l === 'gold_warm' ? 'Gold' : l === 'midnight' ? 'Night' : 'Studio'}
                </button>
              ))}
            </div>

            {/* Bottom Viewport Floating Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-xl z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoRotating(prev => !prev)}
                  className={`p-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAutoRotating
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                  title="Toggle 360° auto-rotation"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin-slow' : ''}`} />
                  <span>{isAutoRotating ? 'Auto 360°' : 'Manual'}</span>
                </button>

                <button
                  onClick={() => setShowWireframe(prev => !prev)}
                  className={`p-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showWireframe
                      ? 'bg-sky-500 text-zinc-950 shadow-md'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                  title="Toggle 3D wireframe mesh topology"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Wireframe</span>
                </button>

                <button
                  onClick={() => setShowParticleSparkles(prev => !prev)}
                  className={`p-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showParticleSparkles
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                  title="Toggle celestial aura particles"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Zoom Scale Controller */}
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span>Scale:</span>
                <input
                  type="range"
                  min="0.6"
                  max="1.8"
                  step="0.05"
                  value={zoomScale}
                  onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                  className="w-24 accent-amber-500 cursor-pointer"
                />
                <span className="w-8 text-right text-zinc-200">{zoomScale.toFixed(2)}x</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Artifact Catalog & Scholarly Dossier (5 cols) */}
          <div className="lg:col-span-5 h-full bg-zinc-900/40 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col overflow-hidden text-left">
            {/* Artifact Filmstrip Selector */}
            {hasArtifacts && (
              <div className="p-3 border-b border-zinc-800 bg-zinc-950/60">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider block mb-2">
                  Select Kingdom Artifact:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {artifacts.map(art => {
                    const isSelected = selectedArtifact?.id === art.id;
                    return (
                      <button
                        key={art.id}
                        onClick={() => setSelectedArtifact(art)}
                        className={`shrink-0 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <p className="text-xs font-bold whitespace-nowrap">{art.nativeTitle || art.title}</p>
                        <p className="text-[10px] font-mono text-zinc-500">{art.material.replace('_', ' ')}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dossier Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900/80">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'materiality', label: 'Materiality', icon: Scale },
                { id: 'provenance', label: 'Provenance', icon: ShieldCheck },
                { id: 'significance', label: 'Significance', icon: Award }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-zinc-800 text-amber-400 shadow-sm border border-zinc-700'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Dossier Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin text-zinc-200">
              {selectedArtifact ? (
                <>
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-500">
                          {selectedArtifact.period}
                        </span>
                        <h3 className="text-lg font-black text-white">
                          {selectedArtifact.title}
                        </h3>
                        <p className="text-xs font-serif italic text-zinc-400">
                          Native Name: {selectedArtifact.nativeTitle}
                        </p>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {selectedArtifact.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Material Medium</span>
                          <strong className="text-amber-400 font-bold capitalize">
                            {selectedArtifact.material.replace('_', ' ')}
                          </strong>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Dimensions</span>
                          <strong className="text-zinc-200 font-bold text-[11px]">
                            {selectedArtifact.dimensions}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MATERIALITY */}
                  {activeTab === 'materiality' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <h4 className="text-xs font-mono uppercase font-bold text-amber-500">
                        Metallurgical &amp; Fabric Composition
                      </h4>
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {selectedArtifact.materialDetails}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase text-zinc-500">Curatorial Shader Parameter</span>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800 font-mono text-xs">
                          <span className="text-zinc-400">Surface Shader:</span>
                          <span className="text-amber-400 font-bold uppercase">{selectedArtifact.shaderType}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PROVENANCE */}
                  {activeTab === 'provenance' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                          <MapPin className="w-4 h-4" />
                          <span>Original Provenance</span>
                        </div>
                        <p className="text-xs text-zinc-300">
                          {selectedArtifact.provenance}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold">
                          <Globe2 className="w-4 h-4" />
                          <span>Current Curatorial Custody</span>
                        </div>
                        <p className="text-xs text-zinc-300">
                          {selectedArtifact.currentLocation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: SIGNIFICANCE */}
                  {activeTab === 'significance' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <h4 className="text-xs font-mono uppercase font-bold text-amber-500">
                          Cosmological &amp; Sovereign Authority
                        </h4>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {selectedArtifact.historicalSignificance}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Scholarly Citation Box */}
                  <div className="pt-3 border-t border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                        Scholarly Citation (Chicago Style):
                      </span>
                      <button
                        onClick={handleCopyCitation}
                        className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCitation ? 'Copied Citation!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 font-serif text-[11.5px] text-zinc-400 leading-relaxed italic">
                      "{selectedArtifact.title} ({selectedArtifact.nativeTitle})." {selectedArtifact.period}, {selectedArtifact.provenance}. Curated at {selectedArtifact.currentLocation}. Africalia Archival Repository.
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-center">
                  <Award className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Pan-African Archival Heritage</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Physical material objects for this historical polity are currently documented in oral royal genealogies and regional archaeological excavation field reports.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
