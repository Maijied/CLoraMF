import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Footprints, 
  Battery, 
  Clock, 
  Bluetooth, 
  Zap, 
  Bell, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import type { WatchFace, WatchStatus, CustomAppPackage, WatchNotificationPayload } from '../types';

interface WatchDevicePreviewProps {
  watchStatus: WatchStatus;
  activeFace?: WatchFace;
  runningApp?: CustomAppPackage | null;
  notification?: WatchNotificationPayload | null;
  onDismissNotification?: () => void;
  onCrownClick?: () => void;
}

export const WatchDevicePreview: React.FC<WatchDevicePreviewProps> = ({
  watchStatus,
  activeFace,
  runningApp,
  notification,
  onDismissNotification,
  onCrownClick
}) => {
  const [time, setTime] = useState(new Date());
  const [isAOD, setIsAOD] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();

  const activeTheme = activeFace?.colorThemes.find(t => t.id === activeFace.activeThemeId) || activeFace?.colorThemes[0];
  const primaryColor = activeTheme?.primaryColor || '#FF5C00';
  const bgColor = isAOD ? '#000000' : (activeTheme?.backgroundColor || '#0A0A0C');
  const textColor = activeTheme?.textColor || '#FFFFFF';

  // Calculate analog hand angles
  const secAngle = (time.getSeconds() / 60) * 360;
  const minAngle = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourAngle = (((time.getHours() % 12) + time.getMinutes() / 60) / 12) * 360;

  return (
    <div className="flex flex-col items-center">
      {/* Physical Watch Chassis */}
      <div className="relative p-3 bg-neutral-900 border-4 border-neutral-700 rounded-full shadow-2xl flex items-center justify-center">
        
        {/* Watch Strap Top */}
        <div className="absolute -top-7 w-28 h-7 bg-neutral-800 border-x-2 border-t-2 border-neutral-700 rounded-t-md opacity-80" />
        
        {/* Physical Crown Button (Right) */}
        <button
          onClick={onCrownClick}
          title="Digital Crown (Click to switch app/face)"
          className="absolute -right-3.5 top-1/3 w-3 h-8 bg-neutral-700 hover:bg-[#FF5C00] active:scale-95 border border-neutral-600 rounded-r-md transition-colors cursor-pointer shadow-lg z-20 flex flex-col justify-around py-1 items-center"
        >
          <div className="w-1.5 h-0.5 bg-neutral-900 rounded" />
          <div className="w-1.5 h-0.5 bg-neutral-900 rounded" />
          <div className="w-1.5 h-0.5 bg-neutral-900 rounded" />
        </button>

        {/* Action Button (Bottom Right) */}
        <button
          onClick={() => setIsAOD(prev => !prev)}
          title="Lower Action Button (Toggle AOD)"
          className="absolute -right-2 bottom-1/3 w-2 h-6 bg-neutral-700 hover:bg-neutral-500 active:scale-95 border border-neutral-600 rounded-r-sm transition-colors cursor-pointer z-20"
        />

        {/* Watch Bezel Outer Ring with Dot Markers */}
        <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] rounded-full p-2.5 bg-gradient-to-b from-neutral-800 to-neutral-950 border-2 border-neutral-700 shadow-inner flex items-center justify-center overflow-hidden">
          
          {/* Outer Tick Marks */}
          <div className="absolute inset-1 rounded-full border border-neutral-800/80 pointer-events-none" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
            <div
              key={deg}
              className="absolute w-full h-full pointer-events-none"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <div className={`mx-auto ${deg % 90 === 0 ? 'w-1 h-3 bg-neutral-400' : 'w-0.5 h-1.5 bg-neutral-700'}`} />
            </div>
          ))}

          {/* AMOLED 466x466 Screen Simulation Area */}
          <div 
            className="relative w-full h-full rounded-full overflow-hidden flex flex-col items-center justify-center select-none shadow-2xl transition-colors duration-500"
            style={{ backgroundColor: bgColor }}
          >
            {/* Ambient subtle noise/matrix grid */}
            {!isAOD && (
              <div className="absolute inset-0 bg-dot-matrix opacity-20 pointer-events-none" />
            )}

            {/* If a Custom SDK App is Running */}
            {runningApp ? (
              <div className="relative w-full h-full p-6 flex flex-col justify-between items-center text-center">
                {/* App Status Bar */}
                <div className="w-full flex justify-between items-center text-[10px] text-neutral-400 font-mono pt-2 px-6">
                  <span>{hours}:{minutes}</span>
                  <span className="text-[#FF5C00] font-bold uppercase">{runningApp.name}</span>
                  <div className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-[#FF5C00]" />
                    <span>{watchStatus.battery}%</span>
                  </div>
                </div>

                {/* Render Custom SDK App Components */}
                <div className="relative w-full flex-1 flex flex-col items-center justify-center gap-2 my-auto">
                  {runningApp.components.map((comp) => {
                    if (comp.type === 'text') {
                      return (
                        <div 
                          key={comp.id}
                          className="font-bold tracking-tight text-center"
                          style={{
                            color: comp.color || '#FFFFFF',
                            fontSize: `${comp.size * 0.7}px`,
                            fontFamily: comp.font === 'Silkscreen' ? 'Silkscreen' : 'JetBrains Mono'
                          }}
                        >
                          {comp.isDynamic ? (
                            comp.bindingKey === 'heart_rate' ? `${watchStatus.heartRateCurrent} BPM` :
                            comp.bindingKey === 'steps' ? `${watchStatus.stepsCurrent} STEPS` :
                            comp.text
                          ) : comp.text}
                        </div>
                      );
                    }

                    if (comp.type === 'graph') {
                      return (
                        <div 
                          key={comp.id} 
                          className="w-4/5 h-14 bg-neutral-900/80 border border-neutral-700 p-1 flex items-end justify-between gap-1 my-1"
                        >
                          {[40, 65, 55, 80, 95, 75, 88, 72, 90, 85].map((val, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ height: '20%' }}
                              animate={{ height: `${val}%` }}
                              transition={{ duration: 0.5, delay: idx * 0.05 }}
                              className="flex-1 bg-[#FF5C00] rounded-none opacity-80"
                            />
                          ))}
                        </div>
                      );
                    }

                    if (comp.type === 'button') {
                      return (
                        <button
                          key={comp.id}
                          onClick={() => alert(`[Watch OS] Triggered action: ${comp.onClickAction}`)}
                          className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-md cursor-pointer border border-neutral-950 mt-1"
                          style={{
                            backgroundColor: comp.bgColor || '#FF5C00',
                            color: comp.color || '#000000'
                          }}
                        >
                          {comp.text}
                        </button>
                      );
                    }

                    return null;
                  })}
                </div>

                <div className="text-[9px] text-neutral-500 uppercase tracking-widest pb-3">
                  Press crown to exit app
                </div>
              </div>
            ) : (
              /* Watch Face Display */
              <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
                {/* Watch Style: Analog Hands */}
                {(activeFace?.style === 'analog' || activeFace?.style === 'hybrid') && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Dial Center Pin */}
                    <div className="w-3 h-3 rounded-full bg-[#FF5C00] z-20 shadow-md" />
                    
                    {/* Hour Hand */}
                    <div 
                      className="absolute w-1.5 h-16 bg-neutral-100 rounded-sm origin-bottom z-10 shadow-sm"
                      style={{ transform: `translateY(-50%) rotate(${hourAngle}deg)` }}
                    />
                    {/* Minute Hand */}
                    <div 
                      className="absolute w-1 h-24 bg-neutral-300 rounded-sm origin-bottom z-10 shadow-sm"
                      style={{ transform: `translateY(-50%) rotate(${minAngle}deg)` }}
                    />
                    {/* Second Hand (Sweep) */}
                    {!isAOD && (
                      <div 
                        className="absolute w-0.5 h-28 bg-[#FF5C00] origin-bottom z-10"
                        style={{ transform: `translateY(-50%) rotate(${secAngle}deg)` }}
                      />
                    )}
                  </div>
                )}

                {/* Complications & Digital Clock */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-1">
                  
                  {/* Top Status Complication */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-neutral-400 mb-1">
                    <Bluetooth className="w-3 h-3 text-[#FF5C00]" />
                    <span>{watchStatus.connected ? 'SYNCED' : 'OFFLINE'}</span>
                    <span>•</span>
                    <span className="text-neutral-200">{watchStatus.battery}%</span>
                  </div>

                  {/* Main Time Display */}
                  <div 
                    className="font-extrabold tracking-tighter leading-none"
                    style={{ 
                      color: primaryColor,
                      fontSize: activeFace?.style === 'matrix' ? '44px' : '48px',
                      fontFamily: activeFace?.style === 'matrix' ? 'Silkscreen' : 'JetBrains Mono'
                    }}
                  >
                    {hours}:{minutes}
                    {!isAOD && (
                      <span className="text-xs font-mono ml-1 opacity-75 font-normal text-neutral-400">
                        {seconds}
                      </span>
                    )}
                  </div>

                  {/* Date Display */}
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    {dateStr}
                  </div>

                  {/* Bottom Complications Grid */}
                  {!isAOD && (
                    <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-neutral-800/80">
                      {/* Heart Rate */}
                      <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-200">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/30 animate-pulse" />
                        <span>{watchStatus.heartRateCurrent}</span>
                      </div>

                      {/* Steps */}
                      <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-200">
                        <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{watchStatus.stepsCurrent.toLocaleString()}</span>
                      </div>

                      {/* Calories */}
                      <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-200">
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                        <span>{watchStatus.caloriesCurrent} kcal</span>
                      </div>
                    </div>
                  )}

                  {/* Face Name Watermark */}
                  <div className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-mono mt-1 opacity-60">
                    {activeFace?.name || 'CMF OS 3.0'}
                  </div>
                </div>
              </div>
            )}

            {/* Notification Push Toast Simulation */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ y: 50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 50, opacity: 0, scale: 0.9 }}
                  className="absolute inset-x-4 bottom-6 z-30 p-3 bg-neutral-900/95 border-2 border-[#FF5C00] rounded-lg shadow-2xl text-left backdrop-blur-md"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF5C00] uppercase">
                      <Bell className="w-3 h-3 animate-bounce" />
                      <span>{notification.title}</span>
                    </div>
                    <button
                      onClick={onDismissNotification}
                      className="text-[9px] text-neutral-400 hover:text-white uppercase font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-200 font-mono leading-tight line-clamp-2">
                    {notification.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Watch Strap Bottom */}
        <div className="absolute -bottom-7 w-28 h-7 bg-neutral-800 border-x-2 border-b-2 border-neutral-700 rounded-b-md opacity-80" />
      </div>

      {/* Control Tips */}
      <div className="mt-4 flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#FF5C00]" />
          466x466 AMOLED
        </span>
        <span>•</span>
        <span>AOD: {isAOD ? 'ON' : 'OFF'}</span>
        <span>•</span>
        <span>Dual BLE 5.3</span>
      </div>
    </div>
  );
};
