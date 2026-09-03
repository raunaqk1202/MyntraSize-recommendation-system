import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Sparkles } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children }) => {
  const [useDeviceShell, setUseDeviceShell] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center sm:py-6 sm:px-4 font-sans text-gray-800">
      {/* Desktop Top Control Bar (Visible only on desktop/laptop viewports) */}
      <aside aria-label="Desktop Preview Controls" className="hidden sm:flex items-center justify-between w-full max-w-[400px] mb-3 px-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5 font-bold text-gray-700">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Myntra Clean Mobile Preview</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseDeviceShell(true)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
              useDeviceShell
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Smartphone size={13} />
            Phone Mockup
          </button>
          <button
            onClick={() => setUseDeviceShell(false)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
              !useDeviceShell
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Monitor size={13} />
            Full Mobile View
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main
        className={`w-full bg-white relative transition-all duration-300 overflow-hidden flex flex-col ${
          useDeviceShell
            ? 'sm:w-[385px] sm:h-[820px] sm:rounded-[40px] sm:border-[8px] sm:border-gray-900 sm:shadow-2xl'
            : 'sm:w-[410px] sm:h-[90vh] sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-xl'
        } min-h-screen sm:min-h-0`}
      >
        {/* Mobile Device Status Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm px-6 pt-2 pb-1 flex items-center justify-between text-gray-900 select-none border-b border-gray-100">
          <span className="text-xs font-bold font-mono tracking-tight text-gray-700">
            {currentTime}
          </span>

          {/* Dynamic Island / Speaker Pill for iPhone aesthetic */}
          <div className="w-16 h-3.5 bg-gray-900 rounded-full mx-auto hidden sm:block shadow-inner" />

          <div className="flex items-center gap-1.5 text-gray-700">
            <span className="text-[10px] font-bold tracking-tight text-gray-500">5G</span>
            <Wifi size={13} strokeWidth={2.2} />
            <Battery size={15} strokeWidth={2.2} className="fill-gray-900" />
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};
