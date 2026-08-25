import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreatNode, ThreatLink } from '../types';
import { 
  Shield, Sparkles, User, Landmark, RefreshCw, Zap, Cpu, Orbit, 
  Activity, Radio, AlertTriangle, Crosshair, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { cn } from '../lib/utils';

// High-fidelity dynamic particle for space-nebula rendering
interface ElegantParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  decay: number;
  type: 'star' | 'stream' | 'cosmic_dust' | 'vortex' | 'code';
  angle?: number;
  speed?: number;
  text?: string;
  targetX?: number;
  targetY?: number;
  progress?: number;
}

interface FraudConstellationProps {
  nodes: ThreatNode[];
  links: ThreatLink[];
  selectedNode: ThreatNode | null;
  onSelectNode: (node: ThreatNode | null) => void;
  isPlayingAutonomousMode?: boolean;
}

export const FraudConstellation: React.FC<FraudConstellationProps> = ({
  nodes,
  links,
  selectedNode,
  onSelectNode,
  isPlayingAutonomousMode = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States for Sidebar Details HUD
  const [hoveredNodeState, setHoveredNodeState] = useState<ThreatNode | null>(null);
  
  // High performance references for physics and states to avoid re-renders
  const positionsRef = useRef<Record<string, { x: number; y: number; baseX: number; baseY: number; vx: number; vy: number; radiusOffset: number; phase: number }>>({});
  const particlesRef = useRef<ElegantParticle[]>([]);
  const particleIdCounterRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const isMouseDownRef = useRef<boolean>(false);
  const rippleWavesRef = useRef<{ x: number; y: number; r: number; maxR: number; opacity: number; color: string }[]>([]);
  const animationAngleRef = useRef<number>(0);

  // Keep references updated for immediate access in canvas render block without stale closures
  const selectedNodeRef = useRef<ThreatNode | null>(null);
  const hoveredNodeRef = useRef<ThreatNode | null>(null);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  // Distribute nodes in a galaxy-inspired spiral with a highly balanced starting distance
  const initializePositions = (w: number, h: number) => {
    const nextPositions: Record<string, { x: number; y: number; baseX: number; baseY: number; vx: number; vy: number; radiusOffset: number; phase: number }> = {};
    const center = { x: w / 2, y: h / 2 };

    nodes.forEach((node, idx) => {
      // Golden spiral distribution for stunning visual balance and organic negative space
      const phi = idx * 137.5 * (Math.PI / 180);
      const spiralRadius = Math.min(w, h) * 0.15 + Math.sqrt(idx) * 28;

      const bx = center.x + Math.cos(phi) * spiralRadius;
      const by = center.y + Math.sin(phi) * spiralRadius;

      nextPositions[node.id] = {
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        vx: 0,
        vy: 0,
        radiusOffset: spiralRadius,
        phase: Math.random() * Math.PI * 2
      };
    });

    positionsRef.current = nextPositions;

    // Generate beautiful, clean, modern cosmic-matrix particles (240 high-efficiency stars)
    const particleList: ElegantParticle[] = [];
    const count = 240;
    
    for (let i = 0; i < count; i++) {
      particleIdCounterRef.current++;
      const starAngle = Math.random() * Math.PI * 2;
      const starDist = Math.random() * Math.max(w, h) * 0.7;
      
      const px = center.x + Math.cos(starAngle) * starDist;
      const py = center.y + Math.sin(starAngle) * starDist;

      const typeRoll = Math.random();
      let color = 'rgba(234, 88, 12, 0.4)'; // Orange accent spark
      if (typeRoll > 0.8) {
        color = 'rgba(234, 88, 12, 0.4)'; // Orange spark
      } else if (typeRoll > 0.6) {
        color = 'rgba(249, 115, 22, 0.35)'; // Amber gold spark
      } else {
        color = 'rgba(148, 163, 184, 0.35)'; // Delicate slate dust
      }

      particleList.push({
        id: particleIdCounterRef.current,
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color,
        size: Math.random() * 1.1 + 0.4,
        alpha: Math.random() * 0.25 + 0.1,
        life: 1.0,
        decay: Math.random() * 0.0006 + 0.0001,
        type: Math.random() > 0.82 ? 'cosmic_dust' : 'star',
        angle: starAngle,
        speed: Math.random() * 0.12 + 0.02
      });
    }

    particlesRef.current = particleList;
  };

  // Safe particle injector for active click explosions
  const spawnSparkTrail = (x: number, y: number, color: string, count: number = 30) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5.0 + 1.5;
      particleIdCounterRef.current++;
      
      particlesRef.current.push({
        id: particleIdCounterRef.current,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 3.5 + 1.0,
        alpha: 1.0,
        life: 1.0,
        decay: Math.random() * 0.025 + 0.01,
        type: 'vortex'
      });
    }
  };

  // Code drift words to float organically upward
  const spawnFloatingCode = (x: number, y: number, color: string, customSymbol?: string) => {
    particleIdCounterRef.current++;
    const symbols = ['RENT', 'SHOPPING', 'MEDS', 'BUDGET', '₹₹₹', 'SAVINGS', 'DINING', 'UTILITY', 'TRAVEL', 'SaaS'];
    const chosen = customSymbol || symbols[Math.floor(Math.random() * symbols.length)];

    particlesRef.current.push({
      id: particleIdCounterRef.current,
      x,
      y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -Math.random() * 1.5 - 0.6,
      color,
      size: 9,
      alpha: 1.0,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.006,
      type: 'code',
      text: chosen
    });
  };

  // Auto-init coordinates on element reload
  useEffect(() => {
    if (nodes.length > 0 && containerRef.current) {
      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 650;
      initializePositions(width, height);
    }
  }, [nodes]);

  // Main high-fidelity animation loop
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          canvas.width = width * window.devicePixelRatio;
          canvas.height = height * window.devicePixelRatio;
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
          
          initializePositions(width, height);
        }
      }
    });

    resizeObserver.observe(container);

    const getColors = (type: string) => {
      switch (type) {
        case 'RENT': return { border: '#EA580C', glow: 'rgba(234,88,12,0.22)', text: '#EA580C', label: 'FIXED HOUSING EXPENSE' };
        case 'SHOPPING': return { border: '#F97316', glow: 'rgba(249,115,22,0.22)', text: '#F97316', label: 'DISCRETIONARY LIFESTYLE' };
        case 'MEDICATION': return { border: '#10B981', glow: 'rgba(16,185,129,0.18)', text: '#10B981', label: 'HEALTH & MEDICAL ESSENTIAL' };
        case 'DINING': return { border: '#EF4444', glow: 'rgba(239,68,68,0.25)', text: '#EF4444', label: 'LEISURE & SOCIAL SPIKE' };
        case 'INVESTMENT': return { border: '#059669', glow: 'rgba(5,150,105,0.18)', text: '#059669', label: 'WEALTH SIP ACCUMULATION' };
        case 'UTILITIES': return { border: '#EA580C', glow: 'rgba(234,88,12,0.22)', text: '#EA580C', label: 'CORE MONTHLY INFRA' };
        case 'TRAVEL': return { border: '#8B5CF6', glow: 'rgba(139,92,246,0.22)', text: '#8B5CF6', label: 'COMMUTE & MOBILITY' };
        case 'SUBSCRIPTIONS': return { border: '#64748B', glow: 'rgba(100,116,139,0.18)', text: '#64748B', label: 'RECURRING DIGITAL SERVICE' };
        default: return { border: '#EA580C', glow: 'rgba(234,88,12,0.18)', text: '#EA580C', label: 'SPENDING PROFILE METRIC' };
      }
    };

    // Full stable 60FPS loop with organic force damping vectors
    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Slower, smooth rotation pacing
      const rotationSpeed = isPlayingAutonomousMode ? 0.002 : 0.0007;
      animationAngleRef.current += rotationSpeed;

      const center = { x: w / 2, y: h / 2 };
      const pos = positionsRef.current;
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      const hasMouse = mx > 0 && my > 0;

      // Restructure if coords not initialized
      const activeKeys = Object.keys(pos);
      if (activeKeys.length === 0 && nodes.length > 0) {
        initializePositions(w, h);
      }

      // --- 1. LIGHT MODE CANVAS BACKGROUND ---
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      const backdropGradient = ctx.createRadialGradient(
        center.x, center.y, 30,
        center.x, center.y, Math.max(w, h) * 0.75
      );
      backdropGradient.addColorStop(0, 'rgba(255, 237, 213, 0.4)');
      backdropGradient.addColorStop(0.3, 'rgba(254, 215, 170, 0.2)');
      backdropGradient.addColorStop(0.65, 'rgba(241, 245, 249, 0.4)');
      backdropGradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
      ctx.fillStyle = backdropGradient;
      ctx.fillRect(0, 0, w, h);

      // Targeted selected coordinate energy beam
      if (selectedNodeRef.current && pos[selectedNodeRef.current.id]) {
        const sP = pos[selectedNodeRef.current.id];
        const colors = getColors(selectedNodeRef.current.type);
        const dynamicBeam = ctx.createRadialGradient(sP.x, sP.y, 10, sP.x, sP.y, 220);
        dynamicBeam.addColorStop(0, colors.glow);
        dynamicBeam.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = dynamicBeam;
        ctx.fillRect(0, 0, w, h);
      }

      // --- 2. GRAVITY STRETCH COORDINATE GRID ---
      ctx.save();
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.7)';
      ctx.lineWidth = 0.6;

      const gridX = 24;
      const gridY = 24;
      // Focus gravity focus points
      const gravityCore = selectedNodeRef.current && pos[selectedNodeRef.current.id] 
        ? pos[selectedNodeRef.current.id] 
        : hasMouse ? mousePosRef.current : center;

      const baseGravityLimit = 220;

      for (let gy = 0; gy <= h; gy += h / gridY) {
        ctx.beginPath();
        for (let gx = 0; gx <= w; gx += w / 35) {
          let px = gx;
          let py = gy;

          const dx = gravityCore.x - gx;
          const dy = gravityCore.y - gy;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < baseGravityLimit) {
            const pull = (1.0 - distance / baseGravityLimit);
            const force = pull * pull * (isMouseDownRef.current ? 45 : 18);
            px += (dx / distance) * force;
            py += (dy / distance) * force;
          }

          if (gx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      for (let gx = 0; gx <= w; gx += w / gridX) {
        ctx.beginPath();
        for (let gy = 0; gy <= h; gy += h / 35) {
          let px = gx;
          let py = gy;

          const dx = gravityCore.x - gx;
          const dy = gravityCore.y - gy;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < baseGravityLimit) {
            const pull = (1.0 - distance / baseGravityLimit);
            const force = pull * pull * (isMouseDownRef.current ? 45 : 18);
            px += (dx / distance) * force;
            py += (dy / distance) * force;
          }

          if (gy === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();

      // --- 3. PHYSIC MOTION EQUATIONS & SMOOTH MAGNET HOVERS ---
      nodes.forEach((node, i) => {
        const p = pos[node.id];
        if (!p) return;

        // Perfect circular trajectory angles 
        const orbitAngle = Math.atan2(p.y - center.y, p.x - center.x);
        
        // Cohesion back to target layout orbits
        const destRadius = p.radiusOffset;
        const currentRadius = Math.sqrt((p.x - center.x) ** 2 + (p.y - center.y) ** 2);
        const radiusDiff = destRadius - currentRadius;

        p.vx += Math.cos(orbitAngle) * radiusDiff * 0.0022;
        p.vy += Math.sin(orbitAngle) * radiusDiff * 0.0022;

        // Beautiful swirling planetary tangent forces
        const tangentX = -Math.sin(orbitAngle) * (isPlayingAutonomousMode ? 0.22 : 0.07);
        const tangentY = Math.cos(orbitAngle) * (isPlayingAutonomousMode ? 0.22 : 0.07);
        p.vx += tangentX;
        p.vy += tangentY;

        // Repulsion to secure 100% overlap reduction
        nodes.forEach(other => {
          if (node.id === other.id || !pos[other.id]) return;
          const op = pos[other.id];
          const rx = p.x - op.x;
          const ry = p.y - op.y;
          const distance = Math.sqrt(rx * rx + ry * ry);
          if (distance < 110 && distance > 0) {
            const pushFactor = (110 - distance) * 0.0009;
            p.vx += rx * pushFactor;
            p.vy += ry * pushFactor;
          }
        });

        // Magnet attraction vector (Fixed to eliminate any high-frequency rattling)
        if (hasMouse) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pullReach = 180;

          if (dist < pullReach) {
            const factor = (pullReach - dist) / pullReach;
            // High traction dampening avoids the jitter!
            const tractionIntensity = factor * factor * (isMouseDownRef.current ? 0.44 : 0.18);
            p.vx += (dx / dist) * tractionIntensity;
            p.vy += (dy / dist) * tractionIntensity;

            if (Math.random() < 0.045) {
              spawnFloatingCode(p.x, p.y - 12, getColors(node.type).border);
            }
          }
        }

        // Extremely high friction damping to completely kill erratic vibrations
        p.vx *= 0.75;
        p.vy *= 0.75;
        p.x += p.vx;
        p.y += p.vy;

        // View bounds secure layout padding
        p.x = Math.max(70, Math.min(w - 70, p.x));
        p.y = Math.max(70, Math.min(h - 70, p.y));
      });

      // --- 4. LIGHTNING CONNECTOR PHOTON TRACERS ---
      if (Math.random() < 0.28) {
        links.forEach(link => {
          const sPos = pos[link.source];
          const tPos = pos[link.target];
          if (!sPos || !tPos) return;

          const isCoreLink = selectedNodeRef.current && (
            selectedNodeRef.current.id === link.source || 
            selectedNodeRef.current.id === link.target
          );

          if (isCoreLink || Math.random() < 0.15) {
            particleIdCounterRef.current++;
            particlesRef.current.push({
              id: particleIdCounterRef.current,
              x: sPos.x,
              y: sPos.y,
              vx: 0,
              vy: 0,
              color: isCoreLink ? '#FF3B30' : '#00F0FF',
              size: isCoreLink ? 2.8 : 1.6,
              alpha: 1.0,
              life: 1.0,
              decay: 0.018,
              type: 'stream',
              targetX: tPos.x,
              targetY: tPos.y,
              progress: 0
            });
          }
        });
      }

      // --- 5. FIBER OPTIC CONNECTIONS ---
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = pos[nodes[i].id];
          const n2 = pos[nodes[j].id];
          if (!n1 || !n2) continue;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 155) {
            ctx.save();
            ctx.strokeStyle = `rgba(203, 213, 225, ${0.4 * (1.0 - dist / 155)})`;
            ctx.lineWidth = 0.5;

            const midPointX = (n1.x + n2.x) / 2;
            const midPointY = (n1.y + n2.y) / 2;
            const offset = Math.sin((Date.now() / 1200) + i) * 6;
            const perpVectX = -dy / dist;
            const perpVectY = dx / dist;

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.quadraticCurveTo(midPointX + perpVectX * offset, midPointY + perpVectY * offset, n2.x, n2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Actual threat flow links with 3D Bezier
      links.forEach(link => {
        const sPos = pos[link.source];
        const tPos = pos[link.target];
        if (!sPos || !tPos) return;

        const isLinkSelected = selectedNodeRef.current && (
          selectedNodeRef.current.id === link.source || 
          selectedNodeRef.current.id === link.target
        );

        const isLinkHovered = hoveredNodeRef.current && (
          hoveredNodeRef.current.id === link.source ||
          hoveredNodeRef.current.id === link.target
        );

        const dx = tPos.x - sPos.x;
        const dy = tPos.y - sPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;

        const midX = (sPos.x + tPos.x) / 2;
        const midY = (sPos.y + tPos.y) / 2;
        const curveOffset = Math.min(dist * 0.16, 40);
        const pX = -dy / dist;
        const pY = dx / dist;
        const ctrlX = midX + pX * curveOffset;
        const ctrlY = midY + pY * curveOffset;

        ctx.save();
        if (isLinkSelected) {
          ctx.strokeStyle = 'rgba(234, 88, 12, 0.2)';
          ctx.lineWidth = 5.0;
          ctx.beginPath();
          ctx.moveTo(sPos.x, sPos.y);
          ctx.quadraticCurveTo(ctrlX, ctrlY, tPos.x, tPos.y);
          ctx.stroke();

          ctx.strokeStyle = '#EA580C';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(sPos.x, sPos.y);
          ctx.quadraticCurveTo(ctrlX, ctrlY, tPos.x, tPos.y);
          ctx.stroke();
        } else if (isLinkHovered) {
          ctx.strokeStyle = '#F97316';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(sPos.x, sPos.y);
          ctx.quadraticCurveTo(ctrlX, ctrlY, tPos.x, tPos.y);
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(sPos.x, sPos.y);
          ctx.quadraticCurveTo(ctrlX, ctrlY, tPos.x, tPos.y);
          ctx.stroke();
        }
        ctx.restore();
      });

      // --- 6. PHYSICAL EXPLOSION RINGS (SHOCKWAVES) ---
      rippleWavesRef.current.forEach(wave => {
        wave.r += 6.5;
        wave.opacity -= 0.018;

        ctx.save();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = Math.max(0, wave.opacity);
        ctx.shadowBlur = 18;
        ctx.shadowColor = wave.color;
        
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
      rippleWavesRef.current = rippleWavesRef.current.filter(w => w.opacity > 0);

      // --- 7. HUD COMPASS TELEMETRY BRACKETS FOR HUB NODES ---
      const activeTargets = [];
      if (selectedNodeRef.current) activeTargets.push({ node: selectedNodeRef.current, primary: true });
      if (hoveredNodeRef.current && hoveredNodeRef.current.id !== selectedNodeRef.current?.id) {
        activeTargets.push({ node: hoveredNodeRef.current, primary: false });
      }

      activeTargets.forEach(({ node, primary }) => {
        const p = pos[node.id];
        if (!p) return;

        const colors = getColors(node.type);
        const clockTicks = (Date.now() / 9);

        ctx.save();
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1.0;
        
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, primary ? 32 : 24, clockTicks * 0.04, clockTicks * 0.04 + Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.strokeStyle = `${colors.border}40`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, primary ? 38 : 28, 0, Math.PI * 2);
        ctx.stroke();

        // Quadrant hairpins
        const tickLength = 5;
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y - (primary ? 38 : 28));
        ctx.lineTo(p.x, p.y - (primary ? 38 : 28) + tickLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p.x, p.y + (primary ? 38 : 28));
        ctx.lineTo(p.x, p.y + (primary ? 38 : 28) - tickLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p.x - (primary ? 38 : 28), p.y);
        ctx.lineTo(p.x - (primary ? 38 : 28) + tickLength, p.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p.x + (primary ? 38 : 28), p.y);
        ctx.lineTo(p.x + (primary ? 38 : 28) - tickLength, p.y);
        ctx.stroke();

        if (primary) {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.font = '7.5px JetBrains Mono';
          ctx.fillText(`LOC: [${Math.floor(p.x)}px, ${Math.floor(p.y)}px]`, p.x + 45, p.y - 12);
          ctx.fillStyle = colors.border;
          ctx.fillText(`TRACER SECURE`, p.x + 45, p.y - 3);
        }
        ctx.restore();
      });

      // --- 8. COSMIC FLUID DUST SWARMS VORTEX ENGINE ---
      const nextParticles: ElegantParticle[] = [];
      particlesRef.current.forEach(p => {
        if (p.type !== 'star' && p.type !== 'cosmic_dust') {
          p.life -= p.decay;
          if (p.life <= 0) return;
        }

        if (p.type === 'star' || p.type === 'cosmic_dust') {
          if (p.angle !== undefined && p.speed !== undefined) {
            p.angle += p.speed * 0.02 * (isPlayingAutonomousMode ? 1.8 : 1.0);
            
            if (hasMouse) {
              const dx = mx - p.x;
              const dy = my - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const orbitLimit = isMouseDownRef.current ? 280 : 180;

              if (dist < orbitLimit) {
                const rotationVel = isMouseDownRef.current ? 4.5 : 1.8;
                const perpX = -dy / dist;
                const perpY = dx / dist;

                const pullVector = isMouseDownRef.current ? 0.4 : 0.15;
                p.vx += (dx / dist) * pullVector + perpX * rotationVel * 0.35;
                p.vy += (dy / dist) * pullVector + perpY * rotationVel * 0.35;

                p.size = Math.min(p.size + 0.06, 4.0);
              } else {
                p.vx += Math.sin(p.angle) * 0.012;
                p.vy += Math.cos(p.angle) * 0.012;
                p.size = Math.max(p.size - 0.015, 0.5);
              }
            } else {
              p.vx += Math.sin(p.angle) * 0.01;
              p.vy += Math.cos(p.angle) * 0.01;
            }

            p.vx *= 0.93;
            p.vy *= 0.93;
            p.x += p.vx;
            p.y += p.vy;

            // Loop edges bounds
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            p.alpha = 0.08 + Math.sin((p.angle || 0) * 1.5 + (Date.now() / 2500)) * 0.05;
          }
        } else if (p.type === 'stream') {
          if (p.progress !== undefined && p.targetX !== undefined && p.targetY !== undefined) {
            p.progress += 0.032;
            if (p.progress >= 1.0) {
              if (Math.random() < 0.25) {
                spawnSparkTrail(p.targetX, p.targetY, p.color, 4);
              }
              return;
            }

            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            p.x += dx * 0.14;
            p.y += dy * 0.14;
          }
        } else if (p.type === 'vortex') {
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = p.life;
        } else if (p.type === 'code' && p.text) {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = p.life;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.type === 'vortex' || p.type === 'stream') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        }

        if (p.type === 'code' && p.text) {
          ctx.fillStyle = p.color;
          ctx.font = 'bold 8.5px JetBrains Mono';
          ctx.fillText(p.text, p.x, p.y);
        } else if (p.type === 'star' || p.type === 'cosmic_dust') {
          // Soft rendering of subtle stars and occasional delicate space-crosshairs
          ctx.fillStyle = p.color;
          if (p.id % 24 === 0) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x - 3.5, p.y);
            ctx.lineTo(p.x + 3.5, p.y);
            ctx.moveTo(p.x, p.y - 3.5);
            ctx.lineTo(p.x, p.y + 3.5);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(p.x, p.y, 0.7, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        p.alpha = Math.max(0, p.alpha);
        if (p.type === 'star' || p.type === 'cosmic_dust' || p.life > 0) {
          nextParticles.push(p);
        }
      });
      particlesRef.current = nextParticles;

      // Draw faint, premium micro-constellation thread lines in the deep background space
      const bgStars = nextParticles.filter(p => p.type === 'star' || p.type === 'cosmic_dust');
      ctx.save();
      ctx.lineWidth = 0.35;
      for (let i = 0; i < bgStars.length; i++) {
        const s1 = bgStars[i];
        const checkLimit = Math.min(bgStars.length, i + 8);
        for (let j = i + 1; j < checkLimit; j++) {
          const s2 = bgStars[j];
          const dx = s2.x - s1.x;
          const dy = s2.y - s1.y;
          const dst = Math.sqrt(dx * dx + dy * dy);
          if (dst < 75) {
            ctx.strokeStyle = `rgba(234, 88, 12, ${0.08 * (1.0 - dst / 75) * (s1.alpha + s2.alpha)})`;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // --- 9. NODES (CLEAN LIGHT HUBS) ---
      nodes.forEach(node => {
        const p = pos[node.id];
        if (!p) return;

        const isSelected = selectedNodeRef.current?.id === node.id;
        const isHovered = hoveredNodeRef.current?.id === node.id;
        const colors = getColors(node.type);

        const hubBaseRadius = isSelected ? 20 : isHovered ? 16 : 11.0;

        ctx.save();
        
        // Depth level 1: Ambient halo glow
        ctx.fillStyle = colors.border;
        ctx.globalAlpha = isSelected ? 0.25 : isHovered ? 0.15 : 0.06;
        ctx.beginPath();
        ctx.arc(p.x, p.y, hubBaseRadius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Depth level 2: Solid white core
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, hubBaseRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = colors.border;
        ctx.lineWidth = isSelected ? 3.0 : isHovered ? 2.0 : 1.4;
        ctx.stroke();
        ctx.restore();

        // Risk status core indicator node
        ctx.save();
        if (node.status === 'quarantined') {
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(p.x, p.y, isSelected ? 6.0 : 4.0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = colors.border;
          ctx.beginPath();
          ctx.arc(p.x, p.y, isSelected ? 5.0 : 3.0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // High-contrast label cards floating below node hubs
        ctx.save();
        ctx.font = isSelected ? 'bold 9px JetBrains Mono' : '8px Outfit';
        ctx.textAlign = 'center';

        const labelText = node.label;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fillRect(p.x - 50, p.y - hubBaseRadius - 15, 100, 12);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(p.x - 50, p.y - hubBaseRadius - 15, 100, 12);

        ctx.fillStyle = isSelected ? colors.border : '#1E293B';
        ctx.fillText(labelText, p.x, p.y - hubBaseRadius - 6);

        if (isSelected) {
          ctx.fillStyle = '#EA580C';
          ctx.font = 'bold 8px JetBrains Mono';
          ctx.fillText(`IMPULSE SCORE: ${node.riskScore}%`, p.x, p.y + hubBaseRadius + 13);
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    // Canvas Mouse Click Handlers
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let foundNode: ThreatNode | null = null;
      let minDistance = 38;

      nodes.forEach(node => {
        const p = positionsRef.current[node.id];
        if (!p) return;
        const dist = Math.sqrt((p.x - clickX) ** 2 + (p.y - clickY) ** 2);
        if (dist < minDistance) {
          minDistance = dist;
          foundNode = node;
        }
      });

      if (foundNode) {
        const p = positionsRef.current[foundNode.id];
        if (p) {
          const colors = getColors(foundNode.type);
          
          spawnSparkTrail(p.x, p.y, colors.border, 60);
          
          for (let c = 0; c < 5; c++) {
            spawnFloatingCode(p.x, p.y - 10, colors.border);
          }

          rippleWavesRef.current.push({
            x: p.x,
            y: p.y,
            r: 10,
            maxR: 240,
            opacity: 0.95,
            color: colors.border
          });
        }
        onSelectNode(foundNode);
      } else {
        // Clicking deep space drops selection
        onSelectNode(null);
      }
    };

    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      mousePosRef.current = { x: clickX, y: clickY };

      let curHover: ThreatNode | null = null;
      let minDistance = 32;

      nodes.forEach(node => {
        const p = positionsRef.current[node.id];
        if (!p) return;
        const dist = Math.sqrt((p.x - clickX) ** 2 + (p.y - clickY) ** 2);
        if (dist < minDistance) {
          minDistance = dist;
          curHover = node;
        }
      });

      // Avoid heavy React thrashes: only dispatch when target ID strictly shifts
      if (curHover !== hoveredNodeRef.current) {
        hoveredNodeRef.current = curHover;
        setHoveredNodeState(curHover);

        if (curHover) {
          const p = positionsRef.current[(curHover as ThreatNode).id];
          if (p) {
            const colors = getColors((curHover as ThreatNode).type);
            spawnSparkTrail(p.x, p.y, colors.border, 12);
          }
        }
      }
    };

    const handleCanvasMouseDown = () => {
      isMouseDownRef.current = true;
      const mX = mousePosRef.current.x;
      const mY = mousePosRef.current.y;
      const hasCurrentMouse = mX > 0 && mY > 0;
      if (hasCurrentMouse) {
        rippleWavesRef.current.push({
          x: mX,
          y: mY,
          r: 5,
          maxR: 190,
          opacity: 0.8,
          color: '#00F0FF'
        });

        spawnSparkTrail(mX, mY, '#FFB000', 25);
      }
    };

    const handleCanvasMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleCanvasMouseLeave = () => {
      mousePosRef.current = { x: -999, y: -999 };
      isMouseDownRef.current = false;
      hoveredNodeRef.current = null;
      setHoveredNodeState(null);
    };

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('mouseleave', handleCanvasMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
      canvas.removeEventListener('mousedown', handleCanvasMouseDown);
      canvas.removeEventListener('mouseup', handleCanvasMouseUp);
      canvas.removeEventListener('mouseleave', handleCanvasMouseLeave);
    };
  }, [nodes, links, isPlayingAutonomousMode]);

  const getNodeMetaLabel = (type: string) => {
    switch (type) {
      case 'RENT': return 'Housing Rent Core';
      case 'SHOPPING': return 'Retail & Shopping';
      case 'MEDICATION': return 'Healthcare & Pharma';
      case 'DINING': return 'Dining & Food Delivery';
      case 'INVESTMENT': return 'Wealth SIP Investment';
      case 'UTILITIES': return 'Essential Utility Bill';
      case 'TRAVEL': return 'Travel & Commute';
      case 'SUBSCRIPTIONS': return 'Digital Subscriptions';
      default: return 'Spending Vector';
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[600px] lg:h-[720px] rounded-2xl overflow-hidden text-left select-none border border-slate-200 bg-white shadow-sm"
    >
      {/* 1. IMMERSIVE CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full cursor-crosshair z-0" />
      
      {/* 2. HUD LABELS */}
      <div className="absolute top-5 left-6 pointer-events-none z-10 flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-orange-600 flex items-center gap-2">
          <Radio className="animate-pulse text-orange-500 shrink-0" size={12} />
          SPENDING MATRIX CONSTELLATION
        </div>
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
          SYSTEM ACTIVE • SELECT EXPENSE HUBS TO ANALYZE EMOTIONAL EXPENDITURE
        </div>
      </div>

      {/* 3. DYNAMIC FLOATING CONNECTOR GRAPH HOVER POPUP */}
      <AnimatePresence>
        {hoveredNodeState && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-6 bottom-[75px] pointer-events-none z-20 max-w-[280px] p-4 bg-white/95 border border-orange-200 rounded-xl backdrop-blur-md shadow-lg"
          >
            <div className="flex items-center gap-2 mb-1 text-orange-600">
              <Orbit size={12} className="animate-spin text-orange-500" style={{ animationDuration: '4s' }} />
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider">
                {getNodeMetaLabel(hoveredNodeState.type)}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase truncate tracking-wide">{hoveredNodeState.label}</h4>
            <p className="text-[9px] font-mono text-slate-600 leading-relaxed mt-1 uppercase">
              {hoveredNodeState.details.summary || 'INTEGRATED TRANSACTIONS CORRELATING THREAT CHANNELS.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. LEGEND OVERLAY BAR */}
      <div className="absolute bottom-5 left-6 pointer-events-none z-10 hidden sm:flex justify-between items-center bg-white/90 backdrop-blur-md border border-slate-200 py-2 px-4 rounded-xl text-[8px] font-bold tracking-wider uppercase gap-6 shadow-sm">
        <div className="flex gap-4 text-slate-700">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" /> RENT
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> SHOPPING
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> DINING
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> INVESTMENT
          </span>
        </div>
        <span className="text-[8px] font-mono text-slate-400 border-l border-slate-200 pl-4 h-3 flex items-center">
          ARGUS CONSTELLATION
        </span>
      </div>

      {/* 5. TELEMETRY SIDEBAR */}
      <div className="absolute top-4 right-4 bottom-4 w-full sm:w-[260px] z-20 pointer-events-none flex flex-col justify-end">
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 15, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.97 }}
              className="w-full bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl p-4 flex flex-col pointer-events-auto shadow-xl max-h-full overflow-y-auto relative text-slate-800"
            >
              <button
                onClick={() => onSelectNode(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-200 transition-all cursor-pointer text-[8px] font-mono uppercase tracking-wider"
              >
                × CLOSE
              </button>

              <div className="mt-1 text-left">
                <div className="flex justify-between items-start mb-3 relative z-10 pr-12">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded bg-orange-50 border border-orange-200 text-orange-600">
                      <Zap size={11} className="text-orange-500 shrink-0" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[7px] font-mono font-black uppercase text-slate-400 tracking-wider">CATEGORY</span>
                      <span className="text-[9px] font-bold text-slate-800 uppercase tracking-wider">{selectedNode.type}</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-100 pb-2 mb-2">
                  <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase leading-snug mb-0.5 break-words">{selectedNode.label}</h3>
                  <div className="flex items-center gap-1 text-[7.5px] font-mono text-orange-600 tracking-wider uppercase">
                    <Radio size={8} className="animate-ping text-orange-500" />
                    <span>IMPULSE METRIC HUB</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-b border-slate-100 pb-2 mb-2 font-mono">
                  {Object.entries(selectedNode.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start text-[8.5px] gap-2">
                      <span className="text-slate-400 uppercase tracking-wider text-[7px] font-bold mt-0.5 shrink-0">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-medium text-slate-800 max-w-[130px] text-right break-all leading-normal uppercase">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 mb-2 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[7px] uppercase tracking-wider text-slate-500 font-bold font-mono">IMPULSIVENESS SCORE</span>
                    <span className="text-[10px] font-black font-mono text-orange-600">{selectedNode.riskScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden p-[1px]">
                    <div 
                      className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${selectedNode.riskScore}%` }} 
                    />
                  </div>
                </div>

                <div className="text-[7.5px] font-mono leading-relaxed text-slate-500 uppercase tracking-wider flex items-center gap-1 text-left">
                  <AlertTriangle size={9} className="text-orange-500 shrink-0" />
                  <span>Cognitive spending matrix tracks emotional purchase patterns.</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="w-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3.5 flex flex-col items-start gap-2 text-left pointer-events-auto cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-2 w-full">
                <div className="p-1 px-1.5 rounded-lg bg-orange-50 border border-orange-200">
                  <Orbit className="text-orange-600 animate-spin" size={13} style={{ animationDuration: '6s' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[8.5px] font-black uppercase tracking-wider text-slate-900 leading-none mb-0.5">COGNITIVE INDEX ONLINE</h4>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wide">Ready for selection</span>
                  </div>
                </div>
              </div>
              <p className="text-[8px] text-slate-500 leading-snug uppercase font-mono border-t border-slate-100 pt-1.5 w-full">
                Tap any spending star to analyze impulsive cognitive ratios & budget impact.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
