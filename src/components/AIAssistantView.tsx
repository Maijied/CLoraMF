import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Terminal, 
  GitBranch, 
  Heart, 
  Cpu, 
  Bell, 
  Globe, 
  Check, 
  RotateCcw,
  User,
  ShieldAlert
} from 'lucide-react';
import type { ChatMessage, WatchStatus, AIActionPayload } from '../types';

interface AIAssistantViewProps {
  watchStatus: WatchStatus;
  onDispatchAction?: (action: AIActionPayload) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  watchStatus,
  onDispatchAction
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: "CMF AI Assistant online. I am synchronized with your CMF Watch 3 Pro telemetry, Git protocols, and SDK runtime. How can I assist your workflow today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { type: 'health_alert', title: 'Biometric Status', message: `Heart rate is nominal at ${watchStatus.heartRateCurrent} BPM with ${watchStatus.stepsCurrent} steps recorded.` },
        { type: 'git', title: 'Git Status', command: 'git status -s' }
      ]
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            watchStatus,
            firmware: watchStatus.firmwareVersion,
            battery: watchStatus.battery,
            heartRate: watchStatus.heartRateCurrent,
            steps: watchStatus.stepsCurrent
          }
        })
      });

      const data = await response.json();

      let actions: AIActionPayload[] = [];
      const lower = prompt.toLowerCase();
      if (lower.includes('git') || lower.includes('commit') || lower.includes('repo')) {
        actions.push({ type: 'git', title: 'Execute Git Action', command: 'git add . && git commit -m "update watch protocols"' });
      }
      if (lower.includes('heart') || lower.includes('health') || lower.includes('pulse')) {
        actions.push({ type: 'health_alert', title: 'PPG Diagnostic', message: `Current HR: ${watchStatus.heartRateCurrent} BPM (Resting Zone)` });
      }
      if (lower.includes('notify') || lower.includes('push') || lower.includes('alert')) {
        actions.push({ type: 'notification', title: 'Push to Watch', message: prompt });
      }

      const assistantMessage: ChatMessage = {
        id: `msg_asst_${Date.now()}`,
        role: 'assistant',
        content: data.text || "I've analyzed your telemetry and updated the synchronization pipeline.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: actions.length > 0 ? actions : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `Error communicating with AI Core: ${error.message || 'Server connection error'}. Please verify your Gemini API key in settings.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Analyze today's biometric recovery & HRV",
    "Check OTA firmware release notes for v1.5.0",
    "Push test alert to watch screen",
    "Run Git status on watchface repo"
  ];

  return (
    <div className="flex flex-col h-[700px] bg-neutral-900 border-2 border-neutral-800 font-mono">
      {/* Terminal Header */}
      <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#FF5C00]" />
          <span className="font-bold text-sm text-white uppercase tracking-wider">
            CMF AI Intelligence Console (Gemini 3.8 Flash)
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
          <span>•</span>
          <span>LATENCY: 42ms</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role !== 'user' && (
              <div className="w-8 h-8 rounded-none bg-neutral-950 border border-neutral-700 flex items-center justify-center shrink-0 text-[#FF5C00]">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3.5 max-w-[82%] space-y-2.5 ${
                msg.role === 'user'
                  ? 'bg-[#FF5C00] text-black font-semibold'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-200'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] opacity-70 mb-1">
                <span className="font-bold uppercase">{msg.role === 'user' ? 'You' : 'CMF AI Core'}</span>
                <span>{msg.timestamp}</span>
              </div>

              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* Action Buttons if returned */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                  <span className="text-[9px] text-[#FF5C00] uppercase font-bold tracking-wider block">
                    Action Dispatch Hooks:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {msg.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => onDispatchAction?.(act)}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-[10px] font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {act.type === 'git' && <GitBranch className="w-3 h-3 text-[#FF5C00]" />}
                        {act.type === 'health_alert' && <Heart className="w-3 h-3 text-red-500" />}
                        {act.type === 'notification' && <Bell className="w-3 h-3 text-amber-400" />}
                        <span>{act.title || act.command || 'Execute'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-none bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 text-white">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-8 h-8 bg-neutral-950 border border-neutral-700 flex items-center justify-center shrink-0 text-[#FF5C00]">
              <RotateCcw className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 text-neutral-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FF5C00] animate-ping rounded-full" />
              <span>Querying Gemini 3.8 Flash Neural Pipeline...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-neutral-950/60 border-t border-neutral-800 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-neutral-500 text-[10px] uppercase font-bold shrink-0">Quick Prompts:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-[10px] whitespace-nowrap cursor-pointer transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-neutral-950 border-t border-neutral-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Type command or query for CMF Watch AI..."
            className="flex-1 bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF5C00]"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="px-5 py-2.5 bg-[#FF5C00] hover:bg-white text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
