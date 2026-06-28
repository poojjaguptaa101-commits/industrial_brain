"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  Cpu, 
  LayoutDashboard, 
  Network, 
  MessageSquare, 
  Wrench, 
  ShieldCheck, 
  BrainCircuit, 
  Presentation, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Clock, 
  UploadCloud, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  Smartphone, 
  Monitor, 
  Mic, 
  QrCode, 
  Send, 
  Package, 
  Download, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  Bookmark,
  Check
} from 'lucide-react';

// -------------------------------------------------------------
// Mock Data definitions
// -------------------------------------------------------------
const INITIAL_NODES: Node[] = [
  { id: 'PMP-101', type: 'default', data: { label: 'Feed Pump PMP-101' }, position: { x: 250, y: 150 }, style: { background: '#00f2fe', color: '#0b0f19', border: '1px solid #00f2fe', borderRadius: '8px', fontWeight: 'bold' } },
  { id: 'VLV-204', type: 'default', data: { label: 'Control Valve VLV-204' }, position: { x: 450, y: 100 }, style: { background: '#00f2fe', color: '#0b0f19', border: '1px solid #00f2fe', borderRadius: '8px', fontWeight: 'bold' } },
  { id: 'BLR-302', type: 'default', data: { label: 'Boiler BLR-302' }, position: { x: 200, y: 350 }, style: { background: '#00f2fe', color: '#0b0f19', border: '1px solid #00f2fe', borderRadius: '8px', fontWeight: 'bold' } },
  { id: 'T-104', type: 'default', data: { label: 'Storage Tank T-104' }, position: { x: 600, y: 320 }, style: { background: '#00f2fe', color: '#0b0f19', border: '1px solid #00f2fe', borderRadius: '8px', fontWeight: 'bold' } },
  
  { id: 'SOP-PMP-101', type: 'default', data: { label: 'SOP_FeedPump_v2.pdf' }, position: { x: 80, y: 80 }, style: { background: '#818cf8', color: '#f8fafc', border: '1px solid #818cf8', borderRadius: '8px' } },
  { id: 'OEM-VLV-204', type: 'default', data: { label: 'Valve_OEM_Guide_v3.pdf' }, position: { x: 550, y: 30 }, style: { background: '#818cf8', color: '#f8fafc', border: '1px solid #818cf8', borderRadius: '8px' } },
  { id: 'SOP-BLR-302', type: 'default', data: { label: 'SOP_Boiler_v4.pdf' }, position: { x: 50, y: 380 }, style: { background: '#818cf8', color: '#f8fafc', border: '1px solid #818cf8', borderRadius: '8px' } },
  { id: 'INS-T-104', type: 'default', data: { label: 'Tank_Inspection_2025.xlsx' }, position: { x: 650, y: 400 }, style: { background: '#818cf8', color: '#f8fafc', border: '1px solid #818cf8', borderRadius: '8px' } },
  
  { id: 'OISD-189', type: 'default', data: { label: 'OISD-STD-189 (Boiler)' }, position: { x: 380, y: 380 }, style: { background: '#10b981', color: '#f8fafc', border: '1px solid #10b981', borderRadius: '8px' } },
  { id: 'PESO-ACT', type: 'default', data: { label: 'PESO Explosives Rules' }, position: { x: 740, y: 260 }, style: { background: '#10b981', color: '#f8fafc', border: '1px solid #10b981', borderRadius: '8px' } },
  { id: 'FACTORY-ACT', type: 'default', data: { label: 'Indian Factory Act' }, position: { x: 380, y: 240 }, style: { background: '#10b981', color: '#f8fafc', border: '1px solid #10b981', borderRadius: '8px' } },

  { id: 'JO-88321', type: 'default', data: { label: 'Job Order #JO-88321' }, position: { x: 280, y: 40 }, style: { background: '#f59e0b', color: '#0b0f19', border: '1px solid #f59e0b', borderRadius: '8px' } },
  { id: 'RCA-VLV-204', type: 'default', data: { label: 'RCA_Valve_Sticking.md' }, position: { x: 620, y: 150 }, style: { background: '#f59e0b', color: '#0b0f19', border: '1px solid #f59e0b', borderRadius: '8px' } }
];

const INITIAL_EDGES: Edge[] = [
  { id: 'e1', source: 'PMP-101', target: 'SOP-PMP-101', label: 'follows_procedure', animated: true },
  { id: 'e2', source: 'PMP-101', target: 'JO-88321', label: 'maintained_in' },
  { id: 'e3', source: 'VLV-204', target: 'OEM-VLV-204', label: 'OEM_reference' },
  { id: 'e4', source: 'VLV-204', target: 'RCA-VLV-204', label: 'analyzed_in' },
  { id: 'e5', source: 'BLR-302', target: 'SOP-BLR-302', label: 'follows_procedure', animated: true },
  { id: 'e6', source: 'BLR-302', target: 'OISD-189', label: 'governed_by' },
  { id: 'e7', source: 'T-104', target: 'INS-T-104', label: 'inspected_in' },
  { id: 'e8', source: 'T-104', target: 'PESO-ACT', label: 'licensed_by' },
  { id: 'e9', source: 'FACTORY-ACT', target: 'SOP-BLR-302', label: 'mandates_audit' }
];

const UPTIME_DATA = [
  { name: '08:00', Uptime: 99.8 },
  { name: '10:00', Uptime: 99.85 },
  { name: '12:00', Uptime: 99.82 },
  { name: '14:00', Uptime: 99.91 },
  { name: '16:00', Uptime: 99.84 }
];

const SILO_DATA = [
  { name: 'P&IDs', Coverage: 95 },
  { name: 'SAP Logs', Coverage: 89 },
  { name: 'SOPs', Coverage: 100 },
  { name: 'OEM Guides', Coverage: 72 },
  { name: 'PESO Rules', Coverage: 90 }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [liveTime, setLiveTime] = useState('');
  
  // Graph hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // Ingest Console Logs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[14:26:42] System initialized. Awaiting new document streams.",
    "[14:26:45] Pre-indexed 12,842 files from Jamnagar Sharepoint archive complete."
  ]);
  
  // Copilot Chat
  const [copilotView, setCopilotView] = useState<'desktop' | 'mobile'>('desktop');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am your Industrial Expert Knowledge Copilot. I scan across all drawings, procedures, OEM manuals, and compliance regulations to give you cited, actionable insights. How can I assist you today?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Maintenance & RCA
  const [activeAsset, setActiveAsset] = useState('PMP-101');
  const [activeDiagTab, setActiveDiagTab] = useState('overview');
  const [selectedRCAIncident, setSelectedRCAIncident] = useState('pmp-leak');
  const [rca5Whys, setRca5Whys] = useState<string[]>([]);
  const [rcaCapas, setRcaCapas] = useState<string[]>([]);
  
  // Compliance
  const [evAsset, setEvAsset] = useState('PMP-101');
  const [evReg, setEvReg] = useState('OISD');
  const [isCompilingEvidence, setIsCompilingEvidence] = useState(false);
  const [evidenceManifest, setEvidenceManifest] = useState<any[]>([]);
  const [showEvidenceResult, setShowEvidenceResult] = useState(false);

  // Slide Deck
  const [activeSlide, setActiveSlide] = useState(1);
  const [activePitchTab, setActivePitchTab] = useState('slides');

  // Clock Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync RCA state with selector
  useEffect(() => {
    triggerRCAAnalysis();
  }, [selectedRCAIncident]);

  // Dynamic Theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Node selection handler
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    const origNode = INITIAL_NODES.find(n => n.id === node.id);
    setSelectedNode(origNode || node);
  };

  // Ingest Simulator
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const addLog = (text: string) => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setConsoleLogs(prev => [...prev, `[${timeStr}] ${text}`]);
    };

    addLog(`Uploaded: ${file.name} (${Math.round(file.size / 1024)} KB)`);
    addLog(`Running LayoutLMv3 layout detection & segmentation...`);

    setTimeout(() => {
      addLog(`Extracted layout tables and 2 P&ID symbols.`);
      addLog(`PaddleOCR extracting labels...`);
    }, 1200);

    setTimeout(() => {
      const isBoiler = file.name.toLowerCase().includes('boiler') || file.name.toLowerCase().includes('oisd');
      const tag = isBoiler ? 'BLR-302' : 'VLV-204';
      addLog(`OCR successful. Entity Tag match: **${tag}**.`);
      addLog(`Seeding knowledge repositories and graph linker...`);
    }, 2800);

    setTimeout(() => {
      const newDocId = `DOC-${Math.floor(Math.random() * 1000)}`;
      const isBoiler = file.name.toLowerCase().includes('boiler') || file.name.toLowerCase().includes('oisd');
      const targetTag = isBoiler ? 'BLR-302' : 'VLV-204';

      // Spawn Node in React Flow
      const newNode: Node = {
        id: newDocId,
        type: 'default',
        data: { label: file.name },
        position: { x: 300 + Math.random() * 100, y: 200 + Math.random() * 100 },
        style: { background: '#818cf8', color: '#f8fafc', border: '1px solid #818cf8', borderRadius: '8px' }
      };

      const newEdge: Edge = {
        id: `e-${newDocId}`,
        source: newDocId,
        target: targetTag,
        label: 'associated_specification'
      };

      setNodes(prev => [...prev, newNode]);
      setEdges(prev => [...prev, newEdge]);

      addLog(`Success! Linked ${newDocId} to ${targetTag}. Active knowledge graph updated.`);
    }, 4000);
  };

  // Copilot engine
  const handleSendChat = (input: string) => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setChatInput('');
    setIsTyping(true);

    const lowQ = input.toLowerCase();
    let reply = "";
    let citations: string[] = [];
    let confidence = 85;

    if (lowQ.includes('pmp-101') && lowQ.includes('start')) {
      reply = "To start Feed Pump PMP-101:\n1. Inspect lube oil pressure (must exceed 1.8 bar).\n2. Fully open the suction valve.\n3. Bleed air vents until fluid emerges (priming).\n4. Ignite motor. Keep discharge valve closed during spin-up.\n5. Crack discharge valve to target line pressure (4.2 bar).";
      citations = ["SOP_FeedPump_v2.pdf (Page 4)", "OEM_Pump_Manual_v1.pdf"];
      confidence = 98;
    } else if (lowQ.includes('oisd') && lowQ.includes('hot work')) {
      reply = "OISD-STD-105 Section 6.4 dictates:\n1. Mandatory gas checks (LEL must be 0.0%).\n2. 15-meter clearance perimeter.\n3. Metal barriers blocking drains.\n4. Dedicated Fire Watch with charged CO2 cylinders.";
      citations = ["OISD-STD-105 (Section 6.4)", "Factory_Safety_Code.pdf"];
      confidence = 94;
    } else if (lowQ.includes('valve') || lowQ.includes('vlv-204')) {
      reply = "Control Valve VLV-204 sticking alerts suggest spindle friction coefficient is at 24% (exceeding safety limits). Recommend replacing instrument air dryer filters to stop rust condensation in the spring chamber.";
      citations = ["Valve_OEM_Guide_v3.pdf", "RCA_Valve_Sticking.md"];
      confidence = 91;
    } else {
      reply = `Parsed request regarding: "${input}". Knowledge Graph paths link this to Jamnagar complex parameters. Check SOP index archives and sensor gauges.`;
      citations = ["General_Complex_Index.pdf"];
      confidence = 85;
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: reply,
        citations,
        confidence
      }]);
    }, 1500);
  };

  // RCA Wizard Data
  const triggerRCAAnalysis = () => {
    if (selectedRCAIncident === 'pmp-leak') {
      setRca5Whys([
        "Shaft seal micro-cracked and leaked hydrocarbons.",
        "High axial shaft vibration wore down mechanical carbon seal face.",
        "Impeller cavitation induced unbalanced rotational forces on the shaft.",
        "Viscous petroleum feed rate increased while intake pressure dropped below 1.4 bar.",
        "Failure to cross-reference feed pump design limits in OEM Manual Page 22 during shift process changes."
      ]);
      setRcaCapas([
        "Install automated suction-pressure trip interlock on PMP-101 control panel.",
        "Incorporate OEM flow-limit curves directly into real-time sensor dashboards.",
        "Revise shift handover checklist to mandate feed viscosity limits audits."
      ]);
    } else if (selectedRCAIncident === 'vlv-stick') {
      setRca5Whys([
        "Pneumatic positioner failed to respond to flow commands.",
        "Friction coefficient inside pneumatic actuator rose to 24% (sticking).",
        "Moisture accumulation inside the pneumatic diaphragm rusted the spring housing.",
        "Instrument air supply feed gas filter was saturated with liquid moisture.",
        "Scheduled quarterly filter-drain inspections were omitted due to maintenance logging gaps."
      ]);
      setRcaCapas([
        "Replace VLV-204 actuator spring and execute stroke calibration.",
        "Update standard operating procedure to require weekly air-manifold drain verification.",
        "Integrate air dryer alarm telemetry directly into the Unified Operations Brain."
      ]);
    } else {
      setRca5Whys([
        "Boiler superheater tube ruptured, forcing unplanned shutdown.",
        "Tube wall suffered rapid creep deformation and thinning.",
        "Local temperature exceeded design limit of 620°C for extended runs.",
        "Chemical scaling on the tube water-side restricted internal heat transfer.",
        "Demineralized water treatment plant suffered pH and silica control spikes last month."
      ]);
      setRcaCapas([
        "Perform chemical acid-cleaning of boiler internals to clear scaling.",
        "Install high-temperature infrared sensor grid to detect local tube hotspots.",
        "Mandate daily laboratory reports uploads into regulatory compliance directory."
      ]);
    }
  };

  // Compliance packages
  const handleGenerateEvidence = () => {
    setIsCompilingEvidence(true);
    setShowEvidenceResult(false);
    setTimeout(() => {
      setIsCompilingEvidence(false);
      setShowEvidenceResult(true);
      if (evAsset === 'PMP-101') {
        setEvidenceManifest([
          { name: 'SOP_FeedPump_v2.pdf', hash: 'sha256-a88b1fc94d1b848c...' },
          { name: 'PMP-101_Calibration_2026.csv', hash: 'sha256-f84a1...' }
        ]);
      } else if (evAsset === 'BLR-302') {
        setEvidenceManifest([
          { name: 'SOP_Boiler_v4.pdf', hash: 'sha256-55ea30bb3912a281...' },
          { name: 'OISD-189_Boiler_Audit_Certificate.pdf', hash: 'sha256-8e2b9c73b...' }
        ]);
      } else {
        setEvidenceManifest([
          { name: 'Valve_OEM_Guide_v3.pdf', hash: 'sha256-ee29a8f273b71921...' }
        ]);
      }
    }, 1800);
  };

  // Focus node utility helper
  const handleFocusGraphNode = (nodeId: string) => {
    setActiveTab('ingest-graph');
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
    }
  };

  return (
    <div className={`flex w-screen h-screen overflow-hidden ${theme === 'dark' ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar Navigation */}
      <aside className={`w-[260px] flex-shrink-0 flex flex-col border-r ${theme === 'dark' ? 'bg-[#131b2e] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="p-5 flex items-center gap-3 border-b border-inherit">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-cyan-400 bg-cyan-950/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <Cpu className="text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-extrabold text-lg tracking-tight">
              IndusBrain<span className="text-cyan-400">AI</span>
            </h1>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Unified Industrial Brain</span>
          </div>
        </div>

        <nav className="p-4 flex flex-col gap-1.5 flex-grow overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'ingest-graph', label: 'Ingest & Graph', icon: Network },
            { id: 'copilot', label: 'Expert Copilot', icon: MessageSquare },
            { id: 'maintenance', label: 'Maintenance & RCA', icon: Wrench },
            { id: 'compliance', label: 'Compliance & Quality', icon: ShieldCheck },
            { id: 'lessons', label: 'Failure Intel', icon: BrainCircuit },
            { id: 'presentation', label: 'Pitch & Architecture', icon: Presentation }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                  active 
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-semibold' 
                    : 'text-slate-400 border-transparent hover:bg-slate-800/10'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-inherit flex flex-col gap-4">
          <div className="p-3 bg-slate-900/30 border border-slate-800 rounded-lg flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <div className="text-xs">
              <div className="font-semibold">Refinery Complex #3</div>
              <div className="text-[10px] text-slate-500">Status: NORMAL</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">P</div>
            <div className="text-xs">
              <div className="font-semibold">Pooja Sharma</div>
              <div className="text-[10px] text-slate-500">Chief Reliability Eng.</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className={`h-[70px] border-b flex items-center justify-between px-8 flex-shrink-0 ${theme === 'dark' ? 'bg-[#131b2e] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Query tags (e.g. PMP-101), procedures..."
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  const target = e.currentTarget.value.trim();
                  if (target) {
                    setActiveTab('copilot');
                    handleSendChat(target);
                    e.currentTarget.value = '';
                  }
                }
              }}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(34,211,238,0.25)] text-inherit"
            />
          </div>
          <div className="flex items-center gap-5 text-xs">
            <div className="px-3 py-1.5 bg-slate-900/30 border border-slate-800 rounded-md">
              Uptime: <span className="text-emerald-400 font-bold">99.84%</span>
            </div>
            <button className="relative text-slate-400 hover:text-inherit">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <button onClick={toggleTheme} className="text-slate-400 hover:text-inherit">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="font-mono text-cyan-400 text-sm font-semibold flex items-center gap-1 shadow-sm">
              <Clock size={14} />
              {liveTime || "14:26:42 PM"}
            </div>
          </div>
        </header>

        {/* View viewport */}
        <div className="flex-grow overflow-y-auto p-8">
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <section className="animate-fadeIn">
              <div className="flex justify-between items-start mb-6 border-b border-slate-800/50 pb-5">
                <div>
                  <h2 className="text-2xl font-bold font-sans">Unified Operations Dashboard</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Continuous aggregation of plant intelligence across 12 legacy document silos.</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-500">Shift A (06:00 - 14:00)</span>
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-900 border border-cyan-400">Shift B (14:00 - 22:00)</span>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-4 gap-5 mb-8">
                {[
                  { label: 'Ingested Documents', value: '12,842', trend: '+142 this week', icon: FileText, color: 'border-l-cyan-400' },
                  { label: 'Knowledge Graph Nodes', value: '85,291', trend: '+1,104 entities linked', icon: Network, color: 'border-l-indigo-400' },
                  { label: 'Safety Compliance Score', value: '98.6%', trend: '0 compliance breaches', icon: Activity, color: 'border-l-emerald-400' },
                  { label: 'Unplanned Downtime (YTD)', value: '2.4%', trend: '-18.2% vs 22% 2025 avg', icon: AlertTriangle, color: 'border-l-amber-500' }
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className={`bg-slate-900/40 border border-slate-800/80 border-l-4 ${kpi.color} rounded-xl p-5 flex items-center gap-4 hover:translate-y-[-2px] transition-all`}>
                      <div className="w-12 h-12 rounded-lg bg-slate-950/50 border border-slate-800 flex items-center justify-center text-cyan-400"><Icon size={20} /></div>
                      <div>
                        <span className="text-[11px] text-slate-500 uppercase font-semibold">{kpi.label}</span>
                        <h3 className="text-xl font-bold font-sans mt-0.5">{kpi.value}</h3>
                        <span className="text-[9px] text-emerald-400 block mt-0.5">{kpi.trend}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grid split */}
              <div className="grid grid-cols-12 gap-5">
                {/* Left Area - Warnings Feed */}
                <div className="col-span-7 bg-[#131b2e]/60 border border-slate-800/80 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/20 flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Critical Warnings & Actionable Insights</h3>
                    <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-bold">Active System Monitor</span>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    
                    <div className="bg-slate-950/40 border-l-4 border-amber-500 border border-slate-900 rounded-lg p-4">
                      <h4 className="text-xs font-bold text-amber-500">Valve VLV-204 Sticking Risk Flagged</h4>
                      <p className="text-xs text-slate-400 mt-1">Copilot matched work orders with OEM manual Page 47. Current operation logs show a temperature delta of +12°C. Risk of safety latch failure in next 72 hours.</p>
                      <div className="flex justify-between items-center mt-3 text-[10px]">
                        <span className="text-slate-500 flex items-center gap-1"><FileText size={12} /> Valve_OEM_Guide_v3.pdf</span>
                        <button onClick={() => { setActiveTab('maintenance'); setSelectedRCAIncident('vlv-stick'); }} className="text-cyan-400 hover:underline">Analyze Failure Path &rarr;</button>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border-l-4 border-cyan-400 border border-slate-900 rounded-lg p-4">
                      <h4 className="text-xs font-bold text-cyan-400">Factory Act 2024 Audit Prep Gap</h4>
                      <p className="text-xs text-slate-400 mt-1">Boiler BLR-302 safety valve certification expires in 12 days. Standard Operating Procedure (SOP_Boiler_v4.pdf) requires hydrostatic tests 10 days prior.</p>
                      <div className="flex justify-between items-center mt-3 text-[10px]">
                        <span className="text-slate-500 flex items-center gap-1"><FileText size={12} /> SOP_Boiler_v4.pdf</span>
                        <button onClick={() => setActiveTab('compliance')} className="text-cyan-400 hover:underline">View Gaps &rarr;</button>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border-l-4 border-emerald-500 border border-slate-900 rounded-lg p-4">
                      <h4 className="text-xs font-bold text-emerald-500">Pump PMP-101 Health Restored</h4>
                      <p className="text-xs text-slate-400 mt-1">Maintenance executed. Inspection log uploaded and parsed. Automatic entity linkage successfully bound Job Record #JO-88321 to PMP-101 and P&ID #PID-ENG-442.</p>
                      <div className="flex justify-between items-center mt-3 text-[10px]">
                        <span className="text-slate-500 flex items-center gap-1"><FileText size={12} /> Job_Order_JO-88321.xlsx</span>
                        <button onClick={() => handleFocusGraphNode('PMP-101')} className="text-cyan-400 hover:underline">View in Graph &rarr;</button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Area - Silo Coverage Chart */}
                <div className="col-span-5 bg-[#131b2e]/60 border border-slate-800/80 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/20 flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Silo Integration Coverage (%)</h3>
                  </div>
                  <div className="p-5 flex flex-col justify-center h-80">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={SILO_DATA}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="Coverage" fill="#00f2fe" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="p-3 bg-emerald-500/5 border border-dashed border-emerald-500/20 rounded-lg flex items-center gap-3 mt-4">
                      <CheckCircle className="text-emerald-400 flex-shrink-0" size={16} />
                      <p className="text-xs text-slate-400">Cross-silo connections created: <strong>42,891 relationships</strong> (average time-to-link: 1.2s via LangChain agent).</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. INGESTION & GRAPH VIEW (REACT FLOW) */}
          {activeTab === 'ingest-graph' && (
            <section className="animate-fadeIn">
              <div className="flex justify-between items-start mb-6 border-b border-slate-800/50 pb-5">
                <div>
                  <h2 className="text-2xl font-bold font-sans">Universal Document Ingestion & Knowledge Graph</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Ingest raw files. Watch the LangChain pipeline extract tags and spawn nodes in the React Flow graph.</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-5 h-[500px]">
                {/* Left - Ingest controls */}
                <div className="col-span-4 flex flex-col gap-4 h-full">
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center flex flex-col justify-center items-center flex-grow">
                    <UploadCloud className="text-cyan-400 mb-4" size={48} />
                    <h3 className="font-semibold text-sm">Upload Industrial Files</h3>
                    <p className="text-xs text-slate-400 mt-2 mb-4">Drag and drop PDFs, scanned guides, P&IDs, or emails.</p>
                    <label className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 text-xs font-bold px-4 py-2 rounded-md cursor-pointer shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-colors">
                      Browse Local Files
                      <input type="file" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col h-1/2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/20 text-xs font-semibold flex items-center justify-between">
                      <span>Real-time Extraction Console</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>
                    <div className="p-4 overflow-y-auto flex-grow font-mono text-[10px] flex flex-col gap-2 bg-slate-950/40 text-slate-400">
                      {consoleLogs.map((log, index) => (
                        <div key={index} className="word-break leading-relaxed">{log}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right - React Flow Canvas */}
                <div className="col-span-8 bg-slate-950/80 border border-slate-800 rounded-xl relative h-full overflow-hidden">
                  <ReactFlow 
                    nodes={nodes} 
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    fitView
                  >
                    <Background color="#334155" gap={16} />
                    <Controls />
                  </ReactFlow>

                  {/* Dynamic overlay sidebar */}
                  {selectedNode && (
                    <div className="absolute top-0 right-0 w-80 h-full bg-[#131b2e]/95 border-l border-slate-850 shadow-2xl p-6 overflow-y-auto animate-slideIn">
                      <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">&times;</button>
                      <h4 className="text-sm font-bold border-b border-slate-800 pb-3 uppercase tracking-wider text-cyan-400">{selectedNode.id} Detailed Meta</h4>
                      
                      <div className="mt-4 flex flex-col gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block">Name:</span>
                          <span className="font-semibold text-slate-200">{selectedNode.data.label}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Category:</span>
                          <span className="font-semibold text-slate-200 uppercase">{selectedNode.id.includes('SOP') || selectedNode.id.includes('OEM') || selectedNode.id.includes('INS') ? 'document' : (selectedNode.id.includes('OISD') || selectedNode.id.includes('ACT') ? 'regulatory' : 'asset')}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Linked connections:</span>
                          <ul className="mt-1 flex flex-col gap-1 text-[11px] text-cyan-400">
                            {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map((e, idx) => (
                              <li key={idx} className="bg-slate-900/50 border border-slate-800/40 p-1.5 rounded">
                                {e.source === selectedNode.id ? `Linked to ${e.target}` : `Required by ${e.source}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 3. EXPERT COPILOT VIEW */}
          {activeTab === 'copilot' && (
            <section className="animate-fadeIn">
              <div className="flex justify-between items-start mb-6 border-b border-slate-800/50 pb-5">
                <div>
                  <h2 className="text-2xl font-bold font-sans">Expert Knowledge Copilot</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Ask complex engineering, operations, or regulatory questions. Get answers backed by sources, citations, and risk-profiles.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Workspace View:</span>
                  <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                    <button 
                      onClick={() => setCopilotView('desktop')} 
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded ${copilotView === 'desktop' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}
                    >
                      <Monitor size={12} /> Desktop Engineer
                    </button>
                    <button 
                      onClick={() => setCopilotView('mobile')} 
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded ${copilotView === 'mobile' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}
                    >
                      <Smartphone size={12} /> Rugged Field Tablet
                    </button>
                  </div>
                </div>
              </div>

              {/* View Layout wrapper */}
              <div className="h-[480px]">
                {copilotView === 'desktop' ? (
                  <div className="grid grid-cols-12 gap-5 h-full">
                    {/* Left Sidebar */}
                    <div className="col-span-4 bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col gap-5 h-full">
                      <h4 className="text-xs uppercase text-slate-500 font-bold tracking-wider">Suggested Engineering Queries</h4>
                      <div className="flex flex-col gap-2">
                        {[
                          "What is the start-up sequence for Feed Pump PMP-101?",
                          "Which OISD regulations apply to hot work permits?",
                          "Show me the failure history for Control Valve VLV-204.",
                          "What is the torque spec on HEX-902 bolts?"
                        ].map((q, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleSendChat(q)}
                            className="text-left bg-slate-950/30 border border-slate-800 hover:border-cyan-400 hover:translate-x-1 transition-all rounded-lg p-3 text-xs text-slate-400 flex items-center gap-2"
                          >
                            <MessageSquare size={14} className="text-cyan-400 flex-shrink-0" />
                            <span>{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right Chat */}
                    <div className="col-span-8 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden">
                      <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 bg-slate-950/30">
                        {messages.map((m, idx) => (
                          <div key={idx} className={`flex gap-3 max-w-[80%] ${m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${m.sender === 'user' ? 'border-indigo-500/20 text-indigo-400 bg-indigo-950/20' : 'border-cyan-500/20 text-cyan-400 bg-cyan-950/20'}`}>
                              {m.sender === 'user' ? 'U' : 'AI'}
                            </div>
                            <div className={`p-4 rounded-xl text-xs leading-relaxed border ${m.sender === 'user' ? 'bg-indigo-550/5 border-indigo-500/20 rounded-tr-none' : 'bg-slate-900/50 border-slate-800 rounded-tl-none'}`}>
                              <p className="whitespace-pre-line">{m.text}</p>
                              {m.citations && (
                                <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] flex flex-col gap-2">
                                  <div className="text-slate-500 flex items-center gap-1 font-semibold"><Bookmark size={12} /> Source Citations:</div>
                                  <div className="flex gap-1.5 flex-wrap">
                                    {m.citations.map((c: string, cIdx: number) => (
                                      <button key={cIdx} onClick={() => handleFocusGraphNode(c.split('_')[0])} className="bg-slate-950 border border-slate-850 hover:border-cyan-400 text-cyan-400 px-2 py-0.5 rounded flex items-center gap-1">
                                        <ExternalLink size={10} /> {c}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="text-emerald-400 bg-emerald-950/20 border border-emerald-500/10 px-2 py-0.5 rounded w-max flex items-center gap-1">
                                    <Check size={12} /> Confidence Score: {m.confidence}%
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="text-xs text-slate-500 italic ml-11">IndusBrain is thinking...</div>
                        )}
                      </div>
                      <div className="p-4 border-t border-slate-800 flex gap-3">
                        <input 
                          type="text" 
                          placeholder="Ask a reliability or compliance question..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyUp={(e) => e.key === 'Enter' && handleSendChat(chatInput)}
                          className="flex-grow pl-4 pr-4 py-3 text-xs rounded-lg bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-cyan-400 text-inherit"
                        />
                        <button onClick={() => handleSendChat(chatInput)} className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 w-11 h-11 rounded-lg flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.3)]"><Send size={18} /></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    {/* Rugged Tablet Wrap */}
                    <div className="w-[360px] h-[450px] border-[10px] border-slate-700 bg-slate-800 rounded-[28px] overflow-hidden shadow-2xl flex flex-col relative">
                      <div className="h-6 bg-slate-700 flex justify-between px-4 items-center text-[9px] text-slate-400">
                        <span>LTE-R Secure Network</span>
                        <span>ATEX Zone II Intrinsically Safe</span>
                        <span>84%</span>
                      </div>
                      <div className="flex-grow bg-slate-950 p-4 flex flex-col justify-between overflow-hidden">
                        
                        <div className="flex-grow overflow-y-auto flex flex-col gap-3">
                          <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg text-[11px] text-slate-300">
                            <span className="font-bold text-cyan-400 block mb-1">Field Copilot Mode Active</span>
                            Scan asset barcode/QR codes or input instructions using safety microphone.
                          </div>
                          {messages.map((m, idx) => (
                            <div key={idx} className={`p-3 rounded-lg text-[11px] leading-relaxed border ${m.sender === 'user' ? 'bg-indigo-950/20 border-indigo-900/20 self-end' : 'bg-slate-900 border-slate-800 self-start'}`}>
                              <p className="whitespace-pre-line">{m.text}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-900">
                          <div className="flex gap-2">
                            <button onClick={() => handleSendChat("Read me SOP clearances for PMP-101.")} className="flex-1 bg-slate-900 border border-slate-800 text-[10px] py-2 rounded flex items-center justify-center gap-1.5 text-slate-300 hover:border-cyan-400"><Mic size={12} /> Mic input</button>
                            <button onClick={() => handleSendChat("Show me spec compliance report for Valve VLV-204.")} className="flex-1 bg-slate-900 border border-slate-800 text-[10px] py-2 rounded flex items-center justify-center gap-1.5 text-slate-300 hover:border-cyan-400"><QrCode size={12} /> Scan QR</button>
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Type query..."
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyUp={(e) => e.key === 'Enter' && handleSendChat(chatInput)}
                              className="flex-grow pl-3 py-2 text-[10px] rounded bg-slate-900 border border-slate-800 focus:outline-none text-inherit"
                            />
                            <button onClick={() => handleSendChat(chatInput)} className="bg-cyan-400 text-slate-900 px-3 rounded"><Send size={12} /></button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. MAINTENANCE & RCA DIAGNOSTICS */}
          {activeTab === 'maintenance' && (
            <section className="animate-fadeIn">
              <div className="flex justify-between items-start mb-6 border-b border-slate-800/50 pb-5">
                <div>
                  <h2 className="text-2xl font-bold font-sans">Maintenance Intelligence & Root Cause Analysis (RCA)</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Diagnose plant assets and generate automated Cause-and-Effect fishbone charts.</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-5 h-[500px]">
                {/* Left - Asset Profile Selector */}
                <div className="col-span-3 bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 h-full">
                  <h3 className="font-semibold text-sm">Select Asset Profile</h3>
                  <div className="flex flex-col gap-2 overflow-y-auto flex-grow">
                    {[
                      { id: 'PMP-101', name: 'Feed Pump PMP-101', type: 'Centrifugal', health: '85%' },
                      { id: 'VLV-204', name: 'Control Valve VLV-204', type: 'Actuator', health: '68%' },
                      { id: 'BLR-302', name: 'Boiler BLR-302', type: 'Steam Boiler', health: '94%' }
                    ].map(asset => (
                      <button 
                        key={asset.id} 
                        onClick={() => setActiveAsset(asset.id)}
                        className={`w-full text-left p-3.5 border rounded-lg transition-all ${
                          activeAsset === asset.id 
                            ? 'bg-cyan-500/5 border-cyan-400' 
                            : 'bg-slate-950/20 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-bold text-inherit">{asset.name}</h4>
                          <span className={`w-2 h-2 rounded-full ${asset.id === 'VLV-204' ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex flex-col gap-0.5">
                          <span>Type: {asset.type}</span>
                          <span>Health Score: <strong className="text-slate-300">{asset.health}</strong></span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right - Tabs (Overview vs RCA) */}
                <div className="col-span-9 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden">
                  <div className="flex border-b border-slate-850 bg-slate-950/20">
                    <button onClick={() => setActiveDiagTab('overview')} className={`px-5 py-3 text-xs font-semibold ${activeDiagTab === 'overview' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500'}`}>Asset Health Overview</button>
                    <button onClick={() => setActiveDiagTab('rca')} className={`px-5 py-3 text-xs font-semibold ${activeDiagTab === 'rca' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500'}`}>Root Cause Analysis (RCA)</button>
                  </div>

                  <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-4">
                    {activeDiagTab === 'overview' ? (
                      <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">Vibration (Axial)</span>
                            <strong className="text-base font-sans text-emerald-400">{activeAsset === 'PMP-101' ? '1.2 mm/s' : 'N/A'}</strong>
                          </div>
                          <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">Bearing Temp</span>
                            <strong className={`text-base font-sans ${activeAsset === 'PMP-101' ? 'text-orange-400' : 'text-emerald-400'}`}>
                              {activeAsset === 'PMP-101' ? '74.2 °C' : (activeAsset === 'VLV-204' ? '52.1 °C' : '585.0 °C')}
                            </strong>
                          </div>
                          <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">Flow / Load</span>
                            <strong className="text-base font-sans text-emerald-400">
                              {activeAsset === 'PMP-101' ? '185 m³/h' : (activeAsset === 'VLV-204' ? '112 m³/h' : '42.5 T/h')}
                            </strong>
                          </div>
                        </div>

                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                          <h4 className="text-xs font-semibold text-amber-500 flex items-center gap-1.5 mb-1.5"><AlertTriangle size={14} /> AI Recommendation:</h4>
                          <p className="text-xs text-slate-400">
                            {activeAsset === 'PMP-101' 
                              ? 'Bearing temperature triggers cavitation alert check standard. Recommend lubrication checks prior to next operating batch.'
                              : 'Stroke friction curves indicate pneumatic compression drops. Check supply valves and schedule alignment sweep.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        <div className="flex gap-4 items-center bg-slate-950/40 border border-slate-850 p-4 rounded-lg text-xs">
                          <label className="font-medium">Incident Case:</label>
                          <select 
                            value={selectedRCAIncident} 
                            onChange={(e) => setSelectedRCAIncident(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded p-1 text-inherit"
                          >
                            <option value="pmp-leak">PMP-101 Shaft Seal Leakage & High Temp</option>
                            <option value="vlv-stick">VLV-204 Sticking Risk & Pressure Drops</option>
                          </select>
                        </div>

                        {/* 5 whys */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI 5-Whys Chain Analysis</h4>
                          <div className="flex flex-col gap-2 pl-4 border-l border-slate-800">
                            {rca5Whys.map((why, idx) => (
                              <div key={idx} className="bg-slate-950/30 border border-slate-850/60 p-3 rounded-lg flex items-center gap-4 text-xs">
                                <span className="text-cyan-400 font-extrabold flex-shrink-0">Why {idx + 1}</span>
                                <span className="text-slate-400">{why}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* fishbone rendering */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Ishikawa (Fishbone) Matrix</h4>
                          <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg flex justify-center">
                            {/* Graphic SVG Fishbone */}
                            <svg className="w-full max-w-xl h-60 text-slate-400" viewBox="0 0 600 240">
                              <line x1="30" y1="120" x2="520" y2="120" stroke="#22d3ee" strokeWidth="2.5" />
                              <polygon points="520,113 540,120 520,127" fill="#22d3ee" />
                              
                              <rect x="540" y="95" width="50" height="50" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                              <text x="565" y="124" fill="#22d3ee" fontSize="10" textAnchor="middle">EFFECT</text>

                              {/* Ribs */}
                              <line x1="160" y1="40" x2="220" y2="120" stroke="#475569" strokeWidth="1.5" />
                              <text x="160" y="30" fill="#f8fafc" fontSize="9" textAnchor="middle">MANPOWER</text>

                              <line x1="340" y1="40" x2="400" y2="120" stroke="#475569" strokeWidth="1.5" />
                              <text x="340" y="30" fill="#f8fafc" fontSize="9" textAnchor="middle">MACHINE</text>

                              <line x1="160" y1="200" x2="220" y2="120" stroke="#475569" strokeWidth="1.5" />
                              <text x="160" y="215" fill="#f8fafc" fontSize="9" textAnchor="middle">METHOD</text>

                              <line x1="340" y1="200" x2="400" y2="120" stroke="#475569" strokeWidth="1.5" />
                              <text x="340" y="215" fill="#f8fafc" fontSize="9" textAnchor="middle">MATERIAL</text>
                            </svg>
                          </div>
                        </div>

                        {/* CAPAS */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Systemic Corrective Actions (CAPA)</h4>
                          <ul className="flex flex-col gap-2 text-xs">
                            {rcaCapas.map((capa, idx) => (
                              <li key={idx} className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-md flex gap-2 text-slate-400">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{capa}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. COMPLIANCE & QUALITY */}
          {activeTab === 'compliance' && (
            <section className="animate-fadeIn">
              <div className="flex justify-between items-start mb-6 border-b border-slate-800/50 pb-5">
                <div>
                  <h2 className="text-2xl font-bold font-sans">Quality & Regulatory Compliance Intelligence</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Map safety laws (Factory Act, OISD, PESO) against current machinery records and operating status.</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-5 h-[500px]">
                {/* Gaps List */}
                <div className="col-span-7 bg-[#131b2e]/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 overflow-y-auto">
                  <h3 className="font-semibold text-sm">Regulatory Gaps & Safety Warnings</h3>
                  
                  <div className="bg-slate-950/40 border-l-4 border-rose-500 border border-slate-900 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-[10px] mb-1">
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold">CRITICAL</span>
                      <span className="text-slate-500">OISD-189</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">Boiler safety relief valve testing cycle overdue by 12 days.</h4>
                    <p className="text-xs text-slate-400 mt-1">OISD-189 Clause 6.2 dictates safety valves must undergo full physical test checks annually. Last tested: June 11, 2025.</p>
                    <div className="flex justify-between items-center mt-3 text-[10px]">
                      <span className="text-slate-500">Impact: BLR-302</span>
                      <button onClick={() => { setEvAsset('BLR-302'); handleGenerateEvidence(); }} className="text-cyan-400 hover:underline">Draft Evidence Pack</button>
                    </div>
                  </div>

                  <div className="bg-slate-950/40 border-l-4 border-amber-500 border border-slate-900 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-[10px] mb-1">
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold">MEDIUM</span>
                      <span className="text-slate-500">PESO Rules</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">Missing flame arrester inspection cert on storage Tank T-104.</h4>
                    <p className="text-xs text-slate-400 mt-1">PESO guidelines specify all class-A zone tank hoods must keep structural test certificates updated in the refinery archives.</p>
                    <div className="flex justify-between items-center mt-3 text-[10px]">
                      <span className="text-slate-500">Impact: Tank T-104</span>
                      <button onClick={() => { setEvAsset('T-104'); handleGenerateEvidence(); }} className="text-cyan-400 hover:underline">Resolve Gaps</button>
                    </div>
                  </div>

                </div>

                {/* Evidence Pack generator */}
                <div className="col-span-5 bg-[#131b2e]/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                  <h3 className="font-semibold text-sm">Audit Evidence package Generator</h3>
                  <p className="text-xs text-slate-400">Instantly aggregate mechanical drawings, calibrations, and safety permits into a verified audit compliance ZIP folder.</p>
                  
                  <div className="flex flex-col gap-4 text-xs mt-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold">Target Asset:</label>
                      <select value={evAsset} onChange={(e) => setEvAsset(e.target.value)} className="bg-slate-900 border border-slate-800 rounded p-2.5 text-inherit">
                        <option value="PMP-101">Feed Pump PMP-101</option>
                        <option value="BLR-302">Boiler BLR-302</option>
                        <option value="VLV-204">Control Valve VLV-204</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold">Regulatory Framework:</label>
                      <select value={evReg} onChange={(e) => setEvReg(e.target.value)} className="bg-slate-900 border border-slate-800 rounded p-2.5 text-inherit">
                        <option value="OISD">OISD (Oil Industry Safety Directorate)</option>
                        <option value="PESO">PESO (Petroleum Explosives)</option>
                        <option value="Factory">Indian Factory Act 1948</option>
                      </select>
                    </div>

                    <button 
                      onClick={handleGenerateEvidence}
                      className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-colors"
                    >
                      <Package size={16} /> Compile Evidence Package
                    </button>

                    {isCompilingEvidence && (
                      <div className="text-center italic text-xs text-slate-500">Mapping databases and verifying files SHA-256 hashes...</div>
                    )}

                    {showEvidenceResult && (
                      <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg flex flex-col gap-3 text-xs">
                        <div className="flex gap-2 items-start">
                          <CheckCircle className="text-emerald-400 flex-shrink-0" size={16} />
                          <div>
                            <h4 className="font-bold text-emerald-400">Package Compiled!</h4>
                            <p className="text-[10px] text-slate-500">Manifest contains {evidenceManifest.length} verified files.</p>
                          </div>
                        </div>
                        <ul className="flex flex-col gap-1 text-[10px] text-slate-400">
                          {evidenceManifest.map((m, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-slate-900 border border-slate-850 p-1.5 rounded">
                              <span>{m.name}</span>
                              <span className="text-[9px] text-slate-500">{m.hash}</span>
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => alert('ZIP download triggered!')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors">
                          <Download size={14} /> Download Evidence ZIP
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 6. FAILURE INTELLIGENCE VIEW */}
          {activeTab === 'lessons' && (
            <section className="animate-fadeIn">
              <div className="flex justify-between items-start mb-6 border-b border-slate-800/50 pb-5">
                <div>
                  <h2 className="text-2xl font-bold font-sans">Lessons Learned & Failure Intelligence Engine</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Correlate mechanical defects with fluid variables, assembly teams, and operating standards to identify silent patterns.</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-5 h-[500px]">
                {/* Heatmap correlation grid */}
                <div className="col-span-7 bg-[#131b2e]/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                  <h3 className="font-semibold text-sm">Failure Mode Correlation Matrix</h3>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs mt-4">
                    <div className="text-left font-bold text-slate-500 uppercase text-[9px] py-2">Component</div>
                    <div className="font-bold text-slate-500 uppercase text-[9px] py-2">Vibration</div>
                    <div className="font-bold text-slate-500 uppercase text-[9px] py-2">Heat Delta</div>
                    <div className="font-bold text-slate-500 uppercase text-[9px] py-2">Impeller Wear</div>
                    <div className="font-bold text-slate-500 uppercase text-[9px] py-2">Seal Leak</div>

                    <div className="text-left font-semibold py-3 border-b border-slate-850">Shaft / Bearings</div>
                    <div className="bg-rose-500 text-white font-bold py-3 rounded border border-rose-600 flex items-center justify-center">92%</div>
                    <div className="bg-amber-500 text-white font-bold py-3 rounded border border-amber-600 flex items-center justify-center">65%</div>
                    <div className="bg-slate-950 border border-slate-850 text-slate-500 py-3 rounded flex items-center justify-center">12%</div>
                    <div className="bg-rose-500 text-white font-bold py-3 rounded border border-rose-600 flex items-center justify-center">88%</div>

                    <div className="text-left font-semibold py-3 border-b border-slate-850">Actuators</div>
                    <div className="bg-amber-500 text-white font-bold py-3 rounded border border-amber-600 flex items-center justify-center">45%</div>
                    <div className="bg-rose-500 text-white font-bold py-3 rounded border border-rose-600 flex items-center justify-center">82%</div>
                    <div className="bg-slate-950 border border-slate-850 text-slate-500 py-3 rounded flex items-center justify-center">8%</div>
                    <div className="bg-slate-950 border border-slate-850 text-slate-500 py-3 rounded flex items-center justify-center">15%</div>

                    <div className="text-left font-semibold py-3 border-b border-slate-850">Boiler Tubes</div>
                    <div className="bg-slate-950 border border-slate-850 text-slate-500 py-3 rounded flex items-center justify-center">10%</div>
                    <div className="bg-rose-500 text-white font-bold py-3 rounded border border-rose-600 flex items-center justify-center">90%</div>
                    <div className="bg-amber-500 text-white font-bold py-3 rounded border border-amber-600 flex items-center justify-center">58%</div>
                    <div className="bg-slate-950 border border-slate-850 text-slate-500 py-3 rounded flex items-center justify-center">4%</div>
                  </div>
                </div>

                {/* Push Bulletins */}
                <div className="col-span-5 bg-[#131b2e]/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
                  <h3 className="font-semibold text-sm">Systemic Knowledge Push Bulletins</h3>
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-lg text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold text-[9px]">SYSTEMIC RISK</span>
                        <span className="text-slate-500 text-[10px]">Today</span>
                      </div>
                      <h4 className="font-bold text-slate-200">Cavitation Pattern in Centrifugal Pumps</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">AI matched 3 pump cases where intake pressure drops under high-viscosity products worn down impellers 6 months ahead of schedule. Impeller load threshold reached on PMP-101.</p>
                      <div className="mt-3 p-2 bg-cyan-500/5 border border-dashed border-cyan-400/20 text-cyan-400 rounded">
                        Action: Monitor suction line pressure logs daily.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 7. PRESENTATION SLIDES & ARCHITECTURE VIEW */}
          {activeTab === 'presentation' && (
            <section className="animate-fadeIn">
              <div className="flex justify-between items-start mb-6 border-b border-slate-800/50 pb-5">
                <div>
                  <h2 className="text-2xl font-bold font-sans">Project Pitch Deck & System Architecture</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Explore the business case slides and the full vector pipeline powering the Unified Brain.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-2 border-b border-slate-850 pb-2">
                  <button onClick={() => setActivePitchTab('slides')} className={`px-4 py-2 text-xs font-semibold rounded ${activePitchTab === 'slides' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}>Pitch Presentation</button>
                  <button onClick={() => setActivePitchTab('architecture')} className={`px-4 py-2 text-xs font-semibold rounded ${activePitchTab === 'architecture' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}>System Architecture</button>
                </div>

                {activePitchTab === 'slides' ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 flex flex-col justify-between h-[360px] relative">
                    
                    {activeSlide === 1 && (
                      <div className="flex flex-col justify-center items-center text-center h-full gap-4">
                        <span className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">McKinsey Theme: Industrial Intelligence</span>
                        <h2 className="text-3xl font-extrabold font-sans text-slate-100">IndusBrain AI</h2>
                        <h3 className="text-lg text-slate-400 font-sans mt-[-8px]">Unified Asset & Operations Brain</h3>
                        <p className="text-sm text-slate-500 max-w-xl">Eliminating knowledge fragmentation, retiring personnel cliffs, and unplanned plant downtime using unified document semantic linkers.</p>
                      </div>
                    )}

                    {activeSlide === 2 && (
                      <div className="flex flex-col h-full justify-center">
                        <h3 className="text-lg font-bold mb-4 font-sans text-cyan-400">The 35% Silo Waste Problem</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed text-slate-400">
                          <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850">
                            <span className="text-xl font-bold font-sans text-cyan-400 block mb-1">35% Time Lost</span>
                            Plant engineers spend over a third of shifts checking legacy manuals, drawings, and logs across disconnected tools.
                          </div>
                          <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850">
                            <span className="text-xl font-bold font-sans text-amber-500 block mb-1">18-22% Downtime</span>
                            Caused directly by crew executing repairs without local asset configuration, history, or OEM limits context.
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSlide === 3 && (
                      <div className="flex flex-col h-full justify-center">
                        <h3 className="text-lg font-bold mb-4 font-sans text-cyan-400">The Solution: IndusBrain AI</h3>
                        <div className="grid grid-cols-4 gap-4 text-center text-xs">
                          {[
                            { title: 'Graph Ingestion', text: 'OCR segments drawings and maps tags.', icon: Network, color: 'text-cyan-400' },
                            { title: 'Expert RAG', text: 'Field copilot answers queries with citations.', icon: MessageSquare, color: 'text-indigo-400' },
                            { title: 'RCA & CAPA', text: 'Instantly draws Fishbone and 5-Whys.', icon: Wrench, color: 'text-amber-500' },
                            { title: 'Sentinel compliance', text: 'Flags gaps in OISD, PESO, Factory Act.', icon: ShieldCheck, color: 'text-emerald-400' }
                          ].map((feat, fIdx) => {
                            const Icon = feat.icon;
                            return (
                              <div key={fIdx} className="bg-slate-950/40 p-4 rounded-lg border border-slate-850">
                                <Icon className={`mx-auto mb-2.5 ${feat.color}`} size={24} />
                                <h4 className="font-bold mb-1.5">{feat.title}</h4>
                                <p className="text-[10px] text-slate-500">{feat.text}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-slate-800/80 pt-4 mt-4 text-xs text-slate-500">
                      <button 
                        onClick={() => activeSlide > 1 && setActiveSlide(activeSlide - 1)} 
                        className="px-3 py-1 bg-slate-950 border border-slate-850 rounded hover:text-white disabled:opacity-50 disabled:hover:text-slate-500"
                        disabled={activeSlide === 1}
                      >
                        <ArrowLeft size={14} className="inline mr-1" /> Prev
                      </button>
                      <span>Slide {activeSlide} of 3</span>
                      <button 
                        onClick={() => activeSlide < 3 && setActiveSlide(activeSlide + 1)} 
                        className="px-3 py-1 bg-slate-950 border border-slate-850 rounded hover:text-white disabled:opacity-50 disabled:hover:text-slate-500"
                        disabled={activeSlide === 3}
                      >
                        Next <ArrowRight size={14} className="inline ml-1" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 flex flex-col items-center h-[360px] overflow-hidden">
                    <h3 className="font-semibold text-sm mb-3">Enterprise Data Pipeline flow</h3>
                    <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-lg w-full flex items-center justify-center flex-grow">
                      {/* Embedded vector SVG system schema */}
                      <svg className="w-full max-w-lg h-56 text-slate-500" viewBox="0 0 500 200">
                        <rect x="10" y="70" width="90" height="60" rx="6" fill="#1e293b" stroke="#334155" />
                        <text x="55" y="105" fill="#f8fafc" fontSize="9" textAnchor="middle">Ingest PDFs</text>
                        
                        <line x1="100" y1="100" x2="140" y2="100" stroke="#00f2fe" strokeWidth="1.5" />
                        
                        <rect x="140" y="70" width="90" height="60" rx="6" fill="#1e293b" stroke="#00f2fe" />
                        <text x="185" y="100" fill="#f8fafc" fontSize="9" textAnchor="middle">OCR Service</text>
                        <text x="185" y="112" fill="#64748b" fontSize="7" textAnchor="middle">(Tesseract)</text>

                        <line x1="230" y1="100" x2="270" y2="100" stroke="#00f2fe" strokeWidth="1.5" />

                        <rect x="270" y="70" width="90" height="60" rx="6" fill="#1e293b" stroke="#818cf8" />
                        <text x="315" y="100" fill="#f8fafc" fontSize="9" textAnchor="middle">LangChain RAG</text>
                        <text x="315" y="112" fill="#64748b" fontSize="7" textAnchor="middle">(ChromaDB/Neo4j)</text>

                        <line x1="360" y1="100" x2="400" y2="100" stroke="#00f2fe" strokeWidth="1.5" />

                        <rect x="400" y="70" width="90" height="60" rx="6" fill="#1e293b" stroke="#10b981" />
                        <text x="445" y="100" fill="#f8fafc" fontSize="9" textAnchor="middle">UI Dashboard</text>
                        <text x="445" y="112" fill="#64748b" fontSize="7" textAnchor="middle">(Next.js 15)</text>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
