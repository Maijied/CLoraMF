import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  HardDrive, 
  Battery, 
  Zap, 
  Sparkles,
  Layers,
  FileCode2,
  RefreshCw,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FirmwareInfo, UpdateStage, UpdateProgress, WatchStatus } from '../types';
import { LATEST_FIRMWARE_INFO } from '../mockData';

interface FirmwareManagerProps {
  watchStatus: WatchStatus;
  onFirmwareUpdated: (newVersion: string) => void;
}

export const FirmwareManager: React.FC<FirmwareManagerProps> = ({
  watchStatus,
  onFirmwareUpdated
}) => {
  const [firmwareInfo] = useState<FirmwareInfo>(LATEST_FIRMWARE_INFO);
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState<UpdateProgress>({
    stage: 'CHECKING',
    progress: 0,
    message: 'Idle',
    details: { totalBytes: firmwareInfo.size, transferredBytes: 0, speedKbps: 0, timeRemainingSec: 0 }
  });

  const isUpToDate = watchStatus.firmwareVersion === firmwareInfo.version;

  const handleStartOtaUpdate = () => {
    if (watchStatus.battery < firmwareInfo.minBatteryLevel) {
      alert(`Battery level is ${watchStatus.battery}%. A minimum of ${firmwareInfo.minBatteryLevel}% is required to prevent bricking during flash.`);
      return;
    }

    setIsUpdating(true);
    const stages: UpdateStage[] = [
      'CHECKING',
      'DOWNLOADING',
      'PREPARING',
      'TRANSFERRING',
      'VERIFYING',
      'INSTALLING',
      'COMPLETED'
    ];

    let currentStageIndex = 0;
    let stageProgress = 0;
    let transferred = 0;

    const interval = setInterval(() => {
      stageProgress += 5;

      if (stages[currentStageIndex] === 'CHECKING') {
        setProgress({
          stage: 'CHECKING',
          progress: 0.08,
          message: 'Connecting to CMF Global OTA Cluster...',
          details: { totalBytes: firmwareInfo.size, transferredBytes: 0, speedKbps: 0, timeRemainingSec: 120 }
        });
        if (stageProgress > 20) {
          currentStageIndex = 1;
          stageProgress = 0;
        }
      } else if (stages[currentStageIndex] === 'DOWNLOADING') {
        transferred = Math.round((firmwareInfo.size * stageProgress) / 100);
        setProgress({
          stage: 'DOWNLOADING',
          progress: 0.1 + (stageProgress * 0.002),
          message: `Downloading firmware payload (${(transferred / 1024 / 1024).toFixed(2)} MB / ${(firmwareInfo.size / 1024 / 1024).toFixed(2)} MB)...`,
          details: { totalBytes: firmwareInfo.size, transferredBytes: transferred, speedKbps: 1840, timeRemainingSec: 90 }
        });
        if (stageProgress >= 100) {
          currentStageIndex = 2;
          stageProgress = 0;
        }
      } else if (stages[currentStageIndex] === 'PREPARING') {
        setProgress({
          stage: 'PREPARING',
          progress: 0.35,
          message: 'Opening BLE OTA Service Channel (UUID: 0000fe59-0000-1000-8000-00805f9b34fb)...',
          details: { totalBytes: firmwareInfo.size, transferredBytes: firmwareInfo.size, speedKbps: 0, timeRemainingSec: 75 }
        });
        if (stageProgress > 30) {
          currentStageIndex = 3;
          stageProgress = 0;
        }
      } else if (stages[currentStageIndex] === 'TRANSFERRING') {
        const chunkProgress = stageProgress / 100;
        transferred = Math.round(firmwareInfo.size * chunkProgress);
        setProgress({
          stage: 'TRANSFERRING',
          progress: 0.4 + (chunkProgress * 0.4),
          message: `Streaming 244-byte BLE packets to watch RTOS (${Math.round(chunkProgress * 100)}%)...`,
          details: {
            totalBytes: firmwareInfo.size,
            transferredBytes: transferred,
            speedKbps: 64,
            timeRemainingSec: Math.max(1, Math.round((1 - chunkProgress) * 35))
          }
        });
        if (stageProgress >= 100) {
          currentStageIndex = 4;
          stageProgress = 0;
        }
      } else if (stages[currentStageIndex] === 'VERIFYING') {
        setProgress({
          stage: 'VERIFYING',
          progress: 0.85,
          message: `Validating SHA-256 Checksum: ${firmwareInfo.checksum.substring(0, 16)}...`,
          details: { totalBytes: firmwareInfo.size, transferredBytes: firmwareInfo.size, speedKbps: 0, timeRemainingSec: 10 }
        });
        if (stageProgress > 40) {
          currentStageIndex = 5;
          stageProgress = 0;
        }
      } else if (stages[currentStageIndex] === 'INSTALLING') {
        setProgress({
          stage: 'INSTALLING',
          progress: 0.95,
          message: 'Flashing NOR Flash Sector & Rebooting Watch RTOS...',
          details: { totalBytes: firmwareInfo.size, transferredBytes: firmwareInfo.size, speedKbps: 0, timeRemainingSec: 3 }
        });
        if (stageProgress > 50) {
          currentStageIndex = 6;
        }
      } else if (stages[currentStageIndex] === 'COMPLETED') {
        clearInterval(interval);
        setProgress({
          stage: 'COMPLETED',
          progress: 1.0,
          message: 'Firmware successfully installed & verified!',
          details: { totalBytes: firmwareInfo.size, transferredBytes: firmwareInfo.size, speedKbps: 0, timeRemainingSec: 0 }
        });

        setTimeout(() => {
          setIsUpdating(false);
          onFirmwareUpdated(firmwareInfo.version);
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#00E676', '#FF5C00', '#FFFFFF']
          });
        }, 1200);
      }
    }, 180);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2 text-white">
            <Cpu className="w-6 h-6 text-[#FF5C00]" />
            Firmware & OTA Update System
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            CMF Watch 3 Pro RTOS Flasher • Cryptographically Signed OTA Stream
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-mono">
            Bootloader: v2.0-SECURE
          </span>
        </div>
      </div>

      {/* Version Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="p-5 border-2 border-neutral-800 bg-neutral-900 flex flex-col justify-between">
          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Installed Version</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{watchStatus.firmwareVersion}</span>
            <span className="text-[10px] text-emerald-400 font-bold">STABLE</span>
          </div>
          <span className="text-[10px] text-neutral-500 mt-3">Target Hardware: CMF-W3P-GLOBAL</span>
        </div>

        <div className="p-5 border-2 border-neutral-800 bg-neutral-900 flex flex-col justify-between">
          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Available OTA Release</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-[#FF5C00]">{firmwareInfo.version}</span>
            <span className="text-[10px] bg-[#FF5C00] text-black px-1.5 py-0.2 font-black uppercase">Build #{firmwareInfo.buildNumber}</span>
          </div>
          <span className="text-[10px] text-neutral-500 mt-3">Package Size: {(firmwareInfo.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>

        <div className="p-5 border-2 border-neutral-800 bg-neutral-900 flex flex-col justify-between">
          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Device Readiness</span>
          <div className="flex items-center gap-3 mt-2">
            <Battery className="w-5 h-5 text-[#FF5C00]" />
            <span className="text-xl font-bold text-white">{watchStatus.battery}%</span>
            {watchStatus.battery >= firmwareInfo.minBatteryLevel ? (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 border border-emerald-800">
                READY (≥50%)
              </span>
            ) : (
              <span className="text-[10px] text-red-400 font-bold bg-red-950/60 px-2 py-0.5 border border-red-800">
                LOW BATTERY
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-500 mt-3">Estimated Flash Time: ~3 mins</span>
        </div>
      </div>

      {/* Live OTA Flashing Modal / Container */}
      {isUpdating && (
        <div className="p-6 border-2 border-[#FF5C00] bg-neutral-950 space-y-4 font-mono shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <RotateCcw className="w-5 h-5 text-[#FF5C00] animate-spin" />
              <span>OTA FIRMWARE UPDATE IN PROGRESS</span>
            </div>
            <span className="text-xs bg-[#FF5C00] text-black px-2 py-0.5 font-black uppercase">
              STAGE: {progress.stage}
            </span>
          </div>

          <p className="text-xs text-neutral-300">
            {progress.message}
          </p>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
              <span>Overall Progress</span>
              <span className="text-[#FF5C00] font-bold">{Math.round(progress.progress * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-neutral-900 border border-neutral-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF5C00] to-amber-400"
                style={{ width: `${progress.progress * 100}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] text-neutral-400 border-t border-neutral-900">
            <div>
              <span className="block text-[9px] text-neutral-500 uppercase">Transferred</span>
              <span className="text-neutral-200 font-bold">
                {(progress.details.transferredBytes / 1024 / 1024).toFixed(2)} / {(progress.details.totalBytes / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <div>
              <span className="block text-[9px] text-neutral-500 uppercase">BLE Throughput</span>
              <span className="text-neutral-200 font-bold">{progress.details.speedKbps} KB/s</span>
            </div>
            <div>
              <span className="block text-[9px] text-neutral-500 uppercase">Est. Time Remaining</span>
              <span className="text-neutral-200 font-bold">{progress.details.timeRemainingSec}s</span>
            </div>
            <div>
              <span className="block text-[9px] text-neutral-500 uppercase">Service Channel</span>
              <span className="text-emerald-400 font-bold">SECURE (0xFE59)</span>
            </div>
          </div>

          <div className="p-3 bg-amber-950/30 border border-amber-800/60 text-amber-300 text-[11px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Do not power off watch or disconnect Bluetooth while flashing the NOR storage sectors.</span>
          </div>
        </div>
      )}

      {/* Firmware Changelog & Actions */}
      <div className="p-6 border-2 border-neutral-800 bg-neutral-900 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF5C00]" />
              Release Highlights & Changelog (v{firmwareInfo.version})
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              Released on {new Date(firmwareInfo.releaseDate).toLocaleDateString()} • Verified SHA-256 Signatures
            </span>
          </div>

          {!isUpToDate ? (
            <button
              disabled={isUpdating}
              onClick={handleStartOtaUpdate}
              className="px-6 py-3 bg-[#FF5C00] hover:bg-white text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Install OTA Firmware v{firmwareInfo.version}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/60 border border-emerald-700 text-emerald-400 text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>System Up to Date</span>
            </div>
          )}
        </div>

        {/* Changelog Bullet Points */}
        <div className="space-y-2.5 pt-2">
          {firmwareInfo.changelog.map((item, idx) => (
            <div 
              key={idx}
              className="p-3 bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 flex items-start gap-3"
            >
              <span className="text-[#FF5C00] font-bold">[{idx + 1}]</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Security & Recovery Specs */}
        <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cryptographic Integrity Verification
            </span>
            <div className="text-[10px] text-neutral-300 break-all pt-1 font-mono">
              SHA-256: <span className="text-emerald-400">{firmwareInfo.checksum}</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              Dual-Partition A/B Fallback
            </span>
            <p className="text-[11px] text-neutral-400">
              Automatic hardware recovery rollback to Partition B if boot verification fails after update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
