import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, Search, ChevronRight, ChevronLeft, Database, 
  AlertTriangle, Cpu, Layers, Activity, CheckCircle2, 
  Filter, FileText, Check, Copy, ExternalLink, RefreshCw 
} from 'lucide-react';

interface FileMeta {
  name: string;
  size: string;
  rowCount: number;
  headers: string[];
}

export const DatasetExplorer: React.FC = () => {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('attacker_logs.csv');
  const [fileData, setFileData] = useState<{ headers: string[]; rows: any[] }>({ headers: [], rows: [] });
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'TABLE' | 'RAW'>('TABLE');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const rowsPerPage = 12;

  // Fetch file list with metadata
  useEffect(() => {
    const fetchFileList = async () => {
      setLoadingList(true);
      setError(null);
      try {
        const res = await fetch('/api/dataset-files');
        if (!res.ok) throw new Error('Failed to retrieve system datasets');
        const data = await res.json();
        setFiles(data);
        
        // Find default file or fallback
        const defaultFile = data.find((f: FileMeta) => f.name === 'attacker_logs.csv') || data[0];
        if (defaultFile) {
          setSelectedFile(defaultFile.name);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading dataset metadata');
      } finally {
        setLoadingList(false);
      }
    };

    fetchFileList();
  }, []);

  // Fetch selected file details and rows
  useEffect(() => {
    if (!selectedFile) return;

    const fetchFileContent = async () => {
      setLoadingContent(true);
      setExpandedRow(null);
      setCurrentPage(1);
      try {
        const res = await fetch(`/api/dataset-file/${selectedFile}`);
        if (!res.ok) throw new Error(`Failed to load content for ${selectedFile}`);
        const data = await res.json();
        setFileData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading file records');
      } finally {
        setLoadingContent(false);
      }
    };

    fetchFileContent();
  }, [selectedFile]);

  // Copy raw CSV snippet or contents
  const handleCopyRaw = () => {
    if (fileData.rows.length === 0) return;
    
    const csvHeader = fileData.headers.join(',');
    const csvRows = fileData.rows.slice(0, 50).map(row => 
      fileData.headers.map(h => row[h]).join(',')
    ).join('\n');
    
    const fullText = `${csvHeader}\n${csvRows}\n... [Truncated for Clipboard]`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Derived stats summary per file
  const renderFileSummaryStats = () => {
    if (!fileData || fileData.rows.length === 0) return null;

    if (selectedFile === 'attacker_logs.csv') {
      const highThreats = fileData.rows.filter(r => Number(r.maliciousness_score) >= 80).length;
      const avgMaliciousness = (fileData.rows.reduce((sum, r) => sum + Number(r.maliciousness_score || 0), 0) / fileData.rows.length).toFixed(1);
      const sqlThreats = fileData.rows.filter(r => r.layer === 'SQL').length;
      const sshThreats = fileData.rows.filter(r => r.layer === 'SSH').length;

      return (
        <div className="grid grid-cols-4 gap-2 mb-4 shrink-0">
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">High Risks</div>
            <div className="text-xs font-black text-red-600">{highThreats}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Avg Threat</div>
            <div className="text-xs font-black text-orange-600">{avgMaliciousness}%</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">SQL Vectors</div>
            <div className="text-xs font-black text-sky-600">{sqlThreats}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">SSH Probe</div>
            <div className="text-xs font-black text-purple-600">{sshThreats}</div>
          </div>
        </div>
      );
    }

    if (selectedFile === 'deception_responses.csv') {
      const totalSuccess = fileData.rows.filter(r => r.mitigation_status === 'SUCCESS').length;
      const totalPartial = fileData.rows.filter(r => r.mitigation_status === 'PARTIAL').length;
      const avgConfusionDelta = (fileData.rows.reduce((sum, r) => sum + Number(r.confusion_delta || 0), 0) / fileData.rows.length).toFixed(1);
      const avgYield = (fileData.rows.reduce((sum, r) => sum + Number(r.intelligence_yield || 0), 0) / fileData.rows.length).toFixed(2);

      return (
        <div className="grid grid-cols-4 gap-2 mb-4 shrink-0">
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Mitigated</div>
            <div className="text-xs font-black text-emerald-600">{totalSuccess}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Partial Mit</div>
            <div className="text-xs font-black text-orange-600">{totalPartial}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Confusion Δ</div>
            <div className="text-xs font-black text-sky-600">+{avgConfusionDelta}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Intel Yield</div>
            <div className="text-xs font-black text-emerald-600">{avgYield}</div>
          </div>
        </div>
      );
    }

    if (selectedFile === 'system_telemetry.csv') {
      const avgThreat = (fileData.rows.reduce((sum, r) => sum + Number(r.threat_level || 0), 0) / fileData.rows.length).toFixed(1);
      const avgEntropy = (fileData.rows.reduce((sum, r) => sum + Number(r.entropy_rate || 0), 0) / fileData.rows.length).toFixed(2);
      const avgConfusion = (fileData.rows.reduce((sum, r) => sum + Number(r.confusion_index || 0), 0) / fileData.rows.length).toFixed(1);
      const avgDnaSync = (fileData.rows.reduce((sum, r) => sum + Number(r.dna_sync_percentage || 0), 0) / fileData.rows.length).toFixed(1);

      return (
        <div className="grid grid-cols-4 gap-2 mb-4 shrink-0">
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Threat Mean</div>
            <div className="text-xs font-black text-red-600">{avgThreat}%</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Entropy Avg</div>
            <div className="text-xs font-black text-orange-600">{avgEntropy}b</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Confusion</div>
            <div className="text-xs font-black text-sky-600">{avgConfusion}%</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shadow-xs">
            <div className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">DNA Sync</div>
            <div className="text-xs font-black text-emerald-600">{avgDnaSync}%</div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Filter rows based on search query
  const filteredRows = fileData.rows.filter(row => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(query)
    );
  });

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const displayedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Formatting helpers
  const formatCell = (header: string, val: any) => {
    if (header.toLowerCase().includes('score') || header.toLowerCase().includes('threat_level') || header.toLowerCase().includes('percentage') || header.toLowerCase().includes('index')) {
      const num = Number(val);
      if (!isNaN(num)) {
        const isCritical = num >= 80;
        return (
          <span className={`font-mono font-black ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
            {val}
          </span>
        );
      }
    }
    if (header === 'mitigation_status') {
      const isSuccess = val === 'SUCCESS';
      return (
        <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase tracking-wider ${
          isSuccess ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
        }`}>
          {val}
        </span>
      );
    }
    if (header === 'layer') {
      return (
        <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase ${
          val === 'SQL' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
        }`}>
          {val}
        </span>
      );
    }
    if (header === 'source_ip') {
      return <span className="font-mono text-[9px] text-slate-600">{val}</span>;
    }
    if (header === 'log_id' || header === 'trigger_action_id' || header === 'session_id' || header === 'mutation_id') {
      return <span className="font-mono text-[9px] text-orange-600 tracking-wider font-bold">{val}</span>;
    }
    if (header === 'timestamp') {
      try {
        const timePart = val.split('T')[1]?.substring(0, 8) || val;
        return <span className="font-mono text-[8px] text-slate-400">{timePart}</span>;
      } catch (e) {
        return <span className="font-mono text-[8px] text-slate-400">{val}</span>;
      }
    }
    return <span className="truncate max-w-[120px] block text-[10px] text-slate-700 font-medium">{val}</span>;
  };

  const getRowAccent = (row: any) => {
    if (selectedFile === 'attacker_logs.csv' && Number(row.maliciousness_score) >= 90) {
      return 'border-l-2 border-l-red-500 bg-red-50/40';
    }
    if (selectedFile === 'deception_responses.csv' && row.mitigation_status === 'SUCCESS') {
      return 'border-l-2 border-l-emerald-500 bg-emerald-50/20';
    }
    return 'border-l-2 border-l-transparent';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* File Dataset Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 border border-slate-200 rounded-2xl mb-4 shrink-0 overflow-x-auto select-none no-scrollbar">
        {loadingList ? (
          <div className="flex items-center gap-2 py-1 px-3 text-[10px] text-slate-400 font-mono">
            <RefreshCw className="animate-spin text-orange-600" size={10} /> Loading system files...
          </div>
        ) : (
          files.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file.name)}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                selectedFile === file.name
                  ? 'bg-orange-600 text-white font-black shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <FileSpreadsheet size={10} />
              <span>{file.name.replace('_', ' ')}</span>
              <span className={`text-[8px] font-mono px-1 py-0.2 rounded ${
                selectedFile === file.name ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {file.size}
              </span>
            </button>
          ))
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-[10px] font-mono text-red-600 shrink-0 flex items-center gap-2">
          <AlertTriangle size={12} /> {error}
        </div>
      )}

      {/* Dataset Summary Cards */}
      {!loadingContent && renderFileSummaryStats()}

      {/* View Mode & Filter Controls */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-orange-500 text-slate-900 rounded-xl pl-8 pr-3 py-1.5 text-[10px] font-medium placeholder-slate-400 focus:outline-none transition-all shadow-xs"
          />
        </div>
        
        {/* Toggle Mode button */}
        <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-0.5 shrink-0">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            GRID
          </button>
          <button
            onClick={() => setViewMode('RAW')}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'RAW' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            RAW
          </button>
        </div>
      </div>

      {/* Interactive Main Body Content */}
      <div className="flex-1 min-h-0 relative bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
        {loadingContent ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="animate-spin text-orange-600" size={24} />
            <p className="text-[9px] uppercase tracking-[0.3em] font-mono font-bold text-center text-slate-500">Unpacking {selectedFile} records...</p>
          </div>
        ) : viewMode === 'RAW' ? (
          /* Raw CSV file dump */
          <div className="flex-1 flex flex-col min-h-0 bg-slate-900 p-4 font-mono text-[9.5px] overflow-hidden select-text text-slate-300">
            <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2 shrink-0">
              <span className="text-slate-400 uppercase text-[8px] tracking-widest font-black flex items-center gap-1.5"><Layers size={10} /> CSV Header Map</span>
              <button
                onClick={handleCopyRaw}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-md text-[8px] font-black uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy Snippet'}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar whitespace-pre leading-normal pr-1 select-text scroll-smooth">
              <div className="text-orange-400 font-black sticky top-0 bg-slate-900/90 backdrop-blur-sm py-0.5 border-b border-orange-500/20">{fileData.headers.join(',')}</div>
              {fileData.rows.slice(0, 150).map((row, i) => (
                <div key={i} className="hover:bg-slate-800/60 py-0.5 transition-colors">
                  <span className="text-slate-500 select-none inline-block w-8 text-right pr-2 mr-2 border-r border-slate-800">{i + 1}</span>
                  {fileData.headers.map(h => row[h]).join(',')}
                </div>
              ))}
              {fileData.rows.length > 150 && (
                <div className="text-slate-500 py-2 border-t border-slate-800 select-none text-center">
                  ... and {fileData.rows.length - 150} more records truncated for browser safety.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* High density interactive tabular grid interface */
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-md z-10 border-b border-slate-200 shadow-xs">
                  <tr>
                    {fileData.headers.slice(0, 3).map((header) => (
                      <th 
                        key={header} 
                        className="p-3 text-[8.5px] uppercase font-black tracking-widest text-slate-500 border-b border-slate-200 font-mono"
                      >
                        {header.replace('_', ' ')}
                      </th>
                    ))}
                    <th className="p-3 text-[8.5px] uppercase font-black tracking-widest text-slate-500 border-b border-slate-200 text-right font-mono">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-400 text-[10px] font-mono uppercase tracking-widest">
                        No matches found
                      </td>
                    </tr>
                  ) : (
                    displayedRows.map((row, rowIndex) => {
                      const absoluteIndex = (currentPage - 1) * rowsPerPage + rowIndex;
                      const isExpanded = expandedRow === absoluteIndex;

                      return (
                        <React.Fragment key={rowIndex}>
                          <tr 
                            onClick={() => setExpandedRow(isExpanded ? null : absoluteIndex)}
                            className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${getRowAccent(row)} ${
                              isExpanded ? 'bg-orange-50/30' : ''
                            }`}
                          >
                            {fileData.headers.slice(0, 3).map((header) => (
                              <td key={header} className="p-3 border-b border-slate-100">
                                {formatCell(header, row[header])}
                              </td>
                            ))}
                            <td className="p-3 border-b border-slate-100 text-right">
                              <span className="text-[10px] font-mono font-black text-orange-600 transition-colors">
                                {isExpanded ? '[-]' : '[+]'}
                              </span>
                            </td>
                          </tr>

                          {/* Row Expansion details */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={4} className="p-4 bg-slate-50 border-b border-slate-200 select-text">
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="grid grid-cols-2 gap-x-4 gap-y-2.5 font-mono text-[9px] leading-tight text-slate-700"
                                >
                                  {fileData.headers.map((header) => (
                                    <div key={header} className="border-b border-slate-200 pb-1.5 select-text">
                                      <span className="text-slate-500 font-bold block mb-0.5 text-[8px] uppercase tracking-wider">{header.replace('_', ' ')}</span>
                                      <span className="text-slate-900 break-all select-text font-semibold">{row[header]}</span>
                                    </div>
                                  ))}
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Micro Pagination footer inside side component */}
            <div className="p-3 border-t border-slate-200 flex items-center justify-between shrink-0 bg-slate-50 select-none">
              <span className="text-[8.5px] font-mono text-slate-500 font-bold">
                PAGE <span className="text-slate-900">{currentPage}</span> / <span className="text-slate-900">{totalPages}</span>
                <span className="ml-2 opacity-60">({filteredRows.length} ROWS)</span>
              </span>
              
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
