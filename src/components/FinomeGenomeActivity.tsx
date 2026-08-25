import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, 
  Layers, 
  TowerControl, 
  ShieldAlert, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  RefreshCw, 
  Play, 
  Pause, 
  Info, 
  ChevronRight, 
  ExternalLink,
  Lock,
  Wifi,
  Activity,
  Sliders,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ThreatCase {
  id: string;
  name: string;
  infraCorrelation: number;
  infraStatus: string;
  infraNote1: string;
  infraNote2: string;
  towerTac: string;
  towerConfidence: number;
  globalConsistency: number;
  globalStatus: string;
  finalConfidence: number;
  layers: { name: string; score: number; detail: string }[];
}

const THREAT_CASES: ThreatCase[] = [
  {
    id: 'case-1',
    name: 'SIM-Box Jamtara Cluster',
    infraCorrelation: 96.7,
    infraStatus: 'HIGH CORRELATION',
    infraNote1: 'LIKELY SHARED INFRASTRUCTURE',
    infraNote2: 'SIM-BOX / GATEWAY INDICATED',
    towerTac: '27831 / Sector 03',
    towerConfidence: 94.2,
    globalConsistency: 4.97,
    globalStatus: 'All Layers Agree',
    finalConfidence: 99.4,
    layers: [
      { name: 'Physical RF & GSM Layer', score: 5.0, detail: 'Simultaneous burst transmissions across 16 burner SIMs on single transceiver' },
      { name: 'Cell Tower Sector TAC', score: 4.95, detail: 'Fixed cell mast azimuth 120° with zero Doppler velocity' },
      { name: 'Network Gateway Tunnel', score: 4.92, detail: 'Shared WireGuard egress node routing malicious SMS exfiltration' },
      { name: 'Behavioral OTP Harvesting', score: 5.0, detail: 'Automated script reading SMS verification codes within 140ms' },
      { name: 'Mule Financial Dispersal', score: 4.98, detail: 'Immediate split-transfers into 3 flagged ICICI/Paytm mule vaults' }
    ]
  },
  {
    id: 'case-2',
    name: 'NCR Micro-Mule UPI Pool',
    infraCorrelation: 98.2,
    infraStatus: 'CRITICAL CORRELATION',
    infraNote1: 'CONFIRMED SYNDICATE POOL',
    infraNote2: 'COORDINATED OTP SNIFFER DETECTED',
    towerTac: '41902 / Sector 05',
    towerConfidence: 97.6,
    globalConsistency: 4.99,
    globalStatus: 'All Layers Agree',
    finalConfidence: 99.8,
    layers: [
      { name: 'Physical RF & GSM Layer', score: 5.0, detail: 'Hardware IMEI cloned across 4 virtual modem slots' },
      { name: 'Cell Tower Sector TAC', score: 4.98, detail: 'Co-located inside Cyber Hub micro-cell radius < 80m' },
      { name: 'Network Gateway Tunnel', score: 5.0, detail: 'Direct C2 websocket traffic communicating with decoy server' },
      { name: 'Behavioral OTP Harvesting', score: 4.98, detail: 'Pre-scripted UPI PIN brute-forcing attempt detected' },
      { name: 'Mule Financial Dispersal', score: 5.0, detail: 'Layer-1 account frozen by AI Sentinel with ₹4.8L held' }
    ]
  },
  {
    id: 'case-3',
    name: 'Bengaluru Exit Proxy Relay',
    infraCorrelation: 93.4,
    infraStatus: 'HIGH CORRELATION',
    infraNote1: 'DECOY VPN TUNNEL DETECTED',
    infraNote2: 'TOR / PROXY COLLISION',
    towerTac: '18492 / Sector 01',
    towerConfidence: 91.8,
    globalConsistency: 4.88,
    globalStatus: 'All Layers Agree',
    finalConfidence: 97.9,
    layers: [
      { name: 'Physical RF & GSM Layer', score: 4.8, detail: 'GSM signal spoofing via software defined radio' },
      { name: 'Cell Tower Sector TAC', score: 4.9, detail: 'Sector hop simulation artificially jittered' },
      { name: 'Network Gateway Tunnel', score: 4.95, detail: 'Reverse TLS proxy intercepted by honeypot listener' },
      { name: 'Behavioral OTP Harvesting', score: 4.85, detail: 'Malicious APK background accessibility permission invoked' },
      { name: 'Mule Financial Dispersal', score: 4.9, detail: 'Crypto OTC escrow wallet flagged on blockchain radar' }
    ]
  }
];

export const FinomeGenomeActivity: React.FC = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [isLiveStream, setIsLiveStream] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<'infra' | 'tower' | 'global' | 'consensus' | null>(null);
  const [quarantined, setQuarantined] = useState<boolean>(false);
  const [liveJitter, setLiveJitter] = useState<{ infra: number; tower: number; global: number; final: number }>({
    infra: 0,
    tower: 0,
    global: 0,
    final: 0
  });

  const activeCase = THREAT_CASES[selectedCaseIndex];

  // Subtle real-time live jitter simulation
  useEffect(() => {
    if (!isLiveStream) return;
    const interval = setInterval(() => {
      setLiveJitter({
        infra: (Math.random() * 0.4 - 0.2),
        tower: (Math.random() * 0.3 - 0.15),
        global: (Math.random() * 0.02 - 0.01),
        final: (Math.random() * 0.2 - 0.1)
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isLiveStream]);

  const displayInfra = Math.min(99.9, Math.max(90.0, +(activeCase.infraCorrelation + liveJitter.infra).toFixed(1)));
  const displayTower = Math.min(99.9, Math.max(88.0, +(activeCase.towerConfidence + liveJitter.tower).toFixed(1)));
  const displayGlobal = Math.min(5.00, Math.max(4.50, +(activeCase.globalConsistency + liveJitter.global).toFixed(2)));
  const displayFinal = Math.min(99.9, Math.max(95.0, +(activeCase.finalConfidence + liveJitter.final).toFixed(1)));

  return (
    <div className="w-full flex-1 rounded-2xl bg-white border border-slate-200/90 overflow-hidden flex flex-col p-4 relative font-sans select-none shadow-sm">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/[0.04] via-transparent to-transparent pointer-events-none" />

      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-slate-800">
            INFRASTRUCTURE INTELLIGENCE
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsLiveStream(!isLiveStream)}
            title={isLiveStream ? "Pause Live Stream" : "Resume Live Stream"}
            className={cn(
              "px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all border cursor-pointer",
              isLiveStream 
                ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm" 
                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
            )}
          >
            {isLiveStream ? <Radio size={9} className="animate-spin text-orange-500" /> : <Play size={9} />}
            <span>{isLiveStream ? 'LIVE PING' : 'PAUSED'}</span>
          </button>

          <button
            onClick={() => setSelectedCaseIndex((prev) => (prev + 1) % THREAT_CASES.length)}
            title="Cycle Target Profile"
            className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all text-xs cursor-pointer"
          >
            <RefreshCw size={10} className="hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Primary Stacked Cards */}
      <div className="flex flex-col gap-2.5 flex-1 relative z-10">
        
        {/* =========================================================================
            CARD 1: INFRASTRUCTURE CORRELATION
           ========================================================================= */}
        <motion.div
          whileHover={{ scale: 1.01, borderColor: 'rgba(249, 115, 22, 0.5)' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveModal('infra')}
          className="group relative cursor-pointer rounded-xl bg-slate-50/70 border border-slate-200 p-4 flex flex-col items-center justify-center text-center shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white"
        >
          {/* Header Title */}
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.22em] text-slate-600 mb-1">
            INFRASTRUCTURE CORRELATION
          </span>

          {/* Big High-Impact Percentage */}
          <div className="flex items-baseline justify-center my-0.5">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-red-600">
              {displayInfra}%
            </span>
          </div>

          {/* Red Subtitle */}
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-red-600 mb-3">
            {activeCase.infraStatus}
          </span>

          {/* Gold / Orange Outlined Inner Box */}
          <div className="w-full rounded-lg bg-orange-50/80 border border-orange-300/80 px-3 py-2 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[9.5px] font-mono font-black tracking-wider uppercase text-orange-800">
              {activeCase.infraNote1}
            </span>
            <span className="text-[8.5px] font-mono font-bold tracking-widest uppercase text-orange-700">
              {activeCase.infraNote2}
            </span>
          </div>

          {/* Micro hover hint */}
          <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono text-orange-600">
            TAP TO DRILL-DOWN ↗
          </span>
        </motion.div>


        {/* =========================================================================
            CARD 2: TOWER COHERENCE
           ========================================================================= */}
        <motion.div
          whileHover={{ scale: 1.01, borderColor: 'rgba(249, 115, 22, 0.5)' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveModal('tower')}
          className="group relative cursor-pointer rounded-xl bg-slate-50/70 border border-slate-200 px-4 py-3 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white"
        >
          {/* Header Title */}
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.22em] text-slate-600 mb-2">
            TOWER COHERENCE
          </span>

          {/* Two-Column Metadata Row */}
          <div className="flex items-center justify-between">
            {/* Left Column: Same TAC / Cell Sector */}
            <div className="flex flex-col text-left">
              <span className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                Same TAC / Cell Sector
              </span>
              <span className="text-[13px] font-mono font-black text-orange-600 tracking-tight">
                {activeCase.towerTac}
              </span>
            </div>

            {/* Right Column: MATCH CONFIDENCE */}
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                MATCH CONFIDENCE
              </span>
              <span className="text-[13px] font-mono font-black text-orange-600 tracking-tight">
                {displayTower}%
              </span>
            </div>
          </div>

          <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono text-orange-600">
            RADAR ↗
          </span>
        </motion.div>


        {/* =========================================================================
            CARD 3: GLOBAL CONSISTENCY
           ========================================================================= */}
        <motion.div
          whileHover={{ scale: 1.01, borderColor: 'rgba(16, 185, 129, 0.5)' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveModal('global')}
          className="group relative cursor-pointer rounded-xl bg-slate-50/70 border border-slate-200 p-3.5 flex flex-col items-center justify-center text-center shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white"
        >
          {/* Header Title */}
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.22em] text-slate-600 mb-1">
            GLOBAL CONSISTENCY
          </span>

          {/* Big Green 4.97 / 5 Metric */}
          <div className="flex items-baseline justify-center my-0.5">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-emerald-600">
              {displayGlobal} / 5
            </span>
          </div>

          {/* Green Subtitle */}
          <span className="text-[9.5px] font-mono font-black uppercase tracking-[0.2em] text-emerald-600">
            {activeCase.globalStatus}
          </span>

          <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono text-emerald-600">
            5 LAYERS ↗
          </span>
        </motion.div>


        {/* =========================================================================
            CARD 4: FINAL CONSENSUS
           ========================================================================= */}
        <motion.div
          whileHover={{ scale: 1.01, borderColor: 'rgba(249, 115, 22, 0.6)' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveModal('consensus')}
          className="group relative cursor-pointer rounded-xl bg-orange-50/60 border border-orange-200/90 p-3 flex flex-col items-center justify-center text-center shadow-sm transition-all duration-300 hover:shadow-md hover:bg-orange-50"
        >
          {/* Header Title */}
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.22em] text-orange-800/60 mb-0.5">
            FINAL CONSENSUS
          </span>

          {/* Red Bold Bottom Text */}
          <span className="text-[12px] sm:text-[13px] font-mono font-black uppercase tracking-wider text-orange-600">
            {displayFinal}% FRAUD CONFIDENCE
          </span>

          <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono text-orange-600">
            ACTIONS ↗
          </span>
        </motion.div>

      </div>

      {/* Bottom Syndicate Profile Switcher */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono text-slate-400">
        <span className="truncate max-w-[170px] uppercase font-bold text-slate-700">
          TARGET: {activeCase.name}
        </span>
        <div className="flex items-center gap-1">
          {THREAT_CASES.map((tc, i) => (
            <button
              key={tc.id}
              onClick={() => setSelectedCaseIndex(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all cursor-pointer",
                selectedCaseIndex === i ? "bg-orange-500 scale-110 shadow-[0_0_6px_rgba(249,115,22,0.6)]" : "bg-slate-200 hover:bg-slate-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE DRILL-DOWN MODAL / DRAWER
         ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/98 backdrop-blur-xl p-4 flex flex-col justify-between overflow-y-auto rounded-2xl border border-slate-200 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600 border border-orange-200">
                  <ShieldAlert size={14} />
                </span>
                <div>
                  <h4 className="text-[11px] font-mono font-black uppercase text-slate-900 tracking-wider">
                    {activeModal === 'infra' && 'INFRASTRUCTURE COLLISION AUDIT'}
                    {activeModal === 'tower' && 'CELL TOWER RF TRIANGULATION'}
                    {activeModal === 'global' && '5-LAYER CONSENSUS MATRIX'}
                    {activeModal === 'consensus' && 'FINAL ADVERSARY LOCKDOWN'}
                  </h4>
                  <p className="text-[7.5px] font-mono text-slate-400 uppercase">
                    TARGET: {activeCase.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-800 text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="my-3 flex flex-col gap-2.5 text-[8.5px] font-mono">
              {activeModal === 'infra' && (
                <>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[7.5px] text-slate-400 uppercase block mb-1 font-bold">HARDWARE FINGERPRINT COLLISION</span>
                    <p className="text-slate-700 leading-relaxed">
                      16 simultaneous burner SIM connections verified on a single MediaTek GSM transceiver. Frequency hopping pattern confirms physical SIM-Box array routing SMS phishing bursts.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-red-50 p-2 rounded-lg border border-red-200">
                      <span className="text-red-600 font-bold block">96.7% MATCH</span>
                      <span className="text-[7px] text-slate-500">Hardware IMEI Duplication</span>
                    </div>
                    <div className="bg-orange-50 p-2 rounded-lg border border-orange-200">
                      <span className="text-orange-600 font-bold block">140ms VELOCITY</span>
                      <span className="text-[7px] text-slate-500">Automated OTP Exfiltration</span>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'tower' && (
                <>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[7.5px] text-orange-600 uppercase block mb-1 font-bold">MAST SECTOR TELEMETRY</span>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Cell ID / LAC:</span>
                      <span className="text-slate-900 font-bold">{activeCase.towerTac}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">RF Signal Strength:</span>
                      <span className="text-orange-600 font-bold">-68 dBm (Strong)</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Timing Advance Variance:</span>
                      <span className="text-emerald-600 font-bold">&lt; 150 meters</span>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'global' && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[7.5px] text-slate-400 uppercase font-bold">INDIVIDUAL CONSENSUS LAYERS</span>
                  {activeCase.layers.map((layer, idx) => (
                    <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col gap-0.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-900 font-bold text-[8px]">{layer.name}</span>
                        <span className="text-emerald-600 font-black text-[8px]">{layer.score} / 5.0</span>
                      </div>
                      <span className="text-[7px] text-slate-500">{layer.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'consensus' && (
                <div className="flex flex-col gap-2.5">
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 text-center">
                    <span className="text-orange-600 font-black text-sm block mb-1">{displayFinal}% FRAUD CERTAINTY</span>
                    <p className="text-[8px] text-slate-600">
                      Cross-correlated across RF Tower, SIM-Box MAC, Reverse Proxy Gateway, and Mule Account Velocity.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setQuarantined(true);
                      setTimeout(() => setQuarantined(false), 3500);
                    }}
                    className={cn(
                      "w-full py-2.5 px-3 rounded-xl font-mono font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer",
                      quarantined
                        ? "bg-emerald-600 text-white border border-emerald-500"
                        : "bg-orange-500 hover:bg-orange-600 text-white border border-orange-400 shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
                    )}
                  >
                    <Zap size={12} className={quarantined ? "" : "animate-bounce"} />
                    <span>{quarantined ? '✓ ALL 16 BURNER SIMS QUARANTINED' : 'EXECUTE HONEYPOT LOCKDOWN'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Bottom Close Button */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[8px] font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
