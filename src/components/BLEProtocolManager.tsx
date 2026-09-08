import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bluetooth, 
  Wifi, 
  Send, 
  RefreshCw, 
  Bell, 
  Terminal, 
  Activity, 
  Battery, 
  Footprints, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { WatchStatus, WatchNotificationPayload, BLEPacketLog } from '../types';

interface BLEProtocolManagerProps {
  watchStatus: WatchStatus;
  onUpdateWatchStatus: (updates: Partial<WatchStatus>) => void;
  onSendNotification: (notif: WatchNotificationPayload) => void;
}

export const BLEProtocolManager: React.FC<BLEProtocolManagerProps> = ({
  watchStatus,
  onUpdateWatchStatus,
  onSendNotification
}) => {
  const [notifTitle, setNotifTitle] = useState('GitHub Action');
  const [notifMessage, setNotifMessage] = useState('CI Build #42 succeeded on branch main.');
  const [packetLogs, setPacketLogs] = useState<BLEPacketLog[]>([
    {
      id: 'pkt_1',
      direction: 'RX',
      serviceKey: '0x180D (Heart Rate)',
      characteristicKey: '0x2A37 (HR Measurement)',
      dataHex: '0x16 0x4A 0x03 0xE8',
      decoded: 'HR: 74 BPM | Flags: 0x16 (Contact Detected)',
      timestamp: '11:42:04.102'
    },
    {
      id: 'pkt_2',
      direction: 'RX',
      serviceKey: '0x180F (Battery)',
      characteristicKey: '0x2A19 (Battery Level)',
      dataHex: '0x54',
      decoded: 'Level: 84% (SOC OK)',
      timestamp: '11:42:05.319'
    },
    {
      id: 'pkt_3',
      direction: 'TX',
      serviceKey: '0xFEE7 (Watch Sync)',
      characteristicKey: '0xFEE8 (Data Comm)',
      dataHex: '0x01 0x04 0x7E 0x9B 0x00 0x00',
      decoded: 'CMD: TIME_SYNC_ACK | Epoch: 1725792125',
      timestamp: '11:42:06.014'
    }
  ]);

  // Periodic Telemetry Simulator
  useEffect(() => {
    if (!watchStatus.connected) return;

    const interval = setInterval(() => {
      // Small natural drift in heart rate
      const hrDelta = Math.floor(Math.random() * 5) - 2;
      const newHr = Math.max(55, Math.min(160, watchStatus.heartRateCurrent + hrDelta));
      const newSteps = watchStatus.stepsCurrent + Math.floor(Math.random() * 4);

      onUpdateWatchStatus({
        heartRateCurrent: newHr,
        stepsCurrent: newSteps,
        lastSync: new Date().toLocaleTimeString()
      });

      // Append random telemetry packet
      if (Math.random() > 0.6) {
        const newLog: BLEPacketLog = {
          id: `pkt_${Date.now()}`,
          direction: 'RX',
          serviceKey: '0x180D (Heart Rate)',
          characteristicKey: '0x2A37 (HR Measurement)',
          dataHex: `0x16 0x${newHr.toString(16).toUpperCase()} 0x03 0xE8`,
          decoded: `HR: ${newHr} BPM | Sensor Status: NOMINAL`,
          timestamp: new Date().toLocaleTimeString() + '.' + Math.floor(Math.random() * 900 + 100)
        };
        setPacketLogs(prev => [newLog, ...prev.slice(0, 24)]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [watchStatus.connected, watchStatus.heartRateCurrent, watchStatus.stepsCurrent]);

  const handlePushTestNotification = () => {
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    const payload: WatchNotificationPayload = {
      id: `notif_${Date.now()}`,
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      timestamp: Date.now(),
      appId: 'com.cmf.dashboard'
    };

    onSendNotification(payload);

    // Add TX Packet Log
    const txLog: BLEPacketLog = {
      id: `pkt_${Date.now()}`,
      direction: 'TX',
      serviceKey: '0xFE90 (Notification)',
      characteristicKey: '0xFE91 (Push Notify)',
      dataHex: `0x02 0x${payload.title.length.toString(16)} ${payload.title.substring(0, 4).split('').map(c => '0x' + c.charCodeAt(0).toString(16)).join(' ')}...`,
      decoded: `PUSH: "${payload.title}" -> "${payload.message.substring(0, 20)}..."`,
      timestamp: new Date().toLocaleTimeString() + '.042'
    };
    setPacketLogs(prev => [txLog, ...prev.slice(0, 24)]);
  };

  const handleToggleConnection = () => {
    onUpdateWatchStatus({
      connected: !watchStatus.connected,
      lastSync: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2 text-white">
            <Radio className="w-6 h-6 text-[#FF5C00]" />
            BLE 5.3 Protocol & GATT Hardware Bridge
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Low Energy Peripheral Manager • MTU Packet Queuing & Service Characteristics
          </p>
        </div>

        <button
          onClick={handleToggleConnection}
          className={`px-4 py-2 text-xs font-black font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md ${
            watchStatus.connected
              ? 'bg-neutral-900 border border-emerald-500 text-emerald-400 hover:bg-neutral-800'
              : 'bg-[#FF5C00] hover:bg-white text-black'
          }`}
        >
          <Bluetooth className="w-4 h-4" />
          <span>{watchStatus.connected ? 'DISCONNECT BLE' : 'CONNECT WATCH 3 PRO'}</span>
        </button>
      </div>

      {/* Hardware Link Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
          <span className="text-[10px] text-neutral-500 uppercase font-bold">Link State</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${watchStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="text-sm font-bold text-white uppercase">
              {watchStatus.connected ? 'CONNECTED (GATT)' : 'STANDBY'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
          <span className="text-[10px] text-neutral-500 uppercase font-bold">MAC Address</span>
          <div className="text-xs font-bold text-[#FF5C00] mt-1">{watchStatus.bluetoothAddress}</div>
        </div>

        <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
          <span className="text-[10px] text-neutral-500 uppercase font-bold">Signal RSSI</span>
          <div className="text-xs font-bold text-emerald-400 mt-1">{watchStatus.bleRssi} dBm (Excellent)</div>
        </div>

        <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
          <span className="text-[10px] text-neutral-500 uppercase font-bold">Negotiated MTU</span>
          <div className="text-xs font-bold text-white mt-1">247 Bytes (244 Payload)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GATT Services Explorer & Live Controls (Left) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* GATT Services Map */}
          <div className="p-5 bg-neutral-900 border-2 border-neutral-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF5C00]" />
                Active GATT Services & UUIDs
              </span>
              <span className="text-[10px] text-emerald-400">7 SERVICES CACHED</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 bg-neutral-950 border border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-neutral-200">0x180D (Heart Rate Service)</span>
                  <p className="text-[10px] text-neutral-500">Char: 0x2A37 [NOTIFY | READ]</p>
                </div>
                <span className="text-emerald-400 font-bold">STREAMING</span>
              </div>

              <div className="p-2 bg-neutral-950 border border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-neutral-200">0x180F (Battery Service)</span>
                  <p className="text-[10px] text-neutral-500">Char: 0x2A19 [NOTIFY | READ]</p>
                </div>
                <span className="text-emerald-400 font-bold">{watchStatus.battery}%</span>
              </div>

              <div className="p-2 bg-neutral-950 border border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-neutral-200">0xFE70 (WatchFace OTA Service)</span>
                  <p className="text-[10px] text-neutral-500">Char: 0xFE71 [WRITE_NO_RESP]</p>
                </div>
                <span className="text-neutral-400">READY</span>
              </div>

              <div className="p-2 bg-neutral-950 border border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-neutral-200">0xFE59 (Firmware DFU Service)</span>
                  <p className="text-[10px] text-neutral-500">Char: 0xFE60, 0xFE61 [WRITE | INDICATE]</p>
                </div>
                <span className="text-neutral-400">READY</span>
              </div>

              <div className="p-2 bg-neutral-950 border border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-neutral-200">0xFE90 (Notification Dispatcher)</span>
                  <p className="text-[10px] text-neutral-500">Char: 0xFE91 [WRITE]</p>
                </div>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>
            </div>
          </div>

          {/* Test Push Notification Sender */}
          <div className="p-5 bg-neutral-900 border-2 border-neutral-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#FF5C00]" />
                Dispatch Watch Push Notification
              </span>
              <span className="text-[10px] text-neutral-500">HAPTIC MOTOR TRIGGER</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase">Notification Title</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-bold mt-1 outline-none focus:border-[#FF5C00]"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase">Message Body</label>
                <input
                  type="text"
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-white mt-1 outline-none focus:border-[#FF5C00]"
                />
              </div>

              <button
                onClick={handlePushTestNotification}
                disabled={!watchStatus.connected}
                className="w-full py-2.5 bg-[#FF5C00] hover:bg-white text-black font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Watch Screen</span>
              </button>
            </div>
          </div>

        </div>

        {/* Live Packet Sniffer / Hex Log (Right) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-neutral-950 border-2 border-neutral-800 space-y-3 font-mono">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <Terminal className="w-4 h-4 text-[#FF5C00]" />
                <span>Live BLE Packet Sniffer (TX / RX)</span>
              </div>
              <span className="text-[10px] text-neutral-500">{packetLogs.length} Frames captured</span>
            </div>

            {/* Packet Log Feed */}
            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
              {packetLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-neutral-900 border border-neutral-800/80 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 font-black text-[9px] uppercase ${
                        log.direction === 'TX' ? 'bg-[#FF5C00] text-black' : 'bg-emerald-500 text-black'
                      }`}>
                        {log.direction}
                      </span>
                      <span className="text-neutral-300 font-bold">{log.serviceKey}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">{log.timestamp}</span>
                  </div>

                  <div className="text-[10px] text-neutral-400 font-mono">
                    HEX: <span className="text-amber-400">{log.dataHex}</span>
                  </div>
                  <div className="text-[11px] text-neutral-200">
                    {log.decoded}
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
