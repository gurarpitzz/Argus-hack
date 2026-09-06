import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, ShieldCheck, Download, CheckCircle, Scale, 
  Layers, Lock, Cpu, Clock, Terminal, AlertTriangle
} from 'lucide-react';

export function EvidenceExportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  if (!isOpen) return null;

  const sampleReportData = {
    caseId: "CASE-2026-CHD-0417",
    timestamp: new Date().toISOString(),
    investigator: "Officer In-Charge (Cyber Cell CHD)",
    suspectNetwork: "Syndicate-Alpha (16 SIMs, 5 Mule Bank Accounts)",
    consensusScore: "96.8% (Bayesian Reality Verification Passed)",
    unfalsifiablePhysics: {
      cpnfJitterSync: "0.42ms identical electromagnetic micro-movement",
      hardwareWearIndex: "EEPROM Wear mismatch (High Usage on single power chassis)",
      azimuthSector: "Chandigarh Sector 17 / Tower CHD-17-03"
    },
    linkedEntities: [
      { type: "IMEI", value: "864920040192837", domain: "Telecom Hardware" },
      { type: "MSISDN", value: "+91-98765-43210", domain: "CDR Stream" },
      { type: "UPI VPA", value: "fastpay@okbank", domain: "FINOME Financial" },
      { type: "Bank Account", value: "HDFC-4910284910", domain: "Mule Account" },
      { type: "Social Handle", value: "@chd_kyc_helper", domain: "Telegram/OSINT" }
    ],
    chainOfCustodyHash: "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  };

  const handleDownloadReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Create downloadable JSON evidence file
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sampleReportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `COURT_READY_EVIDENCE_${sampleReportData.caseId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsExporting(false);
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 4000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden font-sans"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Scale className="text-orange-500" size={24} />
            <div>
              <h3 className="font-bold text-base tracking-wide text-white">Court-Ready Evidence Dossier Generator</h3>
              <p className="text-[11px] text-slate-400 font-mono">ARGUS-DFAP // Judicial Chain-of-Custody Standard</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Metadata Card */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">CASE FILE ID:</span>
              <span className="font-bold text-slate-900">{sampleReportData.caseId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">REALITY CONSENSUS SCORE:</span>
              <span className="font-bold text-emerald-600">{sampleReportData.consensusScore}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block">CHAIN-OF-CUSTODY HASH (SHA-256):</span>
              <span className="font-mono text-[10px] text-slate-700 break-all">{sampleReportData.chainOfCustodyHash}</span>
            </div>
          </div>

          {/* Section 1: Hardware Physics Proof */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
              <Cpu size={14} className="text-orange-500" />
              1. Unfalsifiable Hardware Physics Evidence
            </h4>
            <div className="bg-orange-50/60 border border-orange-200 p-3 rounded-lg text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Correlated Phase Noise (CPNF):</span>
                <span className="font-bold text-orange-900">{sampleReportData.unfalsifiablePhysics.cpnfJitterSync}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Hardware Degradation (NHAS):</span>
                <span className="font-bold text-orange-900">{sampleReportData.unfalsifiablePhysics.hardwareWearIndex}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Cross-Domain Linked Entities */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
              <Layers size={14} className="text-blue-500" />
              2. Correlated Cross-Domain Identity Cluster
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-mono text-[10px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Domain</th>
                    <th className="p-2.5">Identifier Type</th>
                    <th className="p-2.5">Ingested Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {sampleReportData.linkedEntities.map((ent, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-500">{ent.domain}</td>
                      <td className="p-2.5 font-bold text-slate-800">{ent.type}</td>
                      <td className="p-2.5 text-orange-600 font-bold">{ent.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Compliance Banner */}
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-800 text-xs">
            <ShieldCheck className="shrink-0 text-emerald-600 mt-0.5" size={16} />
            <div>
              <span className="font-bold block">Admissible Under Indian Evidence Act (Sec 65B Certified)</span>
              <p className="text-[11px] text-emerald-700">Contains immutable timestamps, raw packet hashes, and mathematical consensus proofs formatted for court submission.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleDownloadReport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Encrypting Evidence Stack...</span>
              </>
            ) : downloadComplete ? (
              <>
                <CheckCircle size={14} />
                <span>Evidence Package Exported!</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Export Official Evidence Dossier (.JSON/.PDF)</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
