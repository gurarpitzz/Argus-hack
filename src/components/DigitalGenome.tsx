import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DigitalDNAProfile } from '../types';
import { 
  Dna, Sparkles, Zap, Crosshair, Gauge, ShieldAlert, Radio
} from 'lucide-react';
import { cn } from '../lib/utils';

// Particle definition for highly responsive dynamic interactions
interface CoterieParticle {
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
  type: 'swarm' | 'spark' | 'binary' | 'dust' | 'pulse';
  text?: string;
  angle?: number;
  angleSpeed?: number;
  radius?: number;
}

interface InteractiveDnaNode {
  id: string;
  strand: number; // 0 or 1
  percent: number;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isAttracted: boolean;
  label: string;
  description: string;
  phase: number;
}

interface DigitalGenomeProps {
  genome: DigitalDNAProfile;
  isPlayingAutonomousMode?: boolean;
}

const INTERACTIVE_GENES = [
  { label: 'android.permission.RECEIVE_SMS', desc: 'Intercepts one-time banking authentication PINs silently' },
  { label: 'dex.payload.decrypter', desc: 'Decrypts core malware payloads loaded at runtime memory' },
  { label: 'c2.gateway.handshake', desc: 'Secure connection handshake with secure command central server' },
  { label: 'android.permission.SYSTEM_ALERT_WINDOW', desc: 'Overlays fake banking portals to harvest login items' },
  { label: 'accessibility.service.sniff', desc: 'Keylogger logging sensitive user entries and wallets' },
  { label: 'root.check.bypass', desc: 'Evades virtualization, emulators, and active inspection blocks' },
  { label: 'device.telemetry.drain', desc: 'Leaks cellular ICCID, IMSI, and personal storage flags' },
  { label: 'anti_analysis.debugger_check', desc: 'Halts process execution when system analyst attachment trace detected' }
];

export const DigitalGenome: React.FC<DigitalGenomeProps> = ({
  genome,
  isPlayingAutonomousMode = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hoveredGeneDetails, setHoveredGeneDetails] = useState<{ label: string; desc: string } | null>(null);
  const [isBurstActive, setIsBurstActive] = useState<boolean>(false);
  const [isHoldingClick, setIsHoldingClick] = useState<boolean>(false);
  const [interactionCombo, setInteractionCombo] = useState<number>(0);
  
  const [quantumDecryptions, setQuantumDecryptions] = useState<string[]>([
    'DETECTOR: FULL MATRIX MODE ACTIVE',
    'INTERACTIVE COTERIE SWARMS ONLINE',
    'CLICK / DRAG TO WARP SPACE-TIME REALMS'
  ]);

  // Physics and particle references
  const particlesRef = useRef<CoterieParticle[]>([]);
  const particleIdCounterRef = useRef<number>(0);
  const dnaNodesRef = useRef<InteractiveDnaNode[]>([]);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const isMouseDownRef = useRef<boolean>(false);
  const rippleWavesRef = useRef<{ x: number; y: number; r: number; maxR: number; opacity: number }[]>([]);
  const animationAngleRef = useRef<number>(0);

  // Avoid jitter re-renders: Use reference to track currently active hover details to prevent react thrashing 
  const currentHoveredNodeIdRef = useRef<string | null>(null);

  // Initialize massive, denser double helix nodes vertically
  const initVerticalDnaNodes = (w: number, h: number) => {
    const nodes: InteractiveDnaNode[] = [];
    const numPoints = 28; // Majestic density
    const padding = 45; // smaller padding for bigger, taller screen footprint
    const strandLength = h - padding * 2;

    for (let i = 0; i < numPoints; i++) {
      const percent = i / (numPoints - 1);
      const baseY = padding + percent * strandLength;
      const geneData = INTERACTIVE_GENES[i % INTERACTIVE_GENES.length];

      // Strand 1 node
      nodes.push({
        id: `strand0-node-${i}`,
        strand: 0,
        percent,
        baseX: w / 2,
        baseY,
        x: w / 2,
        y: baseY,
        vx: 0,
        vy: 0,
        isAttracted: false,
        label: geneData.label,
        description: geneData.desc,
        phase: 0
      });

      // Strand 2 node
      nodes.push({
        id: `strand1-node-${i}`,
        strand: 1,
        percent,
        baseX: w / 2,
        baseY,
        x: w / 2,
        y: baseY,
        vx: 0,
        vy: 0,
        isAttracted: false,
        label: geneData.label,
        description: geneData.desc,
        phase: Math.PI
      });
    }

    // Populate grand cosmic swarm (now 620 ambient particles!)
    const swarmCount = 620;
    const initialParticles: CoterieParticle[] = [];
    for (let i = 0; i < swarmCount; i++) {
      particleIdCounterRef.current++;
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      const roll = Math.random();
      const color = roll > 0.8 
        ? '#FF3B30' // threat-crimson spark 
        : roll > 0.4 
          ? '#00F0FF' // data-cyan
          : '#FFB000'; // energetic amber
      
      initialParticles.push({
        id: particleIdCounterRef.current,
        x: rx,
        y: ry,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        color,
        size: Math.random() * 2.8 + 0.6,
        alpha: Math.random() * 0.75 + 0.15,
        life: 1.0,
        decay: Math.random() * 0.001 + 0.0003,
        type: Math.random() > 0.85 ? 'dust' : 'swarm',
        angleSpeed: (Math.random() - 0.5) * 0.035,
        radius: Math.random() * 110 + 40,
        angle: Math.random() * Math.PI * 2
      });
    }
    particlesRef.current = initialParticles;
    dnaNodesRef.current = nodes;
  };

  // Safe manual spark injector
  const spawnSpark = (x: number, y: number, color: string, type: 'spark' | 'binary' | 'swarm' = 'spark', customText?: string) => {
    particleIdCounterRef.current++;
    const angle = Math.random() * Math.PI * 2;
    const speed = type === 'binary' ? Math.random() * 2.8 + 1.2 : Math.random() * 5.8 + 1.8;
    
    particlesRef.current.push({
      id: particleIdCounterRef.current,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: type === 'binary' ? 9.5 : Math.random() * 4.8 + 1.2,
      alpha: 1.0,
      life: 1.0,
      decay: Math.random() * 0.032 + 0.008,
      type: type === 'binary' ? 'binary' : 'spark',
      text: customText || (Math.random() > 0.5 ? '1' : '0')
    });
  };

  const createRipple = (x: number, y: number) => {
    rippleWavesRef.current.push({
      x,
      y,
      r: 4,
      maxR: Math.random() * 200 + 130,
      opacity: 0.9
    });
  };

  const triggerQuantumBurst = () => {
    if (!canvasRef.current) return;
    const w = canvasRef.current.width / window.devicePixelRatio;
    const h = canvasRef.current.height / window.devicePixelRatio;
    
    setIsBurstActive(true);
    setInteractionCombo(prev => prev + 1);

    const burstX = mousePosRef.current.x > 0 ? mousePosRef.current.x : w / 2;
    const burstY = mousePosRef.current.y > 0 ? mousePosRef.current.y : h / 2;

    createRipple(burstX, burstY);

    const updates = [
      'QUANTUM SECURE DECRYPTION: COGNITIVE BOOST ACTIVE',
      'COTERIE COHERENCE RATIO: SHIFTED',
      'COMBO EVENT: ' + (interactionCombo + 1) + 'X FIELD VELOCITY',
      'GRAVATATIONAL ROTATIONAL FIELD RESONATED: 100%'
    ];
    setQuantumDecryptions(prev => [updates[Math.floor(Math.random() * updates.length)], ...prev.slice(0, 5)]);

    // Emit magnificent cascade of particles
    for (let i = 0; i < 180; i++) {
      const sparkColor = i % 3 === 0 ? '#EA580C' : i % 3 === 1 ? '#F97316' : '#FB923C';
      const binaryLabel = Math.random() > 0.82 
        ? 'ARGUS' 
        : Math.random() > 0.6 
          ? '0x' + Math.floor(Math.random() * 256).toString(16).toUpperCase() 
          : Math.random() > 0.5 ? '1' : '0';

      spawnSpark(
        burstX, 
        burstY, 
        sparkColor,
        Math.random() > 0.45 ? 'binary' : 'spark',
        binaryLabel
      );
    }

    setTimeout(() => setIsBurstActive(false), 300);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      isMouseDownRef.current = false;
      setIsHoldingClick(false);
    };
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const resizeAndInit = () => {
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 720;
      
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initVerticalDnaNodes(width, height);
    };

    resizeAndInit();
    window.addEventListener('resize', resizeAndInit);

    // Dynamic Render loop
    const render = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      if (w === 0 || h === 0) {
        animFrame = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Continuous 3.5D Twist rotation flow
      const frameSpeedMultiplier = isHoldingClick ? 0.045 : isPlayingAutonomousMode ? 0.025 : 0.008;
      animationAngleRef.current += frameSpeedMultiplier;

      const padding = 50;
      const strandLength = h - padding * 2;
      const centerColumnX = w / 2;
      
      // Much larger, grander double helix sizing footprint
      const helixWidth = Math.min(w * 0.54, 380);

      if (dnaNodesRef.current.length === 0) {
        initVerticalDnaNodes(w, h);
      }

      // Light mode canvas background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      const radialGlow = ctx.createRadialGradient(
        centerColumnX, h / 2, 80,
        centerColumnX, h / 2, Math.max(w, h) * 0.72
      );
      radialGlow.addColorStop(0, 'rgba(255, 237, 213, 0.45)');
      radialGlow.addColorStop(0.3, 'rgba(254, 215, 170, 0.2)');
      radialGlow.addColorStop(0.6, 'rgba(241, 245, 249, 0.3)');
      radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, w, h);

      // 1. Interactive Gravity Warping Background Grid Mesh
      ctx.save();
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.75)';
      ctx.lineWidth = 0.5;

      const stepsX = 24;
      const stepsY = 24;
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      const hasMouse = mx > 0 && my > 0;

      // Render gravitational warped horizontal lines
      for (let gy = 0; gy <= h; gy += h / stepsY) {
        ctx.beginPath();
        for (let gx = 0; gx <= w; gx += w / 32) {
          let px = gx;
          let py = gy;

          if (hasMouse) {
            const dx = mx - gx;
            const dy = my - gy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const reachDistance = 240;
            if (dist < reachDistance) {
              const factor = (1.0 - dist / reachDistance);
              const pullAmount = factor * factor * (isHoldingClick ? 42 : 20);
              px -= (dx / dist) * pullAmount;
              py -= (dy / dist) * pullAmount;
            }
          }

          if (gx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Render gravitational warped vertical lines
      for (let gx = 0; gx <= w; gx += w / stepsX) {
        ctx.beginPath();
        for (let gy = 0; gy <= h; gy += h / 32) {
          let px = gx;
          let py = gy;

          if (hasMouse) {
            const dx = mx - gx;
            const dy = my - gy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const reachDistance = 240;
            if (dist < reachDistance) {
              const factor = (1.0 - dist / reachDistance);
              const pullAmount = factor * factor * (isHoldingClick ? 42 : 20);
              px -= (dx / dist) * pullAmount;
              py -= (dy / dist) * pullAmount;
            }
          }

          if (gy === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Drag gravity core vortex indicators
      if (isHoldingClick && hasMouse) {
        ctx.save();
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 12]);
        ctx.beginPath();
        ctx.arc(mx, my, 75, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)';
        ctx.beginPath();
        ctx.arc(mx, my, 130, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Ripple rings
      rippleWavesRef.current.forEach((ripple) => {
        ripple.r += 6.0;
        ripple.opacity -= 0.016;
        
        ctx.save();
        ctx.strokeStyle = `rgba(234, 88, 12, ${ripple.opacity})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
      rippleWavesRef.current = rippleWavesRef.current.filter(r => r.opacity > 0);

      // 3. Scan Indicator Laser Beam
      const scanY = (Date.now() / 10) % h;
      ctx.save();
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();
      ctx.restore();

      let closestNode: InteractiveDnaNode | null = null;
      let minDistance = 160;

      // 4. Kinetic Spring Helix Formulation
      dnaNodesRef.current.forEach((node) => {
        const percent = node.percent;
        const targetY = padding + percent * strandLength;

        const angle = percent * Math.PI * 6.2 + animationAngleRef.current;
        const phaseShift = node.phase;
        const z = Math.cos(angle + phaseShift);
        
        const baseAmp = (helixWidth / 2);
        const breathMod = 1.15 + Math.sin(animationAngleRef.current * 0.4) * 0.06;
        const targetX = centerColumnX + Math.sin(angle + phaseShift) * baseAmp * breathMod;

        // Base physics forces
        const fx = (targetX - node.x) * 0.08;
        const fy = (targetY - node.y) * 0.08;
        node.vx += fx;
        node.vy += fy;

        if (hasMouse) {
          const dx = mx - node.x;
          const dy = my - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const reachDistance = isHoldingClick ? 260 : 180;
          if (distance < reachDistance) {
            node.isAttracted = true;

            const pullPower = isHoldingClick ? 0.22 : 0.11;
            const factor = (reachDistance - distance) / reachDistance;
            
            node.vx += (dx / distance) * factor * factor * pullPower * 8;
            node.vy += (dy / distance) * factor * factor * pullPower * 8;

            if (distance < minDistance) {
              minDistance = distance;
              closestNode = node;
            }

            if (Math.random() < (isHoldingClick ? 0.35 : 0.16)) {
              spawnSpark(
                node.x, 
                node.y, 
                node.strand === 0 ? '#EA580C' : '#F97316',
                'binary',
                Math.random() > 0.65 ? '1' : '0'
              );
            }
          } else {
            node.isAttracted = false;
          }
        } else {
          node.isAttracted = false;
        }

        node.vx *= 0.74;
        node.vy *= 0.74;
        node.x += node.vx;
        node.y += node.vy;
      });

      const activeNodeId = closestNode ? (closestNode as InteractiveDnaNode).id : null;
      if (activeNodeId !== currentHoveredNodeIdRef.current) {
        currentHoveredNodeIdRef.current = activeNodeId;
        if (closestNode) {
          setHoveredGeneDetails({
            label: (closestNode as InteractiveDnaNode).label,
            desc: (closestNode as InteractiveDnaNode).description
          });
        } else {
          setHoveredGeneDetails(null);
        }
      }

      // 5. Drawing Rungs (Bridges)
      const segmentsCount = dnaNodesRef.current.length / 2;
      for (let i = 0; i < segmentsCount; i++) {
        const n1 = dnaNodesRef.current[i * 2];
        const n2 = dnaNodesRef.current[i * 2 + 1];
        if (!n1 || !n2) continue;

        const isChainHighlighted = n1.isAttracted || n2.isAttracted;
        ctx.save();
        
        if (isChainHighlighted) {
          ctx.strokeStyle = '#EA580C';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 6. Draw vertical pipelines
      for (let s = 0; s < 2; s++) {
        const strandNodes = dnaNodesRef.current.filter(n => n.strand === s);
        ctx.save();
        ctx.strokeStyle = s === 0 ? 'rgba(234, 88, 12, 0.5)' : 'rgba(249, 115, 22, 0.5)';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        strandNodes.forEach((n, idx) => {
          if (idx === 0) ctx.moveTo(n.x, n.y);
          else ctx.lineTo(n.x, n.y);
        });
        ctx.stroke();
        ctx.restore();
      }

      // 7. Render DNA Atom Nodes
      dnaNodesRef.current.forEach((node) => {
        const angle = node.percent * Math.PI * 6.2 + animationAngleRef.current;
        const phaseShift = node.phase;
        const z = Math.cos(angle + phaseShift);

        const atomBaseSize = node.isAttracted ? 15.5 : 8.5;
        const dSize = Math.max(4.0, atomBaseSize * (1.1 + z * 0.45));
        const color = node.isAttracted 
          ? '#EA580C' 
          : node.strand === 0 
            ? '#EA580C' 
            : '#F97316';

        // Electric ring surrounding attracted nodes
        if (node.isAttracted) {
          ctx.save();
          ctx.strokeStyle = 'rgba(234, 88, 12, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, dSize * 2.1, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        // Layer 1: Ambient halo glow
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(node.x, node.y, dSize * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Layer 2: White body with solid border
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(node.x, node.y, dSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Layer 3: Solid center dot
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, dSize * 0.45, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        // Connected labels
        if (node.isAttracted) {
          ctx.save();
          ctx.fillStyle = '#1E293B';
          ctx.font = 'bold 9px JetBrains Mono';
          ctx.fillText(node.label.split('.').pop() || '', node.x + dSize + 9, node.y + 3);
          ctx.restore();
        }
      });

      // 8. Swarm particles Vortex physics
      const nextParticles: CoterieParticle[] = [];
      particlesRef.current.forEach(p => {
        if (p.type !== 'swarm' && p.type !== 'dust') {
          p.life -= p.decay;
          if (p.life <= 0) return;
        }

        if (p.type === 'swarm' || p.type === 'dust') {
          if (p.angle !== undefined && p.angleSpeed !== undefined) {
            p.angle += p.angleSpeed;
            
            if (hasMouse) {
              const dx = mx - p.x;
              const dy = my - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const reachDistance = isHoldingClick ? 290 : 190;
              
              if (dist < reachDistance) {
                // Swirling vortex mechanics around coordinates
                const pullPower = isHoldingClick ? 0.36 : 0.18;
                const perpX = -dy / dist; // Rotational perpendicular force vector
                const perpY = dx / dist;

                const swirlSpeed = isHoldingClick ? 3.2 : 1.6;
                p.vx += (dx / dist) * pullPower + perpX * swirlSpeed;
                p.vy += (dy / dist) * pullPower + perpY * swirlSpeed;

                p.size = Math.min(p.size + 0.11, 5.8);
                p.alpha = Math.min(p.alpha + 0.08, 1.0);
              } else {
                p.vx += (Math.sin(p.angle) * 0.024);
                p.vy += (Math.cos(p.angle) * 0.024);
                p.size = Math.max(p.size - 0.04, 1.2);
              }
            } else {
              p.vx += (Math.sin(p.angle) * 0.02);
              p.vy += (Math.cos(p.angle) * 0.02);
            }

            p.vx *= 0.93;
            p.vy *= 0.93;
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            p.alpha = 0.58 + Math.sin(p.angle * 2.4) * 0.28;
          }
        } else {
          // Floating sparks 
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.035; // Gravity weight pull
          p.alpha = p.life;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        if (p.type === 'spark' || p.type === 'binary') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        }

        if (p.type === 'binary' && p.text) {
          ctx.fillStyle = p.color;
          ctx.font = 'bold 9.5px JetBrains Mono';
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (p.type === 'swarm' || p.type === 'dust' || p.life > 0) {
          nextParticles.push(p);
        }
      });
      particlesRef.current = nextParticles;

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resizeAndInit);
    };
  }, [isPlayingAutonomousMode, isHoldingClick]);

  // Pointer tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mousePosRef.current = { x, y };

    if (isMouseDownRef.current && Math.random() < 0.55) {
      spawnSpark(
        x, 
        y, 
        Math.random() > 0.5 ? '#00F0FF' : '#FFB000', 
        Math.random() > 0.65 ? 'binary' : 'spark',
        Math.random() > 0.5 ? '1' : '0'
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isMouseDownRef.current = true;
    setIsHoldingClick(true);
    triggerQuantumBurst();
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: -999, y: -999 };
    isMouseDownRef.current = false;
    setIsHoldingClick(false);
    setHoveredGeneDetails(null);
    currentHoveredNodeIdRef.current = null;
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[550px] lg:h-[720px] relative border border-slate-200 bg-white rounded-2xl overflow-hidden flex flex-col group select-none text-left shadow-sm"
    >
      
      {/* IMMERSIVE FULL-CONTAINER INTERACTIVE DNA STAGE */}
      <div 
        className="absolute inset-0 z-0 cursor-crosshair overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>

      {/* OVERLAID IMMERSIVE INTERACTION TELEMETRY */}
      <div className="absolute top-5 left-5 right-5 z-10 flex flex-col sm:flex-row justify-between items-start gap-4 pointer-events-none">
        
        {/* Left Info HUD */}
        <div className="bg-white/90 backdrop-blur-md px-4 py-3 border border-slate-200 rounded-xl flex flex-col gap-1 pointer-events-auto shadow-sm">
          <div className="flex items-center gap-2">
            <Dna className="text-orange-600 animate-pulse shrink-0" size={15} />
            <span className="text-[10px] font-black tracking-wider text-orange-600 uppercase">DIGITAL DNA COGNITIVE MATRIX</span>
          </div>
          <p className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wide leading-relaxed">
            TROJAN RECONSTITUTION • CLICK / DRAG TO WARP SURFACE MESH
          </p>
        </div>

        {/* Right Info HUD */}
        <div className="bg-white/90 backdrop-blur-md px-4 py-3 border border-slate-200 rounded-xl pointer-events-auto flex items-center gap-4 shadow-sm w-full sm:w-auto max-w-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-[7.5px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1">
                <Gauge size={10} className="text-orange-500" /> GENOME ENTROPY
              </span>
              <span className="text-[6.5px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 rounded">
                SECURE_RUN
              </span>
            </div>
            
            <div className="flex gap-2 items-baseline mt-1">
              <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                {genome.entropy.toFixed(3)}
              </span>
              <span className="text-[7.5px] font-mono text-orange-600 tracking-wider uppercase">bits / sec</span>
            </div>
          </div>

          <div className="flex-1 sm:w-28 flex flex-col gap-1.5 justify-center">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-full rounded-full transition-all duration-300" 
                style={{ width: `${(genome.entropy / 8) * 100}%` }} 
              />
            </div>
            <div className="flex justify-between text-[6.5px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              <span>0.0 BASE</span>
              <span className="text-orange-600">8.0 MAX</span>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED INTERACTIVE MOLECULAR POPUP DISPLAY */}
      <AnimatePresence>
        {hoveredGeneDetails && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute left-6 bottom-[80px] max-w-[340px] p-4 bg-white/95 border border-orange-200 rounded-xl z-20 backdrop-blur-md text-left shadow-lg"
          >
            <div className="flex items-center gap-2 mb-1.5 text-orange-600">
              <ShieldAlert size={12} className="animate-pulse" />
              <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider">TROJAN SIGNATURE GENE</span>
            </div>
            <div className="font-mono text-[9.5px] font-black text-slate-900 uppercase break-all leading-normal">
              {hoveredGeneDetails.label}
            </div>
            <p className="text-[8.5px] text-slate-600 font-mono text-left leading-relaxed mt-1.5 uppercase tracking-wide">
              {hoveredGeneDetails.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING BASE LEVEL STAGE CONTROL PANEL */}
      <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col sm:flex-row justify-between items-center gap-3 pointer-events-none">
        
        {/* Interaction controls */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            onClick={triggerQuantumBurst}
            className={cn(
              "py-2.5 px-4 rounded-xl border font-mono text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-sm",
              isBurstActive
                ? "bg-orange-600 border-orange-600 text-white scale-95"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
            )}
          >
            <Sparkles size={12} className={cn("text-orange-500", isBurstActive && "animate-spin")} />
            INJECT PACKET COLLIDER
          </button>

          <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md flex items-center gap-2 text-[8px] font-mono text-slate-600 shadow-sm">
            <span className="uppercase text-slate-400 font-bold tracking-wider">TROJAN RATIO:</span>
            <span className="text-orange-600 font-black tracking-wider">{genome.riskScore}%</span>
          </div>

          {interactionCombo > 0 && (
            <div className="px-3 py-2.5 rounded-xl border border-orange-200 bg-orange-50 backdrop-blur-md text-orange-600 text-[8px] font-mono font-black uppercase tracking-wider animate-bounce">
              COMBO x{interactionCombo}
            </div>
          )}
        </div>

        {/* Streaming Logs list bottom right */}
        <div className="text-center sm:text-right pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 flex flex-col gap-0.5 max-w-[280px] shadow-sm">
          <div className="text-[8px] font-mono font-black text-orange-600 uppercase tracking-wider flex items-center gap-1 justify-center sm:justify-end">
            <Zap size={9} className="fill-orange-500 text-orange-500" /> PARTICLE DECRYPTER PULSE
          </div>
          <div className="text-[7px] font-mono text-slate-500 text-left truncate tracking-tight uppercase w-full">
            &gt; {quantumDecryptions[0]}
          </div>
        </div>

      </div>

    </div>
  );
};
