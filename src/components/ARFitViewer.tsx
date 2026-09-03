import React, { useEffect, useRef, useState } from 'react';
import { Product, UserBodyMeasurements } from '../types';
import { 
  RotateCcw, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Layers, 
  Sliders, 
  Check, 
  ZoomIn, 
  ZoomOut,
  Info,
  Ruler
} from 'lucide-react';
import { ThreeAvatarStudio } from '../utils/threeAvatarBuilder';
import { MyntraLogo } from './MyntraLogo';

interface ARFitViewerProps {
  product: Product;
  userMeasurements: UserBodyMeasurements;
  activeSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  recommendedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  onSelectSize: (size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  onClose: () => void;
  onEditMeasurements: () => void;
}

export const ARFitViewer: React.FC<ARFitViewerProps> = ({
  product,
  userMeasurements,
  activeSize,
  recommendedSize,
  onSelectSize,
  onClose,
  onEditMeasurements
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<ThreeAvatarStudio | null>(null);

  const [viewMode, setViewMode] = useState<'fabric' | 'heatmap' | 'xray'>('fabric');
  const [showCalipers, setShowCalipers] = useState<boolean>(true);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [selectedAngle, setSelectedAngle] = useState<'front' | 'threeQuarter' | 'side' | 'back'>('front');
  const [zoomLevel, setZoomLevel] = useState<number>(5.2);

  // Drag interaction state
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Measurement unit conversions (inches for calculation)
  const userChest = userMeasurements.unit === 'cm' ? Number((userMeasurements.chest / 2.54).toFixed(1)) : userMeasurements.chest;
  const userShoulder = userMeasurements.unit === 'cm' ? Number((userMeasurements.shoulder / 2.54).toFixed(1)) : userMeasurements.shoulder;
  const userLength = userMeasurements.unit === 'cm' ? Number((userMeasurements.frontLength / 2.54).toFixed(1)) : userMeasurements.frontLength;
  const userWaist = userMeasurements.waist ? (userMeasurements.unit === 'cm' ? Number((userMeasurements.waist / 2.54).toFixed(1)) : userMeasurements.waist) : userChest * 0.85;

  const garmentSpec = product.sizeChart.find(s => s.size === activeSize) || product.sizeChart[2];
  const isBottomWear = ['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType);
  
  const chestEase = isBottomWear ? Number(((garmentSpec.waist || 0) - userWaist).toFixed(1)) : Number((garmentSpec.chest - userChest).toFixed(1));
  const shoulderEase = isBottomWear ? 0 : Number((garmentSpec.shoulder - userShoulder).toFixed(1));
  const lengthDiff = Number((garmentSpec.length - userLength).toFixed(1));

  // Initialize Three.js 3D Avatar Studio
  useEffect(() => {
    if (!containerRef.current) return;

    const studio = new ThreeAvatarStudio(containerRef.current, {
      product,
      userMeasurements,
      activeSize,
      viewMode,
      showCalipers,
    });
    studioRef.current = studio;

    const handleResize = () => {
      studio.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      studio.destroy();
      studioRef.current = null;
    };
  }, []);

  // Update 3D studio when size, viewMode, or measurements change
  useEffect(() => {
    if (!studioRef.current) return;
    studioRef.current.updateConfig({
      product,
      userMeasurements,
      activeSize,
      viewMode,
      showCalipers,
    });
  }, [product, userMeasurements, activeSize, viewMode, showCalipers]);

  // Handle Auto-Rotation
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      if (studioRef.current) {
        studioRef.current.targetRotationY += 0.015;
      }
    }, 20);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // View Angle Presets
  const setAngle = (angle: 'front' | 'threeQuarter' | 'side' | 'back') => {
    setSelectedAngle(angle);
    setIsAutoRotating(false);
    if (!studioRef.current) return;

    studioRef.current.targetRotationX = 0;
    if (angle === 'front') studioRef.current.targetRotationY = 0;
    if (angle === 'threeQuarter') studioRef.current.targetRotationY = 0.7;
    if (angle === 'side') studioRef.current.targetRotationY = Math.PI / 2;
    if (angle === 'back') studioRef.current.targetRotationY = Math.PI;
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    const nextZoom = Math.min(6.8, Math.max(3.8, zoomLevel + delta));
    setZoomLevel(nextZoom);
    if (studioRef.current) {
      studioRef.current.zoomDistance = nextZoom;
    }
  };

  // 3D Orbital Mouse/Touch Drag Handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: clientX, y: clientY };
    setIsAutoRotating(false);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current || !studioRef.current) return;
    const deltaX = clientX - prevMousePos.current.x;
    const deltaY = clientY - prevMousePos.current.y;
    prevMousePos.current = { x: clientX, y: clientY };

    // Orbit in Y (yaw) and clamp X (pitch)
    studioRef.current.targetRotationY += deltaX * 0.012;
    studioRef.current.targetRotationX = Math.max(
      -0.35,
      Math.min(0.35, studioRef.current.targetRotationX + deltaY * 0.008)
    );
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Fit classification & status
  let fitStatusText = 'Tailored Regular Fit';
  let fitBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';

  if (chestEase < 0.5) {
    if (product.stretchFactor === 'high-stretch') {
      fitStatusText = 'Snug Sculpted Fit (Fabric Stretches)';
      fitBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
    } else {
      fitStatusText = isBottomWear ? `Tight at Waist (<0.5" Ease)` : `Tight Pulling at Chest (<0.5" Ease)`;
      fitBadgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
    }
  } else if (chestEase > 4.2) {
    fitStatusText = 'Relaxed Oversized Fit (+4" Roomy)';
    fitBadgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
  }

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/90 backdrop-blur-md flex flex-col justify-between font-sans select-none">
      {/* Top Header Bar with Authentic Myntra Branding */}
      <div className="relative z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <MyntraLogo size="sm" showWordmark={true} />
          <span className="text-gray-300">|</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-900">3D Virtual Avatar Studio</span>
              <span className="bg-pink-100 text-[#ff3f6c] text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                TrueFit™
              </span>
            </div>
            <p className="text-[10px] text-gray-500 truncate max-w-[200px]">
              {product.brand} - {product.title}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors shadow-2xs"
          title="Close 3D Avatar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main 3D Studio Canvas Area */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-none bg-gradient-to-b from-[#f8f9fa] via-[#edf0f5] to-[#dce1ea]"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handlePointerUp}
      >
        {/* Three.js Canvas Container */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Live Fit Gauge Pill (Floating Top Center) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-gray-200/80 flex items-center gap-2 pointer-events-none">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${fitBadgeColor}`}>
            Size {activeSize}: {fitStatusText}
          </span>
        </div>

        {/* 3D Interactive Floating Angle Selector (Left Floating Toolbar) */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase text-center tracking-wider pb-0.5 border-b border-gray-100">
            Angle
          </span>
          <button
            onClick={() => setAngle('front')}
            className={`px-2.5 py-1 text-[11px] rounded font-bold transition-all text-left ${
              selectedAngle === 'front' ? 'bg-[#ff3f6c] text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Front (0°)
          </button>
          <button
            onClick={() => setAngle('threeQuarter')}
            className={`px-2.5 py-1 text-[11px] rounded font-bold transition-all text-left ${
              selectedAngle === 'threeQuarter' ? 'bg-[#ff3f6c] text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            3/4 View
          </button>
          <button
            onClick={() => setAngle('side')}
            className={`px-2.5 py-1 text-[11px] rounded font-bold transition-all text-left ${
              selectedAngle === 'side' ? 'bg-[#ff3f6c] text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Profile (90°)
          </button>
          <button
            onClick={() => setAngle('back')}
            className={`px-2.5 py-1 text-[11px] rounded font-bold transition-all text-left ${
              selectedAngle === 'back' ? 'bg-[#ff3f6c] text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Back (180°)
          </button>
        </div>

        {/* View Mode & Visual Tools (Right Floating Toolbar) */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[9px] font-bold text-gray-400 uppercase text-center tracking-wider pb-0.5 border-b border-gray-100">
            View
          </span>

          {/* Fabric Mode */}
          <button
            onClick={() => setViewMode('fabric')}
            title="Realistic Fabric View"
            className={`px-2 py-1.5 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'fabric' ? 'bg-[#ff3f6c] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>Fabric</span>
          </button>

          {/* Heatmap Mode */}
          <button
            onClick={() => setViewMode('heatmap')}
            title="Tension Pressure Heatmap"
            className={`px-2 py-1.5 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'heatmap' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Layers size={13} />
            <span>Tension</span>
          </button>

          {/* X-Ray Clearance Mode */}
          <button
            onClick={() => setViewMode('xray')}
            title="X-Ray Gap View"
            className={`px-2 py-1.5 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'xray' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>X-Ray</span>
          </button>

          <div className="h-px bg-gray-200 my-0.5" />

          {/* Dimension Calipers */}
          <button
            onClick={() => setShowCalipers(!showCalipers)}
            title="Toggle 3D Dimension Calipers"
            className={`p-1.5 rounded text-xs flex items-center justify-center transition-colors ${
              showCalipers ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Ruler size={15} />
          </button>

          {/* 360 Turntable Auto-Rotate */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title="Toggle 360 Auto-Rotate Turntable"
            className={`p-1.5 rounded text-xs flex items-center justify-center transition-colors ${
              isAutoRotating ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <RotateCcw size={15} />
          </button>

          {/* Zoom In & Out */}
          <button
            onClick={() => handleZoom(-0.5)}
            title="Zoom In"
            className="p-1.5 rounded text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => handleZoom(0.5)}
            title="Zoom Out"
            className="p-1.5 rounded text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ZoomOut size={15} />
          </button>
        </div>

        {/* Drag Guidance Toast */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1 rounded-full pointer-events-none opacity-80">
          Drag to orbit 360° • Zoom or tap angles
        </div>
      </div>

      {/* Bottom Control & Measurement Comparison Panel */}
      <div className="relative z-20 bg-white border-t border-gray-200 p-3.5 shadow-lg max-w-md mx-auto w-full">
        {/* Real-time Proportional Fit HUD */}
        <div className="grid grid-cols-3 gap-2 pb-2.5 border-b border-gray-100 text-center">
          <div className="bg-gray-50 p-1.5 rounded border border-gray-100">
            <p className="text-[9px] text-gray-500 uppercase font-semibold">Shoulder Fit</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">
              {garmentSpec.shoulder}" <span className="text-[10px] text-gray-400 font-normal">vs {userShoulder}"</span>
            </p>
            <p className={`text-[9px] font-bold ${shoulderEase >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {shoulderEase >= 0 ? `+${shoulderEase}" drape` : `${shoulderEase}" snug`}
            </p>
          </div>

          <div className="bg-gray-50 p-1.5 rounded border border-gray-100">
            <p className="text-[9px] text-gray-500 uppercase font-semibold">Chest Ease</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">
              {garmentSpec.chest}" <span className="text-[10px] text-gray-400 font-normal">vs {userChest}"</span>
            </p>
            <p className={`text-[9px] font-bold ${chestEase >= 1.5 ? 'text-emerald-600' : chestEase >= 0 ? 'text-amber-600' : 'text-rose-600'}`}>
              {chestEase >= 0 ? `+${chestEase}" ease` : `${chestEase}" tight`}
            </p>
          </div>

          <div className="bg-gray-50 p-1.5 rounded border border-gray-100">
            <p className="text-[9px] text-gray-500 uppercase font-semibold">Hem Coverage</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">
              {garmentSpec.length}" <span className="text-[10px] text-gray-400 font-normal">vs {userLength}"</span>
            </p>
            <p className="text-[9px] font-bold text-gray-600">
              {lengthDiff >= 0 ? `+${lengthDiff}" past waist` : `${lengthDiff}" crop`}
            </p>
          </div>
        </div>

        {/* Size Selection Pill Bar */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => {
              const isAvailable = product.inStockSizes.includes(size);
              const isSelected = activeSize === size;
              const isRecommended = recommendedSize === size;

              return (
                <button
                  key={size}
                  disabled={!isAvailable}
                  onClick={() => onSelectSize(size)}
                  className={`relative px-3 py-1.5 rounded font-bold text-xs flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#ff3f6c] text-white shadow-2xs'
                      : isAvailable
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {size}
                  {isRecommended && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-[#ff3f6c] hover:bg-[#ff527b] text-white font-bold text-xs rounded shadow-2xs flex items-center gap-1 active:scale-98 transition-all whitespace-nowrap"
          >
            Apply Size {activeSize}
            <Check size={14} />
          </button>
        </div>

        {/* Body Calibration Link & Zero-Return Guarantee Note */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1 text-gray-600">
            <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
            <span>
              {activeSize === recommendedSize ? (
                <span className="text-emerald-700 font-semibold">TrueFit Guaranteed: Tailored comfort ease</span>
              ) : (
                <span>Recommended: <strong className="text-[#ff3f6c]">Size {recommendedSize}</strong> for your shape</span>
              )}
            </span>
          </div>

          <button
            onClick={onEditMeasurements}
            className="text-[#ff3f6c] hover:underline font-bold"
          >
            Edit Body ({userChest}" C / {userShoulder}" S) →
          </button>
        </div>
      </div>
    </div>
  );
};
