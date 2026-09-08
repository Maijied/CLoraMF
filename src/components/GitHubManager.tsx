import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  RefreshCw, 
  Check, 
  FileCode2, 
  Plus, 
  FolderGit2, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Zap,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { GitRepo, GitCommitInfo } from '../types';
import { INITIAL_GIT_REPOS, INITIAL_COMMITS } from '../mockData';

interface GitHubManagerProps {
  autoSyncEnabled: boolean;
  onToggleAutoSync: (enabled: boolean) => void;
  onOpenCICD?: () => void;
}

export const GitHubManager: React.FC<GitHubManagerProps> = ({
  autoSyncEnabled,
  onToggleAutoSync,
  onOpenCICD
}) => {
  const [repos, setRepos] = useState<GitRepo[]>(INITIAL_GIT_REPOS);
  const [selectedRepoId, setSelectedRepoId] = useState<string>(INITIAL_GIT_REPOS[0].id);
  const [commits, setCommits] = useState<GitCommitInfo[]>(INITIAL_COMMITS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [secondsUntilNextSync, setSecondsUntilNextSync] = useState(15);

  const activeRepo = repos.find(r => r.id === selectedRepoId) || repos[0];

  // Auto-sync ticker
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const timer = setInterval(() => {
      setSecondsUntilNextSync((prev) => {
        if (prev <= 1) {
          // Perform automatic background sync
          handleAutoSyncTick();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoSyncEnabled, activeRepo.id]);

  const handleAutoSyncTick = () => {
    setRepos(prev => prev.map(r => r.id === activeRepo.id ? { ...r, status: 'clean', aheadCount: 0, behindCount: 0 } : r));
  };

  const handleManualSyncRepo = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setRepos(prev => prev.map(r => r.id === activeRepo.id ? { ...r, status: 'clean', aheadCount: 0, behindCount: 0 } : r));
      confetti({ particleCount: 40 });
    }, 1000);
  };

  const handleCommitChanges = () => {
    if (!commitMessage.trim()) return;

    const newCommit: GitCommitInfo = {
      hash: Math.random().toString(16).substring(2, 9),
      message: commitMessage.trim(),
      author: 'mdshuvo <mdshuvo40@gmail.com>',
      timestamp: Date.now()
    };

    setCommits(prev => [newCommit, ...prev]);
    setRepos(prev => prev.map(r => r.id === activeRepo.id ? {
      ...r,
      lastCommit: commitMessage.trim(),
      commitHash: newCommit.hash,
      status: 'clean',
      modifiedFiles: []
    } : r));

    setCommitMessage('');
    confetti({ particleCount: 50 });
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2 text-white">
            <GitBranch className="w-6 h-6 text-[#FF5C00]" />
            Git Code Hub & Version Control
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Repository Sync Pipeline & Watch Protocol Versioning
          </p>
        </div>

        {/* Auto Sync & CI/CD Quick Triggers */}
        <div className="flex items-center gap-3">
          {/* Auto-Sync Toggle */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-xs">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Auto-Sync</span>
            <button
              onClick={() => onToggleAutoSync(!autoSyncEnabled)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                autoSyncEnabled ? 'bg-[#FF5C00]' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoSyncEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            {autoSyncEnabled && (
              <span className="text-[9px] text-[#FF5C00] font-bold">
                {secondsUntilNextSync}s
              </span>
            )}
          </div>

          <button
            onClick={handleManualSyncRepo}
            disabled={isSyncing}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#FF5C00]' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Remote'}</span>
          </button>

          {onOpenCICD && (
            <button
              onClick={onOpenCICD}
              className="px-3.5 py-1.5 bg-[#FF5C00] hover:bg-white text-black text-xs font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>CI/CD</span>
            </button>
          )}
        </div>
      </div>

      {/* Auto-Sync Notice Banner if enabled */}
      {autoSyncEnabled && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold uppercase">Automated Continuous Sync Active</span>
            <span className="text-neutral-400">• Next biometric & git delta sync in {secondsUntilNextSync} seconds</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase">INTERVAL: 15s</span>
        </div>
      )}

      {/* Repo Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {repos.map((repo) => {
          const isSelected = repo.id === activeRepo.id;

          return (
            <div
              key={repo.id}
              onClick={() => setSelectedRepoId(repo.id)}
              className={`p-4 border-2 transition-all cursor-pointer ${
                isSelected 
                  ? 'border-[#FF5C00] bg-neutral-900' 
                  : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white truncate">{repo.name}</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                  repo.status === 'clean' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {repo.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
                <GitBranch className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span className="text-neutral-300">{repo.branch}</span>
                <span>•</span>
                <span className="text-neutral-500 font-mono">#{repo.commitHash}</span>
              </div>

              <p className="text-[11px] text-neutral-400 mt-2 line-clamp-1">
                "{repo.lastCommit}"
              </p>
            </div>
          );
        })}
      </div>

      {/* Repo Detail & Staging */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Changed Files & Commit Tool (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-neutral-900 border-2 border-neutral-800 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-[#FF5C00]" />
                Modified Files ({activeRepo.modifiedFiles.length})
              </span>
              <span className="text-[10px] text-neutral-500">STAGED FOR COMMIT</span>
            </div>

            {activeRepo.modifiedFiles.length > 0 ? (
              <div className="space-y-1.5">
                {activeRepo.modifiedFiles.map((file, i) => (
                  <div key={i} className="p-2 bg-neutral-950 border border-neutral-800 flex items-center justify-between text-neutral-300">
                    <span className="truncate">{file}</span>
                    <span className="text-amber-400 text-[10px] uppercase font-bold">MODIFIED</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-neutral-950 border border-neutral-800 text-center text-neutral-500 text-xs">
                Working directory clean. No unstaged changes.
              </div>
            )}

            {/* Commit Form */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="text-[10px] text-neutral-400 uppercase font-bold block">
                Commit & Push to '{activeRepo.branch}'
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="feat(watch): update battery curve telemetry..."
                className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white outline-none focus:border-[#FF5C00] text-xs"
              />
              <button
                onClick={handleCommitChanges}
                disabled={!commitMessage.trim()}
                className="w-full py-2 bg-[#FF5C00] hover:bg-white text-black font-black uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                Commit & Trigger CI/CD
              </button>
            </div>
          </div>
        </div>

        {/* Commit Log History (Right) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-neutral-950 border-2 border-neutral-800 space-y-3">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2 text-xs">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <GitCommit className="w-4 h-4 text-[#FF5C00]" />
                Recent Git Commits
              </span>
              <span className="text-[10px] text-neutral-500">{commits.length} Total commits</span>
            </div>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1 text-xs">
              {commits.map((c) => (
                <div key={c.hash} className="p-3 bg-neutral-900 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 bg-[#FF5C00] text-black text-[9px] font-black uppercase">
                        {c.hash}
                      </span>
                      {c.tag && (
                        <span className="px-1.5 py-0.2 bg-neutral-800 text-neutral-300 text-[9px] font-bold border border-neutral-700">
                          {c.tag}
                        </span>
                      )}
                      <span className="font-bold text-neutral-200">{c.message}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
                    <span>{c.author}</span>
                    <span>{new Date(c.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
