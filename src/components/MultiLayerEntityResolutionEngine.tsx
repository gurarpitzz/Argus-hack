import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Link2,
  Activity,
  Globe,
  CheckCircle2,
  Zap,
  Radio,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Play,
  Pause,
  Sliders,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Database,
  ArrowRight,
  Scan,
  Smartphone,
  CreditCard,
  Network
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface ResolutionLayer {
  id: string;
  name: string;
  badge?: string;
  colorHex: string;
  borderColor: string;
  glowColor: string;
  bgGrad: string;
  icon: 'clock' | 'link' | 'pulse' | 'globe';
  items: string[];
  metrics: {
    latency: string;
    efficiency: string;
    processed: string;
    activeRule: string;
  };
  sampleEvent: string;
}

const LAYERS: ResolutionLayer[] = [
  {
    id: 'layer-standardization',
    name: 'STANDARDIZATION',
    colorHex: '#FF3B30',
    borderColor: 'rgba(255, 59, 48, 0.7)',
    glowColor: 'rgba(255, 59, 48, 0.35)',
    bgGrad: 'linear-gradient(180deg, rgba(255, 59, 48, 0.16) 0%, rgba(20, 5, 8, 0.85) 100%)',
    icon: 'clock',
    items: [
      'Timestamp Sync',
      'Format Normalization',
      'Deduplication'
    ],
    metrics: {
      latency: '0.12 ms',
      efficiency: '99.98%',
      processed: '42.8k/s',
      activeRule: 'ISO-8601 UTC & E.164 MSISDN Sanitization'
    },
    sampleEvent: 'Unified UTC skew: -12ms across 16 Jamtara burner transceivers'
  },
  {
    id: 'layer-linking',
    name: 'ENTITY LINKING',
    badge: '🔗',
    colorHex: '#FF8A00',
    borderColor: 'rgba(255, 138, 0, 0.7)',
    glowColor: 'rgba(255, 138, 0, 0.35)',
    bgGrad: 'linear-gradient(180deg, rgba(255, 138, 0, 0.16) 0%, rgba(25, 12, 4, 0.85) 100%)',
    icon: 'link',
    items: [
      'Identity Matching',
      'Fuzzy Resolution',
      'Alias Mapping'
    ],
    metrics: {
      latency: '0.24 ms',
      efficiency: '99.4%',
      processed: '38.2k/s',
      activeRule: 'Jaro-Winkler + Soundex Cross-Bank Graph Clustered'
    },
    sampleEvent: 'Matched Virtual VPA "mule_902@ybl" -> Real IMEI: 864902049102'
  },
  {
    id: 'layer-behavior',
    name: 'BEHAVIOR MODELING',
    colorHex: '#FBBF24',
    borderColor: 'rgba(251, 191, 36, 0.7)',
    glowColor: 'rgba(251, 191, 36, 0.35)',
    bgGrad: 'linear-gradient(180deg, rgba(251, 191, 36, 0.16) 0%, rgba(24, 18, 5, 0.85) 100%)',
    icon: 'pulse',
    items: [
      'Pattern Extraction',
      'Anomaly Scoring',
      'Risk Profiling'
    ],
    metrics: {
      latency: '0.38 ms',
      efficiency: '98.9%',
      processed: '35.1k/s',
      activeRule: 'Neural LSTM OTP Exfiltration Velocity Detector'
    },
    sampleEvent: 'SMS verification code intercepted & consumed in < 140ms'
  },
  {
    id: 'layer-enrichment',
    name: 'CONTEXT ENRICHMENT',
    colorHex: '#00F0FF',
    borderColor: 'rgba(0, 240, 255, 0.7)',
    glowColor: 'rgba(0, 240, 255, 0.35)',
    bgGrad: 'linear-gradient(180deg, rgba(0, 240, 255, 0.16) 0%, rgba(3, 20, 28, 0.85) 100%)',
    icon: 'globe',
    items: [
      'Geo Mapping',
      'Network Context',
      'Device Intelligence'
    ],
    metrics: {
      latency: '0.45 ms',
      efficiency: '99.7%',
      processed: '31.4k/s',
      activeRule: 'Telecom Sector TAC 27831 / Cell Mast Triangulation'
    },
    sampleEvent: 'Tagged physical location: Narela Sector 04 Micro-Cell Mast'
  }
];

export const MultiLayerEntityResolutionEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedLayer, setSelectedLayer] = useState<ResolutionLayer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [confluenceScore, setConfluenceScore] = useState<number>(99.4);
  const [processedTotal, setProcessedTotal] = useState<number>(241850);
  const [activePayloadIndex, setActivePayloadIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STREAMS' | 'RULES'>('OVERVIEW');

  // Interactive Live simulation tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProcessedTotal(prev => prev + Math.floor(Math.random() * 18 + 12));
      setConfluenceScore(+(99.2 + Math.random() * 0.5).toFixed(1));
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // High-performance canvas for 3D perspective grid, raw fiber optic data streams & particle collisions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let tick = 0;

    const render = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);
      const width = rect.width;
      const height = rect.height;

      if (isPlaying) {
        tick += 0.022;
      }

      // =========================================================================
      // 1. Draw 3D Perspective Neon Wireframe Floor Grid
      // =========================================================================
      const horizonY = height * 0.72;
      const floorBottomY = height;
      const gridColor = 'rgba(0, 240, 255, 0.09)';
      const accentGridColor = 'rgba(255, 59, 48, 0.12)';

      ctx.lineWidth = 1;

      // Perspective Transverse Grid Lines
      const numTransverse = 9;
      for (let i = 0; i <= numTransverse; i++) {
        const progress = Math.pow(i / numTransverse, 1.8);
        const y = horizonY + (floorBottomY - horizonY) * progress;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = i % 2 === 0 ? accentGridColor : gridColor;
        ctx.stroke();
      }

      // Perspective Longitudinal Vanishing Lines
      const numLongitudinal = 18;
      const vanishX = width * 0.48;
      const vanishY = horizonY - 40;
      for (let i = 0; i <= numLongitudinal; i++) {
        const bottomX = (width / numLongitudinal) * i;
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(bottomX, floorBottomY);
        ctx.strokeStyle = i === 9 ? 'rgba(255, 59, 48, 0.25)' : gridColor;
        ctx.stroke();
      }

      // =========================================================================
      // 2. Draw Left Raw Fiber-Optic Ingestion Streams (Vibrant Splines)
      // =========================================================================
      const streamColors = [
        '#FF3B30', // Red (SMS-C Phishing)
        '#FF8A00', // Orange (SIM-Box Bursts)
        '#FBBF24', // Gold (Mule Banking)
        '#10B981', // Emerald (UPI PIN Exfiltration)
        '#00F0FF', // Cyan (Telecom Mast Sector)
        '#A855F7'  // Violet (APK Reverse Shell)
      ];

      const inletCenterX = width * 0.22;
      const inletCenterY = height * 0.44;

      // Draw Left Splines feeding into the Aperture Ring
      streamColors.forEach((color, idx) => {
        const startY = height * 0.20 + idx * (height * 0.46 / streamColors.length);
        const startX = 0;
        const waveOffset = Math.sin(tick * 1.8 + idx * 0.8) * 12;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(
          width * 0.08, startY + waveOffset,
          width * 0.14, inletCenterY + (idx - 2.5) * 6,
          inletCenterX, inletCenterY
        );

        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Animated energetic data photon particles on each spline
        for (let p = 0; p < 3; p++) {
          const prog = (tick * 0.6 + p * 0.33 + idx * 0.15) % 1;
          // Calculate cubic bezier point
          const t = prog;
          const cp1x = width * 0.08, cp1y = startY + waveOffset;
          const cp2x = width * 0.14, cp2y = inletCenterY + (idx - 2.5) * 6;
          const px = Math.pow(1 - t, 3) * startX +
            3 * Math.pow(1 - t, 2) * t * cp1x +
            3 * (1 - t) * Math.pow(t, 2) * cp2x +
            Math.pow(t, 3) * inletCenterX;
          const py = Math.pow(1 - t, 3) * startY +
            3 * Math.pow(1 - t, 2) * t * cp1y +
            3 * (1 - t) * Math.pow(t, 2) * cp2y +
            Math.pow(t, 3) * inletCenterY;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Left Intake Vortex Concentric Rings
      for (let r = 1; r <= 3; r++) {
        const ringRad = 20 * r + Math.sin(tick * 3) * 2;
        ctx.beginPath();
        ctx.ellipse(inletCenterX, inletCenterY, ringRad * 0.5, ringRad, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 59, 48, ${0.4 - r * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // =========================================================================
      // 3. Draw Central High-Energy Laser Spine passing through all Glass Panels
      // =========================================================================
      const outletCenterX = width * 0.86;
      const outletCenterY = height * 0.44;

      // Laser Core Beam (Red-Gold to Cyan Gradient)
      const laserGrad = ctx.createLinearGradient(inletCenterX, inletCenterY, outletCenterX, outletCenterY);
      laserGrad.addColorStop(0, '#FF3B30');
      laserGrad.addColorStop(0.35, '#FF8A00');
      laserGrad.addColorStop(0.65, '#FBBF24');
      laserGrad.addColorStop(1, '#00F0FF');

      ctx.beginPath();
      ctx.moveTo(inletCenterX, inletCenterY);
      ctx.lineTo(outletCenterX, outletCenterY);
      ctx.strokeStyle = laserGrad;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#FF8A00';
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner White Hot Filament
      ctx.beginPath();
      ctx.moveTo(inletCenterX, inletCenterY);
      ctx.lineTo(outletCenterX, outletCenterY);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // High-speed Laser Particle Bursts
      for (let bp = 0; bp < 12; bp++) {
        const prog = (tick * 1.2 + bp * 0.083) % 1;
        const bx = inletCenterX + (outletCenterX - inletCenterX) * prog;
        const by = inletCenterY + (outletCenterY - inletCenterY) * prog;

        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // =========================================================================
      // 4. Draw Right Convergence Aperture (UNIFIED ENTITY VIEW Target Portal)
      // =========================================================================
      for (let r = 1; r <= 4; r++) {
        const ringRad = 22 * r + Math.sin(tick * 3 + r) * 2;
        ctx.beginPath();
        ctx.ellipse(outletCenterX, outletCenterY, ringRad * 0.45, ringRad, 0, 0, Math.PI * 2);
        ctx.strokeStyle = r === 1 ? '#00F0FF' : `rgba(0, 240, 255, ${0.45 - r * 0.1})`;
        ctx.lineWidth = r === 1 ? 2.5 : 1;
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = r === 1 ? 12 : 0;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Exit Beams dispersing outward into 360° Intelligence
      for (let eb = 0; eb < 6; eb++) {
        const angle = (eb * Math.PI) / 3 + tick * 0.2;
        const outX = outletCenterX + Math.cos(angle) * 35;
        const outY = outletCenterY + Math.sin(angle) * 35;
        ctx.beginPath();
        ctx.moveTo(outletCenterX, outletCenterY);
        ctx.lineTo(outX, outY);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[580px] rounded-2xl bg-[#06080F] border border-[#171D2A] overflow-hidden flex flex-col select-none font-sans shadow-[0_16px_48px_rgba(0,0,0,0.95)]",
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : ""
      )}
    >
      {/* Ambient Cyber Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/[0.05] via-transparent to-transparent pointer-events-none" />

      {/* =========================================================================
          TOP HEADER BAR MATCHING SCREENSHOT EXACTLY
         ========================================================================= */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.07] bg-[#05070D]/90 backdrop-blur-md">
        {/* Left: Engine Title & Subtitle */}
        <div className="flex flex-col">
          <h2 className="text-[14px] sm:text-[16px] font-mono font-black uppercase tracking-wider text-white flex items-center gap-2">
            <span>MULTI-LAYER ENTITY RESOLUTION ENGINE</span>
          </h2>
          <p className="text-[10px] sm:text-[11px] font-mono text-white/50 tracking-wide mt-0.5">
            Fusing heterogeneous data into unified intelligence
          </p>
        </div>

        {/* Right: ENGINE HEALTH & Interactive Controls */}
        <div className="flex items-center gap-3">
          {/* Engine Health Badge Matching Screenshot */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0C121E] border border-white/10 text-white/80 shadow-inner">
            <Activity size={12} className="text-white/40" />
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-white/60">
              ENGINE HEALTH
            </span>
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66] animate-pulse" />
              <span className="text-[9.5px] font-mono font-black uppercase text-[#00FF66] tracking-wider">
                OPTIMAL
              </span>
            </div>
          </div>

          {/* Pause / Play Flow Control */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause Stream Pipeline" : "Resume Stream Pipeline"}
            className={cn(
              "px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase flex items-center gap-1.5 transition-all",
              isPlaying
                ? "bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
            )}
          >
            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
            <span>{isPlaying ? 'STREAMING' : 'PAUSED'}</span>
          </button>

          {/* Fullscreen Expand */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/50 hover:text-white transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN 3D ISOMETRIC RESOLUTION ENGINE AREA
         ========================================================================= */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden flex items-center justify-center p-4">
        {/* Canvas Layer for Splines, 3D Grid, Photons & Concentric Portals */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* The 4 Translucent 3D Holographic Glass Slabs Container */}
        <div className="relative z-20 w-full max-w-6xl h-full flex items-center justify-between px-10 gap-3">
          
          {/* Left Spacer for Fiber Ingest Funnel */}
          <div className="w-[12%] shrink-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-red-400/80 mb-1">
              RAW HETEROGENEOUS INGEST
            </span>
            <div className="px-2 py-0.5 rounded bg-black/60 border border-red-500/30 text-[7px] font-mono text-white/60">
              6 Real-Time Feeds
            </div>
          </div>

          {/* Center 4 Glass Slabs */}
          <div className="flex-1 h-[340px] flex items-center justify-center gap-3.5 sm:gap-5">
            {LAYERS.map((layer, index) => {
              const isSelected = selectedLayer?.id === layer.id;

              return (
                <motion.div
                  key={layer.id}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLayer(layer)}
                  style={{
                    background: layer.bgGrad,
                    borderColor: layer.borderColor,
                    boxShadow: `0 0 25px ${layer.glowColor}, inset 0 0 15px ${layer.glowColor}`
                  }}
                  className={cn(
                    "relative flex-1 h-full max-w-[210px] rounded-2xl border backdrop-blur-md p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-300 group select-none",
                    isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-105" : ""
                  )}
                >
                  {/* Top Glass Plate Header & Icon Sphere */}
                  <div className="flex flex-col items-center text-center">
                    {/* Glowing Icon Circle */}
                    <div
                      style={{
                        borderColor: layer.colorHex,
                        boxShadow: `0 0 14px ${layer.glowColor}`
                      }}
                      className="w-10 h-10 rounded-full border-2 bg-black/40 flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                    >
                      {layer.icon === 'clock' && <Clock size={18} style={{ color: layer.colorHex }} />}
                      {layer.icon === 'link' && <Link2 size={18} style={{ color: layer.colorHex }} />}
                      {layer.icon === 'pulse' && <Activity size={18} style={{ color: layer.colorHex }} />}
                      {layer.icon === 'globe' && <Globe size={18} style={{ color: layer.colorHex }} />}
                    </div>

                    {/* Step Name Tag */}
                    <h3
                      style={{ color: layer.colorHex }}
                      className="text-[11px] sm:text-[12px] font-mono font-black uppercase tracking-wider drop-shadow-md mb-0.5"
                    >
                      {layer.name}
                    </h3>
                  </div>

                  {/* Glass Middle Particle Matrix Hologram (Subtle points) */}
                  <div className="my-auto py-2 flex flex-col gap-1.5">
                    {layer.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-left bg-black/30 px-2 py-1 rounded-md border border-white/5 transition-colors group-hover:border-white/20"
                      >
                        <span
                          style={{ backgroundColor: layer.colorHex }}
                          className="w-1 h-1 rounded-full shrink-0"
                        />
                        <span className="text-[9px] sm:text-[9.5px] font-mono font-semibold text-white/90 truncate">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Metric Pill */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[8px] font-mono">
                    <span className="text-white/40">LATENCY</span>
                    <span style={{ color: layer.colorHex }} className="font-bold">
                      {layer.metrics.latency}
                    </span>
                  </div>

                  {/* Interactive Inspect Tag */}
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 px-2 py-0.5 rounded text-[7.5px] font-mono text-white whitespace-nowrap shadow-md">
                    INSPECT FILTER ↗
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Right Output Target: UNIFIED ENTITY VIEW */}
          <div className="w-[14%] shrink-0 flex flex-col items-center justify-center text-center pl-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedLayer(null)}
              className="cursor-pointer flex flex-col items-center"
            >
              <h3 className="text-[12px] sm:text-[13px] font-mono font-black uppercase tracking-wider text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]">
                UNIFIED ENTITY VIEW
              </h3>
              <p className="text-[8.5px] sm:text-[9px] font-mono text-cyan-300/80 uppercase tracking-tight mt-1 leading-snug">
                360° Intelligence Profile Ready
              </p>

              <div className="mt-3 px-2.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-[8px] font-mono font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                <ShieldCheck size={10} />
                <span>ACTIVE DOSSIER</span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Selected Layer Modal / Deep Audit Drawer */}
        <AnimatePresence>
          {selectedLayer && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="absolute inset-x-6 top-8 bottom-8 z-40 bg-[#080B14]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-y-auto font-mono"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    style={{ borderColor: selectedLayer.colorHex }}
                    className="w-9 h-9 rounded-xl border-2 bg-black/60 flex items-center justify-center"
                  >
                    {selectedLayer.icon === 'clock' && <Clock size={16} style={{ color: selectedLayer.colorHex }} />}
                    {selectedLayer.icon === 'link' && <Link2 size={16} style={{ color: selectedLayer.colorHex }} />}
                    {selectedLayer.icon === 'pulse' && <Activity size={16} style={{ color: selectedLayer.colorHex }} />}
                    {selectedLayer.icon === 'globe' && <Globe size={16} style={{ color: selectedLayer.colorHex }} />}
                  </div>
                  <div>
                    <h3
                      style={{ color: selectedLayer.colorHex }}
                      className="text-[13px] font-black uppercase tracking-wider"
                    >
                      {selectedLayer.name} PIPELINE STAGE AUDIT
                    </h3>
                    <p className="text-[8px] text-white/40 uppercase">
                      RULE: {selectedLayer.metrics.activeRule}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLayer(null)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[9px] font-bold uppercase rounded-lg transition-colors"
                >
                  ✕ Close Audit
                </button>
              </div>

              {/* Drawer Body Grid */}
              <div className="my-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[9px]">
                <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                  <span className="text-white/40 uppercase text-[8px]">PROCESSING VELOCITY</span>
                  <div className="text-lg font-black text-white mt-1">{selectedLayer.metrics.processed}</div>
                  <span className="text-[7.5px] text-emerald-400">Throughput peak normal</span>
                </div>

                <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                  <span className="text-white/40 uppercase text-[8px]">PIPELINE EFFICIENCY</span>
                  <div
                    style={{ color: selectedLayer.colorHex }}
                    className="text-lg font-black mt-1"
                  >
                    {selectedLayer.metrics.efficiency}
                  </div>
                  <span className="text-[7.5px] text-white/50">Zero dropped packet anomalies</span>
                </div>

                <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                  <span className="text-white/40 uppercase text-[8px]">STAGE LATENCY</span>
                  <div className="text-lg font-black text-cyan-300 mt-1">{selectedLayer.metrics.latency}</div>
                  <span className="text-[7.5px] text-white/50">Hardware accelerated eBPF hook</span>
                </div>
              </div>

              {/* Sample Live Event Intercept */}
              <div className="bg-black/70 p-3 rounded-xl border border-white/10 text-[8.5px] mb-3">
                <span className="text-white/40 block uppercase text-[7.5px] mb-1">REAL-TIME TELEMETRY TRACE</span>
                <p className="text-white/90 leading-relaxed font-bold">
                  {selectedLayer.sampleEvent}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[8px] text-white/40">
                  TOTAL PROCESSED: {processedTotal.toLocaleString()} ENTITY SIGNALS
                </span>
                <button
                  onClick={() => alert(`Optimized JIT filter caches refreshed for ${selectedLayer.name}.`)}
                  className="px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[8.5px] font-bold uppercase transition-all"
                >
                  Flush & Re-Calibrate Filter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          BOTTOM FOOTER BAR: REAL-TIME ENTITY CONFLUENCE SCORE
         ========================================================================= */}
      <div className="relative z-30 px-6 py-3.5 border-t border-white/[0.07] bg-[#05070D]/95 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] shadow-[0_0_10px_#FF3B30] animate-pulse" />
          <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.2em] text-white/90">
            REAL-TIME ENTITY CONFLUENCE SCORE
          </span>
        </div>

        {/* Live Score & Telemetry Feed */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[8.5px] text-white/40 uppercase">CONFIDENCE:</span>
            <span className="text-base font-black text-[#00FF66] drop-shadow-[0_0_10px_rgba(0,255,102,0.4)]">
              {confluenceScore}%
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10">
            <span className="text-[8.5px] text-white/40 uppercase">INGESTED:</span>
            <span className="text-[11px] font-bold text-white">
              {processedTotal.toLocaleString()} evts
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10">
            <span className="text-[8.5px] text-white/40 uppercase">STATUS:</span>
            <span className="text-[10px] font-bold text-[#00F0FF]">
              360° SYNDICATE LOCKED
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
