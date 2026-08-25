import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Maximize2,
  Minimize2,
  Shield,
  Smartphone,
  Radio,
  Building2,
  PhoneCall,
  TowerControl,
  Globe,
  AlertTriangle,
  Zap,
  Info,
  CheckCircle2,
  Copy,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  Layers,
  Lock,
  Wifi
} from 'lucide-react';
import { cn } from '../lib/utils';

export type EntityType = 'ALL' | 'SIM' | 'IMEI' | 'IP' | 'BANK' | 'PHONE' | 'TOWER';

export interface GraphNode {
  id: string;
  type: 'SIM' | 'IMEI' | 'IP' | 'BANK' | 'PHONE' | 'TOWER';
  labelHeader: string;
  labelMain: string;
  labelSub?: string;
  normX: number; // Normalized coordinates -1 to 1 from center
  normY: number;
  riskScore: number;
  status: 'active' | 'flagged' | 'quarantined' | 'intercepted';
  details: {
    fullName: string;
    identifier: string;
    carrierOrBank?: string;
    location?: string;
    protocolOrModel?: string;
    telemetryRate?: string;
    riskReason: string;
    lastPing: string;
    connectionsCount: number;
  };
}

export interface GraphLink {
  source: string;
  target: string;
  color?: string;
  style?: 'dashed' | 'solid';
  animatedParticles?: boolean;
}

const ENTITY_NODES: GraphNode[] = [
  {
    id: 'node-imei-center',
    type: 'IMEI',
    labelHeader: 'IMEI',
    labelMain: '3567891043',
    labelSub: 'XXXX',
    normX: 0,
    normY: 0.12,
    riskScore: 98,
    status: 'quarantined',
    details: {
      fullName: 'Primary Adversary Terminal (Dual SIM GSM)',
      identifier: 'IMEI 356789104381924',
      protocolOrModel: 'MediaTek Dimensity 7050 / Custom Android ROM',
      location: 'Triangulated at Jamtara Grid Sector 05',
      telemetryRate: '48.2 req/sec C2 Broadcast',
      riskReason: 'Central cyber syndication hub coordinating SIM farm rotation and mule siphoning.',
      lastPing: 'Live Synchronized (12ms)',
      connectionsCount: 10
    }
  },
  {
    id: 'node-ip-10',
    type: 'IP',
    labelHeader: 'IP',
    labelMain: '103.27.XX.10',
    normX: -0.22,
    normY: -0.55,
    riskScore: 89,
    status: 'flagged',
    details: {
      fullName: 'Command & Control Gateway Node #1',
      identifier: '103.27.89.10 (Port 443 / 8080 TLS)',
      protocolOrModel: 'Encrypted Reverse Proxy / WireGuard VPN Tunnel',
      location: 'Bengaluru Exit Node Relay (AS133618)',
      telemetryRate: '12.4 MB/s Payload Stream',
      riskReason: 'Receives intercepted SMS OTP packets directly from infected malicious APKs.',
      lastPing: '3 sec ago',
      connectionsCount: 3
    }
  },
  {
    id: 'node-ip-11',
    type: 'IP',
    labelHeader: 'IP',
    labelMain: '103.27.XX.11',
    normX: 0.35,
    normY: -0.45,
    riskScore: 84,
    status: 'flagged',
    details: {
      fullName: 'Shadow Exfiltration Host #2',
      identifier: '103.27.89.11 (WebSocket C2)',
      protocolOrModel: 'Node.js Botnet Orchestrator',
      location: 'Singapore Virtual Datacenter (Decoy Host)',
      telemetryRate: '8.1 MB/s Infiltration Rate',
      riskReason: 'Synchronizes adversary honeypot evasion algorithms and payload decryption keys.',
      lastPing: '7 sec ago',
      connectionsCount: 2
    }
  },
  {
    id: 'node-tower',
    type: 'TOWER',
    labelHeader: 'TOWER',
    labelMain: '27831',
    labelSub: '(Sector 05)',
    normX: 0.78,
    normY: -0.46,
    riskScore: 65,
    status: 'active',
    details: {
      fullName: 'Cellular Base Transceiver Tower #27831',
      identifier: 'Cell ID: 27831 (LAC: 4108 / MCC: 404)',
      protocolOrModel: '4G LTE / Carrier Geo-Triangulation Cell',
      location: 'Jamtara District, Jharkhand (Sector 05)',
      telemetryRate: 'Carrier Signal RSSI: -68 dBm (Strong)',
      riskReason: 'Active cellular mast transmitting simultaneous high-frequency burner SIM bursts.',
      lastPing: 'Continuous RF Stream',
      connectionsCount: 1
    }
  },
  {
    id: 'node-bank-7741',
    type: 'BANK',
    labelHeader: 'BANK',
    labelMain: 'XXXX7741',
    normX: 0.72,
    normY: -0.06,
    riskScore: 92,
    status: 'quarantined',
    details: {
      fullName: 'Layer-1 Mule Current Account',
      identifier: 'A/C: 004192837741 (ICICI Bank)',
      carrierOrBank: 'ICICI Bank Digital Banking Branch',
      location: 'Noida Sector 62 Branch',
      telemetryRate: 'Inflow: ₹4,80,000 / 2 hours',
      riskReason: 'Instant UPI drain receptacle routing funds into p2p crypto purchase escrow.',
      lastPing: 'Freeze Hold Mandated',
      connectionsCount: 1
    }
  },
  {
    id: 'node-bank-1188',
    type: 'BANK',
    labelHeader: 'BANK',
    labelMain: 'XXXX1188',
    normX: 0.82,
    normY: 0.35,
    riskScore: 95,
    status: 'quarantined',
    details: {
      fullName: 'Intermediate Rapid-Dispersal Account',
      identifier: 'A/C: 918374901188 (Paytm Payments Bank)',
      carrierOrBank: 'Paytm Payments Bank UPI Handle',
      location: 'Cyber Hub Delhi NCR',
      telemetryRate: 'Velocity: 42 Micro-Transfers/min',
      riskReason: 'Splits large exfiltrated sums into <₹10,000 tranches to evade automatic ML alerts.',
      lastPing: 'Quarantined by AI Sentinel',
      connectionsCount: 1
    }
  },
  {
    id: 'node-bank-9822',
    type: 'BANK',
    labelHeader: 'BANK',
    labelMain: 'XXXX9822',
    normX: 0.58,
    normY: 0.70,
    riskScore: 97,
    status: 'quarantined',
    details: {
      fullName: 'Central Mule Settlement Account',
      identifier: 'A/C: 581938109822 (Raipur Co-op Bank)',
      carrierOrBank: 'Raipur Urban Cooperative Bank',
      location: 'Raipur Central Commercial Branch',
      telemetryRate: 'Total Volume: ₹28,50,000 cumulative',
      riskReason: 'Master aggregator linked to crypto OTC desk and offshore hawala nodes.',
      lastPing: 'Account Enforced Lockdown',
      connectionsCount: 1
    }
  },
  {
    id: 'node-victim-2',
    type: 'PHONE',
    labelHeader: 'PHONE',
    labelMain: '+91XXXXX9622',
    labelSub: '(Victim 2)',
    normX: 0.22,
    normY: 0.85,
    riskScore: 91,
    status: 'flagged',
    details: {
      fullName: 'Compromised Target Device (Victim #2)',
      identifier: '+91 98234 59622 (Pune, India)',
      protocolOrModel: 'Samsung Galaxy A52 / Android 13',
      location: 'Pune, Maharashtra',
      telemetryRate: 'Malicious Overlay Active',
      riskReason: 'Infected with Trojanized SBI Banking APK masquerading as a mandatory KYC app.',
      lastPing: '1 min ago (Honeypot Decoy Intercepted)',
      connectionsCount: 1
    }
  },
  {
    id: 'node-victim-1',
    type: 'PHONE',
    labelHeader: 'PHONE',
    labelMain: '+91XXXXX2234',
    labelSub: '(Victim 1)',
    normX: -0.22,
    normY: 0.82,
    riskScore: 94,
    status: 'flagged',
    details: {
      fullName: 'Infiltrated Target Endpoint (Victim #1)',
      identifier: '+91 94201 12234 (Hyderabad, India)',
      protocolOrModel: 'Redmi Note 11 / MIUI 14',
      location: 'Hyderabad, Telangana',
      telemetryRate: 'SMS Forwarding Exploited',
      riskReason: 'Adversary intercepted netbanking login OTP; transaction intercepted by Decoy Gate.',
      lastPing: '45 sec ago (Interception Shield Active)',
      connectionsCount: 1
    }
  },
  {
    id: 'node-sim-822',
    type: 'SIM',
    labelHeader: 'SIM',
    labelMain: '+91XXXXX822',
    normX: -0.42,
    normY: -0.08,
    riskScore: 88,
    status: 'active',
    details: {
      fullName: 'Burner SIM Farm Channel #1 (Primary)',
      identifier: '+91 98710 48822 (IMSI: 404458192839102)',
      carrierOrBank: 'Reliance Jio 4G LTE VoLTE',
      location: 'Jamtara Cluster Cell 05',
      telemetryRate: 'SMS Dispatch: 180 SMS/hr',
      riskReason: 'Active SMS phishing gateway broadcasting malicious APK download links.',
      lastPing: 'Transmitting Now',
      connectionsCount: 2
    }
  },
  {
    id: 'node-sim-572',
    type: 'SIM',
    labelHeader: 'SIM',
    labelMain: '+91XXXXX572',
    normX: -0.56,
    normY: 0.52,
    riskScore: 90,
    status: 'active',
    details: {
      fullName: 'Burner SIM Farm Channel #2 (Sub-Hub)',
      identifier: '+91 99100 01572 (IMSI: 404209182374910)',
      carrierOrBank: 'Bharti Airtel Prepaid Roaming',
      location: 'Jamtara Cluster Cell 05',
      telemetryRate: 'Data Session: 4G Burst Active',
      riskReason: 'Controls secondary slave burner SIMs used for automated OTP verification relay.',
      lastPing: 'Active Link Synchronized',
      connectionsCount: 4
    }
  },
  {
    id: 'node-sim-992',
    type: 'SIM',
    labelHeader: 'SIM',
    labelMain: '+91XXXXX992',
    normX: -0.86,
    normY: 0.22,
    riskScore: 78,
    status: 'intercepted',
    details: {
      fullName: 'Slave Burner SIM #3 (Auto-Rotated)',
      identifier: '+91 91000 01992 (IMSI: 404102938475819)',
      carrierOrBank: 'Vodafone Idea Prepaid',
      location: 'Virtual GSM Modem Bank Pool #9',
      telemetryRate: 'Rotates every 45 minutes',
      riskReason: 'Used exclusively to generate spoofed payment authorization SMS to targets.',
      lastPing: 'Rerouted to Honeypot Decoy',
      connectionsCount: 1
    }
  },
  {
    id: 'node-sim-331',
    type: 'SIM',
    labelHeader: 'SIM',
    labelMain: '+91XXXXX331',
    normX: -0.88,
    normY: 0.78,
    riskScore: 82,
    status: 'intercepted',
    details: {
      fullName: 'Slave Burner SIM #4 (Spoof Carrier)',
      identifier: '+91 91000 01331 (IMSI: 404392817492817)',
      carrierOrBank: 'BSNL GSM Mobile',
      location: 'Virtual GSM Modem Bank Pool #14',
      telemetryRate: 'Decoy Ping Stream: 12ms',
      riskReason: 'Secondary fallback SIM for OTP harvesting; currently captured in honeypot sandbox.',
      lastPing: 'Isolated & Decoyed',
      connectionsCount: 1
    }
  }
];

const GRAPH_LINKS: GraphLink[] = [
  // Center IMEI to surrounding nodes
  { source: 'node-imei-center', target: 'node-ip-10', color: '#A855F7', style: 'dashed', animatedParticles: true },
  { source: 'node-imei-center', target: 'node-ip-11', color: '#A855F7', style: 'dashed', animatedParticles: true },
  { source: 'node-imei-center', target: 'node-tower', color: '#06B6D4', style: 'dashed', animatedParticles: true },
  { source: 'node-imei-center', target: 'node-bank-7741', color: '#F59E0B', style: 'dashed', animatedParticles: true },
  { source: 'node-imei-center', target: 'node-bank-1188', color: '#F59E0B', style: 'dashed', animatedParticles: true },
  { source: 'node-imei-center', target: 'node-bank-9822', color: '#F59E0B', style: 'dashed', animatedParticles: true },
  { source: 'node-imei-center', target: 'node-victim-2', color: '#EF4444', style: 'dashed', animatedParticles: true },
  { source: 'node-imei-center', target: 'node-victim-1', color: '#EF4444', style: 'dashed', animatedParticles: true },
  { source: 'node-imei-center', target: 'node-sim-822', color: '#10B981', style: 'dashed', animatedParticles: true },
  { source: 'node-imei-center', target: 'node-sim-572', color: '#10B981', style: 'dashed', animatedParticles: true },

  // SIM interconnections (as shown in image)
  { source: 'node-sim-822', target: 'node-sim-572', color: '#10B981', style: 'dashed', animatedParticles: true },
  { source: 'node-sim-572', target: 'node-sim-992', color: '#10B981', style: 'dashed', animatedParticles: true },
  { source: 'node-sim-572', target: 'node-sim-331', color: '#10B981', style: 'dashed', animatedParticles: true }
];

const TYPE_CONFIG = {
  SIM: {
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    bgGradient: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(6, 78, 59, 0.6) 80%)',
    border: 'border-emerald-500/60',
    text: 'text-emerald-400',
    label: 'SIM',
    icon: Smartphone
  },
  IMEI: {
    color: '#0070F3',
    glowColor: 'rgba(0, 112, 243, 0.55)',
    bgGradient: 'radial-gradient(circle, rgba(0, 112, 243, 0.35) 0%, rgba(15, 23, 42, 0.85) 90%)',
    border: 'border-blue-500/70',
    text: 'text-blue-400',
    label: 'IMEI',
    icon: Cpu
  },
  IP: {
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    bgGradient: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(59, 7, 100, 0.6) 80%)',
    border: 'border-purple-500/60',
    text: 'text-purple-400',
    label: 'IP',
    icon: Globe
  },
  BANK: {
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    bgGradient: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(69, 26, 3, 0.6) 80%)',
    border: 'border-amber-500/60',
    text: 'text-amber-400',
    label: 'Bank Account',
    icon: Building2
  },
  PHONE: {
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    bgGradient: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(69, 10, 10, 0.6) 80%)',
    border: 'border-red-500/60',
    text: 'text-red-400',
    label: 'Phone Number',
    icon: PhoneCall
  },
  TOWER: {
    color: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    bgGradient: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(8, 51, 68, 0.6) 80%)',
    border: 'border-cyan-500/60',
    text: 'text-cyan-400',
    label: 'Tower',
    icon: TowerControl
  }
};

export const EntityGraph: React.FC<{
  onInspectNode?: (node: GraphNode) => void;
}> = ({ onInspectNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeFilter, setActiveFilter] = useState<EntityType>('ALL');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-imei-center');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotateSimulation, setAutoRotateSimulation] = useState(true);
  const [particleSpeed, setParticleSpeed] = useState(1);

  // Dynamic node positions allowing dragging and fluid responsive layout
  const [nodePositions, setNodePositions] = useState<{ [id: string]: { x: number; y: number; vx?: number; vy?: number } }>({});
  const draggingNodeRef = useRef<{ id: string; startMouseX: number; startMouseY: number; startNodeX: number; startNodeY: number } | null>(null);

  const selectedNode = useMemo(() => {
    return ENTITY_NODES.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Initialize and calculate responsive node pixel positions
  const updateNodeLayout = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Use responsive scaling
    const centerX = width * 0.52;
    const centerY = height * 0.50;
    const radiusX = Math.min(width * 0.42, 380);
    const radiusY = Math.min(height * 0.40, 260);

    const newPos: { [id: string]: { x: number; y: number } } = {};
    ENTITY_NODES.forEach(node => {
      newPos[node.id] = {
        x: centerX + node.normX * radiusX,
        y: centerY + node.normY * radiusY
      };
    });
    setNodePositions(newPos);
  };

  useEffect(() => {
    updateNodeLayout();
    const handleResize = () => {
      updateNodeLayout();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // High-performance canvas drawing loop for animated dashed lines & photon energy pulses
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let particleOffset = 0;

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

      particleOffset += 0.4 * particleSpeed;

      // Draw starry ambient cyber dust in the deep background
      const time = Date.now() * 0.001;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 35; i++) {
        const sx = ((i * 97 + time * 4) % rect.width);
        const sy = ((i * 53 + Math.sin(time + i) * 10) % rect.height);
        const sz = (i % 3 === 0 ? 1.2 : 0.8);
        ctx.fillRect(sx, sy, sz, sz);
      }

      // Draw subtle circular radar distance rings around center IMEI
      const centerNodePos = nodePositions['node-imei-center'];
      if (centerNodePos) {
        [90, 180, 280].forEach((r, idx) => {
          ctx.beginPath();
          ctx.arc(centerNodePos.x, centerNodePos.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = idx === 0 ? 'rgba(0, 112, 243, 0.12)' : 'rgba(255, 255, 255, 0.03)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 12]);
          ctx.stroke();
        });
      }

      // Render links
      GRAPH_LINKS.forEach(link => {
        const p1 = nodePositions[link.source];
        const p2 = nodePositions[link.target];
        if (!p1 || !p2) return;

        const sourceNode = ENTITY_NODES.find(n => n.id === link.source);
        const targetNode = ENTITY_NODES.find(n => n.id === link.target);

        // Check if either node matches active filter
        const isSourceVisible = activeFilter === 'ALL' || (sourceNode && (sourceNode.type === activeFilter || (activeFilter === 'BANK' && sourceNode.type === 'BANK') || (activeFilter === 'PHONE' && sourceNode.type === 'PHONE')));
        const isTargetVisible = activeFilter === 'ALL' || (targetNode && (targetNode.type === activeFilter || (activeFilter === 'BANK' && targetNode.type === 'BANK') || (activeFilter === 'PHONE' && targetNode.type === 'PHONE')));
        
        const isDimmed = activeFilter !== 'ALL' && (!isSourceVisible || !isTargetVisible);
        const isHighlighted = (hoveredNodeId && (link.source === hoveredNodeId || link.target === hoveredNodeId)) ||
                              (selectedNodeId && (link.source === selectedNodeId || link.target === selectedNodeId));

        const baseColor = link.color || '#38BDF8';

        // Draw base dashed connection line
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = isDimmed 
          ? 'rgba(255, 255, 255, 0.04)' 
          : isHighlighted 
            ? baseColor 
            : `${baseColor}55`;
        ctx.lineWidth = isHighlighted ? 2 : 1.2;
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -particleOffset * 0.8;
        ctx.stroke();

        // Draw glowing animated photon pulses traveling along the spoke lines
        if (!isDimmed) {
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.hypot(dx, dy);

          const pulsesCount = 2;
          for (let p = 0; p < pulsesCount; p++) {
            const progress = ((particleOffset * 0.015 + p / pulsesCount) % 1);
            const px = p1.x + dx * progress;
            const py = p1.y + dy * progress;

            ctx.beginPath();
            ctx.arc(px, py, isHighlighted ? 3 : 2, 0, Math.PI * 2);
            ctx.fillStyle = baseColor;
            ctx.shadowColor = baseColor;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          }
        }
      });

      ctx.restore();
      animFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameId);
  }, [nodePositions, activeFilter, hoveredNodeId, selectedNodeId, particleSpeed]);

  // Dragging event handlers
  const handleMouseDownNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const pos = nodePositions[id];
    if (!pos) return;
    draggingNodeRef.current = {
      id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startNodeX: pos.x,
      startNodeY: pos.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeRef.current) return;
    const { id, startMouseX, startMouseY, startNodeX, startNodeY } = draggingNodeRef.current;
    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;

    setNodePositions(prev => ({
      ...prev,
      [id]: { x: startNodeX + dx, y: startNodeY + dy }
    }));
  };

  const handleMouseUp = () => {
    draggingNodeRef.current = null;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectNode = (node: GraphNode) => {
    setSelectedNodeId(node.id);
    if (onInspectNode) {
      onInspectNode(node);
    }
  };

  const filterTabs: { id: EntityType; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'SIM', label: 'SIM' },
    { id: 'IMEI', label: 'IMEI' },
    { id: 'IP', label: 'IP' },
    { id: 'BANK', label: 'Bank' },
    { id: 'PHONE', label: 'Phone' },
    { id: 'TOWER', label: 'Tower' }
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={cn(
        "relative w-full h-full min-h-[560px] rounded-2xl bg-[#040814] border border-[#0F223D] overflow-hidden flex flex-col select-none",
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : ""
      )}
    >
      {/* Dynamic Background Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#0c2142_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/50 to-[#02050f] pointer-events-none" />

      {/* Top Header Bar Matching The Image */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#0F223D] bg-[#050D1D]/80 backdrop-blur-md">
        {/* Left Section: 03 ENTITY GRAPH */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-mono font-black text-cyan-400 tracking-[0.2em] uppercase text-glow-cyan">
              03 ENTITY GRAPH
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-800/40 text-[9px] font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            13 NODES LINKED
          </div>
        </div>

        {/* Center: Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#020611]/90 rounded-xl border border-[#0E2038] shadow-inner overflow-x-auto max-w-full">
          {filterTabs.map(tab => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[10.5px] font-mono font-bold uppercase transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-[#062040] text-cyan-300 border border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateNodeLayout()}
            title="Reset Graph Layout"
            className="p-2 rounded-lg bg-[#08152B] border border-[#0F284B] text-white/60 hover:text-white hover:border-cyan-500/50 transition-all text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={13} className="hover:rotate-180 transition-transform duration-500" />
            <span className="text-[9px] font-mono hidden md:inline">RESET</span>
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Graph"}
            className="p-2 rounded-lg bg-[#08152B] border border-[#0F284B] text-cyan-400 hover:text-cyan-200 hover:border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Graph Canvas Body */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
        {/* Animated Canvas for Links & Particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Top-Left Color Legend Box (Exactly as in the Image) */}
        <div className="absolute top-5 left-6 z-20 bg-[#050D1D]/90 backdrop-blur-md border border-[#0F284B] p-3.5 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[140px] pointer-events-auto">
          <div className="text-[8px] font-mono font-black text-white/40 uppercase tracking-[0.18em] border-b border-white/5 pb-1 flex items-center justify-between">
            <span>ENTITY LEGEND</span>
            <Filter size={9} className="text-cyan-400" />
          </div>

          <div className="flex flex-col gap-1.5">
            {[
              { type: 'SIM', label: 'SIM', color: '#10B981' },
              { type: 'IMEI', label: 'IMEI', color: '#0070F3' },
              { type: 'IP', label: 'IP', color: '#A855F7' },
              { type: 'BANK', label: 'Bank Account', color: '#F59E0B' },
              { type: 'PHONE', label: 'Phone Number', color: '#EF4444' },
              { type: 'TOWER', label: 'Tower', color: '#06B6D4' }
            ].map(item => {
              const isFiltered = activeFilter === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => setActiveFilter(activeFilter === item.type ? 'ALL' : item.type as EntityType)}
                  className={cn(
                    "flex items-center gap-2.5 text-[10px] font-mono text-left transition-all py-0.5 px-1.5 rounded",
                    isFiltered ? "bg-white/10 text-white font-bold" : "text-white/60 hover:text-white"
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}`
                    }}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nodes Layer: Rendered as Interactive Glowing Circular Pods */}
        {ENTITY_NODES.map(node => {
          const pos = nodePositions[node.id];
          if (!pos) return null;

          const isCenterIMEI = node.type === 'IMEI';
          const cfg = TYPE_CONFIG[node.type];
          const isSelected = selectedNodeId === node.id;
          const isHovered = hoveredNodeId === node.id;

          const isVisible = activeFilter === 'ALL' || node.type === activeFilter;
          const opacityClass = isVisible ? 'opacity-100' : 'opacity-20 scale-90 pointer-events-none';

          // Radius sizing
          const diameter = isCenterIMEI ? 88 : 68;

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: isCenterIMEI ? 25 : isSelected ? 24 : isHovered ? 23 : 20
              }}
              onMouseDown={(e) => handleMouseDownNode(node.id, e)}
              onClick={() => handleSelectNode(node)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              className={cn(
                "group cursor-pointer transition-all duration-200",
                opacityClass
              )}
            >
              {/* Outer Glowing Concentric Rings for Active & Center Nodes */}
              {isCenterIMEI && (
                <>
                  <div className="absolute -inset-4 rounded-full border border-blue-500/30 animate-ping opacity-25 pointer-events-none" />
                  <div className="absolute -inset-2.5 rounded-full border border-blue-400/40 animate-pulse pointer-events-none" />
                </>
              )}

              {/* Selection Halo */}
              {isSelected && (
                <div
                  className="absolute -inset-2 rounded-full border-2 border-cyan-400 animate-spin pointer-events-none"
                  style={{ animationDuration: '8s' }}
                />
              )}

              {/* Node Circular Body */}
              <div
                style={{
                  width: `${diameter}px`,
                  height: `${diameter}px`,
                  background: cfg.bgGradient,
                  boxShadow: isSelected || isHovered
                    ? `0 0 25px ${cfg.glowColor}, inset 0 0 15px ${cfg.glowColor}`
                    : `0 0 14px ${cfg.glowColor}`,
                  borderColor: cfg.color
                }}
                className={cn(
                  "relative rounded-full flex flex-col items-center justify-center p-1 border-2 backdrop-blur-md transition-all duration-300 transform",
                  isHovered || isSelected ? "scale-110 shadow-2xl" : "hover:scale-105"
                )}
              >
                {/* Micro Header Badge (e.g. SIM, IMEI, IP, BANK, TOWER) */}
                <span
                  style={{ color: cfg.color }}
                  className="text-[8px] font-mono font-black tracking-wider uppercase leading-none mb-0.5"
                >
                  {node.labelHeader}
                </span>

                {/* Primary Ident (e.g. +91XXXXX822, 3567891043, XXXX7741) */}
                <span className="text-[8.5px] font-mono font-black text-white text-center leading-tight tracking-tighter px-0.5 break-all">
                  {node.labelMain}
                </span>

                {/* Subtitle / Mask indicator (e.g. XXXX, (Victim 1), (Sector 05)) */}
                {node.labelSub && (
                  <span className="text-[7px] font-mono text-white/70 tracking-widest uppercase leading-none mt-0.5">
                    {node.labelSub}
                  </span>
                )}

                {/* Pulsing Core Center Point */}
                <span
                  className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full animate-ping"
                  style={{ backgroundColor: cfg.color }}
                />
              </div>

              {/* Hover Tooltip Label */}
              <AnimatePresence>
                {isHovered && !isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 px-2.5 py-1 rounded-md border border-white/20 text-[8px] font-mono text-white pointer-events-none shadow-xl z-30"
                  >
                    Click to inspect {node.type} telemetry
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Selected Entity Details Drawer / Card (Bottom-Right / Side Overlay) */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="absolute bottom-5 right-6 z-30 w-[310px] bg-[#050E22]/95 backdrop-blur-xl border border-[#112952] rounded-2xl p-4 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-col gap-3"
            >
              {/* Card Header with Entity Type Tag & Close/Copy */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className="p-1.5 rounded-lg text-white"
                    style={{ backgroundColor: TYPE_CONFIG[selectedNode.type].color }}
                  >
                    {React.createElement(TYPE_CONFIG[selectedNode.type].icon, { size: 13 })}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[7.5px] font-mono uppercase font-black tracking-widest text-white/40">
                      ENTITY TELEMETRY
                    </span>
                    <span className="text-[11px] font-bold font-mono text-white uppercase tracking-wider">
                      {selectedNode.type} POD
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[8px] font-mono font-black uppercase tracking-wider",
                    selectedNode.status === 'quarantined' ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                    selectedNode.status === 'flagged' ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                    "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  )}>
                    {selectedNode.status}
                  </span>
                  <button
                    onClick={() => setSelectedNodeId(null)}
                    className="text-white/40 hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Primary Name & Identifier with Quick Copy */}
              <div className="flex flex-col gap-1 bg-[#030816] p-2.5 rounded-xl border border-white/5">
                <div className="text-[8px] font-mono text-white/40 uppercase">Identifier</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-mono font-bold text-cyan-300 break-all">
                    {selectedNode.details.identifier}
                  </span>
                  <button
                    onClick={() => handleCopy(selectedNode.details.identifier, selectedNode.id)}
                    className="p-1 text-white/50 hover:text-cyan-300 transition-colors shrink-0"
                    title="Copy identifier"
                  >
                    {copiedId === selectedNode.id ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="text-[8.5px] font-mono text-white/80 mt-0.5">
                  {selectedNode.details.fullName}
                </div>
              </div>

              {/* Attributes Table */}
              <div className="grid grid-cols-2 gap-2 text-[8px] font-mono">
                {selectedNode.details.carrierOrBank && (
                  <div className="bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    <div className="text-white/40 uppercase text-[7px]">Carrier / Hub</div>
                    <div className="text-white font-bold truncate mt-0.5">{selectedNode.details.carrierOrBank}</div>
                  </div>
                )}
                {selectedNode.details.location && (
                  <div className="bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    <div className="text-white/40 uppercase text-[7px]">Location</div>
                    <div className="text-white font-bold truncate mt-0.5">{selectedNode.details.location}</div>
                  </div>
                )}
                {selectedNode.details.telemetryRate && (
                  <div className="bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    <div className="text-white/40 uppercase text-[7px]">Data Stream</div>
                    <div className="text-cyan-400 font-bold truncate mt-0.5">{selectedNode.details.telemetryRate}</div>
                  </div>
                )}
                {selectedNode.details.protocolOrModel && (
                  <div className="bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    <div className="text-white/40 uppercase text-[7px]">Hardware / Spec</div>
                    <div className="text-white font-bold truncate mt-0.5">{selectedNode.details.protocolOrModel}</div>
                  </div>
                )}
              </div>

              {/* Threat Probability Gauge */}
              <div className="bg-[#030816] p-2.5 rounded-xl border border-white/5 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[8px] font-mono">
                  <span className="text-white/40 uppercase">Adversary Threat Ratio</span>
                  <span className="text-red-400 font-bold">{selectedNode.riskScore}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedNode.riskScore}%` }}
                  />
                </div>
                <div className="text-[7.5px] text-white/50 leading-relaxed mt-1">
                  {selectedNode.details.riskReason}
                </div>
              </div>

              {/* Honey-Pot Action Button */}
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Active Honeypot Decoy deployed against ${selectedNode.details.identifier}. Interception active.`)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                >
                  <Zap size={11} className="animate-pulse" />
                  TRIGGER DECOY TRACE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Status Ticker Bar */}
      <div className="relative z-30 px-6 py-2 border-t border-[#0F223D] bg-[#030713] flex flex-wrap items-center justify-between text-[8px] font-mono text-white/40 gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Radio size={10} className="animate-pulse" />
            LIVE ENTITY INTERCEPTION ENGINE
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline">CENTRAL IMEI: 3567891043XXXX</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden md:inline">CORRELATED SIMS: 4</span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline">SIPHON BANKS: 3</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/60">SIMULATION VELOCITY:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(speed => (
              <button
                key={speed}
                onClick={() => setParticleSpeed(speed)}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[7.5px] font-mono font-bold",
                  particleSpeed === speed
                    ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
                    : "text-white/40 hover:text-white"
                )}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
