import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Layers, 
  Play, 
  Download, 
  Plus, 
  Trash2, 
  Sparkles, 
  Cpu, 
  Box, 
  Sliders, 
  Activity, 
  Flame, 
  Battery, 
  ShieldCheck, 
  FileJson, 
  Smartphone, 
  CheckCircle2,
  Terminal,
  Settings2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { 
  CustomAppPackage, 
  SDKUIComponent, 
  SDKEventHandler, 
  SDKDataProvider, 
  WatchPermission,
  GraphType 
} from '../types';
import { DEFAULT_SDK_PROJECT } from '../mockData';

interface AppSDKStudioProps {
  onTestAppOnWatch: (app: CustomAppPackage) => void;
  onPublishAppToStore: (app: CustomAppPackage) => void;
}

export const AppSDKStudio: React.FC<AppSDKStudioProps> = ({
  onTestAppOnWatch,
  onPublishAppToStore
}) => {
  const [project, setProject] = useState<CustomAppPackage>(DEFAULT_SDK_PROJECT);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'manifest' | 'binary'>('visual');
  const [selectedCompId, setSelectedCompId] = useState<string | null>(project.components[0]?.id || null);

  const selectedComponent = project.components.find(c => c.id === selectedCompId);

  // Add a new UI Component
  const handleAddComponent = (type: 'text' | 'button' | 'graph') => {
    const id = `comp_${type}_${Date.now()}`;
    let newComp: SDKUIComponent;

    if (type === 'text') {
      newComp = {
        type: 'text',
        id,
        text: 'NEW LABEL',
        x: 50,
        y: 50,
        size: 20,
        color: '#FFFFFF',
        font: 'JetBrains Mono'
      };
    } else if (type === 'button') {
      newComp = {
        type: 'button',
        id,
        text: 'TAP ME',
        x: 30,
        y: 70,
        width: 40,
        height: 12,
        onClickAction: 'action_custom_event',
        color: '#000000',
        bgColor: '#FF5C00'
      };
    } else {
      newComp = {
        type: 'graph',
        id,
        dataProvider: 'heart_rate',
        x: 15,
        y: 45,
        width: 70,
        height: 25,
        graphType: 'line',
        color: '#00F0FF'
      };
    }

    setProject(prev => ({
      ...prev,
      components: [...prev.components, newComp]
    }));
    setSelectedCompId(id);
  };

  const handleRemoveComponent = (id: string) => {
    setProject(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== id)
    }));
    if (selectedCompId === id) {
      setSelectedCompId(null);
    }
  };

  const handleUpdateComponentProp = (id: string, updates: Partial<SDKUIComponent>) => {
    setProject(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === id ? { ...c, ...updates } as SDKUIComponent : c)
    }));
  };

  const handleTogglePermission = (perm: WatchPermission) => {
    setProject(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleExportWapp = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.id}.wapp.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    confetti({ particleCount: 50 });
  };

  const handleCompileAndRun = () => {
    onTestAppOnWatch(project);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF5C00', '#00E676', '#FFFFFF']
    });
  };

  // Generated Kotlin SDK Code
  const generatedKotlinCode = `// ${project.name} - Compiled for CMF Watch OS SDK v${project.sdkVersion}
package com.cmf.watch.apps.${project.id.replace(/[^a-zA-Z0-9_]/g, '_')}

import com.cmf.aiwatch.sdk.WatchAppSDK
import com.cmf.aiwatch.sdk.WatchAppSDK.UIComponent
import com.cmf.aiwatch.sdk.WatchAppSDK.EventHandler
import com.cmf.aiwatch.sdk.WatchAppSDK.DataProvider
import java.io.File

class ${project.name.replace(/\s+/g, '')}App {
    fun buildAppPackage(outputDir: File): File {
        val app = WatchAppSDK.WatchAppBuilder("${project.name}")
            .setAppId("${project.id}")
            .setVersion("${project.version}")
            .setAuthor("${project.author}")
            .setDescription("${project.description}")
            .setMinWatchVersion("${project.minWatchVersion}")
            
        // Required Permissions
${project.permissions.map(p => `        app.addPermission(WatchAppSDK.WatchPermission.${p.toUpperCase()})`).join('\n')}

        // UI Components
${project.components.map(c => {
  if (c.type === 'text') {
    return `        app.addUIComponent(UIComponent.Text(
            id = "${c.id}",
            text = "${c.text}",
            x = ${c.x}f,
            y = ${c.y}f,
            size = ${c.size}f,
            color = "${c.color}",
            font = "${c.font || 'default'}"
        ))`;
  }
  if (c.type === 'button') {
    return `        app.addUIComponent(UIComponent.Button(
            id = "${c.id}",
            text = "${c.text}",
            x = ${c.x}f,
            y = ${c.y}f,
            width = ${c.width}f,
            height = ${c.height}f,
            onClick = "${c.onClickAction}"
        ))`;
  }
  if (c.type === 'graph') {
    return `        app.addUIComponent(UIComponent.Graph(
            id = "${c.id}",
            dataProvider = "${c.dataProvider}",
            x = ${c.x}f,
            y = ${c.y}f,
            width = ${c.width}f,
            height = ${c.height}f,
            graphType = UIComponent.Graph.GraphType.${c.graphType.toUpperCase()}
        ))`;
  }
  return '';
}).join('\n')}

        // Data Providers & Event Listeners
${project.dataProviders.map(dp => `        app.addDataProvider(DataProvider.${dp.type === 'heart_rate' ? 'HeartRate' : dp.type === 'steps' ? 'Steps' : 'Battery'})`).join('\n')}

        val targetBinary = File(outputDir, "${project.id}.wapp")
        app.build(targetBinary)
        return targetBinary
    }
}`;

  // Generated Binary Bytecode Preview
  const generatedBinaryBytecode = `CMFWAPP1.0.0
# COMPONENT_TABLE_OFFSET: 0x00000040 (Size: ${project.components.length} nodes)
${project.components.map(c => {
  if (c.type === 'text') return `0x01 [TEXT] ID:${c.id} POS:(${c.x},${c.y}) SIZE:${c.size} COLOR:${c.color} VAL:"${c.text}"`;
  if (c.type === 'button') return `0x02 [BTN] ID:${c.id} RECT:(${c.x},${c.y},${c.width},${c.height}) ACTION:${c.onClickAction}`;
  if (c.type === 'graph') return `0x03 [GRAPH] ID:${c.id} SRC:${c.dataProvider} TYPE:${c.graphType}`;
  return '';
}).join('\n')}
# EVENT_DISPATCH_TABLE: 0x000002A0
${project.events.map(e => `EVT:${e.type} -> ACTION:${e.action.type}`).join('\n')}
# COMPILED_CHECKSUM: 0x8F9C4A21 | TARGET_ARCH: ARM-CORTEX-M33 RTOS`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2 text-white">
            <Code2 className="w-6 h-6 text-[#FF5C00]" />
            Watch App Development Kit (SDK) Studio
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Visual App Builder & Live Bytecode Compiler for CMF Watch 3 Pro RTOS
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCompileAndRun}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF5C00] hover:bg-white text-black text-xs font-black uppercase transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Run on Watch Simulator</span>
          </button>
          <button
            onClick={handleExportWapp}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export .wapp
          </button>
        </div>
      </div>

      {/* Editor Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer ${
            activeTab === 'visual' ? 'bg-[#FF5C00] text-black' : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          Visual Layout Builder
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer ${
            activeTab === 'code' ? 'bg-[#FF5C00] text-black' : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          Generated Kotlin SDK Code
        </button>
        <button
          onClick={() => setActiveTab('manifest')}
          className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer ${
            activeTab === 'manifest' ? 'bg-[#FF5C00] text-black' : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          manifest.json
        </button>
        <button
          onClick={() => setActiveTab('binary')}
          className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer ${
            activeTab === 'binary' ? 'bg-[#FF5C00] text-black' : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          RTOS Binary Bytecode
        </button>
      </div>

      {/* Tab: Visual Layout Studio */}
      {activeTab === 'visual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Component Palette & Tree (Left) */}
          <div className="lg:col-span-4 space-y-4">
            {/* App Metadata */}
            <div className="p-4 bg-neutral-900 border-2 border-neutral-800 space-y-3 font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">App Identity</span>
              <div>
                <label className="text-[10px] text-neutral-500 uppercase">App Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1 text-white font-bold text-xs mt-0.5 outline-none focus:border-[#FF5C00]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase">Package ID</label>
                  <input
                    type="text"
                    value={project.id}
                    onChange={(e) => setProject(p => ({ ...p, id: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1 text-white text-[11px] mt-0.5 outline-none focus:border-[#FF5C00]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase">Version</label>
                  <input
                    type="text"
                    value={project.version}
                    onChange={(e) => setProject(p => ({ ...p, version: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1 text-white text-[11px] mt-0.5 outline-none focus:border-[#FF5C00]"
                  />
                </div>
              </div>
            </div>

            {/* Add New Component Palette */}
            <div className="p-4 bg-neutral-900 border-2 border-neutral-800 space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
                Component Palette
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAddComponent('text')}
                  className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-[#FF5C00] text-center text-xs font-mono font-bold text-white transition-all flex flex-col items-center gap-1 cursor-pointer"
                >
                  <span className="text-[#FF5C00] text-sm font-black">T</span>
                  <span>+ Text</span>
                </button>
                <button
                  onClick={() => handleAddComponent('button')}
                  className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-[#FF5C00] text-center text-xs font-mono font-bold text-white transition-all flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Box className="w-4 h-4 text-[#FF5C00]" />
                  <span>+ Button</span>
                </button>
                <button
                  onClick={() => handleAddComponent('graph')}
                  className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-[#FF5C00] text-center text-xs font-mono font-bold text-white transition-all flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>+ Graph</span>
                </button>
              </div>
            </div>

            {/* UI Component Hierarchy Tree */}
            <div className="p-4 bg-neutral-900 border-2 border-neutral-800 space-y-2">
              <div className="flex justify-between items-center font-mono">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  UI Hierarchy ({project.components.length})
                </span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {project.components.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    className={`p-2.5 border transition-all flex items-center justify-between font-mono text-xs cursor-pointer ${
                      selectedCompId === comp.id
                        ? 'border-[#FF5C00] bg-neutral-950 text-white'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#FF5C00] font-bold uppercase text-[10px]">[{comp.type}]</span>
                      <span className="truncate">{comp.id}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveComponent(comp.id);
                      }}
                      className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Permissions Selector */}
            <div className="p-4 bg-neutral-900 border-2 border-neutral-800 space-y-2 font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Hardware Permissions
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {(['heart_rate', 'steps', 'battery', 'notifications', 'bluetooth', 'storage', 'network'] as WatchPermission[]).map((perm) => {
                  const isGranted = project.permissions.includes(perm);
                  return (
                    <button
                      key={perm}
                      onClick={() => handleTogglePermission(perm)}
                      className={`p-2 border text-left flex items-center justify-between cursor-pointer transition-colors ${
                        isGranted ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300' : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <span className="uppercase text-[10px]">{perm.replace('_', ' ')}</span>
                      {isGranted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Component Property Inspector (Right) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedComponent ? (
              <div className="p-6 bg-neutral-900 border-2 border-neutral-800 space-y-6 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-[10px] text-[#FF5C00] uppercase font-bold">Inspecting Component</span>
                    <h3 className="text-lg font-bold text-white uppercase">{selectedComponent.id}</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase">
                    Type: {selectedComponent.type}
                  </span>
                </div>

                {/* Specific Inspector Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedComponent.type === 'text' && (
                    <>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-neutral-400 uppercase">Display Text</label>
                        <input
                          type="text"
                          value={selectedComponent.text}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { text: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-bold mt-1 outline-none focus:border-[#FF5C00]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Text Color Hex</label>
                        <input
                          type="text"
                          value={selectedComponent.color}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { color: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Font Size (px)</label>
                        <input
                          type="number"
                          value={selectedComponent.size}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { size: Number(e.target.value) })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Dynamic Telemetry Binding</label>
                        <select
                          value={selectedComponent.bindingKey || 'none'}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { 
                            isDynamic: e.target.value !== 'none',
                            bindingKey: e.target.value === 'none' ? undefined : e.target.value 
                          })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        >
                          <option value="none">None (Static Text)</option>
                          <option value="heart_rate">Live Heart Rate (BPM)</option>
                          <option value="steps">Live Steps Count</option>
                          <option value="battery">Live Battery (%)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Typography Font</label>
                        <select
                          value={selectedComponent.font || 'JetBrains Mono'}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { font: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        >
                          <option value="JetBrains Mono">JetBrains Mono</option>
                          <option value="Silkscreen">Silkscreen (Dot Matrix)</option>
                          <option value="Space Grotesk">Space Grotesk</option>
                        </select>
                      </div>
                    </>
                  )}

                  {selectedComponent.type === 'button' && (
                    <>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Button Label</label>
                        <input
                          type="text"
                          value={selectedComponent.text}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { text: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">On-Click Action Handler</label>
                        <input
                          type="text"
                          value={selectedComponent.onClickAction}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { onClickAction: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Background Color</label>
                        <input
                          type="text"
                          value={selectedComponent.bgColor || '#FF5C00'}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { bgColor: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Text Color</label>
                        <input
                          type="text"
                          value={selectedComponent.color || '#000000'}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { color: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        />
                      </div>
                    </>
                  )}

                  {selectedComponent.type === 'graph' && (
                    <>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Data Stream Provider</label>
                        <select
                          value={selectedComponent.dataProvider}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { dataProvider: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        >
                          <option value="heart_rate">PPG Heart Rate Stream</option>
                          <option value="steps">Step Activity Cadence</option>
                          <option value="battery">Battery Voltage Discharge</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Graph Visualization Style</label>
                        <select
                          value={selectedComponent.graphType}
                          onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { graphType: e.target.value as GraphType })}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                        >
                          <option value="line">Line Waveform</option>
                          <option value="bar">Bar Spectrum</option>
                          <option value="area">Filled Area Chart</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {/* Spatial Coordinates */}
                <div className="pt-4 border-t border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-2">
                    Spatial Anchors on 466×466 Circular Viewport
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-neutral-500 uppercase">X Position ({selectedComponent.x}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedComponent.x}
                        onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { x: Number(e.target.value) })}
                        className="w-full accent-[#FF5C00] mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-500 uppercase">Y Position ({selectedComponent.y}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedComponent.y}
                        onChange={(e) => handleUpdateComponentProp(selectedComponent.id, { y: Number(e.target.value) })}
                        className="w-full accent-[#FF5C00] mt-1"
                      />
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 bg-neutral-900 border-2 border-neutral-800 text-center font-mono">
                <Box className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-400 uppercase font-bold">No Component Selected</p>
                <p className="text-[11px] text-neutral-500 mt-1">Select a component from the hierarchy or click one of the palette buttons.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab: Generated Kotlin SDK Code */}
      {activeTab === 'code' && (
        <div className="p-6 bg-neutral-950 border-2 border-neutral-800 space-y-4 font-mono">
          <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-neutral-800 pb-3">
            <span className="text-[#FF5C00] font-bold uppercase">Generated Android / Kotlin App Template</span>
            <span>Ready for compilation with JGit & Gradle</span>
          </div>
          <pre className="text-xs text-emerald-400 bg-neutral-900/60 p-4 border border-neutral-800 overflow-x-auto leading-relaxed">
            {generatedKotlinCode}
          </pre>
        </div>
      )}

      {/* Tab: manifest.json */}
      {activeTab === 'manifest' && (
        <div className="p-6 bg-neutral-950 border-2 border-neutral-800 space-y-4 font-mono">
          <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-neutral-800 pb-3">
            <span className="text-[#FF5C00] font-bold uppercase">Watch App Manifest Specification</span>
            <span>SDK Version: {project.sdkVersion}</span>
          </div>
          <pre className="text-xs text-sky-400 bg-neutral-900/60 p-4 border border-neutral-800 overflow-x-auto leading-relaxed">
            {JSON.stringify(project, null, 2)}
          </pre>
        </div>
      )}

      {/* Tab: Binary Bytecode */}
      {activeTab === 'binary' && (
        <div className="p-6 bg-neutral-950 border-2 border-neutral-800 space-y-4 font-mono">
          <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-neutral-800 pb-3">
            <span className="text-[#FF5C00] font-bold uppercase">ARM Cortex-M33 RTOS Bytecode Assembly</span>
            <span>Target MTU chunk size: 244 bytes</span>
          </div>
          <pre className="text-xs text-amber-400 bg-neutral-900/60 p-4 border border-neutral-800 overflow-x-auto leading-relaxed">
            {generatedBinaryBytecode}
          </pre>
        </div>
      )}
    </div>
  );
};
