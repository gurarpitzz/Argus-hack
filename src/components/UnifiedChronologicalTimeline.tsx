import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Phone, DollarSign, Share2, AlertCircle, Shield, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeLabel: string;
  domain: 'TELECOM' | 'FINANCE' | 'SOCIAL' | 'PHYSICS';
  title: string;
  description: string;
  entity: string;
  confidence: number;
  metadata: Record<string, string>;
}

const SAMPLE_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'EV-1',
    timestamp: '2026-09-05T14:02:09.950Z',
    timeLabel: '14:02:09.950 IST',
    domain: 'SOCIAL',
    title: 'Phishing Campaign Dispatch',
    description: 'Bulk dispatch of fake SBI KYC update link via Telegram bot API.',
    entity: '@chd_kyc_helper (IP: 103.21.XX.XX)',
    confidence: 94,
    metadata: { Platform: 'Telegram', UserAgent: 'Python-AIOHTTP/3.8', Method: 'POST' }
  },
  {
    id: 'EV-2',
    timestamp: '2026-09-05T14:02:10.120Z',
    timeLabel: '14:02:10.120 IST',
    domain: 'TELECOM',
    title: 'Inbound VoIP Fraud Call Initiated',
    description: 'Call routed through illegal local SIM-Box array in Sector 17.',
    entity: 'MSISDN: +91-98765-43210 (IMEI: 864920040192837)',
    confidence: 98,
    metadata: { Tower: 'CHD-SECTOR17-03', Azimuth: '120°', Duration: '42s' }
  },
  {
    id: 'EV-3',
    timestamp: '2026-09-05T14:02:10.540Z',
    timeLabel: '14:02:10.540 IST',
    domain: 'PHYSICS',
    title: 'Phase Noise & Jitter Synchronization Lock',
    description: '0.42ms identical jitter detected across 16 active SIM slots on shared chassis.',
    entity: 'CPNF Signal Analysis Engine',
    confidence: 99,
    metadata: { PhaseDiff: '0.002 rad', HardwareWear: '96.2%', PowerCoupling: 'MATCHED' }
  },
  {
    id: 'EV-4',
    timestamp: '2026-09-05T14:02:11.850Z',
    timeLabel: '14:02:11.850 IST',
    domain: 'FINANCE',
    title: 'Victim Fund Transfer Received',
    description: 'Victim transfers ₹5,00,000 to primary fraudulent merchant account.',
    entity: 'VPA: fastpay@okbank (HDFC Acc: XXXX4819)',
    confidence: 97,
    metadata: { Amount: '₹5,00,000', Protocol: 'UPI/IMPS', TxnID: 'UPI/325109281' }
  },
  {
    id: 'EV-5',
    timestamp: '2026-09-05T14:02:12.650Z',
    timeLabel: '14:02:12.650 IST',
    domain: 'FINANCE',
    title: 'Rapid Mule Fund Dispersion (FINOME)',
    description: '₹5,00,000 split across 5 secondary money-mule accounts in 800ms.',
    entity: 'Mule Ring Alpha-05',
    confidence: 99,
    metadata: { FanOutRatio: '1:5', DispersionVelocity: '₹625,000/sec', AutoScript: 'TRUE' }
  }
];

export function UnifiedChronologicalTimeline() {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [activeIndex, setActiveIndex] = useState<number>(2);

  const filteredEvents = selectedDomain === 'ALL' 
    ? SAMPLE_TIMELINE_EVENTS 
    : SAMPLE_TIMELINE_EVENTS.filter(e => e.domain === selectedDomain);

  const activeEvent = filteredEvents[activeIndex] || filteredEvents[0];

  const getDomainBadge = (domain: TimelineEvent['domain']) => {
    switch (domain) {
      case 'TELECOM':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded font-mono">TELECOM (CDR/IPDR)</span>;
      case 'FINANCE':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded font-mono font-mono">FINANCE (FINOME)</span>;
      case 'SOCIAL':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-bold px-2 py-0.5 rounded font-mono">SOCIAL / OSINT</span>;
      case 'PHYSICS':
        return <span className="bg-orange-100 text-orange-800 border border-orange-300 text-[10px] font-bold px-2 py-0.5 rounded font-mono">HARDWARE PHYSICS</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="text-orange-600" size={20} />
            <h3 className="font-bold text-slate-900 text-base">Unified Cross-Domain Chronological Timeline</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized temporal reconstruction fusing Telegram pings, CDR calls, Bank UPI transfers & Physics jitter.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-mono">
          {['ALL', 'TELECOM', 'FINANCE', 'SOCIAL', 'PHYSICS'].map(d => (
            <button
              key={d}
              onClick={() => { setSelectedDomain(d); setActiveIndex(0); }}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold text-[11px]",
                selectedDomain === d 
                  ? "bg-white text-orange-600 shadow-sm border border-slate-200" 
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Timeline Slider */}
      <div className="space-y-4">
        <div className="flex justify-between text-xs font-mono text-slate-500">
          <span>T0: Phishing Post (14:02:09)</span>
          <span className="font-bold text-orange-600">ACTIVE MOMENT: {activeEvent.timeLabel}</span>
          <span>Tn: Cash-out (14:02:12)</span>
        </div>

        <input
          type="range"
          min="0"
          max={filteredEvents.length - 1}
          value={activeIndex}
          onChange={(e) => setActiveIndex(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />

        {/* Milestone Node Dots */}
        <div className="relative flex justify-between items-center px-1">
          {filteredEvents.map((evt, idx) => (
            <button
              key={evt.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center text-[8px] font-mono font-bold",
                activeIndex === idx 
                  ? "bg-orange-600 border-orange-300 ring-4 ring-orange-100 text-white scale-125" 
                  : "bg-white border-slate-400 text-slate-600 hover:border-orange-500"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Active Event Detail Box */}
      <motion.div 
        key={activeEvent.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-3">
            {getDomainBadge(activeEvent.domain)}
            <span className="font-mono text-xs font-bold text-slate-500">{activeEvent.timeLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Bayesian Confidence:</span>
            <span className="font-bold text-emerald-600">{activeEvent.confidence}%</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-base">{activeEvent.title}</h4>
          <p className="text-xs text-slate-600 mt-1">{activeEvent.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-lg border border-slate-200 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">CORRELATED ENTITY:</span>
            <span className="font-bold text-slate-800">{activeEvent.entity}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">METADATA ATTRIBUTES:</span>
            <div className="text-slate-700 text-[11px] space-x-2">
              {Object.entries(activeEvent.metadata).map(([k, v]) => (
                <span key={k} className="inline-block bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {k}: <b className="text-orange-600">{v}</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
