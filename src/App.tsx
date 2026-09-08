import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Battery, 
  Bluetooth, 
  BluetoothOff, 
  GitBranch, 
  MessageSquare, 
  Cpu, 
  Watch, 
  Store, 
  Code2, 
  Radio, 
  Heart, 
  Footprints, 
  Zap, 
  Clock, 
  Settings, 
  Bell, 
  Download, 
  Layers,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Globe,
  FileCode2,
  Workflow
} from 'lucide-react';
import confetti from 'canvas-confetti';

import type { 
  WatchStatus, 
  WatchFace, 
  StoreApp, 
  CustomAppPackage, 
  WatchNotificationPayload,
  AIActionPayload 
} from './types';

import { 
  INITIAL_WATCH_FACES, 
  DEFAULT_SDK_PROJECT, 
  LATEST_FIRMWARE_INFO 
} from './mockData';

import { WatchDevicePreview } from './components/WatchDevicePreview';
import { WatchFaceManager } from './components/WatchFaceManager';
import { FirmwareManager } from './components/FirmwareManager';
import { AppSDKStudio } from './components/AppSDKStudio';
import { AppStoreView } from './components/AppStoreView';
import { BLEProtocolManager } from './components/BLEProtocolManager';
import { AIAssistantView } from './components/AIAssistantView';
import { GitHubManager } from './components/GitHubManager';
import { CICDPipelineView } from './components/CICDPipelineView';
import { OSSWebsiteView } from './components/OSSWebsiteView';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'watchfaces' | 'store' | 'sdk' | 'firmware' | 'ble' | 'ai' | 'git' | 'cicd' | 'website'
  >('dashboard');

  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);

  const [watchStatus, setWatchStatus] = useState<WatchStatus>({
    connected: true,
    battery: 84,
    lastSync: 'Just now',
    deviceName: 'CMF Watch 3 Pro',
    firmwareVersion: '1.4.2-AI',
    bluetoothAddress: 'DC:54:75:A8:92:E1',
    heartRateCurrent: 74,
    stepsCurrent: 8432,
    caloriesCurrent: 620,
    distanceKm: 5.8,
    sleepHours: 7.4,
    activeFaceId: 'face_cmf_matrix_01',
    storageUsedMb: 4200,
    storageTotalMb: 8192,
    bleRssi: -58
  });

  const [watchFaces, setWatchFaces] = useState<WatchFace[]>(INITIAL_WATCH_FACES);
  const [runningApp, setRunningApp] = useState<CustomAppPackage | null>(null);
  const [activeNotification, setActiveNotification] = useState<WatchNotificationPayload | null>({
    id: 'notif_welcome',
    title: 'BLE 5.3 LINK ESTABLISHED',
    message: 'CMF Watch 3 Pro paired with Companion AI Platform.',
    timestamp: Date.now()
  });

  // Background Auto-Sync Simulation
  useEffect(() => {
    if (!autoSyncEnabled || !watchStatus.connected) return;

    const interval = setInterval(() => {
      // Natural gentle telemetry fluctuation
      const hrDelta = Math.floor(Math.random() * 5) - 2;
      const newHr = Math.max(58, Math.min(150, watchStatus.heartRateCurrent + hrDelta));
      const newSteps = watchStatus.stepsCurrent + Math.floor(Math.random() * 6);
      const newCalories = watchStatus.caloriesCurrent + (Math.random() > 0.5 ? 1 : 0);

      setWatchStatus(prev => ({
        ...prev,
        heartRateCurrent: newHr,
        stepsCurrent: newSteps,
        caloriesCurrent: newCalories,
        lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [autoSyncEnabled, watchStatus.connected, watchStatus.heartRateCurrent, watchStatus.stepsCurrent, watchStatus.caloriesCurrent]);

  const activeWatchFace = watchFaces.find(f => f.id === watchStatus.activeFaceId) || watchFaces[0];
  const hasFirmwareUpdate = watchStatus.firmwareVersion !== LATEST_FIRMWARE_INFO.version;

  const handleSelectActiveFace = (faceId: string) => {
    setWatchFaces(prev => prev.map(f => ({ ...f, isActive: f.id === faceId })));
    setWatchStatus(prev => ({ ...prev, activeFaceId: faceId }));
    setRunningApp(null); // Return to watchface dial
  };

  const handleInstallNewFace = (face: WatchFace) => {
    setWatchFaces(prev => [face, ...prev]);
    setWatchStatus(prev => ({ ...prev, activeFaceId: face.id }));
    setRunningApp(null);
  };

  const handleUpdateFaceTheme = (faceId: string, themeId: string) => {
    setWatchFaces(prev => prev.map(f => f.id === faceId ? { ...f, activeThemeId: themeId } : f));
  };

  const handleFirmwareUpdated = (newVersion: string) => {
    setWatchStatus(prev => ({
      ...prev,
      firmwareVersion: newVersion,
      lastSync: new Date().toLocaleTimeString()
    }));
    setActiveNotification({
      id: `notif_${Date.now()}`,
      title: 'FIRMWARE UPDATED',
      message: `Running CMF OS v${newVersion} on RTOS kernel.`,
      timestamp: Date.now()
    });
  };

  const handleTestAppOnWatch = (app: CustomAppPackage) => {
    setRunningApp(app);
    setActiveNotification({
      id: `notif_${Date.now()}`,
      title: `LAUNCHED ${app.name.toUpperCase()}`,
      message: 'Running live sandboxed bytecode on 466x466 AMOLED display.',
      timestamp: Date.now()
    });
  };

  const handleAppInstalledOnWatch = (app: StoreApp) => {
    setActiveNotification({
      id: `notif_${Date.now()}`,
      title: 'APP INSTALLED',
      message: `${app.name} ready on CMF Watch 3 Pro.`,
      timestamp: Date.now()
    });
  };

  const handleDispatchAIAction = (action: AIActionPayload) => {
    if (action.type === 'notification' && action.message) {
      setActiveNotification({
        id: `notif_${Date.now()}`,
        title: action.title || 'AI COMMAND',
        message: action.message,
        timestamp: Date.now()
      });
    } else if (action.type === 'git') {
      setActiveTab('git');
    } else if (action.type === 'health_alert') {
      setActiveTab('dashboard');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Vitals & Hub', icon: Activity, badge: null },
    { id: 'watchfaces', label: 'Watch Faces', icon: Watch, badge: `${watchFaces.length}` },
    { id: 'store', label: 'App Store', icon: Store, badge: 'NEW' },
    { id: 'sdk', label: 'Watch SDK', icon: Code2, badge: 'v1.0' },
    { id: 'firmware', label: 'Firmware OTA', icon: Cpu, badge: hasFirmwareUpdate ? 'OTA' : null },
    { id: 'ble', label: 'BLE Bridge', icon: Radio, badge: watchStatus.connected ? 'LINK' : 'OFF' },
    { id: 'ai', label: 'AI Console', icon: MessageSquare, badge: '3.8' },
    { id: 'git', label: 'Git Hub', icon: GitBranch, badge: autoSyncEnabled ? 'AUTO' : null },
    { id: 'cicd', label: 'CI/CD Pipeline', icon: Workflow, badge: 'PASS' },
    { id: 'website', label: 'OSS Website', icon: Globe, badge: 'PORTAL' }
  ];

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#EDEDED] font-mono selection:bg-[#FF5C00] selection:text-white flex flex-col">
      
      {/* Top Main App Header */}
      <header className="border-b border-neutral-800 bg-[#0E1013]/90 backdrop-blur-md px-4 sm:px-8 py-3 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="w-9 h-9 bg-[#FF5C00] flex items-center justify-center shadow-md cursor-pointer hover:bg-white transition-colors group"
          >
            <Cpu className="text-black w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 
                onClick={() => setActiveTab('dashboard')}
                className="text-base font-bold tracking-tight uppercase leading-none text-white cursor-pointer hover:text-[#FF5C00] transition-colors"
              >
                CMF WATCH 3 PRO
              </h1>
              <span className="px-1.5 py-0.2 bg-neutral-800 text-[9px] font-black uppercase text-neutral-300 border border-neutral-700">
                AI PLATFORM
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
              OS v{watchStatus.firmwareVersion} • {watchStatus.connected ? `SYNCED (${watchStatus.lastSync})` : 'OFFLINE'}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Quick Portal Switcher */}
          <button
            onClick={() => setActiveTab('website')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'website'
                ? 'border-[#FF5C00] bg-neutral-900 text-white'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>OSS Website & Downloads</span>
          </button>

          {/* Quick CI/CD Switcher */}
          <button
            onClick={() => setActiveTab('cicd')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'cicd'
                ? 'border-emerald-600 bg-emerald-950/40 text-emerald-400'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-emerald-400" />
            <span>CI/CD</span>
          </button>

          {/* Auto-Sync Toggle in Header */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-xs">
            <span className="hidden sm:inline text-[9px] text-neutral-400 font-bold uppercase">Auto-Sync</span>
            <button
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
              title={autoSyncEnabled ? "Auto-Sync is Enabled (Every 4s)" : "Auto-Sync is Disabled"}
              className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                autoSyncEnabled ? 'bg-[#FF5C00]' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`bg-black w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                  autoSyncEnabled ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </button>
            {autoSyncEnabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            )}
          </div>

          {/* Bluetooth Connection Toggle */}
          <button
            onClick={() => setWatchStatus(prev => ({ ...prev, connected: !prev.connected }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold uppercase transition-all cursor-pointer ${
              watchStatus.connected 
                ? 'border-emerald-600 bg-emerald-950/40 text-emerald-400' 
                : 'border-neutral-700 bg-neutral-900 text-neutral-400'
            }`}
          >
            {watchStatus.connected ? <Bluetooth className="w-3.5 h-3.5 text-emerald-400" /> : <BluetoothOff className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{watchStatus.connected ? 'BLE' : 'Off'}</span>
          </button>

          {/* Battery Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 text-xs">
            <Battery className="w-4 h-4 text-[#FF5C00]" />
            <span className="font-bold text-neutral-200">{watchStatus.battery}%</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Navigation Rail (Desktop) */}
        <nav className="hidden lg:flex flex-col gap-1.5 lg:col-span-3">
          <div className="p-3 bg-neutral-900 border border-neutral-800 mb-2 flex justify-between items-center">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest block">
              Ecosystem Navigator
            </span>
            {autoSyncEnabled && (
              <span className="text-[9px] text-[#FF5C00] uppercase font-bold">AUTO-SYNC ON</span>
            )}
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`p-3 flex items-center justify-between border-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'border-[#FF5C00] bg-neutral-900 text-white font-bold' 
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-[#FF5C00]' : 'text-neutral-400'}`} />
                  <span className="text-xs uppercase tracking-wider">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.2 text-[9px] font-black uppercase ${
                    isActive ? 'bg-[#FF5C00] text-black' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Device Quick Stats Card in Sidebar */}
          <div className="mt-4 p-4 bg-neutral-900 border border-neutral-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-[10px] text-neutral-400 uppercase font-bold border-b border-neutral-800 pb-2">
              <span>Hardware Snapshot</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">AMOLED Panel</span>
                <span className="text-white font-bold">1.96" 466x466</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Storage Usage</span>
                <span className="text-white font-bold">
                  {(watchStatus.storageUsedMb / 1024).toFixed(1)} / {(watchStatus.storageTotalMb / 1024).toFixed(1)} GB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Dual BLE Chip</span>
                <span className="text-[#FF5C00] font-bold">Realtek RTL8762</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">CI/CD Build</span>
                <span className="text-emerald-400 font-bold">#run_4210 PASS</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Center / Main Tab Viewport */}
        <main className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* TAB: DASHBOARD & VITALS */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Hardware Live Simulator Card */}
                <div className="p-6 bg-neutral-900 border-2 border-neutral-800 flex flex-col md:flex-row items-center justify-around gap-6 relative overflow-hidden">
                  <div className="space-y-3 max-w-sm text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-[10px] text-[#FF5C00] uppercase font-bold tracking-widest block font-mono">
                        Real-Time Hardware Bridge
                      </span>
                      {autoSyncEnabled && (
                        <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 text-[8px] font-black border border-emerald-800 uppercase">
                          Auto-Syncing
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold uppercase text-white tracking-tight">
                      CMF Watch 3 Pro Active Screen
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                      Interactive AMOLED circular viewport. Click the crown on the right to toggle apps or press the lower button to test Always-On Display mode.
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                      <button
                        onClick={() => setActiveTab('watchfaces')}
                        className="px-3.5 py-2 bg-[#FF5C00] hover:bg-white text-black text-xs font-black uppercase transition-colors cursor-pointer"
                      >
                        Change Watch Face
                      </button>
                      <button
                        onClick={() => setActiveTab('sdk')}
                        className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-colors cursor-pointer"
                      >
                        Build Custom App
                      </button>
                      <button
                        onClick={() => setActiveTab('website')}
                        className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold uppercase transition-colors cursor-pointer"
                      >
                        Downloads
                      </button>
                    </div>
                  </div>

                  {/* AMOLED Preview */}
                  <WatchDevicePreview
                    watchStatus={watchStatus}
                    activeFace={activeWatchFace}
                    runningApp={runningApp}
                    notification={activeNotification}
                    onDismissNotification={() => setActiveNotification(null)}
                    onCrownClick={() => {
                      if (runningApp) {
                        setRunningApp(null); // Exit app back to dial
                      } else {
                        // Switch to next installed face
                        const idx = watchFaces.findIndex(f => f.id === watchStatus.activeFaceId);
                        const nextFace = watchFaces[(idx + 1) % watchFaces.length];
                        handleSelectActiveFace(nextFace.id);
                      }
                    }}
                  />
                </div>

                {/* Vitals Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                  {/* Heart Rate */}
                  <div className="p-5 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-neutral-950 border border-neutral-800 text-red-500">
                        <Heart className="w-5 h-5 fill-red-500/20 animate-pulse" />
                      </div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">HEART RATE</span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{watchStatus.heartRateCurrent}</span>
                      <span className="text-xs text-neutral-400 font-bold uppercase">BPM</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-2 block">Normal Resting Zone</span>
                  </div>

                  {/* Steps */}
                  <div className="p-5 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-neutral-950 border border-neutral-800 text-emerald-400">
                        <Footprints className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">STEP COUNT</span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{watchStatus.stepsCurrent.toLocaleString()}</span>
                      <span className="text-xs text-neutral-400 font-bold uppercase">STEPS</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-2 block">Goal: 10,000 (84%)</span>
                  </div>

                  {/* Calories */}
                  <div className="p-5 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-neutral-950 border border-neutral-800 text-amber-400">
                        <Zap className="w-5 h-5 fill-amber-400/20" />
                      </div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">ACTIVE BURN</span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{watchStatus.caloriesCurrent}</span>
                      <span className="text-xs text-neutral-400 font-bold uppercase">KCAL</span>
                    </div>
                    <span className="text-[10px] text-amber-400 mt-2 block">Distance: {watchStatus.distanceKm} km</span>
                  </div>

                  {/* Sleep */}
                  <div className="p-5 bg-neutral-900 border-2 border-neutral-800 hover:border-neutral-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-neutral-950 border border-neutral-800 text-purple-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">SLEEP DURATION</span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{watchStatus.sleepHours}</span>
                      <span className="text-xs text-neutral-400 font-bold uppercase">HRS</span>
                    </div>
                    <span className="text-[10px] text-purple-400 mt-2 block">Deep Sleep: 2h 15m</span>
                  </div>
                </div>

                {/* AI Optimization Banner */}
                <div className="p-6 bg-neutral-950 border-2 border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1 font-mono">
                    <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
                      <Sparkles className="w-4 h-4 text-[#FF5C00]" />
                      <span>Gemini AI Health Recommendation</span>
                    </div>
                    <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                      Biometric variability is stabilized. Predicted afternoon peak energy window is 14:00 - 16:30. Would you like to schedule an automated focus session on your watch?
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('ai')}
                    className="px-5 py-2.5 bg-[#FF5C00] hover:bg-white text-black font-black uppercase text-xs tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    Open AI Console
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB: WATCH FACES */}
            {activeTab === 'watchfaces' && (
              <motion.div
                key="watchfaces"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <WatchFaceManager
                  watchFaces={watchFaces}
                  activeFaceId={watchStatus.activeFaceId}
                  watchStatus={watchStatus}
                  onSelectActiveFace={handleSelectActiveFace}
                  onInstallNewFace={handleInstallNewFace}
                  onUpdateFaceTheme={handleUpdateFaceTheme}
                />
              </motion.div>
            )}

            {/* TAB: APP STORE */}
            {activeTab === 'store' && (
              <motion.div
                key="store"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <AppStoreView
                  watchStatus={watchStatus}
                  onAppInstalledOnWatch={handleAppInstalledOnWatch}
                />
              </motion.div>
            )}

            {/* TAB: WATCH APP SDK */}
            {activeTab === 'sdk' && (
              <motion.div
                key="sdk"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <AppSDKStudio
                  onTestAppOnWatch={handleTestAppOnWatch}
                  onPublishAppToStore={() => {
                    alert('Submitted app package to CMF Developer verification queue!');
                    confetti({ particleCount: 50 });
                  }}
                />
              </motion.div>
            )}

            {/* TAB: FIRMWARE OTA */}
            {activeTab === 'firmware' && (
              <motion.div
                key="firmware"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <FirmwareManager
                  watchStatus={watchStatus}
                  onFirmwareUpdated={handleFirmwareUpdated}
                />
              </motion.div>
            )}

            {/* TAB: BLE PROTOCOL */}
            {activeTab === 'ble' && (
              <motion.div
                key="ble"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <BLEProtocolManager
                  watchStatus={watchStatus}
                  onUpdateWatchStatus={(updates) => setWatchStatus(prev => ({ ...prev, ...updates }))}
                  onSendNotification={(notif) => {
                    setActiveNotification(notif);
                    confetti({ particleCount: 30 });
                  }}
                />
              </motion.div>
            )}

            {/* TAB: AI CONSOLE */}
            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <AIAssistantView
                  watchStatus={watchStatus}
                  onDispatchAction={handleDispatchAIAction}
                />
              </motion.div>
            )}

            {/* TAB: GIT HUB */}
            {activeTab === 'git' && (
              <motion.div
                key="git"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <GitHubManager
                  autoSyncEnabled={autoSyncEnabled}
                  onToggleAutoSync={setAutoSyncEnabled}
                  onOpenCICD={() => setActiveTab('cicd')}
                />
              </motion.div>
            )}

            {/* TAB: CI/CD PIPELINE IN ACTION */}
            {activeTab === 'cicd' && (
              <motion.div
                key="cicd"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <CICDPipelineView />
              </motion.div>
            )}

            {/* TAB: OPEN SOURCE EXPERIMENT WEBSITE & PORTAL */}
            {activeTab === 'website' && (
              <motion.div
                key="website"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <OSSWebsiteView
                  onOpenCICD={() => setActiveTab('cicd')}
                  onOpenDashboard={() => setActiveTab('dashboard')}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-800 bg-[#0E1013]/95 backdrop-blur-md p-2 z-50 flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`p-2 transition-all flex flex-col items-center gap-0.5 ${
              activeTab === item.id ? 'text-[#FF5C00]' : 'text-neutral-500'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] uppercase font-bold tracking-tight">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </footer>

    </div>
  );
}
