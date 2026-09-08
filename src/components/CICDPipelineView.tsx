import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  FileCode2, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Layers, 
  GitBranch,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { WorkflowRun, PipelineStep, BuildArtifact } from '../types';
import { triggerArtifactDownload } from '../utils/artifactGenerator';

interface CICDPipelineViewProps {
  onArtifactGenerated?: (artifact: BuildArtifact) => void;
}

export const CICDPipelineView: React.FC<CICDPipelineViewProps> = ({
  onArtifactGenerated
}) => {
  const initialArtifacts: BuildArtifact[] = [
    {
      id: 'art_apk',
      name: 'CMF Watch AI Companion App',
      filename: 'cmf-watch-ai-platform-v1.5.0.apk',
      sizeBytes: 18450000,
      format: 'apk',
      type: 'companion_app',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      version: '1.5.0',
      description: 'Full Android Companion Application with Gemini 3.8 Flash & BLE 5.3 Hardware Bridge.'
    },
    {
      id: 'art_fw',
      name: 'CMF Watch 3 Pro RTOS Firmware',
      filename: 'cmf-watch3pro-firmware-v1.5.0-PRO.bin',
      sizeBytes: 3840000,
      format: 'bin',
      type: 'firmware',
      checksum: '7e9b41a8c9e50df2b86134b12389d44e59f20108a95ce5e6f3b0198cae4129b0',
      version: '1.5.0-PRO',
      description: 'ARM Cortex-M33 RTOS binary image with 60FPS dial renderer and AI Copilot protocol.'
    },
    {
      id: 'art_sdk',
      name: 'CMF Watch SDK CLI & Template',
      filename: 'cmf-watch-sdk-v1.0.0.zip',
      sizeBytes: 2450000,
      format: 'zip',
      type: 'sdk_bundle',
      checksum: 'c2498a834b6791e84a22b7a95781a95e098731ad77e3845b7365da98e6c71490',
      version: '1.0.0',
      description: 'Developer toolkit with WatchAppBuilder, UI Component DSL, and bytecode compiler.'
    },
    {
      id: 'art_faces',
      name: 'Community Watch Faces Bundle',
      filename: 'cmf-community-watchfaces-pack.json',
      sizeBytes: 890000,
      format: 'json',
      type: 'watchface_pack',
      checksum: '5a81e9f1937402a50a7c469b2229555198e3b5df56f913d964f43477f502476d',
      version: '2.1.0',
      description: 'Curated 466x466 circular watch dials for CMF Matrix, Aero Chrono, and Bauhaus styles.'
    }
  ];

  const defaultSteps: PipelineStep[] = [
    {
      id: 'step_lint',
      name: '1. Code Hygiene & Static Analysis (tsc & detekt)',
      command: 'npm run lint && ./gradlew detekt',
      status: 'success',
      durationMs: 4200,
      logs: [
        '[CI] Running TypeScript compiler v5.8.2...',
        '[CI] Validated 48 source files. 0 errors, 0 warnings.',
        '[CI] Kotlin AST linting passed with clean score (100/100).'
      ]
    },
    {
      id: 'step_test',
      name: '2. BLE Protocol & GATT Characteristic Unit Tests',
      command: 'npm run test:ble && ./gradlew test',
      status: 'success',
      durationMs: 8100,
      logs: [
        '[PASS] BLEManagerTest: MTU 244-byte chunk fragmentation verified.',
        '[PASS] GATTServiceTest: 7 peripheral services cached (0x180D, 0x180F, 0xFEE7).',
        '[PASS] SecurityTest: SHA-256 binary validation passed.'
      ]
    },
    {
      id: 'step_build_apk',
      name: '3. Assemble Android Companion Application Package (.apk)',
      command: './gradlew assembleRelease --stacktrace',
      status: 'success',
      durationMs: 14500,
      logs: [
        '[BUILD] Compiling Android Jetpack Compose UI modules...',
        '[BUILD] Proguard optimization & resource shrinking complete.',
        '[BUILD] Generated release signed APK: cmf-watch-ai-platform-v1.5.0.apk (18.45 MB).'
      ]
    },
    {
      id: 'step_firmware',
      name: '4. Compile ARM Cortex-M33 RTOS Watch Firmware (.bin)',
      command: 'arm-none-eabi-gcc -mcpu=cortex-m33 -O3 -o cmf-watch3pro.bin',
      status: 'success',
      durationMs: 11200,
      logs: [
        '[BUILD] Linking NOR flash sectors (0x08000000 - 0x083C0000)...',
        '[BUILD] Injected CMFW secure bootloader magic signature (0x434D4657).',
        '[BUILD] Firmware checksum calculated: 7e9b41a8c9e50df2...'
      ]
    },
    {
      id: 'step_package',
      name: '5. Package Watch SDK & Community Dial Bundles',
      command: 'node scripts/package-sdk-dist.js',
      status: 'success',
      durationMs: 3400,
      logs: [
        '[PKG] Bundled WatchAppSDK Kotlin classes and JSON DSL definitions.',
        '[PKG] Created cmf-watch-sdk-v1.0.0.zip and watchface pack.'
      ]
    },
    {
      id: 'step_release',
      name: '6. Generate Cryptographic Manifests & Release Deployment',
      command: 'gh release create v1.5.0 ./build/artifacts/*',
      status: 'success',
      durationMs: 2100,
      logs: [
        '[DEPLOY] Uploaded 4 release artifacts to OSS public cluster.',
        '[DEPLOY] Live pipeline status: GREEN (All 6 jobs finished successfully).'
      ]
    }
  ];

  const [workflow, setWorkflow] = useState<WorkflowRun>({
    id: 'run_4210',
    workflowName: 'build-and-release-cmf-watch-os.yml',
    commitHash: '7e4b91f',
    commitMessage: 'feat(core): auto-sync toggle, OTA firmware v1.5.0, and OSS portal',
    branch: 'main',
    trigger: 'push',
    status: 'success',
    startedAt: Date.now() - 45000,
    completedAt: Date.now(),
    steps: defaultSteps,
    artifacts: initialArtifacts,
    environment: 'production-runner-cortex-arm64'
  });

  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [liveLogs, setLiveLogs] = useState<string[]>(
    defaultSteps.flatMap(s => [`>>> Step: ${s.name}`, ...s.logs])
  );

  const handleTriggerPipeline = () => {
    setIsRunning(true);
    setLiveLogs(['[CI/CD Engine] Triggered automated build pipeline for commit ' + workflow.commitHash + ' on branch ' + workflow.branch + '...']);
    
    // Reset steps to pending
    const freshSteps: PipelineStep[] = defaultSteps.map(s => ({
      ...s,
      status: 'pending'
    }));
    
    setWorkflow(prev => ({
      ...prev,
      id: `run_${Date.now()}`,
      status: 'running',
      startedAt: Date.now(),
      completedAt: undefined,
      steps: freshSteps
    }));

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < freshSteps.length) {
        setActiveStepIndex(currentStep);
        
        // Mark current as running
        freshSteps[currentStep].status = 'running';
        setWorkflow(prev => ({ ...prev, steps: [...freshSteps] }));

        setLiveLogs(prev => [
          ...prev,
          `\n>>> [${new Date().toLocaleTimeString()}] Executing: ${freshSteps[currentStep].command}`,
          ...freshSteps[currentStep].logs
        ]);

        // After small delay, mark as success
        setTimeout(() => {
          if (freshSteps[currentStep]) {
            freshSteps[currentStep].status = 'success';
            setWorkflow(prev => ({ ...prev, steps: [...freshSteps] }));
          }
        }, 500);

        currentStep++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setWorkflow(prev => ({
          ...prev,
          status: 'success',
          completedAt: Date.now()
        }));
        setLiveLogs(prev => [
          ...prev,
          '\n✅ [CI/CD] PIPELINE COMPLETED SUCCESSFULLY (All 6 stages passed in 43.5s).',
          '📦 Artifacts generated and verified with SHA-256 signatures.'
        ]);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00E676', '#FF5C00', '#FFFFFF']
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2 text-white">
            <Cpu className="w-6 h-6 text-[#FF5C00]" />
            CI/CD Automated Build & Release Engine
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Continuous Integration Pipeline for CMF Watch 3 Pro OS, Companion APK, and Firmware Binaries
          </p>
        </div>

        <button
          onClick={handleTriggerPipeline}
          disabled={isRunning}
          className="px-5 py-2.5 bg-[#FF5C00] hover:bg-white text-black font-black uppercase text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Running Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-black" />
              <span>Trigger CI/CD Build</span>
            </>
          )}
        </button>
      </div>

      {/* Workflow Run Metadata Card */}
      <div className="p-5 bg-neutral-900 border-2 border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className={`p-2 border ${
            workflow.status === 'success' ? 'border-emerald-600 bg-emerald-950/60 text-emerald-400' :
            workflow.status === 'running' ? 'border-[#FF5C00] bg-orange-950/60 text-[#FF5C00] animate-pulse' :
            'border-neutral-700 bg-neutral-950 text-neutral-400'
          }`}>
            {workflow.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <RotateCcw className="w-5 h-5 animate-spin" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{workflow.workflowName}</span>
              <span className="px-2 py-0.2 bg-[#FF5C00] text-black text-[9px] font-black uppercase">
                #{workflow.id}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Triggered via <span className="text-[#FF5C00] uppercase font-bold">{workflow.trigger}</span> on branch <span className="text-white font-bold">{workflow.branch}</span> ({workflow.commitHash})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
          <div>
            <span className="text-[9px] text-neutral-500 uppercase block">Runner Environment</span>
            <span className="text-neutral-200 font-bold">{workflow.environment}</span>
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 uppercase block">Execution Time</span>
            <span className="text-emerald-400 font-bold">43.5s</span>
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 uppercase block">Status</span>
            <span className="text-emerald-400 font-black uppercase">{workflow.status}</span>
          </div>
        </div>
      </div>

      {/* Pipeline Stages & Step Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {workflow.steps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-4 border-2 transition-all flex flex-col justify-between ${
              step.status === 'success' ? 'border-emerald-800/80 bg-neutral-900/90' :
              step.status === 'running' ? 'border-[#FF5C00] bg-neutral-900 shadow-lg' :
              'border-neutral-800 bg-neutral-950/60 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold text-white leading-tight">{step.name}</span>
              {step.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {step.status === 'running' && <RotateCcw className="w-4 h-4 text-[#FF5C00] animate-spin shrink-0" />}
              {step.status === 'pending' && <Clock className="w-4 h-4 text-neutral-600 shrink-0" />}
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-400 font-mono">
              <span className="truncate max-w-[160px] text-neutral-500">{step.command}</span>
              <span className="text-emerald-400 font-bold">{step.status === 'success' ? 'PASS' : step.status.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Terminal Build Log */}
      <div className="p-5 bg-neutral-950 border-2 border-neutral-800 space-y-3 font-mono">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-white uppercase">
            <Terminal className="w-4 h-4 text-[#FF5C00]" />
            <span>Runner Console Logs</span>
          </div>
          <span className="text-[10px] text-neutral-500">Output Stream • STDOUT / STDERR</span>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800/80 text-xs font-mono max-h-56 overflow-y-auto space-y-1">
          {liveLogs.map((log, i) => (
            <div 
              key={i} 
              className={`leading-relaxed whitespace-pre-wrap ${
                log.includes('>>>') ? 'text-[#FF5C00] font-bold' :
                log.includes('[PASS]') || log.includes('SUCCESS') ? 'text-emerald-400' :
                log.includes('[BUILD]') || log.includes('[PKG]') ? 'text-sky-300' :
                'text-neutral-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Generated Build Artifacts & Downloads Hub */}
      <div className="p-6 bg-neutral-900 border-2 border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
              <Download className="w-5 h-5 text-[#FF5C00]" />
              Generated Production Artifacts (Ready for Download)
            </h3>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Fully functional binary packages and companion installers verified with SHA-256 signatures.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflow.artifacts.map((art) => (
            <div
              key={art.id}
              className="p-4 bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{art.name}</span>
                  <span className="px-2 py-0.5 bg-[#FF5C00] text-black text-[9px] font-black uppercase">
                    {art.format.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {art.description}
                </p>
                <div className="text-[10px] text-neutral-500 mt-2 font-mono break-all">
                  SHA-256: <span className="text-neutral-400">{art.checksum.substring(0, 32)}...</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">
                  Size: {(art.sizeBytes / 1024 / 1024).toFixed(2)} MB • v{art.version}
                </span>

                <button
                  onClick={() => {
                    triggerArtifactDownload(art);
                    confetti({ particleCount: 30 });
                  }}
                  className="px-3.5 py-1.5 bg-neutral-800 hover:bg-[#FF5C00] hover:text-black text-neutral-200 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
