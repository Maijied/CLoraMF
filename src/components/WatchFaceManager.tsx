import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Watch, 
  Sparkles, 
  Download, 
  Upload, 
  Palette, 
  Layers, 
  Check, 
  Sliders, 
  Clock, 
  Activity, 
  Battery, 
  Flame, 
  RotateCcw,
  Eye,
  Info,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { WatchFace, WatchStatus, ComplicationType } from '../types';

interface WatchFaceManagerProps {
  watchFaces: WatchFace[];
  activeFaceId: string;
  watchStatus: WatchStatus;
  onSelectActiveFace: (faceId: string) => void;
  onInstallNewFace: (face: WatchFace) => void;
  onUpdateFaceTheme: (faceId: string, themeId: string) => void;
}

export const WatchFaceManager: React.FC<WatchFaceManagerProps> = ({
  watchFaces,
  activeFaceId,
  watchStatus,
  onSelectActiveFace,
  onInstallNewFace,
  onUpdateFaceTheme
}) => {
  const [selectedFace, setSelectedFace] = useState<WatchFace>(
    watchFaces.find(f => f.id === activeFaceId) || watchFaces[0]
  );
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashProgress, setFlashProgress] = useState(0);
  const [flashStage, setFlashStage] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const activeTheme = selectedFace.colorThemes.find(t => t.id === selectedFace.activeThemeId) || selectedFace.colorThemes[0];

  const handleApplyFaceToWatch = (face: WatchFace) => {
    setIsFlashing(true);
    setFlashProgress(0);
    setFlashStage('Packaging WatchFace Manifest & Binaries...');

    let p = 0;
    const interval = setInterval(() => {
      p += 15;
      if (p <= 30) {
        setFlashStage('Sending 244-byte BLE MTU packets (UUID: 0000fe70)...');
      } else if (p <= 70) {
        setFlashStage(`Transferring raster textures & fonts (${Math.round((selectedFace.sizeBytes * p) / 100 / 1024)} KB / ${Math.round(selectedFace.sizeBytes / 1024)} KB)...`);
      } else if (p <= 90) {
        setFlashStage('Verifying payload signature with CMF OS secure bootloader...');
      } else if (p >= 100) {
        clearInterval(interval);
        setFlashProgress(100);
        setFlashStage('Activated on AMOLED panel!');
        
        setTimeout(() => {
          setIsFlashing(false);
          onSelectActiveFace(face.id);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF5C00', '#00F0FF', '#FFFFFF']
          });
        }, 600);
        return;
      }
      setFlashProgress(p);
    }, 250);
  };

  const handleImportSubmit = () => {
    try {
      const parsed = JSON.parse(importJson);
      const newFace: WatchFace = {
        id: `face_custom_${Date.now()}`,
        name: parsed.name || 'Custom Imported Face',
        author: parsed.author || 'Community Developer',
        version: parsed.version || '1.0.0',
        resolution: { width: 466, height: 466 },
        style: parsed.style || 'custom',
        isActive: false,
        alwaysOnDisplay: parsed.alwaysOnDisplay ?? true,
        animations: true,
        batteryEfficient: true,
        sizeBytes: 154000,
        customFonts: ['JetBrains Mono'],
        activeThemeId: 'theme_default',
        colorThemes: parsed.colorThemes || [
          {
            id: 'theme_default',
            name: 'Neon Cyber',
            backgroundColor: '#0A0A0C',
            primaryColor: '#00F0FF',
            secondaryColor: '#FF5C00',
            accentColor: '#00E676',
            textColor: '#FFFFFF'
          }
        ],
        complications: parsed.complications || [
          { id: 'c1', type: 'time', position: { x: 50, y: 50 }, size: 36, configurable: true }
        ],
        description: parsed.description || 'Imported custom watchface package.'
      };

      onInstallNewFace(newFace);
      setSelectedFace(newFace);
      setShowImportModal(false);
      setImportJson('');
      confetti({ particleCount: 50 });
    } catch (err) {
      alert('Invalid JSON package format. Please verify the watchface schema.');
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedFace, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${selectedFace.id}.wface.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2 text-white">
            <Watch className="w-6 h-6 text-[#FF5C00]" />
            Watch Face Studio & Installer
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            466×466 Circular AMOLED Dial Pipeline • Dual-Channel OTA Transfer (UUID: 0000fe70)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Import Package
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Config
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gallery Cards (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Installed Watch Faces ({watchFaces.length})</span>
            <span className="text-[10px] text-[#FF5C00] font-mono">ACTIVE: {watchFaces.find(f => f.id === activeFaceId)?.name}</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {watchFaces.map((face) => {
              const isCurrentActive = face.id === activeFaceId;
              const isCurrentSelected = face.id === selectedFace.id;
              const theme = face.colorThemes.find(t => t.id === face.activeThemeId) || face.colorThemes[0];

              return (
                <div
                  key={face.id}
                  onClick={() => setSelectedFace(face)}
                  className={`p-4 border-2 transition-all cursor-pointer relative overflow-hidden ${
                    isCurrentSelected 
                      ? 'border-[#FF5C00] bg-neutral-900' 
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Mini Dial Preview Indicator */}
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-neutral-700 flex items-center justify-center relative overflow-hidden shrink-0 shadow-md"
                      style={{ backgroundColor: theme.backgroundColor }}
                    >
                      <div 
                        className="text-[10px] font-bold font-mono tracking-tighter"
                        style={{ color: theme.primaryColor }}
                      >
                        12:45
                      </div>
                      <div 
                        className="absolute bottom-1 w-2 h-0.5 rounded-full"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white truncate">{face.name}</h4>
                        {isCurrentActive && (
                          <span className="px-1.5 py-0.5 bg-[#FF5C00] text-black text-[9px] font-black uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
                        By {face.author} • v{face.version}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-400 font-mono">
                        <span className="uppercase text-neutral-300">Style: {face.style}</span>
                        <span>•</span>
                        <span>{Math.round(face.sizeBytes / 1024)} KB</span>
                        <span>•</span>
                        <span>{face.colorThemes.length} Themes</span>
                      </div>
                    </div>

                    <ChevronRight className={`w-5 h-5 transition-transform ${isCurrentSelected ? 'text-[#FF5C00] rotate-90 sm:rotate-0' : 'text-neutral-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Face Detail & Controls (Right) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 border-2 border-neutral-800 bg-neutral-900 space-y-6">
            
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-[#FF5C00] uppercase font-bold tracking-widest">
                  Selected Package: {selectedFace.id}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedFace.name}</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {selectedFace.description}
                </p>
              </div>

              {/* Apply / Flash Button */}
              <button
                disabled={isFlashing}
                onClick={() => handleApplyFaceToWatch(selectedFace)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                  selectedFace.id === activeFaceId 
                    ? 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700' 
                    : 'bg-[#FF5C00] hover:bg-white text-black font-black active:scale-95'
                }`}
              >
                {isFlashing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Flashing OTA...</span>
                  </>
                ) : selectedFace.id === activeFaceId ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Re-Flash Current Face</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Flash & Activate on Watch</span>
                  </>
                )}
              </button>
            </div>

            {/* Flash Progress Banner */}
            {isFlashing && (
              <div className="p-4 bg-neutral-950 border-2 border-[#FF5C00] space-y-2 font-mono">
                <div className="flex justify-between text-xs text-neutral-200">
                  <span className="text-[#FF5C00] font-bold uppercase">{flashStage}</span>
                  <span className="font-bold">{flashProgress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FF5C00]"
                    style={{ width: `${flashProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            )}

            {/* Color Theme Selector */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#FF5C00]" />
                Color Theme Palette
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedFace.colorThemes.map((theme) => {
                  const isThemeActive = theme.id === selectedFace.activeThemeId;

                  return (
                    <button
                      key={theme.id}
                      onClick={() => onUpdateFaceTheme(selectedFace.id, theme.id)}
                      className={`p-3 text-left border transition-all cursor-pointer flex items-center justify-between ${
                        isThemeActive 
                          ? 'border-[#FF5C00] bg-neutral-950' 
                          : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{theme.name}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 shadow-sm" style={{ backgroundColor: theme.backgroundColor }} />
                          <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 shadow-sm" style={{ backgroundColor: theme.primaryColor }} />
                          <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 shadow-sm" style={{ backgroundColor: theme.accentColor }} />
                        </div>
                      </div>
                      {isThemeActive && <Check className="w-4 h-4 text-[#FF5C00]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complications Configuration List */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF5C00]" />
                Active Complications ({selectedFace.complications.length})
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                {selectedFace.complications.map((comp) => (
                  <div 
                    key={comp.id}
                    className="p-2.5 bg-neutral-950 border border-neutral-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {comp.type === 'heart_rate' && <Activity className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                      {comp.type === 'steps' && <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      {comp.type === 'battery' && <Battery className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      {comp.type === 'time' && <Clock className="w-3.5 h-3.5 text-[#FF5C00] shrink-0" />}
                      {comp.type === 'date' && <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                      <span className="uppercase text-neutral-300 truncate">{comp.label || comp.type}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      ({comp.position.x}%, {comp.position.y}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware Flags & Specs */}
            <div className="pt-4 border-t border-neutral-800 grid grid-cols-3 gap-3 text-center font-mono">
              <div className="p-2 bg-neutral-950 border border-neutral-800">
                <div className="text-[9px] text-neutral-500 uppercase">AOD Mode</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  {selectedFace.alwaysOnDisplay ? 'SUPPORTED' : 'OFF'}
                </div>
              </div>
              <div className="p-2 bg-neutral-950 border border-neutral-800">
                <div className="text-[9px] text-neutral-500 uppercase">Resolution</div>
                <div className="text-xs font-bold text-white mt-0.5">466 × 466 px</div>
              </div>
              <div className="p-2 bg-neutral-950 border border-neutral-800">
                <div className="text-[9px] text-neutral-500 uppercase">Power Curve</div>
                <div className="text-xs font-bold text-[#FF5C00] mt-0.5">
                  {selectedFace.batteryEfficient ? 'ULTRA-LOW' : 'STANDARD'}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border-2 border-neutral-700 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#FF5C00]" />
                Import Watch Face JSON Package
              </h3>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-neutral-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-mono">
              Paste the manifest JSON containing complications, color themes, and style definitions:
            </p>

            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder={`{\n  "name": "Neon Chrono",\n  "author": "MD Shuvo",\n  "version": "1.0.0",\n  "style": "sport",\n  "colorThemes": [...]\n}`}
              className="w-full h-44 bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono text-neutral-200 outline-none focus:border-[#FF5C00]"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                disabled={!importJson.trim()}
                className="px-4 py-2 bg-[#FF5C00] hover:bg-white text-black text-xs font-black uppercase disabled:opacity-50 cursor-pointer"
              >
                Compile & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
