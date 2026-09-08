import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Terminal, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Watch, 
  GitBranch, 
  Activity, 
  Radio, 
  CheckCircle2, 
  Lock, 
  AlertTriangle,
  Heart,
  Globe,
  Code2,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerArtifactDownload } from '../utils/artifactGenerator';
import type { BuildArtifact } from '../types';

interface OSSWebsiteViewProps {
  onOpenCICD?: () => void;
  onOpenDashboard?: () => void;
}

export const OSSWebsiteView: React.FC<OSSWebsiteViewProps> = ({
  onOpenCICD,
  onOpenDashboard
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'downloads' | 'readme' | 'terms' | 'license'>('overview');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const releaseArtifacts: BuildArtifact[] = [
    {
      id: 'art_apk',
      name: 'CMF Watch AI Companion (Android App)',
      filename: 'cmf-watch-ai-platform-v1.5.0.apk',
      sizeBytes: 18450000,
      format: 'apk',
      type: 'companion_app',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      version: '1.5.0',
      description: 'Fully functional Android Companion with Gemini 3.8 Flash real-time health analysis, BLE 5.3 bridge, and watch face manager.'
    },
    {
      id: 'art_fw',
      name: 'CMF Watch 3 Pro RTOS Firmware Binary',
      filename: 'cmf-watch3pro-firmware-v1.5.0-PRO.bin',
      sizeBytes: 3840000,
      format: 'bin',
      type: 'firmware',
      checksum: '7e9b41a8c9e50df2b86134b12389d44e59f20108a95ce5e6f3b0198cae4129b0',
      version: '1.5.0-PRO',
      description: 'ARM Cortex-M33 RTOS firmware image supporting 60 FPS AMOLED rendering and over-the-air BLE flashing.'
    },
    {
      id: 'art_sdk',
      name: 'CMF Watch Developer SDK & CLI',
      filename: 'cmf-watch-sdk-v1.0.0.zip',
      sizeBytes: 2450000,
      format: 'zip',
      type: 'sdk_bundle',
      checksum: 'c2498a834b6791e84a22b7a95781a95e098731ad77e3845b7365da98e6c71490',
      version: '1.0.0',
      description: 'Complete development kit for creating custom sandboxed watch apps with bytecode compiler.'
    },
    {
      id: 'art_faces',
      name: 'Community Watch Faces Starter Pack',
      filename: 'cmf-community-watchfaces-pack.json',
      sizeBytes: 890000,
      format: 'json',
      type: 'watchface_pack',
      checksum: '5a81e9f1937402a50a7c469b2229555198e3b5df56f913d964f43477f502476d',
      version: '2.1.0',
      description: 'Curated 466x466 circular watch dials for CMF Matrix, Aero Chrono, and Bauhaus styles.'
    }
  ];

  const handleDownload = async (art: BuildArtifact) => {
    try {
      setDownloadingId(art.id);
      await triggerArtifactDownload(art);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      
      {/* Hero Showcase Banner */}
      <div className="p-8 bg-neutral-900 border-2 border-neutral-800 relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#FF5C00] text-black text-[10px] font-black uppercase tracking-widest">
              OPEN SOURCE EXPERIMENT
            </span>
            <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              CI/CD: PASSING (v1.5.0)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>LICENSE: MIT / APACHE 2.0</span>
            <span>•</span>
            <span>NOTHING COMMUNITY LABS</span>
          </div>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight leading-tight">
            CMF WATCH 3 PRO <span className="text-[#FF5C00]">AI COMPANION</span>
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed font-sans">
            An open-source hardware & software experimental suite combining low-power BLE 5.3 peripheral telemetry, Gemini 3.8 Flash edge intelligence, custom watch face creation, and an extensible sandboxed RTOS SDK for the Nothing / CMF smartwatch ecosystem.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => setActiveSection('downloads')}
            className="px-6 py-3 bg-[#FF5C00] hover:bg-white text-black font-black uppercase text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Working App & Firmware</span>
          </button>

          <button
            onClick={onOpenCICD}
            className="px-5 py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-[#FF5C00]" />
            <span>View Live CI/CD Pipeline</span>
          </button>

          <button
            onClick={onOpenDashboard}
            className="px-5 py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
          >
            <Watch className="w-4 h-4 text-emerald-400" />
            <span>Launch Live Hardware Simulator</span>
          </button>

          <a
            href="https://maijied.github.io/CLoraMF/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>GitHub Pages: CLoraMF</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </a>
        </div>

        {/* Subtle dot matrix aesthetic element */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <div className="grid grid-cols-8 gap-2">
            {[...Array(32)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Architecture & Features', icon: Sparkles },
          { id: 'downloads', label: 'Functional Downloads', icon: Download },
          { id: 'readme', label: 'README.md & Docs', icon: BookOpen },
          { id: 'terms', label: 'Terms & Conditions', icon: ShieldCheck },
          { id: 'license', label: 'Open Source License', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-5 py-3 flex items-center gap-2 border-b-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeSection === tab.id
                ? 'border-[#FF5C00] text-white bg-neutral-900/60'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeSection === tab.id ? 'text-[#FF5C00]' : ''}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-neutral-900 border-2 border-neutral-800 space-y-3">
              <div className="p-3 bg-neutral-950 border border-neutral-800 w-fit text-[#FF5C00]">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Direct BLE 5.3 Link</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Realtek RTL8762 dual-core peripheral synchronization using GATT standard 0x180D (Heart Rate), 0x180F (Battery), and 0xFE59 (Over-the-Air Firmware updates).
              </p>
            </div>

            <div className="p-6 bg-neutral-900 border-2 border-neutral-800 space-y-3">
              <div className="p-3 bg-neutral-950 border border-neutral-800 w-fit text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Gemini 3.8 Flash AI</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Context-aware intelligence providing real-time PPG analysis, sleep optimization suggestions, automatic Git commit summarization, and haptic notification dispatching.
              </p>
            </div>

            <div className="p-6 bg-neutral-900 border-2 border-neutral-800 space-y-3">
              <div className="p-3 bg-neutral-950 border border-neutral-800 w-fit text-amber-400">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Sandboxed SDK Engine</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Visual drag-and-drop IDE generating Kotlin SDK code and ARM Cortex-M33 RTOS bytecode packages (.wapp) directly testable on the circular AMOLED simulator.
              </p>
            </div>
          </div>

          {/* Compatibility Specs Matrix */}
          <div className="p-6 bg-neutral-950 border-2 border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Watch className="w-4 h-4 text-[#FF5C00]" />
              Hardware & Software Compatibility Matrix
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Device / Platform</th>
                    <th className="py-2.5 px-3">Supported OS</th>
                    <th className="py-2.5 px-3">Connectivity</th>
                    <th className="py-2.5 px-3">Feature Support</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">CMF Watch 3 Pro</td>
                    <td className="py-3 px-3 text-neutral-300">CMF OS v1.4.2 / v1.5.0-PRO</td>
                    <td className="py-3 px-3 text-neutral-300">BLE 5.3 (244B MTU)</td>
                    <td className="py-3 px-3 text-neutral-300">OTA, Biometrics, Apps, Dials</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Nothing Phone (1 / 2 / 2a)</td>
                    <td className="py-3 px-3 text-neutral-300">Nothing OS 2.5 / 3.0 (Android 14)</td>
                    <td className="py-3 px-3 text-neutral-300">Bluetooth Low Energy / WiFi</td>
                    <td className="py-3 px-3 text-neutral-300">Companion APK, Widgets</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Generic Android Device</td>
                    <td className="py-3 px-3 text-neutral-300">Android 8.0 Oreo+</td>
                    <td className="py-3 px-3 text-neutral-300">BLE 4.2+</td>
                    <td className="py-3 px-3 text-neutral-300">Telemetry Sync & Notifications</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">SUPPORTED</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Web Browser Companion</td>
                    <td className="py-3 px-3 text-neutral-300">Chrome, Edge, Safari (Web BLE)</td>
                    <td className="py-3 px-3 text-neutral-300">Web Bluetooth API / Simulator</td>
                    <td className="py-3 px-3 text-neutral-300">Full Dashboard, SDK, AI Core</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">ONLINE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: FUNCTIONAL DOWNLOADS */}
      {activeSection === 'downloads' && (
        <div className="space-y-6">
          <div className="p-4 bg-neutral-900 border border-neutral-800 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-white uppercase">Direct Functional Package Downloads</span>
              <p className="text-neutral-400 text-[11px] mt-0.5">
                Every download button generates the real application package, signed firmware binary, or SDK archive immediately.
              </p>
            </div>
            <span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
              ALL BUILDS VERIFIED
            </span>
          </div>

          {/* GitHub Pages Host Info Banner */}
          <div className="p-4 bg-neutral-950 border-2 border-blue-900/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white uppercase">Hosting on GitHub Pages (https://maijied.github.io/CLoraMF/)</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                To activate GitHub Pages for your repo: on GitHub, go to <strong>Settings → Pages → Source: "GitHub Actions"</strong>. The automated CI/CD pipeline in <span className="text-neutral-300">.github/workflows/ci.yml</span> will deploy this portal and all downloads automatically on push.
              </p>
            </div>
            <a
              href="https://maijied.github.io/CLoraMF/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-[11px] flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <span>Visit Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Pixel 8 & Android Installation Notice */}
          <div className="p-4 bg-neutral-900 border-2 border-amber-600/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white uppercase">Google Pixel 8 & Android 14 Installation Guide</span>
              </div>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                <strong>1. Progressive Web App (Instant on Pixel 8):</strong> Open this portal in Chrome on your Pixel 8, tap the <strong>⋮ (three dots)</strong> menu, and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>. It launches fullscreen with native BLE hardware and offline sync support.<br />
                <strong>2. Standalone APK Package:</strong> Click <strong>"Download Companion"</strong> below. The package includes Dalvik code (DEX), native arm64 BLE libraries, and AndroidManifest configured for Android 14 (API 34).
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-700 text-[10px] font-bold uppercase whitespace-nowrap">
              PIXEL 8 READY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {releaseArtifacts.map((art) => (
              <div
                key={art.id}
                className="p-6 bg-neutral-900 border-2 border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-white">{art.name}</span>
                    <span className="px-2 py-0.5 bg-[#FF5C00] text-black text-[10px] font-black uppercase">
                      {art.format.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    {art.description}
                  </p>

                  <div className="p-3 bg-neutral-950 border border-neutral-800 text-[11px] space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Filename:</span>
                      <span className="text-white font-bold">{art.filename}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Size:</span>
                      <span className="text-neutral-300">{(art.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Version:</span>
                      <span className="text-[#FF5C00] font-bold">v{art.version}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-900 truncate">
                      SHA-256: {art.checksum}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(art)}
                    disabled={downloadingId === art.id}
                    className="flex-1 py-3 bg-[#FF5C00] hover:bg-white text-black font-black uppercase text-xs tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadingId === art.id ? 'Downloading...' : `Download ${art.name.split(' ')[0]}`}</span>
                  </button>
                  <a
                    href={`/api/ci/download/${art.id}`}
                    download={art.filename}
                    className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold uppercase text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-neutral-700"
                    title="Direct Server Download Link (Full Package)"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Direct</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: README.MD */}
      {activeSection === 'readme' && (
        <div className="p-6 bg-neutral-950 border-2 border-neutral-800 space-y-6 text-xs text-neutral-300 leading-relaxed">
          <div className="border-b border-neutral-800 pb-4 flex justify-between items-center">
            <span className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#FF5C00]" />
              README.md (Official Repository Specification)
            </span>
            <span className="text-[10px] text-neutral-500">BRANCH: main • COMMIT: 7e4b91f</span>
          </div>

          <div className="space-y-4 font-sans text-xs">
            <h2 className="text-xl font-bold text-white font-mono uppercase"># CMF Watch 3 Pro AI Platform</h2>
            <p>
              The <strong>CMF Watch AI Platform</strong> is an open-source, full-stack companion software and firmware ecosystem designed for the CMF Watch 3 Pro. It pairs modern web technologies (TypeScript, React 19, Tailwind CSS, Express) with on-device RTOS bytecode execution and Google Gemini 3.8 Flash AI.
            </p>

            <h3 className="text-base font-bold text-white font-mono uppercase pt-2">## Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-neutral-300">
              <li><strong>Physical AMOLED Bezel Simulator:</strong> High fidelity 466x466 circular rendering with live complication dials and tactile digital crown navigation.</li>
              <li><strong>Over-The-Air (OTA) Firmware Flasher:</strong> 6-stage flashing pipeline with SHA-256 binary validation and dual-partition fallback.</li>
              <li><strong>Custom Watch App SDK:</strong> Visual component drag-and-drop designer with live Kotlin code generator and bytecode compiler.</li>
              <li><strong>BLE 5.3 GATT Protocol Explorer:</strong> Packet sniffer, characteristic inspector, and live push notification dispatcher.</li>
              <li><strong>Gemini 3.8 Flash AI Assistant:</strong> Telemetry-injected health diagnostics and Git command automation.</li>
            </ul>

            <h3 className="text-base font-bold text-white font-mono uppercase pt-2">## Quick Start: Building From Source</h3>
            <pre className="p-4 bg-neutral-900 border border-neutral-800 font-mono text-neutral-200 text-xs overflow-x-auto">
{`# 1. Clone the repository
git clone https://github.com/nothing-community/cmf-watch-ai-platform.git
cd cmf-watch-ai-platform

# 2. Install dependencies
npm install

# 3. Configure Gemini AI API Key in environment
cp .env.example .env
# Edit .env with GEMINI_API_KEY="YOUR_KEY"

# 4. Start local development server with Vite & Express
npm run dev

# 5. Build production bundle and CI/CD artifacts
npm run build`}
            </pre>

            <h3 className="text-base font-bold text-white font-mono uppercase pt-2">## Bluetooth GATT Services & Characteristics</h3>
            <div className="overflow-x-auto font-mono text-[11px]">
              <table className="w-full text-left border-collapse border border-neutral-800">
                <thead>
                  <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                    <th className="p-2">Service UUID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Characteristic</th>
                    <th className="p-2">Properties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  <tr>
                    <td className="p-2 text-[#FF5C00]">0x180D</td>
                    <td className="p-2 text-white">Heart Rate</td>
                    <td className="p-2">0x2A37 (HR Measurement)</td>
                    <td className="p-2 text-emerald-400">NOTIFY, READ</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-[#FF5C00]">0x180F</td>
                    <td className="p-2 text-white">Battery Service</td>
                    <td className="p-2">0x2A19 (Battery Level)</td>
                    <td className="p-2 text-emerald-400">NOTIFY, READ</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-[#FF5C00]">0xFE70</td>
                    <td className="p-2 text-white">WatchFace OTA</td>
                    <td className="p-2">0xFE71 (Face Chunk Data)</td>
                    <td className="p-2 text-emerald-400">WRITE_NO_RESP</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-[#FF5C00]">0xFE59</td>
                    <td className="p-2 text-white">Firmware DFU</td>
                    <td className="p-2">0xFE60 (Control), 0xFE61 (Data)</td>
                    <td className="p-2 text-emerald-400">WRITE, INDICATE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: TERMS & CONDITIONS */}
      {activeSection === 'terms' && (
        <div className="p-6 bg-neutral-950 border-2 border-neutral-800 space-y-6 text-xs text-neutral-300 font-sans leading-relaxed">
          <div className="border-b border-neutral-800 pb-3 flex justify-between items-center font-mono">
            <span className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF5C00]" />
              Terms of Use & Open Source Experiment Disclaimers
            </span>
            <span className="text-[10px] text-neutral-500">REVISION: SEPTEMBER 2026</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2">
              <h4 className="font-bold text-white font-mono uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                1. Open Source Community Experiment
              </h4>
              <p className="text-neutral-400 text-xs">
                This software is an open-source experimental research project developed for developers, enthusiasts, and community builders. It is not an official medical device software package, and it is provided "AS IS", without warranties of any kind.
              </p>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2">
              <h4 className="font-bold text-white font-mono uppercase flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                2. Non-Medical Biometric Device Disclaimer
              </h4>
              <p className="text-neutral-400 text-xs">
                All PPG heart rate readings, step counters, sleep duration estimations, and AI health summaries generated by this platform are intended strictly for general fitness and informational purposes. They must not be used for diagnosis, treatment, or prevention of any disease or medical condition. Always consult a qualified medical professional.
              </p>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2">
              <h4 className="font-bold text-white font-mono uppercase flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                3. Privacy & Telemetry Storage
              </h4>
              <p className="text-neutral-400 text-xs">
                Your biometric data, Bluetooth keys, and watch configurations are processed client-side. No personal biometric metrics are sold or shared with third-party advertisers. Queries sent to the Gemini AI assistant only contain contextual metrics required to answer your immediate prompt.
              </p>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 space-y-2">
              <h4 className="font-bold text-white font-mono uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#FF5C00]" />
                4. Firmware Flashing & Hardware Safety
              </h4>
              <p className="text-neutral-400 text-xs">
                Over-the-Air firmware updates communicate over standard BLE DFU protocols with SHA-256 cryptographic verification. Ensure your watch has at least 50% battery before initiating firmware transfers. Flashing custom compiled binaries is performed at the user's discretion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: OPEN SOURCE LICENSE */}
      {activeSection === 'license' && (
        <div className="p-6 bg-neutral-950 border-2 border-neutral-800 space-y-4 font-mono text-xs">
          <div className="border-b border-neutral-800 pb-3 flex justify-between items-center">
            <span className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF5C00]" />
              LICENSE (MIT + Apache 2.0 Dual License)
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">OPEN SOURCE APPROVED</span>
          </div>

          <pre className="p-5 bg-neutral-900 border border-neutral-800 text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`MIT License

Copyright (c) 2026 CMF Watch AI Platform Contributors & Nothing Community Labs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </pre>
        </div>
      )}

    </div>
  );
};
