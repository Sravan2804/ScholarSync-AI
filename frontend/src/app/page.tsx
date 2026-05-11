"use client";

import { useState, useEffect } from "react";
import { 
  Search, Loader2, BookOpen, AlertCircle, ExternalLink, 
  GraduationCap, CheckCircle2, Globe, ShieldCheck, 
  FileText, Cpu, Layers, Database, Command, ArrowRight, Sparkles, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AGENT_STEPS = [
  { id: "planner", name: "Strategic Planner", icon: <Cpu className="w-6 h-6" />, desc: "Decomposes objective into core pillars" },
  { id: "scout", name: "Data Scout", icon: <Globe className="w-6 h-6" />, desc: "Retrieves literature from academic nodes" },
  { id: "validator", name: "Authority Validator", icon: <ShieldCheck className="w-6 h-6" />, desc: "Verifies peer-reviewed credibility" },
  { id: "synthesizer", name: "Blueprint Synthesizer", icon: <Layers className="w-6 h-6" />, desc: "Compiles intelligence into final report" },
];

export default function Home() {
  const [assignment, setAssignment] = useState("");
  const [contradictionToggle, setContradictionToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && currentStep < AGENT_STEPS.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => Math.min(prev + 1, AGENT_STEPS.length - 1));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading, currentStep]);

  const handleAnalyze = async () => {
    if (!assignment.trim()) return;
    setLoading(true);
    setCurrentStep(0);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_statement: assignment,
          contradiction_toggle: contradictionToggle
        })
      });

      if (!response.ok) throw new Error("Connection to research swarm failed. Please try again.");
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during synthesis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-sky-500/30 selection:text-white relative overflow-x-hidden">
      
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-600/20 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/15 blur-[150px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-violet-600/15 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <Command className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                ScholarSync <span className="text-sky-400 font-medium ml-1">AI</span>
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Methodology</a>
            <a href="#" className="hover:text-white transition-colors">Archive</a>
            <a href="https://github.com/Sravan2804/ScholarSync-AI" target="_blank" className="px-5 py-2 border border-white/10 rounded-full hover:bg-white/10 text-white transition-all">
              View Source
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        
        {/* State: Initial Input */}
        {!result && (
          <div className="max-w-5xl mx-auto space-y-16">
            
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-bold tracking-widest text-sky-400 uppercase">
                <Sparkles className="w-4 h-4" /> Multi-Agent Intelligence
              </div>
              <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                Accelerate your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">academic discovery.</span>
              </h2>
              <p className="text-slate-400 text-xl font-light leading-relaxed max-w-2xl mx-auto">
                Define your research objective and let our autonomous swarm scout, validate, and synthesize the literature into a professional blueprint.
              </p>
            </div>

            {/* Input Console */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-sky-400">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">Research Objective</span>
                </div>
                
                <textarea
                  value={assignment}
                  onChange={(e) => setAssignment(e.target.value)}
                  placeholder="e.g., Examine the socio-economic impacts of generic AI on productivity..."
                  className="w-full h-32 bg-transparent border-none text-white placeholder:text-slate-600 focus:outline-none resize-none text-2xl lg:text-3xl font-medium leading-tight"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
                  
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={contradictionToggle} onChange={(e) => setContradictionToggle(e.target.checked)} />
                      <div className={`block w-12 h-6 rounded-full transition-all duration-300 ${contradictionToggle ? 'bg-sky-500' : 'bg-slate-800'}`} />
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${contradictionToggle ? 'translate-x-6' : ''}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold transition-colors ${contradictionToggle ? 'text-white' : 'text-slate-400'}`}>
                        Enable Contradiction Analysis
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Actively seek dissenting peer opinions</span>
                    </div>
                  </label>

                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !assignment.trim()}
                    className="w-full sm:w-auto bg-white text-slate-950 px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sky-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    {loading ? "ORCHESTRATING SWARM..." : "GENERATE BLUEPRINT"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Horizontal Agent Pipeline (Visible during loading) */}
            <AnimatePresence>
              {loading && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-8"
                >
                  <div className="flex items-center gap-3 mb-8 justify-center">
                    <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Cluster Pipeline</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {AGENT_STEPS.map((step, idx) => {
                      const isActive = idx === currentStep;
                      const isCompleted = idx < currentStep;
                      
                      return (
                        <div 
                          key={step.id} 
                          className={`relative p-6 rounded-2xl border transition-all duration-500 flex flex-col items-center text-center gap-4
                            ${isActive ? 'bg-sky-500/10 border-sky-500/50 shadow-[0_0_30px_rgba(56,189,248,0.2)] scale-105' : 
                              isCompleted ? 'bg-slate-900/50 border-white/10' : 
                              'bg-slate-900/20 border-white/5 opacity-50'}`}
                        >
                          <div className={`p-4 rounded-full transition-colors duration-500
                            ${isActive ? 'bg-sky-500 text-white shadow-lg' : 
                              isCompleted ? 'bg-slate-800 text-white' : 
                              'bg-slate-950 text-slate-600'}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : step.icon}
                          </div>
                          <div>
                            <p className={`font-bold text-lg mb-2 ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>
                              {step.name}
                            </p>
                            <p className={`text-sm ${isActive ? 'text-sky-200' : 'text-slate-500'}`}>
                              {step.desc}
                            </p>
                          </div>
                          
                          {/* Pulsing indicator for active step */}
                          {isActive && (
                            <div className="absolute inset-0 border-2 border-sky-400 rounded-2xl animate-ping opacity-20 pointer-events-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error State */}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 flex gap-4 items-start shadow-xl">
                <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest mb-2 text-red-300">System Interrupt</p>
                  <p className="text-base leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* State: Results Dashboard */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            >
              {/* Left Column: Source Nodes & Mapping */}
              <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
                
                {/* Verified Sources */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-28">
                  <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest">Data Nodes</h3>
                    </div>
                    <span className="text-xs font-bold bg-white/10 text-white px-3 py-1 rounded-full">{result.links.length}</span>
                  </div>
                  
                  <div className="space-y-8 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                    {result.links.map((link: any, idx: number) => (
                      <motion.div key={link.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="group">
                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-transparent hover:bg-white/[0.06] hover:border-white/10 transition-all">
                          <h4 className="text-lg font-bold text-white leading-snug mb-4 font-josefin tracking-tight">
                            {link.title}
                          </h4>
                          <p className="text-[15px] text-slate-400 font-light line-clamp-4 mb-6 leading-relaxed">
                            "{link.snippet}"
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{link.domain}</span>
                            </div>
                            <a href={link.url} target="_blank" className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-sky-500/10 px-3 py-1.5 rounded-full">
                              Source <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Research Blueprint */}
              <div className="lg:col-span-8 order-1 lg:order-2">
                <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-14 shadow-2xl">
                  
                  {/* Blueprint Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">Research Blueprint</h2>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Validated
                          </span>
                          <span className="text-xs text-slate-500 font-medium">ScholarSync Core v4.1</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { setResult(null); setAssignment(""); }} className="text-sm font-bold text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl border border-white/10 flex items-center gap-2">
                      <Search className="w-4 h-4" /> New Query
                    </button>
                  </div>
                  
                  {/* Formatted Markdown Content */}
                  <article className="prose prose-invert prose-lg max-w-none 
                    prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-light
                    prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight 
                    prose-strong:text-sky-300 prose-strong:font-bold
                    prose-a:text-sky-400 hover:prose-a:text-sky-300
                    prose-ul:text-slate-300 prose-li:marker:text-sky-500">
                    <div 
                      className="font-josefin tracking-wide"
                      dangerouslySetInnerHTML={{ 
                        __html: result.outline
                          .replace(/^\s*# (.*$)/gim, '<h1 class="text-4xl lg:text-5xl mb-2 text-white font-josefin tracking-tight">$1</h1>')
                          .replace(/^\s*## (.*$)/gim, '<h2 class="text-3xl mb-2 text-indigo-100 font-josefin">$1</h2>')
                          .replace(/^\s*### (.*$)/gim, '<h3 class="text-2xl mb-2 text-sky-200 font-sans font-semibold">$1</h3>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-sky-300 font-bold">$1</strong>')
                          .replace(/[=-]{3,}/g, '<hr class="border-white/10 my-2"/>')
                          .replace(/\n{2,}/g, '\n') 
                          .replace(/\n/g, '<br/>') 
                      }} 
                    />
                  </article>

                  {/* Cognitive Mapping (Appended at bottom of report) */}
                  {result.source_mapping && (
                    <div className="mt-20 pt-12 border-t border-white/10">
                      <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <Layers className="w-6 h-6 text-indigo-400" /> Source Mapping Matrix
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(result.source_mapping).map(([section, urls]: any, idx) => (
                          <div key={idx} className="bg-white/5 rounded-2xl p-6 border border-white/5">
                            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-4 line-clamp-1">{section}</h4>
                            <div className="space-y-3">
                              {urls.map((url: string, urlIdx: number) => (
                                <div key={urlIdx} className="flex items-start gap-3 text-xs text-slate-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1 shrink-0" />
                                  <a href={url} target="_blank" className="hover:text-white transition-colors font-mono break-all line-clamp-2">{url}</a>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-slate-500 hover:text-slate-300 transition-colors">
              <GraduationCap className="w-6 h-6" />
              <span className="text-sm font-bold tracking-widest uppercase">ScholarSync AI</span>
            </div>
            <p className="text-sm font-medium text-slate-600">
              &copy; 2026 Neutral Core Systems &bull; High-Performance Research Orchestration
            </p>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
}