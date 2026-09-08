import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Battery, 
  Bluetooth, 
  BluetoothOff, 
  GitBranch, 
  MessageSquare, 
  Search, 
  Settings, 
  Zap, 
  Clock,
  Send,
  Loader2,
  Terminal,
  Cpu,
  Heart,
  Footprints
} from 'lucide-react';
import type { HealthMetric, WatchStatus, ChatMessage, GitRepo } from './types';

const CMF_ORANGE = '#FF5C00';
const CMF_BLACK = '#000000';
const CMF_WHITE = '#FFFFFF';
const CMF_GRAY = '#F2F2F2';

export default function App() {
  const [status, setStatus] = useState<WatchStatus>({
    connected: false,
    battery: 84,
    lastSync: 'Just now'
  });

  const [metrics, setMetrics] = useState<HealthMetric[]>([
    { label: 'Heart Rate', value: 72, unit: 'BPM', icon: 'Heart', trend: 'stable', color: '#FF3B30' },
    { label: 'Steps', value: '8,432', unit: 'steps', icon: 'Footprints', trend: 'up', color: '#34C759' },
    { label: 'Battery', value: 84, unit: '%', icon: 'Battery', trend: 'down', color: CMF_ORANGE },
    { label: 'Sleep', value: '7h 20m', unit: '', icon: 'Clock', trend: 'stable', color: '#5856D6' }
  ]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'health' | 'ai' | 'git'>('health');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, newMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput })
      });
      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.text || "I'm having trouble connecting to the watch protocols right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-black p-4 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center rounded-none">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase leading-none">CMF AI PLATFORM</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Status: {status.connected ? 'Synchronized' : 'Standalone'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setStatus(s => ({ ...s, connected: !s.connected }))}
            className={`flex items-center gap-2 px-3 py-1.5 border-2 transition-all ${status.connected ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}
          >
            {status.connected ? <Bluetooth className="w-4 h-4" /> : <BluetoothOff className="w-4 h-4" />}
            <span className="text-xs font-bold uppercase">{status.connected ? 'Connected' : 'Connect'}</span>
          </button>
          <Settings className="w-6 h-6 cursor-pointer hover:rotate-90 transition-transform duration-500" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar (Desktop) */}
        <nav className="hidden lg:flex flex-col gap-2 lg:col-span-1">
          {[
            { id: 'health', icon: Activity, label: 'Vital' },
            { id: 'ai', icon: MessageSquare, label: 'Core' },
            { id: 'git', icon: GitBranch, label: 'Hub' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`p-3 flex flex-col items-center gap-1 border-2 transition-all ${activeTab === item.id ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-300 hover:text-black'}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'health' && (
              <motion.div 
                key="health"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Biometrics</h2>
                  <div className="flex items-center gap-2 text-xs bg-gray-100 px-2 py-1">
                    <Clock className="w-3 h-3" />
                    <span>Real-time Feed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metrics.map((metric, idx) => (
                    <div key={idx} className="p-6 border-2 border-black hover:bg-black group transition-colors duration-300 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 border border-black group-hover:border-white transition-colors`}>
                          {metric.label === 'Heart Rate' && <Heart className="w-5 h-5 text-red-500" />}
                          {metric.label === 'Steps' && <Footprints className="w-5 h-5 text-green-500" />}
                          {metric.label === 'Battery' && <Battery className="w-5 h-5 text-orange-500" />}
                          {metric.label === 'Sleep' && <Clock className="w-5 h-5 text-purple-500" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-gray-600 tracking-widest">{metric.label}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tighter group-hover:text-white transition-colors">{metric.value}</span>
                        <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 uppercase">{metric.unit}</span>
                      </div>
                      {/* Decorative Dot Matrix Pattern */}
                      <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-30 transition-opacity">
                         <div className="grid grid-cols-4 gap-1">
                           {[...Array(16)].map((_, i) => <div key={i} className="w-1 h-1 bg-black group-hover:bg-white rounded-full"></div>)}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 border-2 border-black bg-black text-white relative overflow-hidden">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-4 italic flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                    Activity Optimization
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-lg mb-6">
                    Current heart rate variance suggests optimal cognitive load. 
                    Recommended: 15min deep work session before next hydration cycle.
                  </p>
                  <button className="px-6 py-2 bg-orange-500 text-black font-bold uppercase text-xs hover:bg-white transition-colors">
                    Start Session
                  </button>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 border-4 border-white/5 rounded-full" />
                </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div 
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[600px] border-2 border-black flex flex-col bg-gray-50"
              >
                <div className="p-4 border-b-2 border-black bg-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-black uppercase tracking-widest">AI Command Interface</span>
                </div>
                
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                  {chatHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                        <MessageSquare className="text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">Awaiting initialization...</p>
                      <p className="text-xs text-gray-400 mt-2">Ask about your health metrics or system status.</p>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 ${msg.role === 'user' ? 'bg-black text-white border-none' : 'bg-white border-2 border-black text-black'}`}>
                        <div className="flex justify-between items-center mb-2 gap-4">
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-50">{msg.role === 'user' ? 'USER' : 'CMF_AI'}</span>
                          <span className="text-[8px] font-black opacity-30">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border-2 border-black p-4 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest animate-pulse">Processing...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white border-t-2 border-black">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="ENTER COMMAND..."
                      className="flex-1 bg-gray-100 border-2 border-transparent focus:border-black outline-none px-4 py-2 text-xs uppercase font-bold placeholder:text-gray-400"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!userInput.trim() || isTyping}
                      className="p-3 bg-black text-white hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:hover:bg-black"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'git' && (
              <motion.div 
                key="git"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Code Hub</h2>
                  <button className="flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-bold uppercase">
                    <Search className="w-3 h-3" />
                    Inspect
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'cmf-watch-protocols', branch: 'main', status: 'clean', lastCommit: '2h ago' },
                    { name: 'biometric-ai-engine', branch: 'develop', status: 'modified', lastCommit: '14m ago' },
                    { name: 'watch-ui-toolkit', branch: 'feature/matrix', status: 'syncing', lastCommit: 'Just now' }
                  ].map((repo, idx) => (
                    <div key={idx} className="p-4 border-2 border-black flex items-center justify-between hover:bg-orange-50 group transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-2 border border-black bg-white">
                          <GitBranch className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold uppercase tracking-tight">{repo.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">/{repo.branch}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 uppercase ${repo.status === 'clean' ? 'bg-green-100 text-green-700' : repo.status === 'modified' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700 animate-pulse'}`}>
                              {repo.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{repo.lastCommit}</span>
                        <button className="text-[10px] font-black uppercase text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">View Diff</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-100 border-2 border-black border-dashed flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white transition-colors">
                    <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold">+</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Connect Repo</span>
                  </div>
                  <div className="p-6 bg-black text-white flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-500 transition-colors group">
                    <div className="w-12 h-12 border-2 border-white flex items-center justify-center mb-3 group-hover:border-black">
                      <Zap className="w-6 h-6 fill-white group-hover:fill-black group-hover:text-black" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Auto Sync</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Column (Desktop) */}
        <aside className="lg:col-span-4 space-y-8">
           <section className="p-6 border-2 border-black bg-white">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Device Specifications</h4>
              <div className="space-y-4">
                {[
                  { label: 'Model', value: 'Watch 3 Pro' },
                  { label: 'Firmware', value: 'v1.4.2-AI' },
                  { label: 'Storage', value: '4.2GB / 8GB' },
                  { label: 'Uptime', value: '142h 12m' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold uppercase text-gray-500">{item.label}</span>
                    <span className="text-xs font-black">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center">
                 <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <div key={i} className={`w-2 h-2 ${i < 4 ? 'bg-black' : 'bg-gray-200'}`}></div>)}
                 </div>
                 <span className="text-[8px] font-black text-gray-400 uppercase">System Integrity: 92%</span>
              </div>
           </section>

           <section className="p-6 border-2 border-black bg-orange-500 text-black">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">Active Notifications</h4>
              <div className="space-y-3">
                 <div className="p-3 bg-white border border-black text-[10px] leading-tight">
                    <span className="font-bold block mb-1">STREAK ALERT</span>
                    You've hit your step goal for 4 consecutive days.
                 </div>
                 <div className="p-3 bg-white border border-black text-[10px] leading-tight opacity-60">
                    <span className="font-bold block mb-1">SYNC COMPLETE</span>
                    Git repository "cmf-watch-protocols" updated.
                 </div>
              </div>
           </section>

           <section className="relative h-40 border-2 border-black bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-repeat flex flex-col items-center justify-center p-6 text-center">
              <div className="absolute top-2 left-2 flex gap-1">
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                 <span className="text-[8px] font-black opacity-40 uppercase">Live Telemetry</span>
              </div>
              <div className="w-full h-12 flex items-end justify-center gap-0.5">
                 {[...Array(20)].map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                     transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                     className="w-1 bg-black"
                   />
                 ))}
              </div>
              <span className="mt-4 text-[10px] font-black uppercase tracking-tighter italic">Processing Vital Streams</span>
           </section>
        </aside>
      </main>

      {/* Footer / Mobile Nav */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 border-t-2 border-black bg-white p-2 z-50 flex justify-around items-center">
        {[
          { id: 'health', icon: Activity },
          { id: 'ai', icon: MessageSquare },
          { id: 'git', icon: GitBranch }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`p-3 border-2 transition-all ${activeTab === item.id ? 'border-orange-500 bg-orange-500 text-black' : 'border-transparent text-gray-400'}`}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </footer>
    </div>
  );
}
