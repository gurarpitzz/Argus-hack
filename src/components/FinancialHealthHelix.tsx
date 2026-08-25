import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Radio,
  Wifi,
  Landmark,
  PhoneCall,
  TowerControl,
  Play,
  Pause,
  RefreshCw,
  Maximize2,
  Minimize2,
  Layers,
  Search,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Info,
  Zap,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

export type NodeType = 'SIM' | 'IMEI' | 'IP' | 'Bank Account' | 'Phone Number' | 'Tower';

export interface ConstellationNode {
  id: string;
  type: NodeType;
  label: string;
  subLabel?: string;
  extraLabel?: string;
  color: string;
  glowColor: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  radius: number;
  details: {
    title: string;
    identifiers: string[];
    riskScore: number;
    activityStatus: string;
    telemetry: string;
  };
}

export interface LinkConnection {
  fromId: string;
  toId: string;
  color: string;
  dashed?: boolean;
}

const NODES_DATA: ConstellationNode[] = [
  // 1. Central Core Node: IMEI
  {
    id: 'center-imei',
    type: 'IMEI',
    label: 'IMEI',
    subLabel: '3567891043',
    extraLabel: 'XXXX',
    color: '#0088FF',
    glowColor: 'rgba(0, 136, 255, 0.65)',
    x: 50,
    y: 52,
    radius: 36,
    details: {
      title: 'PRIMARY HARDWARE IMEI',
      identifiers: ['TAC: 35678910', 'SNR: 439012', 'Rooted Magisk Android 13'],
      riskScore: 99,
      activityStatus: 'ACTIVE TRANSIENT APERTURE',
      telemetry: 'Multi-SIM rapid switcher detected across Jamtara GSM cells.'
    }
  },

  // 2. Top Purple Nodes: IP
  {
    id: 'ip-1',
    type: 'IP',
    label: 'IP',
    subLabel: '103.27.XX.10',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    x: 41,
    y: 15,
    radius: 26,
    details: {
      title: 'COMMAND PROXY IP #1',
      identifiers: ['103.27.182.10 (AS133612)', 'Port 8443 Reverse Shell', 'TLS v1.3 encrypted'],
      riskScore: 94,
      activityStatus: 'VPN TUNNEL LIVE',
      telemetry: 'Encrypted relay transmitting SMS OTP payloads.'
    }
  },
  {
    id: 'ip-2',
    type: 'IP',
    label: 'IP',
    subLabel: '103.27.XX.11',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    x: 67,
    y: 19,
    radius: 26,
    details: {
      title: 'COMMAND PROXY IP #2',
      identifiers: ['103.27.182.11', 'WireGuard Ingress', 'Geo: Netherlands Exit'],
      riskScore: 91,
      activityStatus: 'STEADY POLLING',
      telemetry: 'Concurrent socket heartbeat to central syndicate controller.'
    }
  },

  // 3. Top-Right Cyan Node: Tower
  {
    id: 'tower-1',
    type: 'Tower',
    label: 'TOWER',
    subLabel: '27831',
    extraLabel: '(Sector 05)',
    color: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.65)',
    x: 87,
    y: 19,
    radius: 28,
    details: {
      title: 'CELLULAR MAST TOWER',
      identifiers: ['CellID: 27831', 'Azimuth: 120°', 'Sector 05 Micro-Cell'],
      riskScore: 88,
      activityStatus: 'CONGESTION SPIKE',
      telemetry: 'High-density burst transmission of 18 virtual IMSIs.'
    }
  },

  // 4. Right Yellow/Gold Nodes: Bank Accounts
  {
    id: 'bank-1',
    type: 'Bank Account',
    label: 'BANK',
    subLabel: 'XXXX7741',
    color: '#FFB800',
    glowColor: 'rgba(255, 184, 0, 0.65)',
    x: 84,
    y: 44,
    radius: 27,
    details: {
      title: 'MULE BANK ACCOUNT #1',
      identifiers: ['State Bank of India', 'A/C: XXXX7741', 'IFSC: SBIN0004921'],
      riskScore: 96,
      activityStatus: 'RAPID CASH DRAIN',
      telemetry: '₹49,990 IMPS transfer triggered immediately after OTP interception.'
    }
  },
  {
    id: 'bank-2',
    type: 'Bank Account',
    label: 'BANK',
    subLabel: 'XXXX1168',
    color: '#FFB800',
    glowColor: 'rgba(255, 184, 0, 0.65)',
    x: 88,
    y: 61,
    radius: 27,
    details: {
      title: 'MULE BANK ACCOUNT #2',
      identifiers: ['ICICI Corporate Current', 'A/C: XXXX1168', 'Layer 2 Funnel'],
      riskScore: 93,
      activityStatus: 'MICRO-SPLIT EXFIL',
      telemetry: 'Split into 6 distinct UPI handles within 340ms.'
    }
  },
  {
    id: 'bank-3',
    type: 'Bank Account',
    label: 'BANK',
    subLabel: 'XXXX9822',
    color: '#FFB800',
    glowColor: 'rgba(255, 184, 0, 0.65)',
    x: 77,
    y: 77,
    radius: 27,
    details: {
      title: 'MULE BANK ACCOUNT #3',
      identifiers: ['Federal Bank Savings', 'A/C: XXXX9822', 'ATM Withdrawal Ring'],
      riskScore: 89,
      activityStatus: 'CASH FLUSH PENDING',
      telemetry: 'Flagged for geo-distributed ATM cardless withdrawals.'
    }
  },

  // 5. Bottom Pink/Magenta Nodes: Phone Number / Victims
  {
    id: 'phone-victim-1',
    type: 'Phone Number',
    label: 'IP',
    subLabel: '+91XXXX2234',
    extraLabel: '(Victim 1)',
    color: '#FF2A7A',
    glowColor: 'rgba(255, 42, 122, 0.65)',
    x: 39,
    y: 89,
    radius: 29,
    details: {
      title: 'TARGET VICTIM PHONE #1',
      identifiers: ['MSISDN: +91 98XXX 2234', 'Airtel Pre-paid', 'Delhi NCR Circle'],
      riskScore: 87,
      activityStatus: 'COMPROMISED SESSION',
      telemetry: 'Fake electricity bill APK installed via malicious WhatsApp broadcast.'
    }
  },
  {
    id: 'phone-victim-2',
    type: 'Phone Number',
    label: 'IP',
    subLabel: '+91XXXX9622',
    extraLabel: '(Victim 2)',
    color: '#FF2A7A',
    glowColor: 'rgba(255, 42, 122, 0.65)',
    x: 59,
    y: 89,
    radius: 29,
    details: {
      title: 'TARGET VICTIM PHONE #2',
      identifiers: ['MSISDN: +91 88XXX 9622', 'Jio Post-paid', 'Jaipur Circle'],
      riskScore: 85,
      activityStatus: 'CREDENTIAL SIPHONED',
      telemetry: 'Netbanking login spoofed via phishing reverse proxy page.'
    }
  },

  // 6. Left Green Nodes: SIMs
  {
    id: 'sim-1',
    type: 'SIM',
    label: 'SIM',
    subLabel: '+91XXXX8372',
    color: '#00E676',
    glowColor: 'rgba(0, 230, 118, 0.65)',
    x: 30,
    y: 33,
    radius: 26,
    details: {
      title: 'BURNER SIM CARD #1',
      identifiers: ['IMSI: 40445091823', 'Pre-activated Airtel', 'Fake Aadhaar KYC'],
      riskScore: 98,
      activityStatus: 'BURST BROADCASTING',
      telemetry: 'Originating 420 phishing SMS packets per minute.'
    }
  },
  {
    id: 'sim-2',
    type: 'SIM',
    label: 'SIM',
    subLabel: '+91XXXX1992',
    color: '#00E676',
    glowColor: 'rgba(0, 230, 118, 0.65)',
    x: 11,
    y: 51,
    radius: 26,
    details: {
      title: 'BURNER SIM CARD #2',
      identifiers: ['IMSI: 40445091899', 'BSNL 4G SIM-Box Slot 04'],
      riskScore: 95,
      activityStatus: 'ROUTING TRAFFIC',
      telemetry: 'Interconnected SIM farm mesh swapping identities on tower handoff.'
    }
  },
  {
    id: 'sim-3',
    type: 'SIM',
    label: 'SIM',
    subLabel: '+91XXXX1872',
    color: '#00E676',
    glowColor: 'rgba(0, 230, 118, 0.65)',
    x: 24,
    y: 67,
    radius: 27,
    details: {
      title: 'BURNER SIM CARD #3',
      identifiers: ['IMSI: 40445091187', 'Vodafone Idea Pre-Activated'],
      riskScore: 97,
      activityStatus: 'HOT LINKED TO IMEI',
      telemetry: 'Directly paired with master hardware IMEI 3567891043XXXX.'
    }
  },
  {
    id: 'sim-4',
    type: 'SIM',
    label: 'SIM',
    subLabel: '+91XXXX331',
    color: '#00E676',
    glowColor: 'rgba(0, 230, 118, 0.65)',
    x: 11,
    y: 83,
    radius: 26,
    details: {
      title: 'BURNER SIM CARD #4',
      identifiers: ['IMSI: 40445093310', 'GSM SIM-Box Slot 12'],
      riskScore: 92,
      activityStatus: 'MESH STANDBY',
      telemetry: 'Backup SIM auto-waking upon carrier throttling detection.'
    }
  }
];

const CONNECTIONS: LinkConnection[] = [
  // Center IMEI to Top IP nodes
  { fromId: 'center-imei', toId: 'ip-1', color: '#A855F7', dashed: true },
  { fromId: 'center-imei', toId: 'ip-2', color: '#A855F7', dashed: true },

  // Center IMEI to Tower
  { fromId: 'center-imei', toId: 'tower-1', color: '#00F0FF', dashed: true },

  // Center IMEI to Bank Accounts
  { fromId: 'center-imei', toId: 'bank-1', color: '#FFB800', dashed: true },
  { fromId: 'center-imei', toId: 'bank-2', color: '#FFB800', dashed: true },
  { fromId: 'center-imei', toId: 'bank-3', color: '#FFB800', dashed: true },

  // Center IMEI to Victims (Phone Numbers)
  { fromId: 'center-imei', toId: 'phone-victim-1', color: '#FF2A7A', dashed: true },
  { fromId: 'center-imei', toId: 'phone-victim-2', color: '#FF2A7A', dashed: true },

  // Center IMEI to SIMs
  { fromId: 'center-imei', toId: 'sim-1', color: '#00E676', dashed: true },
  { fromId: 'center-imei', toId: 'sim-3', color: '#00E676', dashed: true },

  // Mesh connections between SIMs
  { fromId: 'sim-1', toId: 'sim-3', color: '#00E676', dashed: true },
  { fromId: 'sim-2', toId: 'center-imei', color: '#00E676', dashed: true },
  { fromId: 'sim-3', toId: 'sim-4', color: '#00E676', dashed: true }
];

export const FinancialHealthHelix: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [filterType, setFilterType] = useState<NodeType | 'ALL'>('ALL');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Particle & link ray animation loop
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
        tick += 0.02;
      }

      // Draw dashed connections with animated photons
      CONNECTIONS.forEach((link, idx) => {
        const from = NODES_DATA.find(n => n.id === link.fromId);
        const to = NODES_DATA.find(n => n.id === link.toId);
        if (!from || !to) return;

        const x1 = (from.x / 100) * width;
        const y1 = (from.y / 100) * height;
        const x2 = (to.x / 100) * width;
        const y2 = (to.y / 100) * height;

        // Base glowing dashed connection line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `${link.color}50`;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -tick * 15;
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated traveling data photon packets along link
        const numPhotons = 2;
        for (let p = 0; p < numPhotons; p++) {
          const prog = (tick * 0.5 + p * 0.5 + idx * 0.2) % 1;
          const px = x1 + (x2 - x1) * prog;
          const py = y1 + (y2 - y1) * prog;

          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = link.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.restore();
      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying]);

  const legendItems = [
    { type: 'SIM' as NodeType, color: '#00E676', label: 'SIM' },
    { type: 'IMEI' as NodeType, color: '#0088FF', label: 'IMEI' },
    { type: 'IP' as NodeType, color: '#A855F7', label: 'IP' },
    { type: 'Bank Account' as NodeType, color: '#FFB800', label: 'Bank Account' },
    { type: 'Phone Number' as NodeType, color: '#FF2A7A', label: 'Phone Number' },
    { type: 'Tower' as NodeType, color: '#00F0FF', label: 'Tower' },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[440px] rounded-2xl bg-white border border-slate-200/90 overflow-hidden flex flex-col select-none font-sans shadow-sm"
    >
      {/* Background Starfield / Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(249,115,22,0.04)_0%,_transparent_75%)] pointer-events-none" />

      {/* =========================================================================
          TOP-LEFT COLOR LEGEND
         ========================================================================= */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 font-mono text-[9px] shadow-sm">
        {legendItems.map((item) => {
          const isFilterActive = filterType === item.type;
          return (
            <button
              key={item.type}
              onClick={() => setFilterType(filterType === item.type ? 'ALL' : item.type)}
              className={cn(
                "flex items-center gap-1.5 text-left py-0.5 px-1.5 rounded-md transition-all cursor-pointer",
                isFilterActive
                  ? "bg-orange-50 text-orange-700 font-bold border border-orange-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <span
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 0 6px ${item.color}80`
                }}
                className="w-2.5 h-2.5 rounded-full shrink-0"
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TOP-RIGHT CONTROLS: PLAY/PAUSE & RESET
         ========================================================================= */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Pause constellation" : "Play constellation"}
          className={cn(
            "w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer shadow-sm",
            isPlaying
              ? "bg-orange-50 border-orange-200 text-orange-600"
              : "bg-white border-slate-200 text-slate-400 hover:text-slate-700"
          )}
        >
          {isPlaying ? <Pause size={11} /> : <Play size={11} />}
        </button>

        <button
          onClick={() => {
            setSelectedNode(null);
            setFilterType('ALL');
          }}
          title="Reset filter & selection"
          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw size={11} />
        </button>
      </div>

      {/* =========================================================================
          CANVAS FOR RAYS & LINKS
         ========================================================================= */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* =========================================================================
          CIRCULAR CONSTELLATION NODES LAYER
         ========================================================================= */}
      <div className="relative z-20 w-full h-full flex-1 min-h-0">
        {NODES_DATA.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const isDimmed = filterType !== 'ALL' && filterType !== node.type;

          return (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedNode(node)}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.radius * 2}px`,
                height: `${node.radius * 2}px`,
                marginLeft: `-${node.radius}px`,
                marginTop: `-${node.radius}px`,
                backgroundColor: '#FFFFFF',
                borderColor: node.color,
                boxShadow: isSelected
                  ? `0 0 0 3px rgba(249, 115, 22, 0.4), 0 4px 16px ${node.color}60`
                  : `0 2px 10px rgba(0,0,0,0.08), 0 0 8px ${node.color}40`
              }}
              className={cn(
                "absolute rounded-full border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 font-mono select-none p-1",
                isDimmed ? "opacity-25 scale-90" : "opacity-100",
                isSelected ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-white z-30" : "z-20"
              )}
            >
              {/* Central Title */}
              <span
                style={{ color: node.color }}
                className={cn(
                  "font-black uppercase tracking-wider leading-tight",
                  node.type === 'IMEI' ? "text-[10.5px]" : "text-[8.5px]"
                )}
              >
                {node.label}
              </span>

              {/* Sub-label Identifier */}
              {node.subLabel && (
                <span className="text-[7.5px] text-slate-800 font-bold leading-tight mt-0.5 truncate max-w-full px-0.5">
                  {node.subLabel}
                </span>
              )}

              {/* Extra Label */}
              {node.extraLabel && (
                <span className="text-[6.5px] text-slate-500 font-semibold leading-none mt-0.5 truncate max-w-full">
                  {node.extraLabel}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* =========================================================================
          SELECTED NODE INSPECTION MODAL / POPUP
         ========================================================================= */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute inset-x-3 bottom-3 z-40 bg-white/98 border rounded-xl p-3.5 backdrop-blur-xl font-mono shadow-2xl"
            style={{ borderColor: selectedNode.color }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: selectedNode.color }}
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                />
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-wider">
                    {selectedNode.details.title}
                  </h4>
                  <span className="text-[7.5px] text-slate-500 uppercase">
                    TYPE: {selectedNode.type} • RISK SCORE: {selectedNode.details.riskScore}/100
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[8px] font-bold uppercase rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[8px] text-slate-700 mb-2 leading-relaxed">
              {selectedNode.details.telemetry}
            </p>

            <div className="flex flex-wrap gap-1 mb-2">
              {selectedNode.details.identifiers.map((ident, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[7.5px] text-slate-700 font-semibold">
                  {ident}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[7.5px] text-emerald-600 font-bold">
                ● {selectedNode.details.activityStatus}
              </span>
              <button
                onClick={() => {
                  setSelectedNode(null);
                }}
                style={{ backgroundColor: `${selectedNode.color}15`, borderColor: selectedNode.color, color: selectedNode.color }}
                className="px-2.5 py-1 rounded border text-[7.5px] font-black uppercase transition-all hover:bg-opacity-30 cursor-pointer"
              >
                Isolate Node
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
