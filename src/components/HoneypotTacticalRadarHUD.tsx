import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RefreshCw,
  Activity,
  Crosshair,
  Terminal,
  Globe as GlobeIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

// Target Interception Points on Radar
interface TargetBlip {
  id: string;
  code: string;
  name: string;
  type: 'BOTNET' | 'BURNER' | 'PHISHING' | 'MULE' | 'DECOY';
  angle: number; // in degrees
  distance: number; // 0 to 1 (fraction of radius)
  status: 'ACTIVE' | 'ISOLATED' | 'INTERCEPTED' | 'HONEYPOT_LOCK';
  threat: number; // 0-100
  ip: string;
  payload: string;
  lat: string;
  lng: string;
  lastPing: number;
}

const INITIAL_TARGETS: TargetBlip[] = [
  { id: 'T-1', code: 'A-21/45T', name: 'Jamtara OTP-Bypass Relay', type: 'BURNER', angle: 42, distance: 0.58, status: 'HONEYPOT_LOCK', threat: 94, ip: '103.241.11.89', payload: 'UPI_OVERLAY_INJECT', lat: '24.2185° N', lng: '86.7977° E', lastPing: Date.now() },
  { id: 'T-2', code: 'B-09/12K', name: 'Mewat SIM Bank Cluster', type: 'MULE', angle: 128, distance: 0.72, status: 'INTERCEPTED', threat: 88, ip: '182.76.19.40', payload: 'SMS_FORWARD_STEALTH', lat: '27.9912° N', lng: '77.0145° E', lastPing: Date.now() },
  { id: 'T-3', code: 'C-77/90X', name: 'Ghost APK Decompiler Node', type: 'BOTNET', angle: 215, distance: 0.44, status: 'ACTIVE', threat: 76, ip: '45.122.90.114', payload: 'MALWARE_C2_BEACON', lat: '12.9716° N', lng: '77.5946° E', lastPing: Date.now() },
  { id: 'T-4', code: 'D-34/88M', name: 'Virtual KYC Trap Decoy', type: 'DECOY', angle: 290, distance: 0.82, status: 'HONEYPOT_LOCK', threat: 32, ip: '192.168.4.199', payload: 'HONEYPOT_MULE_TRAP', lat: '19.0760° N', lng: '72.8777° E', lastPing: Date.now() },
  { id: 'T-5', code: 'E-55/19P', name: 'FastLoan Phantom Server', type: 'PHISHING', angle: 345, distance: 0.35, status: 'ISOLATED', threat: 85, ip: '104.28.19.4', payload: 'CONTACTS_EXFIL_STREAM', lat: '28.6139° N', lng: '77.2090° E', lastPing: Date.now() }
];

export const HoneypotTacticalRadarHUD: React.FC = () => {
  // Playback & System State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackTime, setPlaybackTime] = useState<number>(42); // in seconds
  const [sweepSpeed, setSweepSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [radarRotation, setRadarRotation] = useState<number>(0);
  const [selectedTarget, setSelectedTarget] = useState<TargetBlip>(INITIAL_TARGETS[0]);
  const [targets] = useState<TargetBlip[]>(INITIAL_TARGETS);
  
  // Tactical Mode
  const [tacticalMode, setTacticalMode] = useState<'STEADY' | 'HUNT' | 'DEFENSE' | 'OVERLOAD'>('STEADY');
  const [systemStatus, setSystemStatus] = useState<string>('SISTEM OK');
  
  // Radar & Globe Interactive States
  const [radarZoom, setRadarZoom] = useState<number>(1);
  const [globeRotation, setGlobeRotation] = useState<{ x: number; y: number }>({ x: 15, y: 35 });
  const [isDraggingGlobe, setIsDraggingGlobe] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeSector, setActiveSector] = useState<number>(1);

  // Equalizer dynamic spectrum values (8 bars)
  const [eqBars, setEqBars] = useState<number[]>([72, 95, 48, 88, 62, 79, 35, 91]);

  // Geometric Radar Spider Chart points (5 vertices: Entropy, Latency, Deception Depth, Stealth, Spoof Resilience)
  const [radarPolygon, setRadarPolygon] = useState<number[]>([85, 70, 92, 60, 78]);

  // Waveform canvas refs for the 4 sectors
  const sector1CanvasRef = useRef<HTMLCanvasElement>(null);
  const sector2CanvasRef = useRef<HTMLCanvasElement>(null);
  const sector3CanvasRef = useRef<HTMLCanvasElement>(null);
  const sector4CanvasRef = useRef<HTMLCanvasElement>(null);
  const miniGlobeCanvasRef = useRef<HTMLCanvasElement>(null);
  const globe3DCanvasRef = useRef<HTMLCanvasElement>(null);

  // Live system logs stream
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "[ARGUS_CYBER_SYS] Initializing Azimuthal Radar Array v4.8...",
    "[DECEPTION_LAYER] Honeypot Trap A-21/45T: 14 attacker probes lured into sandboxed VPA emulator.",
    "[RADAR_TELEMETRY] Polar grid aligned with 360° bearing sweep at 0.02ms latency.",
    "[VECTOR_SYNC] Jamtara & Mewat cyber hubs mapped. 4 burner transceivers locked.",
    "[STATUS_LOCK] Sector 1-4 Frequency spectrum steady. No spoofing intrusion detected."
  ]);

  // Radar sweep animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setRadarRotation(prev => (prev + delta * 45 * sweepSpeed) % 360);
        setGlobeRotation(prev => ({
          x: prev.x,
          y: (prev.y + delta * 12 * sweepSpeed) % 360
        }));
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, sweepSpeed]);

  // Playback timer & equalizer animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPlaybackTime(prev => (prev >= 3600 ? 0 : prev + 1));

      // Jitter equalizer bars hyperactively
      setEqBars([
        Math.floor(40 + Math.random() * 55),
        Math.floor(60 + Math.random() * 38),
        Math.floor(30 + Math.random() * 65),
        Math.floor(70 + Math.random() * 29),
        Math.floor(45 + Math.random() * 50),
        Math.floor(55 + Math.random() * 42),
        Math.floor(25 + Math.random() * 60),
        Math.floor(65 + Math.random() * 34),
      ]);

  // Modulate polygon spider chart slightly
      setRadarPolygon(prev =>
        prev.map(v => Math.min(100, Math.max(30, Math.round(v + (Math.random() - 0.5) * 8))))
      );

      // Random telemetry log feed additions
      if (Math.random() > 0.65) {
        const events = [
          `[INTERCEPT] Target ${selectedTarget.code}: Injected decoy OTP response payload. Attacker stalled 4.2s.`,
          `[SECTOR_${Math.floor(Math.random() * 4) + 1}] Carrier wave pulse synchronized. Jitter: 0.0012ms.`,
          `[GLOBE_ORBIT] LEO Satellite Telemetry Node #0${Math.floor(Math.random() * 9) + 1} confirmed zero packet loss.`,
          `[SYS_HEURISTIC] Digital Genome resolved 19 proxy hops for suspicious UPI transaction ID #UP88291.`,
          `[SPECTRAL_ANALYZER] Signal bandwidth 1.48 GHz normalized across identification sectors.`
        ];
        const newEvent = events[Math.floor(Math.random() * events.length)];
        setTelemetryLogs(prev => [newEvent, ...prev.slice(0, 5)]);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isPlaying, selectedTarget]);

  // Draw 4 Sector Oscilloscope Waveforms in Canvas
  useEffect(() => {
    let animId: number;
    let phase = 0;

    const drawSectorWave = (
      canvas: HTMLCanvasElement | null,
      type: 'carrier' | 'pulse' | 'jitter' | 'resonator',
      color: string,
      sectorNum: number
    ) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const isFocused = activeSector === sectorNum;

      // Draw dashed upper and lower threshold guidelines
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Top guideline
      ctx.beginPath();
      ctx.moveTo(0, h * 0.2);
      ctx.lineTo(w, h * 0.2);
      ctx.stroke();

      // Bottom guideline
      ctx.beginPath();
      ctx.moveTo(0, h * 0.8);
      ctx.lineTo(w, h * 0.8);
      ctx.stroke();

      // Center baseline
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.25)';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.5);
      ctx.stroke();

      ctx.setLineDash([]); // reset

      // Draw active waveform
      ctx.beginPath();
      ctx.lineWidth = isFocused ? 2.4 : 1.6;
      ctx.strokeStyle = isFocused ? '#EA580C' : color;
      ctx.shadowColor = isFocused ? '#EA580C' : 'rgba(249, 115, 22, 0.3)';
      ctx.shadowBlur = isFocused ? 6 : 2;

      const midY = h / 2;
      const amp = h * (isFocused ? 0.38 : 0.3);

      for (let x = 0; x < w; x++) {
        let y = midY;
        const normalizedX = x / w;

        if (type === 'carrier') {
          y =
            midY +
            Math.sin(normalizedX * Math.PI * 8 + phase * 2) * amp * 0.7 +
            Math.sin(normalizedX * Math.PI * 18 - phase * 3) * amp * 0.3 +
            (Math.random() - 0.5) * 1.5;
        } else if (type === 'pulse') {
          const pulse = Math.sin(normalizedX * Math.PI * 6 + phase * 2.5);
          const spike = Math.abs(Math.sin(normalizedX * Math.PI * 24 + phase * 5)) > 0.88 ? (Math.random() - 0.5) * amp * 0.85 : 0;
          y = midY + pulse * amp * 0.65 + spike;
        } else if (type === 'jitter') {
          const square = Math.sin(normalizedX * Math.PI * 10 + phase * 3) > 0 ? 1 : -1;
          const noise = (Math.random() - 0.5) * (amp * 0.4);
          y = midY + square * amp * 0.55 + noise;
        } else if (type === 'resonator') {
          const mod = Math.sin(normalizedX * Math.PI * 3 + phase);
          y = midY + Math.sin(normalizedX * Math.PI * 16 * mod + phase * 4) * amp * 0.75;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const render = () => {
      phase += isPlaying ? 0.04 * sweepSpeed : 0.005;

      drawSectorWave(sector1CanvasRef.current, 'carrier', 'rgba(234, 88, 12, 0.95)', 1);
      drawSectorWave(sector2CanvasRef.current, 'pulse', 'rgba(249, 115, 22, 0.95)', 2);
      drawSectorWave(sector3CanvasRef.current, 'jitter', 'rgba(217, 119, 6, 0.95)', 3);
      drawSectorWave(sector4CanvasRef.current, 'resonator', 'rgba(234, 88, 12, 0.95)', 4);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, sweepSpeed, activeSector]);

  // Draw 3D Wireframe Globe on the Canvas with Light Mode (White + Orange + Slate)
  useEffect(() => {
    const canvas = globe3DCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderGlobe = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      // 1. Pure Outer Sphere Silhouette Circle
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = 'rgba(249, 115, 22, 0.4)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Outer HUD frame ring
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.6)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary dashed ring
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Outer tick marks
      const numTicks = 48;
      for (let i = 0; i < numTicks; i++) {
        const rad = (i / numTicks) * Math.PI * 2;
        const tickLen = i % 4 === 0 ? 8 : 4;
        const r1 = radius + 14;
        const r2 = r1 + tickLen;
        ctx.strokeStyle = i % 4 === 0 ? 'rgba(234, 88, 12, 0.95)' : 'rgba(203, 213, 225, 0.9)';
        ctx.lineWidth = i % 4 === 0 ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * r1, cy + Math.sin(rad) * r1);
        ctx.lineTo(cx + Math.cos(rad) * r2, cy + Math.sin(rad) * r2);
        ctx.stroke();
      }

      // Draw 3D Wireframe Latitudinal Ellipses
      const latSteps = 8;
      const rotYRad = (globeRotation.y * Math.PI) / 180;
      const rotXRad = (globeRotation.x * Math.PI) / 180;

      for (let i = 1; i < latSteps; i++) {
        const phi = (i / latSteps) * Math.PI - Math.PI / 2;
        const rLat = radius * Math.cos(phi);
        const yLat = cy + radius * Math.sin(phi) * Math.cos(rotXRad);

        const isEquator = i === Math.floor(latSteps / 2);
        ctx.strokeStyle = isEquator ? 'rgba(234, 88, 12, 0.9)' : 'rgba(203, 213, 225, 0.7)';
        ctx.lineWidth = isEquator ? 1.8 : 1;
        ctx.beginPath();
        ctx.ellipse(cx, yLat, rLat, rLat * 0.35 * Math.abs(Math.cos(rotXRad)) + 2.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw 3D Longitudinal Rings (Ellipses rotated around Y-axis)
      const lonSteps = 16;
      for (let i = 0; i < lonSteps; i++) {
        const theta = (i / lonSteps) * Math.PI + rotYRad;
        const widthFactor = Math.sin(theta);
        const isFacingFront = Math.cos(theta) >= 0;

        ctx.strokeStyle = isFacingFront ? 'rgba(249, 115, 22, 0.45)' : 'rgba(203, 213, 225, 0.4)';
        ctx.lineWidth = isFacingFront ? 1.2 : 0.7;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * Math.abs(widthFactor), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Continents projection points on globe
      const continentPoints = [
        // North America
        { lat: 40, lon: -100 }, { lat: 50, lon: -110 }, { lat: 35, lon: -85 }, { lat: 30, lon: -100 }, { lat: 58, lon: -120 },
        // South America
        { lat: -10, lon: -55 }, { lat: -25, lon: -50 }, { lat: 0, lon: -70 }, { lat: -35, lon: -62 },
        // Europe & Africa
        { lat: 52, lon: 15 }, { lat: 45, lon: 30 }, { lat: 10, lon: 20 }, { lat: -20, lon: 25 }, { lat: 0, lon: 15 }, { lat: 32, lon: 10 },
        // Asia / India / China
        { lat: 25, lon: 78 }, { lat: 28, lon: 85 }, { lat: 35, lon: 105 }, { lat: 20, lon: 100 }, { lat: 45, lon: 80 }, { lat: 12, lon: 77 },
        // Australia & Oceania
        { lat: -25, lon: 135 }, { lat: -30, lon: 140 }, { lat: -18, lon: 145 }
      ];

      continentPoints.forEach(pt => {
        const phi = (pt.lat * Math.PI) / 180;
        const theta = (pt.lon * Math.PI) / 180 + rotYRad;

        const x3D = radius * Math.cos(phi) * Math.sin(theta);
        const y3D = radius * Math.sin(phi);
        const z3D = radius * Math.cos(phi) * Math.cos(theta);

        if (z3D > -radius * 0.1) {
          const screenX = cx + x3D;
          const screenY = cy - y3D;

          ctx.fillStyle = '#EA580C';
          ctx.beginPath();
          ctx.arc(screenX, screenY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Target satellite beacon pings on globe
      targets.forEach(tgt => {
        const angleRad = (tgt.angle * Math.PI) / 180 + rotYRad;
        const dist = tgt.distance * radius;
        const bx = cx + Math.cos(angleRad) * dist;
        const by = cy + Math.sin(angleRad) * dist;

        ctx.fillStyle = tgt.id === selectedTarget.id ? '#EA580C' : 'rgba(249, 115, 22, 0.7)';
        ctx.beginPath();
        ctx.arc(bx, by, tgt.id === selectedTarget.id ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fill();

        if (tgt.id === selectedTarget.id) {
          ctx.strokeStyle = '#EA580C';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(bx, by, 8 + Math.sin(performance.now() * 0.008) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(renderGlobe);
    };

    renderGlobe();
    return () => cancelAnimationFrame(animId);
  }, [globeRotation, targets, selectedTarget]);

  // Mini Gyro Sphere Canvas (Middle Right)
  useEffect(() => {
    const canvas = miniGlobeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderMini = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      // Outer boundary
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Horizontal latitude lines
      [-0.6, -0.3, 0, 0.3, 0.6].forEach(offset => {
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + offset * r, Math.sqrt(r * r - Math.pow(offset * r, 2)), 2.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Rotating vertical longitude line
      const rot = (performance.now() * 0.002) % (Math.PI * 2);
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.75)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(Math.sin(rot)) * r, r, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(Math.sin(rot + Math.PI / 3)) * r, r, 0, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(renderMini);
    };

    renderMini();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Format playback seconds to HH:MM:SS
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${s}`;
  };

  // Handle Drag on 3D Globe to rotate
  const handleGlobeMouseDown = (e: React.MouseEvent) => {
    setIsDraggingGlobe(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleGlobeMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingGlobe) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setGlobeRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x - dy * 0.5)),
      y: (prev.y + dx * 0.8) % 360
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleGlobeMouseUp = () => {
    setIsDraggingGlobe(false);
  };

  // Click on radar to target coordinate
  const handleRadarClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const radius = rect.width / 2;
    const dist = Math.sqrt(x * x + y * y) / radius;

    if (dist <= 1) {
      let deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (deg < 0) deg += 360;

      const closest = targets.reduce((prev, curr) => {
        const diff = Math.abs(curr.angle - deg);
        return diff < Math.abs(prev.angle - deg) ? curr : prev;
      });

      setSelectedTarget(closest);
    }
  };

  return (
    <div
      id="honeypot-tactical-radar-hud"
      className="w-full h-full flex flex-col justify-between bg-white text-slate-800 font-mono select-none overflow-hidden p-2 lg:p-2.5 gap-2 lg:gap-2.5 relative rounded-2xl border border-slate-200/90 shadow-sm"
      style={{
        backgroundImage: `
          radial-gradient(circle at 25% 20%, rgba(249, 115, 22, 0.04) 0%, transparent 60%),
          radial-gradient(circle at 75% 20%, rgba(234, 88, 12, 0.03) 0%, transparent 60%),
          linear-gradient(rgba(226, 232, 240, 0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(226, 232, 240, 0.6) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 16px 16px, 16px 16px'
      }}
    >
      {/* Top Section: Dual Tactical Scanners */}
      <div className="flex-1 min-h-[250px] lg:min-h-[280px] grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-2.5 items-stretch">
        
        {/* TOP-LEFT: CIRCULAR POLAR RADAR SCANNER */}
        <div className="relative flex flex-col items-center justify-between p-2 lg:p-2.5 rounded-xl bg-slate-50/70 border border-slate-200 shadow-sm overflow-hidden">
          {/* Top Left Title & Controls */}
          <div className="w-full flex justify-between items-center z-20 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] lg:text-[12px] font-black uppercase tracking-[0.2em] text-orange-600 flex items-center gap-1.5">
                <Crosshair size={14} className="animate-spin text-orange-500" style={{ animationDuration: '8s' }} />
                AZIMUTHAL SCANNER
              </span>
              <span className="text-[9px] lg:text-[10px] px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-700 font-bold">
                {Math.round(radarRotation)}°
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSweepSpeed(s => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
                className="px-2.5 py-1 text-[9px] font-bold rounded bg-white hover:bg-slate-100 border border-slate-200 transition-colors text-slate-700 cursor-pointer shadow-sm"
                title="Toggle Sweep Speed"
              >
                {sweepSpeed}x
              </button>
              <button
                onClick={() => setRadarZoom(z => (z === 1 ? 1.3 : z === 1.3 ? 1.6 : 1))}
                className="px-2.5 py-1 text-[9px] font-bold rounded bg-white hover:bg-slate-100 border border-slate-200 transition-colors text-slate-700 cursor-pointer shadow-sm"
                title="Toggle Zoom"
              >
                {radarZoom}x
              </button>
            </div>
          </div>

          {/* SVG Polar Radar Display */}
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-0.5">
            <svg
              viewBox="0 0 500 500"
              className="w-auto h-full max-h-[260px] lg:max-h-[280px] aspect-square cursor-crosshair"
              onClick={handleRadarClick}
            >
              <defs>
                <linearGradient id="sweepSectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(249, 115, 22, 0.45)" />
                  <stop offset="60%" stopColor="rgba(251, 146, 60, 0.15)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0.01)" />
                </linearGradient>

                <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Polar Compass Outer Degree Ring */}
              <circle cx="250" cy="250" r="236" fill="none" stroke="#EA580C" strokeWidth="1.8" opacity="0.8" />
              <circle cx="250" cy="250" r="242" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.6" strokeDasharray="4,3" />

              {/* Degree numbers along circumference */}
              {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map(deg => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const tx = 250 + Math.cos(rad) * 223;
                const ty = 250 + Math.sin(rad) * 223 + 3.5;
                const tickX1 = 250 + Math.cos(rad) * 236;
                const tickY1 = 250 + Math.sin(rad) * 236;
                const tickX2 = 250 + Math.cos(rad) * 246;
                const tickY2 = 250 + Math.sin(rad) * 246;

                return (
                  <g key={deg}>
                    <line x1={tickX1} y1={tickY1} x2={tickX2} y2={tickY2} stroke={deg % 90 === 0 ? "#EA580C" : "#CBD5E1"} strokeWidth={deg % 90 === 0 ? "2.2" : "1.2"} opacity="0.9" />
                    <text
                      x={tx}
                      y={ty}
                      fill={deg % 90 === 0 ? "#EA580C" : "#64748B"}
                      fontSize="10.5"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                      opacity="0.95"
                    >
                      {deg}
                    </text>
                  </g>
                );
              })}

              {/* Radial Coordinate Lines */}
              {[0, 30, 60, 90, 120, 150].map(deg => (
                <line
                  key={deg}
                  x1={250 + Math.cos((deg * Math.PI) / 180) * 215}
                  y1={250 + Math.sin((deg * Math.PI) / 180) * 215}
                  x2={250 - Math.cos((deg * Math.PI) / 180) * 215}
                  y2={250 - Math.sin((deg * Math.PI) / 180) * 215}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
              ))}

              {/* Concentric Distance Rings */}
              {[50, 100, 150, 205].map((r, i) => (
                <circle
                  key={r}
                  cx="250"
                  cy="250"
                  r={r * radarZoom}
                  fill="none"
                  stroke={i % 2 === 1 ? "#FDBA74" : "#E2E8F0"}
                  strokeWidth={i === 3 ? "1.6" : "1"}
                  strokeDasharray={i % 2 === 1 ? "4,4" : "none"}
                />
              ))}

              {/* Honeypot Trap Sectors Projection */}
              <g opacity="0.9" stroke="#EA580C" strokeWidth="1.8" fill="rgba(249, 115, 22, 0.08)">
                {/* Sector A - Northern Trap */}
                <path d="M 240,115 C 280,105 320,120 330,160 C 335,185 305,210 270,215 C 245,218 240,160 240,115 Z" fill="rgba(249, 115, 22, 0.12)" stroke="#EA580C" />
                {/* Sector B - North-West Trap */}
                <path d="M 190,195 C 190,165 210,145 230,150 C 235,180 225,210 190,215 Z" />
                {/* Sector C - South-West Cluster */}
                <path d="M 175,255 C 195,240 230,250 230,290 C 215,315 185,305 175,280 Z" fill="rgba(249, 115, 22, 0.1)" stroke="#EA580C" />
                {/* Sector D - South Central Trap */}
                <path d="M 255,270 C 285,260 295,285 285,325 C 265,335 250,305 255,270 Z" />
                {/* Sector E - South-East Cluster */}
                <path d="M 305,285 C 335,275 345,305 330,340 C 310,345 300,315 305,285 Z" fill="rgba(249, 115, 22, 0.1)" stroke="#EA580C" />
                {/* Sector F - Far West Outpost */}
                <path d="M 140,245 C 155,235 160,255 155,275 C 140,270 135,255 140,245 Z" />
              </g>

              {/* Rotating Radar Sweep Wedge Beam */}
              <g transform={`rotate(${radarRotation} 250 250)`}>
                <path
                  d="M 250,250 L 250,35 A 215,215 0 0,1 435,142 Z"
                  fill="url(#sweepSectorGrad)"
                  opacity="0.88"
                />
                <line x1="250" y1="250" x2="435" y2="142" stroke="#EA580C" strokeWidth="2.5" />
                <line x1="250" y1="250" x2="435" y2="142" stroke="#F97316" strokeWidth="1" />
              </g>

              {/* Target Interception Nodes / Blips */}
              {targets.map(tgt => {
                const rad = ((tgt.angle - 90) * Math.PI) / 180;
                const bx = 250 + Math.cos(rad) * (tgt.distance * 210 * radarZoom);
                const by = 250 + Math.sin(rad) * (tgt.distance * 210 * radarZoom);
                const isSelected = selectedTarget.id === tgt.id;

                return (
                  <g
                    key={tgt.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedTarget(tgt);
                    }}
                  >
                    <circle
                      cx={bx}
                      cy={by}
                      r={isSelected ? "14" : "10"}
                      fill="none"
                      stroke={isSelected ? "#EA580C" : "#F97316"}
                      strokeWidth="1.5"
                      opacity={isSelected ? "0.95" : "0.6"}
                      className="animate-ping"
                      style={{ transformOrigin: `${bx}px ${by}px`, animationDuration: '2s' }}
                    />

                    <circle
                      cx={bx}
                      cy={by}
                      r={isSelected ? "5.5" : "4"}
                      fill={isSelected ? "#EA580C" : "#F97316"}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? "2" : "1"}
                    />

                    <text
                      x={bx + 9}
                      y={by + 3.5}
                      fill={isSelected ? "#EA580C" : "#475569"}
                      fontSize={isSelected ? "10.5" : "9"}
                      fontWeight="bold"
                      fontFamily="JetBrains Mono"
                    >
                      {tgt.code}
                    </text>
                  </g>
                );
              })}

              {/* Central Target Reticle Crosshair */}
              <circle cx="250" cy="250" r="4" fill="#EA580C" />
              <circle cx="250" cy="250" r="10" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.8" />
              <line x1="234" y1="250" x2="266" y2="250" stroke="#EA580C" strokeWidth="1.5" />
              <line x1="250" y1="234" x2="250" y2="266" stroke="#EA580C" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Quick Target Detail Footer */}
          <div className="w-full flex items-center justify-between pt-1.5 border-t border-slate-200 px-2 text-[9px] lg:text-[10px] text-slate-600 shrink-0">
            <span>OBJ: <strong className="text-orange-600 font-black">{selectedTarget.code}</strong></span>
            <span>GEO: <strong className="text-slate-800 font-bold">{selectedTarget.lat}, {selectedTarget.lng}</strong></span>
          </div>
        </div>

        {/* TOP-RIGHT: 3D WIREFRAME ORBITAL GLOBE HUD */}
        <div
          className="relative flex flex-col items-center justify-between p-2 lg:p-2.5 rounded-xl bg-slate-50/70 border border-slate-200 shadow-sm overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleGlobeMouseDown}
          onMouseMove={handleGlobeMouseMove}
          onMouseUp={handleGlobeMouseUp}
          onMouseLeave={handleGlobeMouseUp}
        >
          <div className="w-full flex justify-between items-center z-20 shrink-0 pointer-events-none">
            <span className="text-[11px] lg:text-[12px] font-black uppercase tracking-[0.2em] text-orange-600 flex items-center gap-1.5">
              <GlobeIcon size={14} className="text-orange-500" />
              3D ORBITAL WIREFRAME
            </span>

            <button
              onClick={() => setGlobeRotation({ x: 15, y: 35 })}
              className="px-2.5 py-1 text-[9px] font-bold rounded bg-white hover:bg-slate-100 border border-slate-200 transition-colors pointer-events-auto text-slate-700 cursor-pointer shadow-sm"
              title="Reset View Orientation"
            >
              RESET
            </button>
          </div>

          {/* 3D Canvas Globe */}
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-0.5">
            <canvas
              ref={globe3DCanvasRef}
              width={540}
              height={540}
              className="w-auto h-full max-h-[260px] lg:max-h-[280px] aspect-square"
            />
          </div>

          {/* Globe Telemetry Footer */}
          <div className="w-full flex items-center justify-between pt-1.5 border-t border-slate-200 px-2 text-[9px] lg:text-[10px] text-slate-600 shrink-0 pointer-events-none">
            <span>ORBIT: <strong className="text-orange-600 font-bold">LEO 36,000KM</strong></span>
            <span>ROT: <strong className="text-slate-800 font-bold">{Math.round(globeRotation.y)}° / {Math.round(globeRotation.x)}°</strong></span>
          </div>
        </div>
      </div>

      {/* Middle Section: (Search System Player on Left, Equalizer + Spider Chart in Center, Telemetry Data + Mini Gyro on Right) */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-12 gap-2 lg:gap-2.5 items-stretch h-[156px] lg:h-[170px]">
        
        {/* MIDDLE LEFT (Col 4): SEARCH SYSTEM - PLAYER */}
        <div className="md:col-span-4 rounded-xl bg-slate-50/70 border border-slate-200 p-2.5 lg:p-3 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[12px] lg:text-[13px] font-black uppercase tracking-[0.15em] text-orange-600 leading-none">
                SEARCH SYSTEM
              </div>
              <div className="text-[8.5px] lg:text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                PLAYER // RECON STREAM
              </div>
            </div>
            <span className={cn(
              "px-2.5 py-0.5 rounded text-[8px] lg:text-[8.5px] font-black tracking-wider uppercase border",
              isPlaying ? "bg-orange-50 border-orange-200 text-orange-700 animate-pulse" : "bg-slate-100 border-slate-200 text-slate-500"
            )}>
              {isPlaying ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>

          {/* Central Interactive Play/Pause Button */}
          <div className="flex items-center justify-center my-0.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative group p-3.5 rounded-full border-2 border-orange-500 bg-orange-50 hover:bg-orange-100 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              {isPlaying && (
                <span className="absolute inset-0 rounded-full border border-orange-400 animate-ping opacity-40 pointer-events-none" />
              )}
              {isPlaying ? (
                <Pause size={20} className="text-orange-600 fill-orange-600" />
              ) : (
                <Play size={20} className="text-orange-600 fill-orange-600 translate-x-0.5" />
              )}
            </button>
          </div>

          {/* Scrub Bar & Timeline */}
          <div>
            <div className="flex justify-between text-[8.5px] lg:text-[9px] text-slate-600 mb-1 font-bold">
              <span>{formatTime(playbackTime)}</span>
              <span className="text-orange-600 font-black">2.4 GB/s DECEPTION</span>
              <span>01:00:00</span>
            </div>

            <div
              className="w-full h-2 bg-slate-200 rounded-full overflow-hidden cursor-pointer relative border border-slate-300"
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                setPlaybackTime(Math.floor(ratio * 3600));
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 transition-all duration-150"
                style={{ width: `${(playbackTime / 3600) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* MIDDLE CENTER (Col 5): SEARCH SYSTEM - SEARCH COMPLETE (Equalizer + Radar Spider Polygon) */}
        <div className="md:col-span-5 rounded-xl bg-slate-50/70 border border-slate-200 p-2.5 lg:p-3 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[12px] lg:text-[13px] font-black uppercase tracking-[0.15em] text-orange-600 leading-none">
                SEARCH SYSTEM
              </div>
              <div className="text-[8.5px] lg:text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                SEARCH COMPLETE // SPECTRAL
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9.5px] font-bold text-orange-600 leading-none">OBJ: {selectedTarget.code}</div>
              <div className="text-[8px] text-slate-500 mt-0.5">STATUS: {systemStatus}</div>
            </div>
          </div>

          {/* Dual Widget Display: Vertical Equalizer Bars + Spider Radar Mesh */}
          <div className="grid grid-cols-2 gap-3 items-center my-0.5">
            {/* Left: Animated Jumping Vertical Equalizer Spectrum Bars */}
            <div className="flex items-end justify-between h-[72px] lg:h-[82px] px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 relative">
              <div className="absolute -left-0.5 top-1 bottom-1 flex flex-col justify-between text-[7px] font-bold text-slate-400 pointer-events-none">
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>

              {eqBars.map((val, i) => (
                <div
                  key={i}
                  className="w-2.5 rounded-t transition-all duration-200 bg-gradient-to-t from-orange-200 via-orange-400 to-orange-500 relative group cursor-pointer hover:opacity-100"
                  style={{ height: `${val}%` }}
                  onClick={() => {
                    setEqBars(prev => {
                      const copy = [...prev];
                      copy[i] = 100;
                      return copy;
                    });
                  }}
                  title={`Band ${i + 1}: ${val}%`}
                >
                  <div className="w-full h-1 bg-orange-600 rounded-t" />
                </div>
              ))}
            </div>

            {/* Right: Polygon Spider Radar Chart */}
            <div className="relative flex items-center justify-center h-[72px] lg:h-[82px]">
              <svg viewBox="0 0 100 100" className="w-[72px] h-[72px] lg:w-[82px] lg:h-[82px] overflow-visible">
                {[0.33, 0.66, 1].map((scale, i) => {
                  const pts = [0, 1, 2, 3, 4].map(idx => {
                    const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
                    const r = 42 * scale;
                    return `${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={scale}
                      points={pts}
                      fill="none"
                      stroke={i === 2 ? "#EA580C" : "#CBD5E1"}
                      strokeWidth="0.9"
                      strokeDasharray={i === 2 ? "none" : "2,2"}
                      opacity={0.6 + i * 0.2}
                    />
                  );
                })}

                {[0, 1, 2, 3, 4].map(idx => {
                  const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
                  return (
                    <line
                      key={idx}
                      x1="50"
                      y1="50"
                      x2={50 + Math.cos(angle) * 42}
                      y2={50 + Math.sin(angle) * 42}
                      stroke="#E2E8F0"
                      strokeWidth="0.8"
                    />
                  );
                })}

                {(() => {
                  const polyPts = radarPolygon.map((val, idx) => {
                    const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
                    const r = (val / 100) * 42;
                    return `${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`;
                  }).join(' ');

                  return (
                    <>
                      <polygon
                        points={polyPts}
                        fill="rgba(249, 115, 22, 0.25)"
                        stroke="#EA580C"
                        strokeWidth="1.8"
                        className="transition-all duration-300"
                      />
                      {radarPolygon.map((val, idx) => {
                        const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
                        const r = (val / 100) * 42;
                        const vx = 50 + Math.cos(angle) * r;
                        const vy = 50 + Math.sin(angle) * r;
                        return (
                          <circle
                            key={idx}
                            cx={vx}
                            cy={vy}
                            r="3"
                            fill="#EA580C"
                            stroke="#FFFFFF"
                            strokeWidth="1"
                            className="cursor-pointer"
                            onClick={() => {
                              setRadarPolygon(prev => {
                                const copy = [...prev];
                                copy[idx] = copy[idx] >= 90 ? 40 : copy[idx] + 20;
                                return copy;
                              });
                            }}
                          />
                        );
                      })}
                    </>
                  );
                })()}

                <circle cx="50" cy="50" r="3" fill="#EA580C" className="animate-pulse" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center text-[8.5px] lg:text-[9.5px] text-slate-700 border-t border-slate-200 pt-1.5 font-bold">
            <span>ENTROPY: <strong className="text-orange-600 font-black">{Math.round(radarPolygon[0])}%</strong></span>
            <span>DECEPTION: <strong className="text-orange-600 font-black">{Math.round(radarPolygon[2])}%</strong></span>
            <span>RESILIENCE: <strong className="text-orange-600 font-black">{Math.round(radarPolygon[4])}%</strong></span>
          </div>
        </div>

        {/* MIDDLE RIGHT (Col 3): TELEMETRY DATA & MINI CYBER GYRO SPHERE */}
        <div className="md:col-span-3 rounded-xl bg-slate-50/70 border border-slate-200 p-2.5 lg:p-3 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="flex flex-col gap-2 z-10">
            <div className="font-mono leading-tight">
              <span className="text-slate-500 block text-[8px] uppercase tracking-wider font-bold">OBJECT_ID</span>
              <strong className="text-orange-600 font-black text-[11px] lg:text-[12px]">{selectedTarget.code}</strong>
            </div>

            <div className="font-mono leading-tight">
              <span className="text-slate-500 block text-[8px] uppercase tracking-wider font-bold">STATUS</span>
              <strong className="text-slate-800 font-black flex items-center gap-1.5 text-[10px] lg:text-[11px]">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                {systemStatus}
              </strong>
            </div>

            <div className="font-mono leading-tight">
              <span className="text-slate-500 block text-[8px] uppercase tracking-wider font-bold">MODE</span>
              <button
                onClick={() => {
                  const modes: ('STEADY' | 'HUNT' | 'DEFENSE' | 'OVERLOAD')[] = ['STEADY', 'HUNT', 'DEFENSE', 'OVERLOAD'];
                  const next = modes[(modes.indexOf(tacticalMode) + 1) % modes.length];
                  setTacticalMode(next);
                }}
                className="text-orange-600 font-black hover:underline cursor-pointer flex items-center gap-1 text-[10px] lg:text-[11px]"
                title="Click to Switch Mode"
              >
                {tacticalMode}
                <RefreshCw size={10} className="opacity-80" />
              </button>
            </div>
          </div>

          <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center shrink-0">
            <canvas
              ref={miniGlobeCanvasRef}
              width={140}
              height={140}
              className="w-full h-full cursor-pointer"
              onClick={() => {
                setSystemStatus(s => (s === 'SISTEM OK' ? 'LOCK ENGAGED' : 'SISTEM OK'));
              }}
              title="Click to Toggle Lock Protocol"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Broad Tactical "IDENTIFICATION SECTOR" Oscilloscope Panels */}
      <div className="shrink-0 rounded-xl bg-slate-50/70 border border-slate-200 p-2.5 lg:p-3 flex flex-col justify-between shadow-sm relative overflow-hidden h-[166px] lg:h-[182px]">
        {/* Top Header of Identification Sector */}
        <div className="flex justify-between items-center pb-1.5 border-b border-slate-200 shrink-0">
          <div>
            <div className="text-[12px] lg:text-[13px] font-black uppercase tracking-[0.2em] text-orange-600 flex items-center gap-1.5 leading-none">
              <Activity size={14} className="text-orange-500 animate-pulse" />
              IDENTIFICATION SECTOR
            </div>
            <div className="text-[8.5px] text-slate-500 font-mono tracking-widest mt-1 font-bold">
              OBJECT: <span className="text-orange-600">{selectedTarget.code}</span> // MODE: {tacticalMode} // STATUS: {systemStatus}
            </div>
          </div>

          <div className="text-[9.5px] font-mono text-orange-700 font-black px-2.5 py-0.5 rounded bg-orange-50 border border-orange-200">
            SECTOR {activeSector} ISOLATED
          </div>
        </div>

        {/* 4 Oscilloscope Channels */}
        <div className="grid grid-cols-4 gap-2 lg:gap-2.5 my-1 flex-1 min-h-0 items-stretch">
          {/* SECTOR 1 */}
          <div
            onClick={() => setActiveSector(1)}
            className={cn(
              "flex flex-col justify-between p-1.5 lg:p-2 rounded-lg border transition-all cursor-pointer bg-white",
              activeSector === 1
                ? "border-orange-500 bg-orange-50/40 shadow-sm"
                : "border-slate-200 hover:border-orange-300"
            )}
          >
            <div className="flex justify-between items-center text-[8.5px] font-black">
              <span className="text-orange-600">CARRIER</span>
              <span className="text-slate-700">98%</span>
            </div>
            <div className="w-full flex-1 min-h-0 relative flex items-center justify-center my-0.5">
              <canvas ref={sector1CanvasRef} width={240} height={56} className="w-full h-full" />
            </div>
            <div className="text-center text-[9.5px] font-black tracking-wider text-orange-700 bg-slate-50 rounded py-0.5 border border-slate-200">
              SECTOR 1
            </div>
          </div>

          {/* SECTOR 2 */}
          <div
            onClick={() => setActiveSector(2)}
            className={cn(
              "flex flex-col justify-between p-1.5 lg:p-2 rounded-lg border transition-all cursor-pointer bg-white",
              activeSector === 2
                ? "border-orange-500 bg-orange-50/40 shadow-sm"
                : "border-slate-200 hover:border-orange-300"
            )}
          >
            <div className="flex justify-between items-center text-[8.5px] font-black">
              <span className="text-orange-600">PULSE</span>
              <span className="text-slate-700">BURST</span>
            </div>
            <div className="w-full flex-1 min-h-0 relative flex items-center justify-center my-0.5">
              <canvas ref={sector2CanvasRef} width={240} height={56} className="w-full h-full" />
            </div>
            <div className="text-center text-[9.5px] font-black tracking-wider text-orange-700 bg-slate-50 rounded py-0.5 border border-slate-200">
              SECTOR 2
            </div>
          </div>

          {/* SECTOR 3 */}
          <div
            onClick={() => setActiveSector(3)}
            className={cn(
              "flex flex-col justify-between p-1.5 lg:p-2 rounded-lg border transition-all cursor-pointer bg-white",
              activeSector === 3
                ? "border-orange-500 bg-orange-50/40 shadow-sm"
                : "border-slate-200 hover:border-orange-300"
            )}
          >
            <div className="flex justify-between items-center text-[8.5px] font-black">
              <span className="text-orange-600">JITTER</span>
              <span className="text-slate-700">0.001ms</span>
            </div>
            <div className="w-full flex-1 min-h-0 relative flex items-center justify-center my-0.5">
              <canvas ref={sector3CanvasRef} width={240} height={56} className="w-full h-full" />
            </div>
            <div className="text-center text-[9.5px] font-black tracking-wider text-orange-700 bg-slate-50 rounded py-0.5 border border-slate-200">
              SECTOR 3
            </div>
          </div>

          {/* SECTOR 4 */}
          <div
            onClick={() => setActiveSector(4)}
            className={cn(
              "flex flex-col justify-between p-1.5 lg:p-2 rounded-lg border transition-all cursor-pointer bg-white",
              activeSector === 4
                ? "border-orange-500 bg-orange-50/40 shadow-sm"
                : "border-slate-200 hover:border-orange-300"
            )}
          >
            <div className="flex justify-between items-center text-[8.5px] font-black">
              <span className="text-orange-600">RESONANCE</span>
              <span className="text-slate-700">LOCK</span>
            </div>
            <div className="w-full flex-1 min-h-0 relative flex items-center justify-center my-0.5">
              <canvas ref={sector4CanvasRef} width={240} height={56} className="w-full h-full" />
            </div>
            <div className="text-center text-[9.5px] font-black tracking-wider text-orange-700 bg-slate-50 rounded py-0.5 border border-slate-200">
              SECTOR 4
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Terminal Ticker */}
        <div className="w-full bg-slate-900 rounded p-1.5 lg:p-2 border border-slate-800 text-[8.5px] lg:text-[9.5px] text-slate-300 font-mono overflow-hidden shrink-0">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="text-orange-400 font-black flex items-center gap-1 shrink-0">
              <Terminal size={11} className="text-orange-400" />
              TELEMETRY:
            </span>
            <div className="animate-marquee inline-block text-slate-100">
              {telemetryLogs.join('  ///  ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
