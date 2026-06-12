import React from "react";
import { Signal, Battery, Wifi } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 md:p-6 font-sans">
      {/* Phone Silhouette Container */}
      <div className="w-full max-w-[430px] h-screen sm:h-[900px] bg-[#E1F5FE] md:rounded-[48px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-0 md:border-[10px] border-slate-800 flex flex-col overflow-hidden relative">
        
        {/* Notch - Hidden on true mobile if desired, but nice for visual pairing */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-2xl z-50 items-center justify-center">
          <div className="w-12 h-1 bg-slate-700 rounded-full mb-1"></div>
          <div className="w-3 h-3 bg-slate-950 rounded-full ml-3 mb-1 border border-slate-800"></div>
        </div>


        {/* Screen Viewport with child content */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9]">
          {children}
        </div>

        {/* iOS Home Indicator Space */}
        <div className="hidden md:block bg-white dark:bg-slate-900 pb-2 pt-1 flex justify-center z-50">
          <div className="w-28 h-1 bg-slate-400 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}
