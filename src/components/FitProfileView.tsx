import React, { useState } from 'react';
import { UserBodyMeasurements, FitPreference } from '../types';
import { 
  Sparkles, 
  Ruler, 
  Sliders, 
  Check, 
  ShieldCheck, 
  HeartHandshake, 
  Activity, 
  Layers,
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FitProfileViewProps {
  measurements: UserBodyMeasurements;
  onUpdateMeasurements: (newMeasurements: UserBodyMeasurements) => void;
  onOpenARWithSample: () => void;
  onStartShopping: () => void;
}

export const FitProfileView: React.FC<FitProfileViewProps> = ({
  measurements,
  onUpdateMeasurements,
  onOpenARWithSample,
  onStartShopping,
}) => {
  const [chest, setChest] = useState(measurements.chest);
  const [shoulder, setShoulder] = useState(measurements.shoulder);
  const [frontLength, setFrontLength] = useState(measurements.frontLength);
  const [fitPreference, setFitPreference] = useState<FitPreference>(measurements.fitPreference);
  const [unit, setUnit] = useState<'in' | 'cm'>(measurements.unit);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMeasurements({
      chest,
      shoulder,
      frontLength,
      fitPreference,
      unit,
    });
    setSavedSuccess(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff3f6c', '#00bfa5', '#3b82f6']
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Studio Header */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 bg-white/10 px-2.5 py-0.5 rounded-full font-bold">
            Zero Return Technology
          </span>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
            <UserCheck size={14} /> Profile Active
          </span>
        </div>

        <h1 className="text-xl font-black mt-2 leading-tight">
          Myntra FitStudio & 3D Avatar Engine
        </h1>
        <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
          Input your measurements once. Our engine computes garment stretch allowances, fits your virtual 3D avatar, and auto-selects your size with zero return risk.
        </p>

        {/* Quick Launch 3D Avatar Mannequin */}
        <button
          onClick={onOpenARWithSample}
          className="mt-4 w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl font-extrabold text-xs text-white shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all hover:brightness-105"
        >
          <Sparkles size={16} />
          View My 3D Virtual Avatar & Fit
        </button>
      </div>



      {/* Measurement Calibration Form */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
            <Ruler size={16} className="text-pink-600" /> Your Proportions
          </h2>
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-2.5 py-0.5 rounded ${unit === 'in' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'}`}
            >
              Inches
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-0.5 rounded ${unit === 'cm' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'}`}
            >
              CM
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-3">
          {/* Chest Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1 font-bold">
              <span className="text-neutral-700">Chest / Bust Circumference</span>
              <span className="text-pink-600 font-mono bg-pink-50 px-2 py-0.5 rounded">{chest} {unit}</span>
            </div>
            <input
              type="range"
              min={unit === 'in' ? 30 : 76}
              max={unit === 'in' ? 52 : 132}
              step={unit === 'in' ? 0.5 : 1}
              value={chest}
              onChange={(e) => setChest(parseFloat(e.target.value))}
              className="w-full accent-pink-600 h-2 bg-neutral-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Shoulder Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1 font-bold">
              <span className="text-neutral-700">Shoulder Width (Tip to Tip)</span>
              <span className="text-pink-600 font-mono bg-pink-50 px-2 py-0.5 rounded">{shoulder} {unit}</span>
            </div>
            <input
              type="range"
              min={unit === 'in' ? 14 : 35}
              max={unit === 'in' ? 22 : 56}
              step={unit === 'in' ? 0.2 : 0.5}
              value={shoulder}
              onChange={(e) => setShoulder(parseFloat(e.target.value))}
              className="w-full accent-pink-600 h-2 bg-neutral-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Front Length Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1 font-bold">
              <span className="text-neutral-700">Front Torso Length</span>
              <span className="text-pink-600 font-mono bg-pink-50 px-2 py-0.5 rounded">{frontLength} {unit}</span>
            </div>
            <input
              type="range"
              min={unit === 'in' ? 24 : 60}
              max={unit === 'in' ? 35 : 90}
              step={unit === 'in' ? 0.5 : 1}
              value={frontLength}
              onChange={(e) => setFrontLength(parseFloat(e.target.value))}
              className="w-full accent-pink-600 h-2 bg-neutral-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Fit Preference */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              Default Fit Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'slim', label: 'Slim Fit', sub: 'Clean lines' },
                  { id: 'regular', label: 'Regular Fit', sub: 'Comfortable' },
                  { id: 'relaxed', label: 'Relaxed Fit', sub: 'Oversized' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFitPreference(f.id)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    fitPreference === f.id
                      ? 'border-pink-500 bg-pink-50/70 font-bold text-neutral-900 ring-2 ring-pink-400/20'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <div className="text-xs">{f.label}</div>
                  <div className="text-[9px] text-neutral-400 mt-0.5">{f.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <Check size={16} />
            Save & Calibrate Across Catalog
          </button>
        </form>

        {savedSuccess && (
          <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-center text-xs font-semibold animate-in fade-in">
            Measurements saved! All products will auto-select your best size.
          </div>
        )}
      </div>

      {/* How it Works FAQ */}
      <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-2 text-xs">
        <h3 className="font-extrabold text-neutral-900 uppercase tracking-wide text-[11px]">
          How FitStudio Works
        </h3>
        <div className="space-y-2 text-neutral-600 text-[11px] leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span><b>Garment Elasticity Analysis:</b> We factor in whether the garment is 100% rigid cotton, 2% elastane flex denim, or 8% 4-way stretch knit.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span><b>Zero Return Precision:</b> Auto-selects your size on every product detail page and marks it with the green FIT star.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span><b>3D Augmented Reality Avatar:</b> Visualize cloth tension and draping directly onto your virtual twin before ordering.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
