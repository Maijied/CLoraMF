import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  Search, 
  Download, 
  Star, 
  Check, 
  Sparkles, 
  Filter, 
  Heart, 
  GitBranch, 
  Clock, 
  Gamepad2, 
  CloudRain, 
  MessageSquare,
  ShieldAlert,
  UserCheck,
  PlusCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { StoreApp, AppCategory, StoreReview, DeveloperAccount, WatchStatus } from '../types';
import { INITIAL_STORE_APPS, INITIAL_REVIEWS } from '../mockData';

interface AppStoreViewProps {
  watchStatus: WatchStatus;
  onAppInstalledOnWatch: (app: StoreApp) => void;
}

export const AppStoreView: React.FC<AppStoreViewProps> = ({
  watchStatus,
  onAppInstalledOnWatch
}) => {
  const [apps, setApps] = useState<StoreApp[]>(INITIAL_STORE_APPS);
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'downloads' | 'newest'>('popular');
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null);
  const [installingAppId, setInstallingAppId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState(0);

  // Reviews state
  const [reviewsMap, setReviewsMap] = useState<Record<string, StoreReview[]>>(INITIAL_REVIEWS);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Developer portal state
  const [showDevModal, setShowDevModal] = useState(false);
  const [devAccount, setDevAccount] = useState<DeveloperAccount>({
    developerId: 'dev_shuvo_40',
    name: 'MD Shuvo',
    email: 'mdshuvo40@gmail.com',
    appsCount: 2,
    totalDownloads: 14250,
    revenue: 420.50,
    verified: true
  });

  const categories: AppCategory[] = [
    'ALL',
    'HEALTH',
    'FITNESS',
    'PRODUCTIVITY',
    'GAMES',
    'UTILITIES',
    'WEATHER',
    'DEVELOPER'
  ];

  // Filtering & Sorting
  const filteredApps = apps
    .filter(app => {
      const matchCat = selectedCategory === 'ALL' || app.category === selectedCategory;
      const matchSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      return 0;
    });

  const handleInstallApp = (app: StoreApp) => {
    setInstallingAppId(app.id);
    setInstallProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setInstallProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setApps(prev => prev.map(a => a.id === app.id ? { ...a, isInstalled: true } : a));
          setInstallingAppId(null);
          onAppInstalledOnWatch(app);
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FF5C00', '#00E676', '#FFFFFF']
          });
        }, 500);
      }
    }, 200);
  };

  const handleAddReview = () => {
    if (!selectedApp || !newReviewText.trim()) return;

    const review: StoreReview = {
      id: `rev_${Date.now()}`,
      userId: devAccount.developerId,
      userName: devAccount.name,
      rating: newReviewRating,
      comment: newReviewText.trim(),
      date: Date.now(),
      verifiedUser: true
    };

    setReviewsMap(prev => ({
      ...prev,
      [selectedApp.id]: [review, ...(prev[selectedApp.id] || [])]
    }));
    setNewReviewText('');
    confetti({ particleCount: 30 });
  };

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-5 h-5 text-red-500" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5 text-[#FF5C00]" />;
      case 'Clock': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-sky-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5 text-cyan-400" />;
      default: return <Sparkles className="w-5 h-5 text-[#FF5C00]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2 text-white">
            <Store className="w-6 h-6 text-[#FF5C00]" />
            CMF Watch App Store & Community
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Verified Micro-Apps & Sandboxed RTOS Packages (UUID: 0000fe60)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDevModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#FF5C00]" />
            Developer Hub
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between font-mono text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search watch apps, utilities, biometrics..."
            className="w-full bg-neutral-900 border border-neutral-800 pl-9 pr-4 py-2.5 text-white outline-none focus:border-[#FF5C00]"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-200 uppercase outline-none focus:border-[#FF5C00]"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="downloads">Total Downloads</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 uppercase font-bold tracking-wider shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-[#FF5C00] text-black font-black' 
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => {
          const isCurrentlyFlashing = installingAppId === app.id;

          return (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className="p-5 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 bg-neutral-950 border border-neutral-700 flex items-center justify-center shrink-0 shadow-md">
                    {getAppIcon(app.iconUrl)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-white group-hover:text-[#FF5C00] transition-colors truncate">
                        {app.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-mono truncate">
                      {app.author} • v{app.version}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 mt-3 line-clamp-2 leading-relaxed">
                  {app.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {app.rating}
                  </span>
                  <span>•</span>
                  <span>{app.downloads.toLocaleString()} dl</span>
                </div>

                {/* Install Button */}
                <button
                  disabled={isCurrentlyFlashing}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!app.isInstalled) {
                      handleInstallApp(app);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    app.isInstalled 
                      ? 'bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-default' 
                      : 'bg-[#FF5C00] hover:bg-white text-black font-black active:scale-95'
                  }`}
                >
                  {isCurrentlyFlashing ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>{installProgress}%</span>
                    </>
                  ) : app.isInstalled ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Installed</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Get</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* App Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-neutral-900 border-2 border-neutral-700 p-6 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-neutral-950 border border-neutral-700 flex items-center justify-center shrink-0">
                    {getAppIcon(selectedApp.iconUrl)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedApp.name}</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Developed by {selectedApp.author} • Category: {selectedApp.category}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-mono text-neutral-400">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedApp.rating}
                      </span>
                      <span>•</span>
                      <span>{selectedApp.downloads.toLocaleString()} installs</span>
                      <span>•</span>
                      <span>{Math.round(selectedApp.size / 1024)} KB</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-neutral-400 hover:text-white font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase font-mono tracking-wider">
                  About this App
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                  {selectedApp.description}
                </p>
              </div>

              {/* Permissions Required */}
              <div className="space-y-2 pt-2 border-t border-neutral-800 font-mono">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#FF5C00]" />
                  Permissions Requested
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 uppercase"
                    >
                      {perm.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* User Reviews Section */}
              <div className="space-y-4 pt-2 border-t border-neutral-800 font-mono">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Community Reviews ({reviewsMap[selectedApp.id]?.length || 0})
                  </h4>
                </div>

                {/* Add Review Box */}
                <div className="p-3 bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Leave a Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${star <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-neutral-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Write your feedback for the developer..."
                    className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white outline-none focus:border-[#FF5C00]"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddReview}
                      disabled={!newReviewText.trim()}
                      className="px-3 py-1 bg-[#FF5C00] hover:bg-white text-black text-xs font-black uppercase disabled:opacity-50 cursor-pointer"
                    >
                      Post Review
                    </button>
                  </div>
                </div>

                {/* Review Items */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(reviewsMap[selectedApp.id] || []).map((rev) => (
                    <div key={rev.id} className="p-3 bg-neutral-950 border border-neutral-800 space-y-1 text-xs">
                      <div className="flex justify-between items-center text-neutral-400 text-[11px]">
                        <span className="font-bold text-white flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-emerald-400" />
                          {rev.userName}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-neutral-300 text-[11px] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 text-xs font-bold uppercase cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleInstallApp(selectedApp);
                    setSelectedApp(null);
                  }}
                  disabled={selectedApp.isInstalled}
                  className="px-6 py-2 bg-[#FF5C00] hover:bg-white text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{selectedApp.isInstalled ? 'Already Installed' : 'Install to Watch 3 Pro'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Developer Hub Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border-2 border-neutral-700 p-6 space-y-5 font-mono">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FF5C00]" />
                CMF Developer Portal
              </h3>
              <button 
                onClick={() => setShowDevModal(false)}
                className="text-neutral-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Developer Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-500 uppercase">Live Apps</div>
                <div className="text-lg font-bold text-white mt-1">{devAccount.appsCount}</div>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-500 uppercase">Total Installs</div>
                <div className="text-lg font-bold text-[#FF5C00] mt-1">{devAccount.totalDownloads.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-500 uppercase">Revenue</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">${devAccount.revenue}</div>
              </div>
            </div>

            <div className="p-3 bg-neutral-950 border border-neutral-800 space-y-1 text-xs text-neutral-300">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Account Profile</span>
              <div>Developer: <span className="text-white font-bold">{devAccount.name}</span></div>
              <div>Email: <span className="text-neutral-400">{devAccount.email}</span></div>
              <div className="text-emerald-400 text-[11px] font-bold mt-1">✓ Verified Watch OS Publisher</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDevModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold uppercase cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
