import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAetherEngine } from './lib/aetherEngine';
import { Background } from './components/Background';
import { LoadingScreen } from './components/LoadingScreen';
import { FinomeGenomeActivity } from './components/FinomeGenomeActivity';
import { DatasetExplorer } from './components/DatasetExplorer';
import { FraudConstellation } from './components/FraudConstellation';
import { DigitalGenome } from './components/DigitalGenome';
import { GeographicTowerHeatmap } from './components/GeographicTowerHeatmap';
import { HoneypotTacticalRadarHUD } from './components/HoneypotTacticalRadarHUD';
import { MultiLayerEntityResolutionEngine } from './components/MultiLayerEntityResolutionEngine';
import { EntityResolutionCore } from './components/EntityResolutionCore';
import { EntityGraph } from './components/EntityGraph';
import { FraudNexus } from './components/FraudNexus';
import { ThreatOracle } from './components/ThreatOracle';
import { InvestigationMatrix } from './components/InvestigationMatrix';
import { FinancialHealthHelix } from './components/FinancialHealthHelix';
import { RiskEntropyChart } from './components/RiskEntropyChart';
import { generateApkAnalysis } from './lib/gemini';
import { ApkLab } from './components/ApkLab';
import { LithosHero } from './components/LithosHero';
import { ArgusShieldEyeLogo } from './components/ArgusLogo';
import { Globe } from 'lucide-react';
import { 
  Shield, Laptop, Cpu, Radio, TrendingUp, Layers, 
  Zap, AlertCircle, Play, Square, UploadCloud, 
  RefreshCw, CheckCircle2, Sparkles, BookOpen, Binary
} from 'lucide-react';
import { cn } from './lib/utils';

const GlitchOverlay = ({ active }: { active: boolean }) => {
  const [visible, setVisible] = useState(false);
  const [glitchCode, setGlitchCode] = useState('');

  useEffect(() => {
    if (!active) return;
    
    // Constant high risk trigger interval
    const interval = setInterval(() => {
      // Chance of deep visual disruption spikes
      if (Math.random() > 0.8) {
        setVisible(true);
        const chars = '01#$&%X@☠☣☢⚡';
        let str = '';
        for(let i=0; i<30; i++) {
          str += chars[Math.floor(Math.random() * chars.length)];
        }
        setGlitchCode(str);
        setTimeout(() => setVisible(false), 120);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <>
      {/* Absolute Red Hazard alert glow whenever the active threshold is breached */}
      {active && (
        <div className="fixed inset-0 z-[99] pointer-events-none border-4 border-red-threat/40 crazy-alert-glow" />
      )}
      
      {/* Deep glitch structural slice overlay */}
      {visible && (
        <div className="fixed inset-0 z-[100] pointer-events-none mix-blend-difference overflow-hidden">
          {/* Chromatic aberration splits */}
          <div className="absolute inset-0 bg-red-threat/25 translate-x-2 translate-y-1 crazy-static" />
          <div className="absolute inset-0 bg-cyan-data/25 -translate-x-2 -translate-y-1" />
          
          {/* Random horizontal slices */}
          <div className="absolute top-[20%] left-0 w-full h-[8%] bg-[#FF00FF]/25 translate-x-4" />
          <div className="absolute top-[65%] left-0 w-full h-[12%] bg-[#00FFFF]/25 -translate-x-4" />
          
          {/* Floating glitch telemetry */}
          <div className="absolute bottom-10 left-10 font-mono text-[14px] font-black text-red-threat uppercase select-none tracking-[0.5em] animate-pulse">
            OVERLOAD_DETECTION_LOCK: {glitchCode}
          </div>
          <div className="absolute top-10 right-10 font-mono text-[14px] font-black text-cyan-data uppercase select-none tracking-[0.5em] animate-pulse">
            EMERGENCY_DISSOLUTION: ACTIVE
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  const [workflowStep, setWorkflowStep] = useState<'LITHOS' | 'DASHBOARD'>('DASHBOARD');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeView, setActiveView] = useState<'INTELLIGENCE' | 'GENOME' | 'NETWORK' | 'FORECAST' | 'APK_LAB'>('INTELLIGENCE');

  // Load all telemetry stream mechanisms from upgraded ARGUS engine
  const {
    threatLevel,
    confusionIndex,
    attackerLogs,
    deceptionLogs,
    isEngaging,
    digitalDNA,
    metrics,
    
    // Neural galaxy
    constellationNodes,
    constellationLinks,
    selectedConstellationNode,
    setSelectedConstellationNode,
    
    // Rotating crystal helix
    digitalGenome,
    
    // Foreshadow branching oracle
    forecastBranches,
    selectedForecastBranch,
    setSelectedForecastBranch,
    
    // Tactical matrix logs
    investigationCards,
    activeInvestigationStage,
    setActiveInvestigationStage,
    
    // Concentric risk engine scores
    riskRings,
    
    // APK upload drop zones
    uploadedApkStatus,
    setUploadedApkStatus,
    uploadedApkDetails,
    startApkScan,
    
    // Autonomous Mode
    isPlayingScenarios,
    autonomousThinking,
    triggerAutonomousMode
  } = useAetherEngine();

  // Selected sample APK list for quick decompile playground simulation
  const SAMPLE_PLAYLOAD_APKS = [
    { name: 'SBI_Security_Rewards.apk', size: '4.8 MB', desc: 'Pretends to offer HDFC/SBI UPI loyalty points.' },
    { name: 'FastLoan_Instant_In.apk', size: '6.2 MB', desc: 'Instant micro-loans intercepting contacts and SMS alerts.' },
    { name: 'WhatsApp_Beta_Secure.apk', size: '12.4 MB', desc: 'Malicious overlay hijacking banking session notifications.' }
  ];

  // Drag and drop state controls
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.apk') || true) {
        initiateDecompileScan(file.name, `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      initiateDecompileScan(file.name, `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  // Perform AI-Powered or fallbacked APK decompile
  const initiateDecompileScan = async (name: string, size: string) => {
    setUploadedApkStatus('scanning');
    
    // Query Gemini model client side (using proxy process.env.GEMINI_API_KEY safely) to generate actual reverse-engineered logs
    const mockPackageName = `com.india.malware.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const mockPermissions = ['READ_SMS', 'RECEIVE_SMS', 'SYSTEM_ALERT_WINDOW', 'REQUEST_INSTALL_PACKAGES'];
    
    try {
      const reportText = await generateApkAnalysis(name, mockPackageName, mockPermissions);
      startApkScan(name, size, reportText);
    } catch (e) {
      console.warn("Falling back to preset templates due to sandbox API access:", e);
      startApkScan(name, size);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden selection:bg-orange-500 selection:text-white bg-[#F8FAFC] text-slate-900">
      <AnimatePresence mode="wait">
        {workflowStep === 'LITHOS' ? (
          <motion.div
            key="lithos-hero-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <LithosHero 
              onStartDigging={() => {
                setWorkflowStep('DASHBOARD');
                setIsLoaded(false);
              }} 
            />
          </motion.div>
        ) : !isLoaded ? (
          <LoadingScreen key="loading" onComplete={() => setIsLoaded(true)} />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "relative h-full w-full flex flex-col transition-all duration-300",
              threatLevel > 82 && "crazy-shake"
            )}
          >
            <Background />
            <div className="grain" />
            <div className="scanline" />
            
            {/* Chromatic threat-flashing overlay if risk score gets high */}
            <GlitchOverlay active={threatLevel > 75} />
            
            {/* Premium National-Scale Header */}
            <header className="relative z-50 flex flex-col lg:flex-row items-center justify-between px-8 lg:px-12 py-3.5 gap-4 border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-sm shrink-0">
              <div className="flex items-center gap-3.5 select-none">
                <div className="relative">
                  <ArgusShieldEyeLogo size={40} />
                  {isPlayingScenarios && (
                    <span className="absolute inset-0 border-2 border-orange-500 rounded-full animate-ping opacity-60" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-2xl font-extrabold tracking-wider uppercase leading-none text-slate-900 font-sans flex items-center gap-1.5">
                    ARGUS
                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                  </h1>
                  <p className="text-[11px] font-medium text-slate-500 tracking-normal leading-tight mt-0.5">
                    Digital Forensics & Intelligence Platform
                  </p>
                </div>
              </div>

              {/* Master Hub Navigation */}
              <nav className="flex flex-wrap gap-1.5 p-1 bg-slate-100/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-inner">
                {[
                  { id: 'INTELLIGENCE', label: 'Honeypot Intelligence', icon: <Laptop size={13} /> },
                  { id: 'GENOME', label: 'Deception Genome', icon: <Cpu size={13} /> },
                  { id: 'NETWORK', label: 'Breach Nexus', icon: <Radio size={13} /> },
                  { id: 'APK_LAB', label: 'Twin Syndicate', icon: <Binary size={13} /> },
                  { id: 'FORECAST', label: 'Deception Oracle', icon: <TrendingUp size={13} /> },
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id as any)}
                    className={cn(
                      "px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer",
                      activeView === view.id 
                        ? "bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)]" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                    )}
                  >
                    {view.icon}
                    {view.label}
                  </button>
                ))}
              </nav>

              {/* Server-Side Indicators */}
              <div className="flex items-center gap-6">
                
                {/* Active Indicator status alerts */}
                <div className="text-right hidden xl:block">
                  <div className="text-[8px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Threat Density Rate</div>
                  <div className="flex gap-1 h-3.5 items-end">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-1 rounded-full transition-all duration-300", 
                          i < Math.round(threatLevel / 12) ? "bg-orange-500" : "bg-slate-200"
                        )} 
                        style={{ height: `${30 + Math.sin(i + Date.now() / 1000) * 50 + 20}%` }} 
                      />
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[8px] uppercase tracking-[0.2em] text-slate-400 mb-0.5 font-bold">Mitigation Center</div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      autonomousThinking ? "bg-red-500" : "bg-emerald-500"
                    )} />
                    <span className={cn(
                      "text-[9px] font-mono uppercase font-black tracking-widest",
                      autonomousThinking ? "text-red-600" : "text-emerald-600"
                    )}>
                      {autonomousThinking ? 'AUTONOMOUS ACTIVE' : 'STEADY_MITIG'}
                    </span>
                  </div>
                </div>

                {/* Flagship Autonomous mode Button toggler */}
                <button
                  onClick={triggerAutonomousMode}
                  className={cn(
                    "px-4 py-2 text-[9px] font-black uppercase tracking-widest border rounded-xl flex items-center gap-2 transition-all duration-300 transform cursor-pointer shadow-sm",
                    isPlayingScenarios 
                      ? "bg-red-500 border-red-500 text-white shadow-[0_4px_16px_rgba(239,68,68,0.3)]" 
                      : "bg-white hover:bg-orange-50/50 border-slate-200 hover:border-orange-300 text-slate-800"
                  )}
                >
                  {isPlayingScenarios ? <Square size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" className="text-orange-500" />}
                  {isPlayingScenarios ? 'SHUTDOWN AGENT' : 'AUTONOMOUS ACTIVE'}
                </button>
              </div>
            </header>

            {/* Main Full-Scale Grid Workspace */}
            <main className="flex-1 px-4 lg:px-10 py-5 grid grid-cols-12 gap-5 relative z-40 min-h-0 overflow-y-auto lg:overflow-hidden">
              
              {/* Column 1 (Left 3-Grid): Indian Cyber Threat Feeds & Circular Risk Gauge */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-5 lg:h-full lg:max-h-full min-h-0 overflow-hidden">
                
                {/* Live Cyber Fraud exfiltration feed stream */}
                <FinomeGenomeActivity />

                {/* Financial Health DNA Genome Helix mapping milestones */}
                <div className="bento-card h-[460px] shrink-0">
                  <FinancialHealthHelix />
                </div>
              </div>

              {/* Column 2 (Center 6-Grid): Interactive Canvas visualizations pathways */}
              <div className="col-span-12 lg:col-span-6 flex flex-col gap-5 lg:h-full lg:max-h-full min-h-0 overflow-hidden">
                <div className={cn(
                  "bento-card flex-1 relative flex flex-col min-h-0 overflow-hidden",
                  activeView === 'INTELLIGENCE' || activeView === 'NETWORK' ? "p-2 lg:p-2.5" : "p-5 lg:p-6"
                )}>
                  
                  {/* Real-time thinking overlay during Autonomous loops */}
                  <AnimatePresence>
                    {autonomousThinking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-orange-500/10 backdrop-blur-[2px] z-30 pointer-events-none flex flex-col items-center justify-center"
                      >
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 px-4 py-1.5 border border-orange-300 rounded-full flex items-center gap-3 shadow-md">
                          <RefreshCw className="animate-spin text-orange-500" size={12} />
                          <span className="text-[9px] font-mono font-black text-orange-600 uppercase tracking-[0.2em]">ARGUS AGENT MODELING DECEPTION SCENARIOS...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {activeView === 'INTELLIGENCE' && (
                      <motion.div
                        key="intelligence"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="w-full h-full relative"
                      >
                        <HoneypotTacticalRadarHUD />
                      </motion.div>
                    )}

                    {activeView === 'GENOME' && (
                      <motion.div
                        key="genome"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="w-full h-full relative flex flex-col"
                      >
                        <GeographicTowerHeatmap />
                      </motion.div>
                    )}

                    {activeView === 'NETWORK' && (
                      <motion.div
                        key="network"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="w-full h-full relative"
                      >
                        <EntityResolutionCore />
                      </motion.div>
                    )}

                    {activeView === 'FORECAST' && (
                      <motion.div
                        key="forecast"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        className="w-full h-full relative"
                      >
                        <div className="mb-4">
                          <h2 className="text-2xl font-black tracking-tight uppercase text-orange-600 text-glow-orange flex items-center gap-2">
                            AUTONOMOUS DECEPTION ORACLE
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200 font-mono">NEURAL_V4</span>
                          </h2>
                          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold">NEURAL HEURISTIC THREAT VISUALIZATION & PREDICTION</p>
                        </div>
                        <div className="flex-1 min-h-0 h-[calc(100%-60px)]">
                          <ThreatOracle 
                            branches={forecastBranches}
                            selectedBranch={selectedForecastBranch}
                            onSelectBranch={setSelectedForecastBranch}
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeView === 'APK_LAB' && (
                      <motion.div
                        key="apklab"
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                        className="w-full h-full relative"
                      >
                        <div className="mb-4">
                          <h2 className="text-2xl font-black tracking-tight uppercase text-slate-900 flex items-center gap-2">
                            FINANCIAL TWIN SYNDICATE NETWORK
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200 font-mono">LIVE_GRID</span>
                          </h2>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">INTERACTIVE NODE MAPPING & DEEP FAKE RECONNAISSANCE</p>
                        </div>
                        <div className="flex-1 min-h-0 h-[calc(100%-60px)]">
                          <ApkLab />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Column 3 (Right 3-Grid): Sandbox Deceptions & Datasets */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-5 lg:h-full lg:max-h-full min-h-0 overflow-hidden animate-fade-in">
                
                {/* System Datasets Explorer */}
                <div className="bento-card flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-3 shrink-0 border-b border-slate-100 pb-2.5">
                    <div>
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 mb-0.5">Argus Telemetry Hub</h3>
                      <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Interactive Dataset & CSV Logs Explorer</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" />
                  </div>
                  <div className="flex-1 overflow-hidden min-h-[160px]">
                    <DatasetExplorer />
                  </div>
                </div>

                {/* Dynamic Multi-Factor Risk Scoring and Entropy Progression Chart */}
                <div className="bento-card h-[310px] shrink-0 flex flex-col min-h-0">
                  <RiskEntropyChart 
                    threatLevel={threatLevel} 
                    deceptionLogs={deceptionLogs} 
                    attackerLogs={attackerLogs} 
                    metrics={metrics} 
                    riskRings={riskRings} 
                  />
                </div>

              </div>
            </main>

            {/* Premium, clean Footer display */}
            <footer className="px-8 lg:px-12 py-3.5 flex flex-col md:flex-row gap-4 justify-between items-center relative z-50 border-t border-slate-200/90 bg-white/90 backdrop-blur-md shadow-sm shrink-0 text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-slate-700">ARGUS ACTIVE HONEYNET MONITORING CONNECTED</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>LATENCY: 0.02MS</span>
                  <span className="w-[1px] h-3 bg-slate-200" />
                  <span className="text-orange-600 font-bold">ENTROPY: {metrics.entropyRate}b</span>
                  <span className="w-[1px] h-3 bg-slate-200" />
                  <span>PACKETS ROUTING: CLEAR</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="px-3.5 py-1 rounded-full border border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-600 bg-slate-50 font-mono">
                  SECURE CONNECTION STATE
                </div>
                <div className="px-3.5 py-1 rounded-full bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest font-mono shadow-[0_2px_8px_rgba(249,115,22,0.35)]">
                  Autonomous Operating System
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
