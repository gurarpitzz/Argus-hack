import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreatNode, ThreatLink } from '../types';
import { 
  ArrowRight, Landmark, AlertTriangle, ShieldCheck, 
  TrendingUp, CircleAlert, Link, DollarSign, Wallet 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface FraudNexusProps {
  nodes: ThreatNode[];
  links: ThreatLink[];
  isPlayingAutonomousMode?: boolean;
}

interface NexusEdge {
  id: string;
  source: string;
  target: string;
  amount: string;
  timestamp: string;
  status: 'PENDING' | 'LAUNDERED' | 'FROZEN';
}

const SIMULATED_EDGES: NexusEdge[] = [
  { id: 'tx-1', source: 'Anil Kumar (Victim Device)', target: 'Ramesh Patel (Layer-1 Mule)', amount: '₹4,50,000', timestamp: '10:28:14', status: 'LAUNDERED' },
  { id: 'tx-2', source: 'Ramesh Patel (Layer-1 Mule)', target: 'Global Trade Co. (Central Mule)', amount: '₹2,80,000', timestamp: '10:31:02', status: 'LAUNDERED' },
  { id: 'tx-3', source: 'Global Trade Co. (Central Mule)', target: 'CryptEx Mule Wallet', amount: '₹2,10,000 (USDT)', timestamp: '10:35:45', status: 'PENDING' },
  { id: 'tx-4', source: 'SBI Account Root', target: 'Ramesh Patel (Layer-1 Mule)', amount: '₹12,00,000', timestamp: '09:12:44', status: 'FROZEN' }
];

export const FraudNexus: React.FC<FraudNexusProps> = ({
  nodes,
  links,
  isPlayingAutonomousMode = false
}) => {
  const [edges, setEdges] = useState<NexusEdge[]>(SIMULATED_EDGES);
  const [selectedTxId, setSelectedTxId] = useState<string>('tx-1');
  const [activeTab, setActiveTab] = useState<'TX_FLOW' | 'ENTITY_LIST'>('TX_FLOW');
  const [freezeSuccess, setFreezeSuccess] = useState<string | null>(null);

  const selectedTx = edges.find(tx => tx.id === selectedTxId) || null;

  const handleFreeze = (txId: string) => {
    setEdges(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'FROZEN' } : tx));
    const target = edges.find(tx => tx.id === txId);
    if (target) {
      setFreezeSuccess(`Instant UPI/IMPS freeze protocol deployed successfully for transactions matching ${target.id}. Core banks notified.`);
      setTimeout(() => setFreezeSuccess(null), 5000);
    }
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col lg:flex-row gap-5 overflow-hidden">
      
      {/* Visualizer Mesh */}
      <div className="flex-grow min-h-[220px] lg:min-h-0 relative border border-white/5 bg-black/60 rounded-3xl p-5 overflow-hidden flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex justify-between items-center z-10 shrink-0 border-b border-white/5 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link className="text-red-threat animate-pulse" size={14} />
              <span className="text-[10px] font-black tracking-[0.4em] text-red-threat uppercase">Fraud Nexus (GNN Link Engine)</span>
            </div>
            <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
              Laundering networks & Central Cooperative accounts tracing
            </div>
          </div>
          <div className="flex gap-1.5">
            {['TX_FLOW', 'ENTITY_LIST'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-3 py-1 rounded-md text-[8.5px] font-mono tracking-wider transition-all uppercase",
                  activeTab === tab
                    ? "bg-white/10 text-white border border-white/15"
                    : "bg-white/[0.01] text-white/40 border border-transparent hover:text-white"
                )}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Core Node Link Visualization map */}
        {activeTab === 'TX_FLOW' ? (
          <div className="flex-1 my-4 flex flex-col justify-start relative min-h-0 overflow-y-auto pr-1">
            <div className="space-y-3">
              {edges.map((tx) => {
                const isSelected = selectedTx?.id === tx.id;
                return (
                  <motion.div
                    key={tx.id}
                    onClick={() => setSelectedTxId(tx.id)}
                    whileHover={{ scale: 1.005, x: 1 }}
                    className={cn(
                      "p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
                      isSelected 
                        ? 'bg-red-threat/10 border-red-threat/35 shadow-[0_0_20px_rgba(255,31,31,0.06)]'
                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'
                    )}
                  >
                    <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-red-threat/85 to-transparent" />
                    
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                      
                      {/* Left Side: Source Node */}
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                          <Landmark className="text-white/60" size={12} />
                        </div>
                        <div className="truncate">
                          <p className="text-[10.5px] font-bold text-white leading-normal truncate">{tx.source}</p>
                          <span className="text-[7px] font-mono uppercase opacity-35 tracking-wider">Debit Origin</span>
                        </div>
                      </div>

                      {/* Line connector spacer */}
                      <div className="flex flex-col items-center shrink-0 px-2">
                        <span className="text-[10px] font-black text-red-threat leading-none mb-1 font-mono tracking-tighter">{tx.amount}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-10 h-[1px] bg-red-threat/30 relative">
                            <span className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-1 rounded-full bg-red-threat animate-ping" />
                          </div>
                          <ArrowRight className="text-red-threat" size={10} />
                        </div>
                      </div>

                      {/* Right Side: Destination Node */}
                      <div className="flex-1 flex items-center gap-3 min-w-0 pdf-export-avoid">
                        <div className="w-7 h-7 rounded-full bg-red-threat/10 flex items-center justify-center shrink-0 border border-red-threat/20">
                          <Landmark className="text-red-threat" size={12} />
                        </div>
                        <div className="truncate">
                          <p className="text-[10.5px] font-bold text-white leading-normal truncate">{tx.target}</p>
                          <span className="text-[7px] font-mono uppercase tracking-wider text-red-threat/55">Credit Target</span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 my-4 overflow-y-auto pr-1.5 custom-scrollbar space-y-2.5 min-h-0">
            {nodes.map(node => (
              <div key={node.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[9px] text-white/50">
                    {node.type[0]}
                  </div>
                  <div>
                    <h5 className="text-[10.5px] font-bold text-white leading-tight">{node.label}</h5>
                    <p className="text-[8px] opacity-35 uppercase tracking-widest mt-0.5">{node.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-amber-neon block">{node.riskScore}%</span>
                  <span className="text-[7px] tracking-widest font-mono opacity-30 uppercase">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer info line */}
        <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] pt-3 border-t border-white/5">
          Alert central node: Co-operative bank layers exfiltrating to offshore crypto wallet hashes.
        </div>
      </div>

      {/* Linked Analysis Detail view */}
      <div className="w-full lg:w-72 xl:w-80 shrink-0 h-[220px] lg:h-full min-h-0 overflow-y-auto pr-1 z-10 custom-scrollbar flex flex-col gap-4">
        
        {/* Coordinated Rings alert panel */}
        <div className="bg-red-threat/10 border border-red-threat/25 rounded-3xl p-5 relative overflow-hidden shrink-0">
          <div className="absolute top-1/2 -translate-y-1/2 right-[-20px] w-24 h-24 rounded-full bg-red-threat/5 blur-2xl" />
          <div className="flex items-center gap-2.5 mb-3 text-red-threat">
            <AlertTriangle className="animate-bounce" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Laundering Chain Triggered</span>
          </div>
          <p className="text-[10px] text-white/80 leading-relaxed">
            Argus GNN clustering identified a rapid fund exfiltration segment mapping 1 target victim directly into Paytm Payments Bank layer-1 accounts, and channeling into Cooperative Bank hubs.
          </p>
        </div>

        {/* Node detail display */}
        <AnimatePresence mode="wait">
          {selectedTx ? (
            <motion.div
              key={selectedTx.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-grow bg-glass border border-white/10 rounded-3xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-1.5 text-white/50">
                    <TrendingUp size={12} />
                    <span className="text-[8.5px] font-bold tracking-widest uppercase">LANE METRICS</span>
                  </div>
                  <span className="text-[8px] font-mono text-white/30 tracking-widest">{selectedTx.timestamp}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[8px] uppercase tracking-widest font-mono opacity-30 block mb-0.5">Transfer Volume</label>
                    <span className="text-xl font-black text-white">{selectedTx.amount}</span>
                  </div>

                  <div>
                    <label className="text-[8px] uppercase tracking-widest font-mono opacity-30 block mb-1">Centrality Central GNN Metric</label>
                    <span className="text-[10px] font-mono font-bold text-cyan-data tracking-wide block bg-cyan-data/5 p-2.5 rounded border border-cyan-data/10 leading-normal">
                      Central Hub centrality rating: 0.94
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-2.5">
                      <label className="text-[7px] uppercase tracking-widest font-mono opacity-35 block mb-0.5">Launder Prob</label>
                      <span className="text-[10px] font-black text-red-threat font-mono">98.8% Probability</span>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-2.5">
                      <label className="text-[7px] uppercase tracking-widest font-mono opacity-35 block mb-0.5">Status Code</label>
                      <span className="text-[10px] font-black text-white font-mono uppercase tracking-widest">{selectedTx.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {freezeSuccess && (
                  <div className="mb-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[8.5px] font-mono text-emerald-400">
                    {freezeSuccess}
                  </div>
                )}
                {selectedTx.status === 'LAUNDERED' || selectedTx.status === 'PENDING' ? (
                  <button 
                    onClick={() => handleFreeze(selectedTx.id)}
                    className="w-full py-2 bg-red-threat text-black hover:bg-red-400 font-extrabold uppercase text-[8.5px] tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,31,31,0.2)]"
                  >
                    <CircleAlert size={12} /> Immediate Account Freeze API
                  </button>
                ) : (
                  <div className="p-2 bg-cyan-data/10 border border-cyan-data/20 text-cyan-data flex items-center gap-2 rounded-xl justify-center text-[9px] font-black tracking-wider uppercase">
                    <ShieldCheck size={12} /> Account frozen successfully online
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex-grow border border-dashed border-white/10 rounded-3xl p-5 flex flex-col justify-center items-center text-center">
              <Wallet className="opacity-20 text-white mb-3 animate-bounce" size={24} />
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">Select Transfer Segment</h5>
              <p className="text-[8.5px] text-white/40 leading-relaxed max-w-xs">
                Select any transaction link on the left to show localized centrality ratings and dispatch immediate API freezes.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
