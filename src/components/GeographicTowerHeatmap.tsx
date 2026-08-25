import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TowerControl,
  Radio,
  Maximize2,
  Minimize2,
  Zap,
  ShieldAlert,
  Wifi,
  Activity,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import indiaMapBg from '../assets/images/india_radar_map_1787304482851.jpg';

export interface TowerCluster {
  id: string;
  name: string;
  subLocation: string;
  xPercent: number;
  yPercent: number;
  simCount: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  themeColor: 'red' | 'orange' | 'amber';
  hasAccentGauge?: boolean;
  cellId: string;
  tacSector: string;
  signalDbm: number;
  recentBursts: string;
  carrierBand: string;
  interceptedPackets: number;
}

const TOWER_CLUSTERS: TowerCluster[] = [
  {
    id: 'narela',
    name: 'Narela',
    subLocation: 'North Delhi Industrial Area (Sector 04)',
    xPercent: 28.5,
    yPercent: 23.5,
    simCount: 18,
    riskLevel: 'Critical',
    themeColor: 'red',
    cellId: '27831',
    tacSector: 'Sector 03 / LAC 4108',
    signalDbm: -64,
    recentBursts: '240 SMS/min SMS-C Phishing Gateway Array',
    carrierBand: '4G LTE Band 3 (1800 MHz)',
    interceptedPackets: 1420
  },
  {
    id: 'wazirabad',
    name: 'Wazirabad',
    subLocation: 'North-East Yamuna Crossing Grid',
    xPercent: 71.5,
    yPercent: 23.5,
    simCount: 16,
    riskLevel: 'Critical',
    themeColor: 'red',
    cellId: '22910',
    tacSector: 'Sector 04 / LAC 4105',
    signalDbm: -67,
    recentBursts: 'Burner Relay Slave Cell Transceiver Pool',
    carrierBand: '4G LTE Band 8 (900 MHz)',
    interceptedPackets: 980
  },
  {
    id: 'cp',
    name: 'Connaught Place',
    subLocation: 'Central Delhi Core Financial Transit',
    xPercent: 50.0,
    yPercent: 47.0,
    simCount: 10,
    riskLevel: 'Medium',
    themeColor: 'amber',
    cellId: '10842',
    tacSector: 'Sector 01 / LAC 4102',
    signalDbm: -59,
    recentBursts: 'Micro-Mule UPI PIN Infiltration Proxy Hub',
    carrierBand: '5G NSA Band n78 (3500 MHz)',
    interceptedPackets: 2150
  },
  {
    id: 'pitampura',
    name: 'Pitampura',
    subLocation: 'Outer Ring Road Telecom Junction',
    xPercent: 18.0,
    yPercent: 55.5,
    simCount: 14,
    riskLevel: 'High',
    themeColor: 'red',
    cellId: '31904',
    tacSector: 'Sector 02 / LAC 4108',
    signalDbm: -68,
    recentBursts: '180 SMS/min Bank KYC Spoof Burst Node',
    carrierBand: '4G LTE Band 40 (2300 MHz)',
    interceptedPackets: 1120
  },
  {
    id: 'noida',
    name: 'Noida',
    subLocation: 'Sector 62 Tech & Cloud Data Hub',
    xPercent: 82.5,
    yPercent: 55.5,
    simCount: 22,
    riskLevel: 'Critical',
    themeColor: 'red',
    hasAccentGauge: true,
    cellId: '48201',
    tacSector: 'Sector 05 / LAC 4115',
    signalDbm: -61,
    recentBursts: 'High-Density 32-Channel SIM-Box Array',
    carrierBand: '4G LTE Band 3 (1800 MHz)',
    interceptedPackets: 3410
  },
  {
    id: 'gurgaon',
    name: 'Gurgaon',
    subLocation: 'Cyber Hub Phase II & Golf Course Corridor',
    xPercent: 42.0,
    yPercent: 78.0,
    simCount: 16,
    riskLevel: 'High',
    themeColor: 'red',
    cellId: '59124',
    tacSector: 'Sector 06 / LAC 4120',
    signalDbm: -66,
    recentBursts: 'Fake NetBanking APK Reverse Shell Intercept',
    carrierBand: '4G LTE Band 40 (2300 MHz)',
    interceptedPackets: 1890
  }
];

const NETWORK_LINKS: [string, string][] = [
  // Hub connections from Connaught Place
  ['cp', 'narela'],
  ['cp', 'wazirabad'],
  ['cp', 'noida'],
  ['cp', 'gurgaon'],
  ['cp', 'pitampura'],
  // Perimeter links
  ['narela', 'wazirabad'],
  ['wazirabad', 'noida'],
  ['noida', 'gurgaon'],
  ['gurgaon', 'pitampura'],
  ['pitampura', 'narela']
];

export const GeographicTowerHeatmap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedCluster, setSelectedCluster] = useState<TowerCluster | null>(TOWER_CLUSTERS[0]);
  const [hoveredCluster, setHoveredCluster] = useState<TowerCluster | null>(null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');
  const [showRFRings, setShowRFRings] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isolatedClusterId, setIsolatedClusterId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // High performance map road mesh and telemetry canvas
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

      tick += 0.018;

      // 1. Draw Underlying Roadway Network (NCR Geography Background)
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
      ctx.lineWidth = 1;

      const mainRoads = [
        // Ring Roads
        [[width * 0.35, height * 0.35], [width * 0.65, height * 0.38], [width * 0.68, height * 0.65], [width * 0.38, height * 0.65], [width * 0.35, height * 0.35]],
        [[width * 0.22, height * 0.22], [width * 0.76, height * 0.24], [width * 0.85, height * 0.72], [width * 0.28, height * 0.82], [width * 0.22, height * 0.22]],
        // Radials
        [[width * 0.50, height * 0.47], [width * 0.285, height * 0.235]],
        [[width * 0.50, height * 0.47], [width * 0.715, height * 0.235]],
        [[width * 0.50, height * 0.47], [width * 0.825, height * 0.555]],
        [[width * 0.50, height * 0.47], [width * 0.420, height * 0.780]],
        [[width * 0.50, height * 0.47], [width * 0.180, height * 0.555]],
        // Yamuna River Bend
        [[width * 0.66, height * 0.08], [width * 0.68, height * 0.28], [width * 0.64, height * 0.48], [width * 0.72, height * 0.68], [width * 0.79, height * 0.95]]
      ];

      mainRoads.forEach((path, idx) => {
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i][0], path[i][1]);
        }
        ctx.strokeStyle = idx === mainRoads.length - 1 ? 'rgba(249, 115, 22, 0.25)' : 'rgba(203, 213, 225, 0.5)';
        ctx.stroke();
      });

      // Micro road grid lines
      for (let r = 0; r < 24; r++) {
        const x1 = (r * 67 + 30) % width;
        const y1 = (r * 43 + 20) % height;
        const x2 = x1 + ((r % 2 === 0) ? 90 : -70);
        const y2 = y1 + ((r % 3 === 0) ? 100 : -60);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
        ctx.stroke();
      }

      // 2. Draw Network Interconnect Lines (Dashed Red/Orange Links with Floating Photons)
      NETWORK_LINKS.forEach(([idA, idB], linkIdx) => {
        const cA = TOWER_CLUSTERS.find(c => c.id === idA);
        const cB = TOWER_CLUSTERS.find(c => c.id === idB);
        if (!cA || !cB) return;

        const xA = (cA.xPercent / 100) * width;
        const yA = (cA.yPercent / 100) * height;
        const xB = (cB.xPercent / 100) * width;
        const yB = (cB.yPercent / 100) * height;

        const isCpLink = idA === 'cp' || idB === 'cp';
        const strokeColor = isCpLink ? 'rgba(245, 158, 11, 0.7)' : 'rgba(234, 88, 12, 0.75)';

        ctx.beginPath();
        ctx.moveTo(xA, yA);
        ctx.lineTo(xB, yB);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Telemetry Packet Data Flowing along Line
        const prog = (tick * 0.5 + linkIdx * 0.18) % 1;
        const px = xA + (xB - xA) * prog;
        const py = yA + (yB - yA) * prog;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isCpLink ? '#D97706' : '#EA580C';
        ctx.fill();
      });

      // 3. Draw Radar Concentric Circles & Spoke Grid around each Node matching Screenshot
      if (showRFRings) {
        TOWER_CLUSTERS.forEach(cluster => {
          const cx = (cluster.xPercent / 100) * width;
          const cy = (cluster.yPercent / 100) * height;
          const isAmber = cluster.themeColor === 'amber';
          const baseColor = isAmber ? '245, 158, 11' : '234, 88, 12';

          const pulse = Math.sin(tick * 2.5 + cluster.xPercent) * 3;

          // Radial Concentric Rings
          const ringRadii = [28, 48, 70, 92];
          ringRadii.forEach((r, idx) => {
            const rad = r + pulse * (idx + 1) * 0.4;
            ctx.beginPath();
            ctx.arc(cx, cy, rad, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${baseColor}, ${0.25 - idx * 0.045})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          });

          // Radial Grid Spoke Crosshairs (8 cardinal spokes)
          for (let a = 0; a < 8; a++) {
            const angle = (a * Math.PI) / 4 + tick * 0.05 * (isAmber ? 1 : -1);
            const innerR = 18;
            const outerR = 92 + pulse;
            const sx1 = cx + Math.cos(angle) * innerR;
            const sy1 = cy + Math.sin(angle) * innerR;
            const sx2 = cx + Math.cos(angle) * outerR;
            const sy2 = cy + Math.sin(angle) * outerR;

            ctx.beginPath();
            ctx.moveTo(sx1, sy1);
            ctx.lineTo(sx2, sy2);
            ctx.strokeStyle = `rgba(${baseColor}, 0.12)`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }

          // Subtle central radial thermal fill
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 75);
          grad.addColorStop(0, `rgba(${baseColor}, 0.16)`);
          grad.addColorStop(0.5, `rgba(${baseColor}, 0.05)`);
          grad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.beginPath();
          ctx.arc(cx, cy, 75, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });
      }

      ctx.restore();
      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [showRFRings]);

  const filteredClusters = TOWER_CLUSTERS.filter(c => {
    if (filterMode === 'ALL') return true;
    if (filterMode === 'CRITICAL') return c.riskLevel === 'Critical';
    if (filterMode === 'HIGH') return c.riskLevel === 'High';
    return true;
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[580px] rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col select-none font-sans shadow-sm",
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : ""
      )}
    >
      {/* Background Ambience & City Grid Watermarks */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      {/* Atmospheric Geodetic Region Label Watermarks */}
      <div className="absolute top-[32%] right-[10%] text-slate-300/40 text-4xl font-black font-mono tracking-[0.3em] pointer-events-none select-none">
        NOIDA
      </div>
      <div className="absolute top-[16%] right-[14%] text-slate-300/40 text-3xl font-black font-mono tracking-[0.3em] pointer-events-none select-none">
        DELHI
      </div>
      <div className="absolute bottom-[6%] left-[40%] text-slate-300/40 text-4xl font-black font-mono tracking-[0.3em] pointer-events-none select-none">
        GURGAON
      </div>

      {/* =========================================================================
          TOP HEADER BAR
         ========================================================================= */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        {/* Left: GEOGRAPHIC HEATMAP (Towers) & Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-[13px] sm:text-[14px] font-mono font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <span>GEOGRAPHIC HEATMAP</span>
            <span className="text-slate-400 font-normal normal-case">(Towers)</span>
          </h2>

          {/* Active Cell Clusters Pill Badge */}
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[9.5px] font-mono font-bold text-orange-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>6 ACTIVE CELL CLUSTERS</span>
          </div>
        </div>

        {/* Right: Filter Buttons & Control Icons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {(['ALL', 'CRITICAL', 'HIGH'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterMode(tab)}
                className={cn(
                  "px-3 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase transition-all tracking-wider cursor-pointer",
                  filterMode === tab
                    ? "bg-white text-orange-600 border border-orange-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* RF Rings Button */}
          <button
            onClick={() => setShowRFRings(!showRFRings)}
            className={cn(
              "px-3 py-1 rounded-lg border text-[9.5px] font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer",
              showRFRings
                ? "bg-orange-50 border-orange-200 text-orange-700 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
            )}
          >
            <Radio size={11} className={showRFRings ? "animate-pulse" : ""} />
            <span>RF RINGS</span>
          </button>

          {/* Fullscreen Expand Icon */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN MAP CANVAS & CELL NODES
         ========================================================================= */}
      <div 
        className="relative flex-1 w-full h-full min-h-0 overflow-hidden"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height
          });
        }}
      >
        {/* Topography Map Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <motion.div
            className="relative w-full h-full"
            animate={{
              scale: [1, 1.018, 1],
              opacity: [0.15, 0.2, 0.15]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              transform: `translate(${(mousePos.x - 0.5) * -12}px, ${(mousePos.y - 0.5) * -10}px)`
            }}
          >
            <img
              src={indiaMapBg}
              alt="National Topographic Radar Map"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter grayscale contrast-125"
            />
          </motion.div>
        </div>

        {/* Dynamic Canvas with Roadways, Constellation Web & Radar Waves */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* DOM Layer for Node Towers */}
        {filteredClusters.map(cluster => {
          const isSelected = selectedCluster?.id === cluster.id;
          const isHovered = hoveredCluster?.id === cluster.id;
          const isAmber = cluster.themeColor === 'amber';

          return (
            <div
              key={cluster.id}
              style={{
                position: 'absolute',
                left: `${cluster.xPercent}%`,
                top: `${cluster.yPercent}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 35 : isHovered ? 30 : 25
              }}
              onClick={() => setSelectedCluster(cluster)}
              onMouseEnter={() => setHoveredCluster(cluster)}
              onMouseLeave={() => setHoveredCluster(null)}
              className="group cursor-pointer flex flex-col items-center select-none"
            >
              {/* Location Label Above Icon */}
              <div
                className={cn(
                  "mb-1.5 px-2 py-0.5 rounded text-[11.5px] sm:text-[12.5px] font-mono font-bold tracking-tight transition-all",
                  isAmber ? "text-amber-700 font-extrabold" : "text-slate-800",
                  isSelected ? "scale-110 text-orange-600" : "group-hover:scale-105"
                )}
              >
                {cluster.name}
              </div>

              {/* Central Glowing Icon Sphere */}
              <div className="relative flex items-center justify-center">
                {/* Special Accent Gauge Ring for Noida */}
                {cluster.hasAccentGauge && (
                  <svg className="absolute -inset-4 w-[60px] h-[60px] pointer-events-none animate-spin-slow">
                    <circle
                      cx="30"
                      cy="30"
                      r="24"
                      fill="none"
                      stroke="#EA580C"
                      strokeWidth="3"
                      strokeDasharray="100 60"
                      strokeLinecap="round"
                      className="opacity-90"
                    />
                  </svg>
                )}

                {/* Outer Glow Halo */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md border",
                    isAmber
                      ? "bg-amber-100 border-amber-300 text-amber-600"
                      : "bg-orange-100 border-orange-300 text-orange-600",
                    isSelected ? "scale-125 ring-2 ring-orange-500 ring-offset-2 ring-offset-white" : "group-hover:scale-110"
                  )}
                >
                  {/* Central Tower Icon */}
                  <TowerControl size={16} className={isAmber ? "text-amber-700" : "text-orange-600"} />
                </div>
              </div>

              {/* SIM Count Pill Badge Below Icon */}
              <div
                className={cn(
                  "mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider border shadow-sm transition-all",
                  isAmber
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-orange-50 border-orange-200 text-orange-700",
                  isSelected ? "scale-110 bg-orange-600 text-white border-orange-600" : ""
                )}
              >
                {cluster.simCount} SIMs
              </div>
            </div>
          );
        })}

        {/* Selected Cluster Deep-Dive Intel HUD Drawer */}
        <AnimatePresence>
          {selectedCluster && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="absolute top-4 right-4 z-40 w-[280px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-3.5 shadow-lg flex flex-col gap-2 font-mono"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded bg-orange-50 text-orange-600 border border-orange-200">
                    <TowerControl size={13} />
                  </span>
                  <div>
                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                      {selectedCluster.name} Node
                    </h3>
                    <span className="text-[7.5px] text-slate-400 uppercase">
                      ID: {selectedCluster.cellId} ({selectedCluster.tacSector})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Threat Matrix */}
              <div className="grid grid-cols-2 gap-1.5 text-[7.5px]">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">BURST DETECTED</span>
                  <span className="text-orange-600 font-bold text-[9px]">{selectedCluster.simCount} Active Burners</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">SIGNAL RF</span>
                  <span className="text-amber-600 font-bold text-[9px]">{selectedCluster.signalDbm} dBm</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[7.5px] text-slate-600">
                <span className="text-slate-400 block text-[6.5px] uppercase mb-0.5">TELECOM PAYLOAD BURST</span>
                {selectedCluster.recentBursts}
              </div>

              <button
                onClick={() => {
                  setIsolatedClusterId(selectedCluster.id);
                  setTimeout(() => setIsolatedClusterId(null), 3000);
                }}
                className={cn(
                  "w-full py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer",
                  isolatedClusterId === selectedCluster.id
                    ? "bg-emerald-600 text-white border border-emerald-500"
                    : "bg-orange-600 hover:bg-orange-700 text-white border border-orange-500"
                )}
              >
                <Zap size={10} />
                <span>{isolatedClusterId === selectedCluster.id ? '✓ ANTENNA SECTOR QUARANTINED' : 'ISOLATE SECTOR ANTENNA'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            BOTTOM LEFT WIDGET: SIM DENSITY
           ========================================================================= */}
        <div className="absolute bottom-5 left-5 z-30 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl px-4 py-3 shadow-md flex flex-col gap-2 w-64">
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-800">
            SIM DENSITY
          </span>

          <div className="flex items-center justify-between gap-3 text-[9.5px] font-mono font-bold text-slate-500">
            <span>Low</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden p-[1px] bg-slate-100 border border-slate-200">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'linear-gradient(to right, #FED7AA 0%, #FB923C 35%, #F97316 65%, #EA580C 100%)'
                }}
              />
            </div>
            <span>High</span>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM RIGHT WIDGET: CLUSTER RISK DISTRIBUTION
           ========================================================================= */}
        <div className="absolute bottom-5 right-5 z-30 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3.5 shadow-md flex flex-col gap-2.5 w-[310px] font-mono">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
            CLUSTER RISK DISTRIBUTION
          </span>

          <div className="flex items-center justify-between gap-4">
            {/* Donut Chart with "6 TOTAL" */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                {/* Critical Slice (50% = 44 dash on 88 circ) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="4.5"
                  strokeDasharray="44 88"
                  strokeDashoffset="0"
                  className="transition-all hover:stroke-orange-500 cursor-pointer"
                />
                {/* High Slice (33% = 29 dash) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="4.5"
                  strokeDasharray="29 88"
                  strokeDashoffset="-44"
                  className="transition-all hover:stroke-orange-400 cursor-pointer"
                />
                {/* Medium Slice (17% = 15 dash) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="4.5"
                  strokeDasharray="15 88"
                  strokeDashoffset="-73"
                  className="transition-all hover:stroke-amber-400 cursor-pointer"
                />
              </svg>

              {/* Donut Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-slate-800 leading-none">6</span>
                <span className="text-[7.5px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">TOTAL</span>
              </div>
            </div>

            {/* Breakdown Legend Table */}
            <div className="flex-1 flex flex-col gap-1 text-[9px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                  <span className="text-slate-600">Critical</span>
                </div>
                <span className="text-slate-800 font-bold">3 (50%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                  <span className="text-slate-600">High</span>
                </div>
                <span className="text-slate-800 font-bold">2 (33%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                  <span className="text-slate-600">Medium</span>
                </div>
                <span className="text-slate-800 font-bold">1 (17%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Low</span>
                </div>
                <span className="text-slate-800 font-bold">0 (0%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
