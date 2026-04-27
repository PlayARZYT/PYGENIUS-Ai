import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Code2, 
  Layers, 
  Play, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles,
  Search,
  BookOpen,
  Settings,
  Shield,
  ChevronRight
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import { generatePythonCode, type PythonCodeResponse } from './services/geminiService';
import { cn } from './lib/utils';

const LOADING_MESSAGES = [
  "Initializing neural pathways...",
  "Analyzing Python syntax patterns...",
  "Optimizing code architecture...",
  "Synthesizing documentation...",
  "Running static analysis...",
  "Finalizing architectural blueprint..."
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState<PythonCodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generatePythonCode(prompt);
      setResult(response);
      setHistory(prev => [prompt, ...prev.slice(0, 4)]);
      
      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.code) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen tech-grid selection:bg-tech-accent selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-tech-border bg-tech-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tech-accent/10 flex items-center justify-center border border-tech-accent/30 neon-glow">
              <Cpu className="w-6 h-6 text-tech-accent" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-white flex items-center gap-2">
                PYGENIUS <span className="text-tech-accent">AI</span>
              </h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Architectural Engine v3.1</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-xs font-mono text-gray-400 hover:text-tech-accent transition-colors">DOCUMENTATION</a>
            <a href="#" className="text-xs font-mono text-gray-400 hover:text-tech-accent transition-colors">API ACCESS</a>
            <div className="h-4 w-px bg-tech-border" />
            <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-accent/5 border border-tech-accent/20 text-tech-accent text-[10px] font-mono mb-6 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Next-Gen Python Synthesis
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-accent to-python-blue">Complex Logic</span> <br />
              with Pure Intent.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Describe your architectural vision. PyGenius AI synthesizes production-grade 
              Python code, optimized for performance and readability.
            </p>
          </motion.div>
        </section>

        {/* Input Area */}
        <section className="mb-16">
          <motion.div 
            className="glass-panel p-1 p-px bg-gradient-to-br from-tech-border to-tech-accent/20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="bg-tech-card rounded-[11px] p-6">
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create an asynchronous web scraper that extracts real-time stock data and saves it to a PostgreSQL database with error handling..."
                  className="w-full bg-transparent border-none focus:ring-0 text-xl text-white placeholder:text-gray-600 min-h-[160px] resize-none font-sans"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey) handleSubmit();
                  }}
                />
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-tech-border">
                  <div className="flex gap-2">
                    <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-gray-500 transition-colors">
                      <Layers className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-gray-500 transition-colors">
                      <Shield className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button
                    disabled={isLoading || !prompt.trim()}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold transition-all",
                      isLoading || !prompt.trim() 
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                        : "bg-tech-accent text-black hover:scale-105 active:scale-95 neon-glow"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        SYNTHESIZING...
                      </>
                    ) : (
                      <>
                        GENERATE ARCHITECTURE
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
          
          {/* Quick History */}
          <div className="mt-4 flex flex-wrap gap-2">
            {history.map((h, i) => (
              <button 
                key={i}
                onClick={() => setPrompt(h)}
                className="text-[10px] font-mono text-gray-500 hover:text-tech-accent border border-tech-border px-2 py-1 rounded hover:border-tech-accent/30 transition-all truncate max-w-[200px]"
              >
                {h}
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-24 h-24 mb-8">
                <motion.div 
                  className="absolute inset-0 border-2 border-tech-accent/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute inset-4 border-2 border-tech-accent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-tech-accent animate-pulse" />
                </div>
              </div>
              <p className="text-xl font-mono text-tech-accent animate-pulse tracking-tight">{loadingMsg}</p>
              <p className="text-xs text-gray-500 mt-2 uppercase tracking-[0.2em]">Processing architectural request</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Area */}
        <div ref={resultsRef}>
          <AnimatePresence>
            {result && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Code Block */}
                <div className="glass-panel overflow-hidden">
                  <div className="bg-tech-border/30 px-6 py-3 flex items-center justify-between border-b border-tech-border">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                      </div>
                      <div className="h-4 w-px bg-tech-border mx-2" />
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                        <Terminal className="w-3.5 h-3.5 text-python-blue" />
                        main.py
                      </div>
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-tech-accent" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'COPIED' : 'COPY CODE'}
                    </button>
                  </div>
                  <div className="p-0 max-h-[600px] overflow-auto custom-scrollbar">
                    <SyntaxHighlighter 
                      language="python" 
                      style={vscDarkPlus}
                      customStyle={{ 
                        margin: 0, 
                        padding: '24px', 
                        background: 'transparent',
                        fontSize: '14px',
                        fontFamily: '"JetBrains Mono", monospace'
                      }}
                    >
                      {result.code}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Explanation & Libraries */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
                      <BookOpen className="w-5 h-5 text-tech-accent" />
                      ARCHITECTURAL ANALYSIS
                    </div>
                    <div className="prose prose-invert max-w-none prose-p:text-gray-400 prose-headings:text-white prose-strong:text-tech-accent prose-code:text-tech-accent prose-code:bg-tech-accent/10 prose-code:px-1 prose-code:rounded">
                      <ReactMarkdown>{result.explanation}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
                      <Layers className="w-5 h-5 text-tech-accent" />
                      DEPENDENCIES
                    </div>
                    <div className="space-y-3">
                      {result.libraries.map((lib, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-tech-border group hover:border-tech-accent/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-tech-border flex items-center justify-center text-[10px] font-mono text-gray-400 group-hover:text-tech-accent">
                              {i + 1}
                            </div>
                            <span className="font-mono text-sm text-gray-300">{lib}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-tech-accent" />
                        </div>
                      ))}
                      {result.libraries.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No external libraries required.</p>
                      )}
                    </div>
                    
                    <div className="p-4 rounded-xl bg-tech-accent/5 border border-tech-accent/20">
                      <div className="flex items-center gap-2 text-tech-accent text-xs font-bold mb-2">
                        <Zap className="w-3.5 h-3.5" />
                        PRO TIP
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Use <code className="text-tech-accent">pip install -r requirements.txt</code> to 
                        quickly set up your environment with these dependencies.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm">SYNTHESIS ERROR</p>
                <p className="text-xs opacity-80">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-tech-border py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <Cpu className="w-5 h-5" />
            <span className="font-display font-bold text-sm tracking-tight">PYGENIUS AI</span>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">ENGINE STATUS</p>
              <div className="flex items-center gap-2 text-xs text-tech-accent">
                <div className="w-1.5 h-1.5 rounded-full bg-tech-accent animate-pulse" />
                OPERATIONAL
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">LATENCY</p>
              <p className="text-xs text-gray-400">142ms</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">UPTIME</p>
              <p className="text-xs text-gray-400">99.99%</p>
            </div>
          </div>
          
          <p className="text-[10px] font-mono text-gray-600">
            © 2026 PYGENIUS NEURAL SYSTEMS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
