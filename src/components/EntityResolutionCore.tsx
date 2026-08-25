import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  Zap,
  Activity,
  Maximize2,
  Minimize2,
  Sparkles,
  Sliders,
  Volume2,
  RefreshCw,
  Eye,
  Crosshair,
  Layers,
  Terminal,
  Play,
  Pause,
  Cpu,
  Database,
  Compass,
  CornerDownRight,
  TrendingUp,
  ShieldAlert,
  Disc,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface SpectralPeak {
  id: string;
  x: number;
  height: number;
  width: number;
  frequency: string;
  name: string;
  threatLevel: number;
  carrier: string;
  bandwidth: string;
  modulation: string;
}

export function EntityResolutionCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interactive HUD States
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeHarmonic, setActiveHarmonic] = useState<'ALPHA' | 'BETA' | 'GAMMA' | 'DELTA'>('ALPHA');
  const [meshDensity, setMeshDensity] = useState<'DENSE' | 'HYPER' | 'CONTOUR'>('HYPER');
  const [amplitudeMode, setAmplitudeMode] = useState<'BALANCED' | 'ELEVATED' | 'SURGE'>('ELEVATED');
  const [selectedPeakIndex, setSelectedPeakIndex] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; normX: number; normY: number }>({ x: 0, y: 0, normX: 0, normY: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; radius: number; maxRadius: number; opacity: number }[]>([]);
  const [scanSpeed, setScanSpeed] = useState<number>(1);
  const [showWireframeOnly, setShowWireframeOnly] = useState(false);

  // Live telemetry metrics
  const [entropy, setEntropy] = useState(79.4);
  const [carrierFreq, setCarrierFreq] = useState(2.412);
  const [signalDb, setSignalDb] = useState(-42.8);
  const [phaseAngle, setPhaseAngle] = useState(148.6);
  const [correlationSync, setCorrelationSync] = useState(99.7);

  // Peaks definitions exactly matching the prominent double mountain topography in the user image
  const peaks: SpectralPeak[] = [
    {
      id: 'PEAK-1',
      x: 0.22,
      height: 0.74,
      width: 0.13,
      frequency: '2.412 GHz',
      name: 'NEXUS-ALPHA // APEX CARRIER',
      threatLevel: 96,
      carrier: 'BSSID 8C:FE:D4 // HOP 12',
      bandwidth: '80 MHz',
      modulation: 'QAM-1024'
    },
    {
      id: 'PEAK-2',
      x: 0.68,
      height: 0.70,
      width: 0.12,
      frequency: '5.180 GHz',
      name: 'NEXUS-BETA // EXFILTRATION NODE',
      threatLevel: 91,
      carrier: 'UPLINK 0x4F1A // TCP TUNNEL',
      bandwidth: '160 MHz',
      modulation: 'OFDMA-64'
    },
    {
      id: 'PEAK-3',
      x: 0.45,
      height: 0.38,
      width: 0.08,
      frequency: '3.650 GHz',
      name: 'SUB-HARMONIC // ORBIT RELAY',
      threatLevel: 64,
      carrier: 'GEO RELAY // ORBIT 36K',
      bandwidth: '40 MHz',
      modulation: 'BPSK'
    },
    {
      id: 'PEAK-4',
      x: 0.90,
      height: 0.46,
      width: 0.10,
      frequency: '5.825 GHz',
      name: 'DELTA DISPERSION // SHADOW VEIL',
      threatLevel: 78,
      carrier: 'BURST UDP // 1.1ms JITTER',
      bandwidth: '80 MHz',
      modulation: 'DSSS'
    }
  ];

  // Animation & 3D Topographic Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      if (isPlaying) {
        phase += 0.022 * scanSpeed;
      }

      // Live metrics micro-fluctuations
      if (Math.random() > 0.93) {
        setEntropy(prev => +(76 + Math.sin(phase * 0.4) * 6 + Math.random() * 2).toFixed(1));
        setSignalDb(prev => +(-44 + Math.cos(phase * 0.3) * 5 + Math.random() * 1.2).toFixed(1));
        setPhaseAngle(prev => +((140 + Math.sin(phase * 0.2) * 20 + 360) % 360).toFixed(1));
        setCorrelationSync(prev => +(98.5 + Math.sin(phase * 0.6) * 1.4).toFixed(1));
      }

      const w = canvas.width;
      const h = canvas.height;

      // 1. Crisp White Background with soft warm radial depth
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      // Depth gradient: soft orange core + warm peripheral glow
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.42, 30, w * 0.5, h * 0.45, w * 0.75);
      bgGrad.addColorStop(0, 'rgba(255, 237, 213, 0.4)');
      bgGrad.addColorStop(0.35, 'rgba(254, 215, 170, 0.2)');
      bgGrad.addColorStop(0.7, 'rgba(241, 245, 249, 0.6)');
      bgGrad.addColorStop(1, 'rgba(255, 255, 255, 0.98)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle mouse parallax
      const tiltX = (mousePos.normX - 0.5) * 28;
      const tiltY = (mousePos.normY - 0.5) * 16;

      // -------------------------------------------------------------
      // 2. UPPER PERSPECTIVE CEILING GRID & BEACONS
      // -------------------------------------------------------------
      const ceilingTop = 0;
      const horizonY = h * 0.40;

      ctx.save();
      // Ceiling longitudinal lines (perspective vanishing rays)
      const ceilingLines = 16;
      for (let i = 0; i <= ceilingLines; i++) {
        const xTop = (w / ceilingLines) * i + tiltX * 0.4;
        const xBottom = (w * 0.08) + ((w * 0.84) / ceilingLines) * i;

        ctx.strokeStyle = i % 2 === 0 ? 'rgba(249, 115, 22, 0.18)' : 'rgba(203, 213, 225, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xTop, ceilingTop);
        ctx.lineTo(xBottom, horizonY - 35);
        ctx.stroke();
      }

      // Ceiling horizontal crossbars
      for (let y = 12; y < horizonY - 35; y += 22) {
        const progress = y / (horizonY - 35);
        ctx.strokeStyle = `rgba(226, 232, 240, ${0.4 + progress * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Sky Beacon Nodes with Orange and Slate accents
      const beaconPoints = [
        { x: 0.16, y: 0.12, label: 'SAT-ALPHA', color: '#EA580C' },
        { x: 0.36, y: 0.08, label: 'RELAY-02', color: '#F97316' },
        { x: 0.58, y: 0.13, label: 'IONO-CORE', color: '#D97706' },
        { x: 0.84, y: 0.09, label: 'ORBIT-BETA', color: '#EA580C' },
      ];

      beaconPoints.forEach((bp, idx) => {
        const bx = bp.x * w + tiltX * 0.25;
        const by = bp.y * h;

        // Beacon central core
        ctx.fillStyle = bp.color;
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing outer halo
        const haloR = 7 + Math.sin(phase * 2.5 + idx) * 3;
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx, by, haloR, 0, Math.PI * 2);
        ctx.stroke();

        // Vertical projection ray to horizon
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx, horizonY - 10);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      ctx.restore();

      // -------------------------------------------------------------
      // 3. HORIZON CALIBRATION FRAME & FREQUENCY SCALE TICKS
      // -------------------------------------------------------------
      ctx.save();
      const horizonLineY = horizonY - 8;
      
      // Horizon main calibration bar
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.03, horizonLineY);
      ctx.lineTo(w * 0.97, horizonLineY);
      ctx.stroke();

      // Calibration ticks & division marks
      const totalTicks = 48;
      const freqLabels = ['1.0 GHz', '2.4 GHz', '3.6 GHz', '5.0 GHz', '5.8 GHz', '6.5 GHz'];
      for (let i = 0; i <= totalTicks; i++) {
        const tx = w * 0.03 + (w * 0.94 / totalTicks) * i;
        const isMajor = i % 8 === 0;
        const isSemi = i % 4 === 0;
        const tickH = isMajor ? 10 : isSemi ? 6 : 3.5;
        
        ctx.strokeStyle = isMajor ? '#EA580C' : isSemi ? '#F97316' : 'rgba(203, 213, 225, 0.8)';
        ctx.lineWidth = isMajor ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(tx, horizonLineY);
        ctx.lineTo(tx, horizonLineY + tickH);
        ctx.stroke();

        // Major frequency label readouts on horizon bar
        if (isMajor && i / 8 < freqLabels.length) {
          const lbl = freqLabels[i / 8];
          ctx.fillStyle = '#EA580C';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(lbl, tx, horizonLineY - 6);
        }
      }

      // Horizon wireframe backdrop curtain
      const curtainCols = 36;
      for (let i = 0; i <= curtainCols; i++) {
        const cx = w * 0.03 + (w * 0.94 / curtainCols) * i;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(249, 115, 22, 0.1)' : 'rgba(226, 232, 240, 0.6)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx, horizonLineY);
        ctx.lineTo(cx, horizonLineY + h * 0.35);
        ctx.stroke();
      }

      for (let j = 0; j < 7; j++) {
        const cy = horizonLineY + j * 20;
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(w * 0.03, cy);
        ctx.lineTo(w * 0.97, cy);
        ctx.stroke();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 4. 3D TOPOGRAPHIC MOUNTAIN TERRAIN MESH (Dual Mountains)
      // -------------------------------------------------------------
      const numDepthRows = meshDensity === 'HYPER' ? 40 : meshDensity === 'DENSE' ? 28 : 20;
      const numCols = meshDensity === 'HYPER' ? 128 : meshDensity === 'DENSE' ? 84 : 54;

      const baseElevation = amplitudeMode === 'SURGE' ? 1.38 : amplitudeMode === 'ELEVATED' ? 1.08 : 0.82;

      // Function to calculate terrain height at given (u: 0..1, v: 0..1)
      const getTerrainHeight = (u: number, v: number) => {
        let hVal = 0;

        // Primary double peak formations
        peaks.forEach(pk => {
          const dist = Math.abs(u - pk.x);
          const sigma = pk.width;
          const peakVal = Math.exp(-((dist * dist) / (2 * sigma * sigma))) * pk.height;
          hVal += peakVal;
        });

        // Subtle harmonic undulating wave textures across spatial domain
        const wave1 = Math.sin(u * 15 + phase + v * 3.2) * 0.055;
        const wave2 = Math.cos(u * 26 - phase * 1.3 + v * 5.1) * 0.032;
        const wave3 = Math.sin(u * 7 + phase * 0.5) * 0.075;
        
        // Interactive click ripple pulses
        let rippleElevation = 0;
        ripples.forEach(r => {
          const rDist = Math.hypot(u * w - r.x, (horizonLineY + v * (h - horizonLineY)) - r.y);
          if (Math.abs(rDist - r.radius) < 30) {
            rippleElevation += Math.sin((rDist - r.radius) * 0.18) * (r.opacity * 0.09);
          }
        });

        // Mountain depth curve: peaks apex in mid-rear, gently smoothing forward
        const depthCurve = Math.sin(v * Math.PI * 0.82 + 0.18);

        return (hVal + wave1 + wave2 + wave3 + rippleElevation) * depthCurve * baseElevation;
      };

      // Array to store 3D projected coordinate mesh
      const gridPoints: { x: number; y: number; hRaw: number }[][] = [];

      for (let rIdx = 0; rIdx < numDepthRows; rIdx++) {
        const v = rIdx / (numDepthRows - 1); // 0 = horizon, 1 = foreground
        
        const depthFactor = Math.pow(v, 1.35);
        const yFloor = horizonLineY + depthFactor * (h * 0.50);

        // Perspective horizontal flare
        const rowWidth = w * (0.88 + depthFactor * 0.20);
        const rowStartX = (w - rowWidth) / 2 + tiltX * (1 - depthFactor) * 0.35;

        gridPoints[rIdx] = [];

        for (let cIdx = 0; cIdx < numCols; cIdx++) {
          const u = cIdx / (numCols - 1);
          const rawH = getTerrainHeight(u, v);

          const maxPeakPixels = h * 0.44;
          const pixelElevation = rawH * maxPeakPixels;

          const screenX = rowStartX + u * rowWidth;
          const screenY = yFloor - pixelElevation + tiltY * (1 - depthFactor) * 0.2;

          gridPoints[rIdx][cIdx] = { x: screenX, y: screenY, hRaw: rawH };
        }
      }

      // Render 3D Terrain Wireframe (Latitudinal Ribbons)
      for (let rIdx = 0; rIdx < numDepthRows; rIdx++) {
        const v = rIdx / (numDepthRows - 1);
        ctx.beginPath();

        for (let cIdx = 0; cIdx < numCols; cIdx++) {
          const pt = gridPoints[rIdx][cIdx];
          if (cIdx === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }

        const rowAlpha = 0.35 + (1 - v) * 0.55;
        ctx.strokeStyle = rIdx % 3 === 0
          ? `rgba(234, 88, 12, ${rowAlpha * 0.7})`
          : `rgba(249, 115, 22, ${rowAlpha * 0.45})`;
        ctx.lineWidth = rIdx === 0 ? 2 : 1;
        ctx.stroke();
      }

      // Render 3D Terrain Wireframe (Longitudinal Ribbons)
      const colStep = meshDensity === 'HYPER' ? 2 : 1;
      for (let cIdx = 0; cIdx < numCols; cIdx += colStep) {
        const u = cIdx / (numCols - 1);
        ctx.beginPath();

        for (let rIdx = 0; rIdx < numDepthRows; rIdx++) {
          const pt = gridPoints[rIdx][cIdx];
          if (rIdx === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }

        const isPeakCluster = peaks.some(pk => Math.abs(u - pk.x) < 0.08);
        ctx.strokeStyle = isPeakCluster
          ? 'rgba(234, 88, 12, 0.6)'
          : 'rgba(203, 213, 225, 0.5)';
        ctx.lineWidth = isPeakCluster ? 1.3 : 0.8;
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 5. LUMINOUS GLOWING CREST RIDGE (The Signature Neon Wave Line)
      // -------------------------------------------------------------
      ctx.save();
      const crestRowIndex = Math.floor(numDepthRows * 0.28);
      const crestPoints = gridPoints[crestRowIndex];

      if (crestPoints && crestPoints.length > 0) {
        // Pass 1: Luminous Orange Crest
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.85)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        crestPoints.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Pass 2: Bright amber highlight line
        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 2;
        ctx.beginPath();
        crestPoints.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Apex Crest Summit Indicators & High-Readability Callout Badges
        peaks.forEach((pk, pIdx) => {
          const apexColIdx = Math.round(pk.x * (numCols - 1));
          if (crestPoints[apexColIdx]) {
            const apexPt = crestPoints[apexColIdx];
            const isSelected = selectedPeakIndex === pIdx;

            // Summit Diamond
            ctx.fillStyle = isSelected ? '#EA580C' : '#F97316';
            ctx.beginPath();
            ctx.arc(apexPt.x, apexPt.y, isSelected ? 6 : 4.5, 0, Math.PI * 2);
            ctx.fill();

            // Reticle circle
            ctx.strokeStyle = isSelected ? '#EA580C' : '#FB923C';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(apexPt.x, apexPt.y, (isSelected ? 14 : 10) + Math.sin(phase * 3 + pIdx) * 2, 0, Math.PI * 2);
            ctx.stroke();

            // High-Readability Apex Callout Box
            const badgeW = 120;
            const badgeH = 28;
            const badgeX = apexPt.x - badgeW / 2;
            const badgeY = apexPt.y - 42;

            // Light Plate Background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
            ctx.strokeStyle = isSelected ? '#EA580C' : '#CBD5E1';
            ctx.lineWidth = 1.4;
            ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

            // Frequency Text
            ctx.fillStyle = '#EA580C';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(pk.frequency, apexPt.x, badgeY + 12);

            // Carrier / Threat Tag
            ctx.fillStyle = '#475569';
            ctx.font = 'bold 8px monospace';
            ctx.fillText(`${pk.id} // THREAT: ${pk.threatLevel}%`, apexPt.x, badgeY + 23);

            // Connecting leader tick line
            ctx.strokeStyle = isSelected ? '#EA580C' : '#CBD5E1';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(apexPt.x, badgeY + badgeH);
            ctx.lineTo(apexPt.x, apexPt.y - 12);
            ctx.stroke();
          }
        });
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 6. FOREGROUND 3D FLOOR GRID & BINARY DATA REGISTERS
      // -------------------------------------------------------------
      ctx.save();
      const floorStartRow = Math.floor(numDepthRows * 0.72);
      const floorTopY = gridPoints[floorStartRow]?.[0]?.y || h * 0.74;

      // Floor horizontal bounding lines
      for (let y = floorTopY; y < h; y += 22) {
        const floorFrac = (y - floorTopY) / (h - floorTopY);
        ctx.strokeStyle = `rgba(226, 232, 240, ${0.4 + floorFrac * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Floor dividing separator line
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(w * 0.02, h * 0.865);
      ctx.lineTo(w * 0.98, h * 0.865);
      ctx.stroke();

      // Floor longitudinal grid perspective lines
      const floorCols = 18;
      for (let i = 0; i <= floorCols; i++) {
        const fxTop = (w * 0.06) + ((w * 0.88) / floorCols) * i;
        const fxBottom = (w / floorCols) * i;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(249, 115, 22, 0.15)' : 'rgba(226, 232, 240, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fxTop, floorTopY);
        ctx.lineTo(fxBottom, h);
        ctx.stroke();
      }

      // Memory Register Dump / Binary Data Plates (Light Mode)
      const binaryBlockW = w * 0.44;
      const binaryBlockH = h * 0.115;
      const binaryBlockY = h * 0.875;

      // Left Binary Block
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(w * 0.03, binaryBlockY, binaryBlockW, binaryBlockH);
      ctx.fillRect(w * 0.03, binaryBlockY, binaryBlockW, binaryBlockH);

      ctx.fillStyle = '#EA580C';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('BIN 0 1 10-01 10 // VECTOR NEXUS', w * 0.045, binaryBlockY + 15);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 8.5px monospace';
      const binHex = [
        '0x7FA0: 1100 1010 0111 0001 // QAM-1024',
        '0x7FA4: 0010 1101 1110 1000 // HARMONIC LOCK'
      ];
      binHex.forEach((bh, bi) => {
        ctx.fillText(bh, w * 0.045, binaryBlockY + 28 + bi * 12);
      });

      // Right Binary / Telemetry Status Block
      const rightBlockX = w * 0.53;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(rightBlockX, binaryBlockY, binaryBlockW, binaryBlockH);
      ctx.fillRect(rightBlockX, binaryBlockY, binaryBlockW, binaryBlockH);

      ctx.fillStyle = '#EA580C';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`CARRIER: ${carrierFreq} GHz // PHASE: ${phaseAngle}°`, rightBlockX + 12, binaryBlockY + 15);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 8.5px monospace';
      ctx.fillText(`ENTROPY: ${entropy}%  |  DBM: ${signalDb} dBm  |  SYNC: ${correlationSync}%`, rightBlockX + 12, binaryBlockY + 28);
      
      ctx.fillStyle = '#EA580C';
      ctx.fillText(`THREAT: CRITICAL HARMONIC [${activeHarmonic}] ISOLATED`, rightBlockX + 12, binaryBlockY + 40);

      ctx.restore();

      // -------------------------------------------------------------
      // 7. INTERACTIVE MOUSE CROSSHAIR & REAL-TIME PROBE RETICLE
      // -------------------------------------------------------------
      if (isHovering) {
        ctx.save();
        ctx.strokeStyle = '#EA580C';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        // Crosshair lines
        ctx.beginPath();
        ctx.moveTo(mousePos.x, 0);
        ctx.lineTo(mousePos.x, h);
        ctx.moveTo(0, mousePos.y);
        ctx.lineTo(w, mousePos.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Reticle box
        ctx.strokeStyle = '#EA580C';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(mousePos.x - 12, mousePos.y - 12, 24, 24);
        ctx.fillStyle = '#EA580C';
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Coordinates tag
        const coordText = `F: ${(1.8 + mousePos.normX * 4.4).toFixed(2)} GHz // A: ${(100 - mousePos.normY * 100).toFixed(0)}%`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(mousePos.x + 14, mousePos.y - 18, 140, 20);
        ctx.strokeStyle = '#EA580C';
        ctx.lineWidth = 1;
        ctx.strokeRect(mousePos.x + 14, mousePos.y - 18, 140, 20);
        ctx.fillStyle = '#EA580C';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(coordText, mousePos.x + 20, mousePos.y - 4);
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 8. UPDATE RIPPLE PULSES
      // -------------------------------------------------------------
      setRipples(prevRipples =>
        prevRipples
          .map(r => ({
            ...r,
            radius: r.radius + 3.8,
            opacity: r.opacity - 0.016
          }))
          .filter(r => r.opacity > 0)
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeHarmonic, meshDensity, amplitudeMode, mousePos, isHovering, ripples, carrierFreq, entropy, signalDb, phaseAngle, correlationSync, selectedPeakIndex, scanSpeed]);

  // Handle Mouse Movement over 3D Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    setMousePos({
      x,
      y,
      normX: Math.max(0, Math.min(1, x / canvas.width)),
      normY: Math.max(0, Math.min(1, y / canvas.height))
    });
  };

  // Handle Click on 3D Terrain for Ripple Wave
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    setRipples(prev => [
      ...prev,
      { x, y, radius: 4, maxRadius: 200, opacity: 0.95 }
    ]);
  };

  return (
    <div
      id="breach-nexus-spectral-view"
      className="w-full h-full flex flex-col justify-between bg-white text-slate-800 font-mono select-none overflow-hidden p-2 lg:p-2.5 gap-2 relative rounded-2xl border border-slate-200 shadow-sm"
    >
      {/* Top Tactical Command Bar */}
      <div className="w-full flex flex-wrap justify-between items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0 gap-2 z-20">
        
        {/* Left Title & Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Radio size={16} className="text-orange-600 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          </div>
          <div>
            <div className="text-[12px] lg:text-[13px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2 leading-none">
              BREACH NEXUS // SPECTRAL TERRAIN
            </div>
            <div className="text-[8.5px] text-orange-600 tracking-wider mt-0.5 font-bold">
              3D TOPOGRAPHIC HARMONIC WIREFRAME MESH
            </div>
          </div>
        </div>

        {/* Center Harmonic Presets (Alpha, Beta, Gamma, Delta) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
          {(['ALPHA', 'BETA', 'GAMMA', 'DELTA'] as const).map(h => (
            <button
              key={h}
              onClick={() => {
                setActiveHarmonic(h);
                if (h === 'ALPHA') setCarrierFreq(2.412);
                if (h === 'BETA') setCarrierFreq(5.180);
                if (h === 'GAMMA') setCarrierFreq(3.650);
                if (h === 'DELTA') setCarrierFreq(5.825);
              }}
              className={cn(
                "px-2.5 py-1 text-[9px] font-black rounded tracking-wider uppercase transition-all cursor-pointer",
                activeHarmonic === h
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
              )}
            >
              {h}
            </button>
          ))}
        </div>

        {/* Right Controls: Amplitude, Density, Scan Speed, Play/Pause */}
        <div className="flex items-center gap-1.5">
          {/* Amplitude Toggle */}
          <button
            onClick={() => setAmplitudeMode(a => (a === 'BALANCED' ? 'ELEVATED' : a === 'ELEVATED' ? 'SURGE' : 'BALANCED'))}
            className="px-2.5 py-1 text-[9px] font-bold rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
            title="Cycle Amplitude Scale"
          >
            <TrendingUp size={12} className="text-orange-600" />
            <span>{amplitudeMode}</span>
          </button>

          {/* Density Toggle */}
          <button
            onClick={() => setMeshDensity(d => (d === 'DENSE' ? 'HYPER' : d === 'HYPER' ? 'CONTOUR' : 'DENSE'))}
            className="px-2.5 py-1 text-[9px] font-bold rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
            title="Cycle Wireframe Mesh Density"
          >
            <Layers size={12} className="text-orange-600" />
            <span>{meshDensity}</span>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 text-[9px] font-black rounded bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'LIVE' : 'FREEZE'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Spectral Terrain Canvas */}
      <div className="relative flex-1 min-h-[360px] lg:min-h-[420px] w-full rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
        
        {/* HUD Corner Reticles in Orange */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500 pointer-events-none z-10" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-500 pointer-events-none z-10" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500 pointer-events-none z-10" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500 pointer-events-none z-10" />

        {/* Live Topographic Wireframe HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={1080}
          height={680}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleCanvasClick}
          className="w-full h-full object-cover cursor-crosshair"
        />

        {/* Top-Right Telemetry Badges */}
        <div className="absolute top-3 right-4 flex items-center gap-2 pointer-events-none z-10">
          <div className="px-2.5 py-1 rounded-md bg-white/95 border border-slate-200 text-[9px] text-slate-700 font-mono shadow-sm">
            CARRIER: <strong className="text-orange-600">{carrierFreq} GHz</strong>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-white/95 border border-slate-200 text-[9px] text-slate-700 font-mono shadow-sm">
            SIGNAL: <strong className="text-orange-600">{signalDb} dBm</strong>
          </div>
        </div>

        {/* Top-Left Peak Selection Badges */}
        <div className="absolute top-3 left-4 flex gap-1.5 z-10">
          {peaks.map((pk, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPeakIndex(idx);
                setCarrierFreq(parseFloat(pk.frequency));
              }}
              className={cn(
                "px-2.5 py-1 rounded-md text-[8.5px] font-bold border transition-all text-left flex items-center gap-1.5 shadow-sm cursor-pointer",
                selectedPeakIndex === idx
                  ? "bg-orange-50 border-orange-300 text-orange-700"
                  : "bg-white/95 border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full",
                selectedPeakIndex === idx ? "bg-orange-600 animate-pulse" : "bg-slate-300"
              )} />
              <span>{pk.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-1.5 lg:gap-2 shrink-0 z-20">
        
        {/* Sector 1: Frequency & Carrier Details */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[8.5px] text-slate-600 font-bold">
            <span className="flex items-center gap-1">
              <Activity size={11} className="text-orange-600" />
              FREQ SPECTRUM
            </span>
            <span className="text-orange-700 px-1.5 py-0.5 rounded bg-orange-100 text-[7.5px] font-black">ACTIVE</span>
          </div>
          <div className="text-[14px] font-black text-slate-900 mt-0.5">
            {carrierFreq} <span className="text-[9.5px] text-orange-600">GHz</span>
          </div>
          <div className="text-[8.5px] text-slate-500 truncate font-bold">
            BW: {peaks[selectedPeakIndex].bandwidth} // {peaks[selectedPeakIndex].modulation}
          </div>
        </div>

        {/* Sector 2: Entropy & Signal Stability */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[8.5px] text-slate-600 font-bold">
            <span className="flex items-center gap-1">
              <Zap size={11} className="text-orange-600" />
              SIGNAL ENTROPY
            </span>
            <span className="text-orange-700 px-1.5 py-0.5 rounded bg-orange-100 text-[7.5px] font-black">LOCKED</span>
          </div>
          <div className="text-[14px] font-black text-orange-600 mt-0.5">
            {entropy}% <span className="text-[9.5px] text-slate-600">STABLE</span>
          </div>
          <div className="text-[8.5px] text-slate-500 truncate font-bold">
            PHASE ANGLE: {phaseAngle}° // SYNC {correlationSync}%
          </div>
        </div>

        {/* Sector 3: Exfiltration Bandwidth */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[8.5px] text-slate-600 font-bold">
            <span className="flex items-center gap-1">
              <TrendingUp size={11} className="text-orange-600" />
              EXFIL BANDWIDTH
            </span>
            <span className="text-orange-700 px-1.5 py-0.5 rounded bg-orange-100 text-[7.5px] font-black">TCP/UDP</span>
          </div>
          <div className="text-[14px] font-black text-slate-900 mt-0.5">
            3.48 <span className="text-[9.5px] text-orange-600">GB/s</span>
          </div>
          <div className="text-[8.5px] text-slate-500 truncate font-bold">
            SIGNAL: {signalDb} dBm // 99.4%
          </div>
        </div>

        {/* Sector 4: Active Threat Signature */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[8.5px] text-slate-600 font-bold">
            <span className="flex items-center gap-1">
              <ShieldAlert size={11} className="text-orange-600" />
              CORRELATION ID
            </span>
            <span className="text-orange-700 px-1.5 py-0.5 rounded bg-orange-100 text-[7.5px] font-black">ZERO-DAY</span>
          </div>
          <div className="text-[14px] font-black text-slate-900 mt-0.5 truncate">
            {peaks[selectedPeakIndex].name.split(' // ')[0]}
          </div>
          <div className="text-[8.5px] text-slate-500 truncate font-bold">
            {peaks[selectedPeakIndex].carrier}
          </div>
        </div>

      </div>
    </div>
  );
}
