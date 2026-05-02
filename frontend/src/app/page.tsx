"use client";

import { useState } from "react";
import { Search, Loader2, BookOpen, AlertCircle, ExternalLink, GraduationCap, LayoutPanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [assignment, setAssignment] = useState("");
  const [contradictionToggle, setContradictionToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!assignment.trim()) return;
    setLoading(true);
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

      if (!response.ok) {
        throw new Error("Failed to analyze assignment.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
      <header className="border-b border-neutral-800/60 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-xl font-medium tracking-tight text-neutral-100">
              Scholar<span className="text-indigo-400">Sync</span> AI
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
            <span>v2026.1 Edition</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8">
        {!result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto w-full flex flex-col gap-6"
          >
            <div className="space-y-3 text-center mb-8">
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-50">Orchestrate Your Research</h2>
              <p className="text-neutral-400 text-lg">Deploy a swarm of AI agents to decompose, search, and synthesize your academic assignments with verifiable sources.</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl shadow-black/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 space-y-6">
                <div>
                  <label htmlFor="assignment" className="block text-sm font-medium text-neutral-300 mb-2">Assignment Statement</label>
                  <textarea
                    id="assignment"
                    value={assignment}
                    onChange={(e) => setAssignment(e.target.value)}
                    placeholder="E.g., Analyze the impact of multi-agent LLM systems on modern software engineering workflows..."
                    className="w-full h-40 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer group/toggle">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={contradictionToggle}
                        onChange={(e) => setContradictionToggle(e.target.checked)}
                      />
                      <div className={`block w-12 h-6 rounded-full transition-colors ${contradictionToggle ? 'bg-indigo-500' : 'bg-neutral-800'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${contradictionToggle ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-200 group-hover/toggle:text-white transition-colors">Contradiction Mode</span>
                      <span className="text-xs text-neutral-500">Seek dissenting academic opinions for rigorous synthesis</span>
                    </div>
                  </label>

                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !assignment.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Deploying Agents...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Generate Blueprint</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-sm relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <LayoutPanelLeft className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
                    <h2 className="text-2xl font-semibold text-neutral-100 flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-indigo-400" />
                      Research Blueprint
                    </h2>
                    <button 
                      onClick={() => setResult(null)}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Start New Analysis
                    </button>
                  </div>
                  
                  <div className="prose prose-invert prose-indigo max-w-none text-neutral-300">
                    <div dangerouslySetInnerHTML={{ __html: result.outline.replace(/\n/g, '<br/>') }} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-neutral-200 mb-4 flex items-center justify-between">
                    <span>Verified Sources</span>
                    <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full border border-indigo-500/30">
                      {result.links.length} Retrieved
                    </span>
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {result.links.map((link: any, idx: number) => (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={link.id}
                        className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 transition-all group hover:shadow-lg hover:shadow-black/20"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h4 className="font-medium text-neutral-200 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                            {link.title}
                          </h4>
                          <div className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2 py-1 rounded-md font-mono whitespace-nowrap">
                            {link.score}% Auth
                          </div>
                        </div>
                        
                        <p className="text-sm text-neutral-400 mb-4 line-clamp-3">
                          "{link.snippet}"
                        </p>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
                          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                            <span className="w-2 h-2 rounded-full bg-neutral-600" />
                            {link.domain}
                          </div>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            View Source
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {result.source_mapping && (
                  <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-neutral-200 mb-4">Source Mapping</h3>
                    <div className="space-y-4">
                      {Object.entries(result.source_mapping).map(([section, urls]: any, idx) => (
                        <div key={idx} className="border-l-2 border-indigo-500/50 pl-4">
                          <h4 className="text-sm font-medium text-neutral-300 mb-2">{section}</h4>
                          <ul className="space-y-2">
                            {urls.map((url: string, urlIdx: number) => (
                              <li key={urlIdx} className="text-xs text-neutral-500 hover:text-indigo-400 transition-colors truncate">
                                <a href={url} target="_blank" rel="noreferrer">{url}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
