import React, { useState } from 'react';
import { Product, UserBodyMeasurements, FitPreference, FitRecommendation } from '../types';
import { calculateFitRecommendation } from '../utils/fitEngine';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Check, 
  Ruler, 
  Info, 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  ChevronRight,
  Eye,
  HelpCircle,
  Activity
} from 'lucide-react';

interface SizeRecommendationModalProps {
  product: Product;
  userMeasurements: UserBodyMeasurements;
  onSaveMeasurements: (measurements: UserBodyMeasurements) => void;
  onApplyRecommendation: (recommendation: FitRecommendation) => void;
  onOpenARViewer: () => void;
  onClose: () => void;
}

export const SizeRecommendationModal: React.FC<SizeRecommendationModalProps> = ({
  product,
  userMeasurements,
  onSaveMeasurements,
  onApplyRecommendation,
  onOpenARViewer,
  onClose,
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>(userMeasurements.unit);
  const [shoulder, setShoulder] = useState<number>(userMeasurements.shoulder);
  const [chest, setChest] = useState<number>(userMeasurements.chest);
  const [frontLength, setFrontLength] = useState<number>(userMeasurements.frontLength);
  const [waist, setWaist] = useState<number>(userMeasurements.waist || 32);
  const [hip, setHip] = useState<number>(userMeasurements.hip || 38);
  const [inseam, setInseam] = useState<number>(userMeasurements.inseam || 30);
  const [fitPreference, setFitPreference] = useState<FitPreference>(userMeasurements.fitPreference);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [calculatedRec, setCalculatedRec] = useState<FitRecommendation | null>(null);

  const isBottomWear = ['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType);

  // Trigger real-time or updated recommendation
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const updatedMeasurements: UserBodyMeasurements = {
      shoulder,
      chest,
      frontLength,
      waist,
      hip,
      inseam,
      fitPreference,
      unit
    };

    onSaveMeasurements(updatedMeasurements);
    const rec = calculateFitRecommendation(updatedMeasurements, product.sizeChart, product.stretchFactor, product.garmentType);
    setCalculatedRec(rec);

    // Trigger celebration confetti for confidence
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff3f6c', '#ff527b', '#00bfa5', '#ff9800']
    });
  };

  const handleApplyAndClose = () => {
    const updatedMeasurements: UserBodyMeasurements = {
      shoulder,
      chest,
      frontLength,
      waist,
      hip,
      inseam,
      fitPreference,
      unit
    };
    onSaveMeasurements(updatedMeasurements);
    const rec = calculatedRec || calculateFitRecommendation(updatedMeasurements, product.sizeChart, product.stretchFactor, product.garmentType);
    onApplyRecommendation(rec);
    onClose();
  };

  // Convert values when unit toggles
  const handleUnitToggle = (newUnit: 'in' | 'cm') => {
    if (newUnit === unit) return;
    if (newUnit === 'cm') {
      setShoulder(Number((shoulder * 2.54).toFixed(1)));
      setChest(Number((chest * 2.54).toFixed(1)));
      setFrontLength(Number((frontLength * 2.54).toFixed(1)));
      setWaist(Number((waist * 2.54).toFixed(1)));
      setHip(Number((hip * 2.54).toFixed(1)));
      setInseam(Number((inseam * 2.54).toFixed(1)));
    } else {
      setShoulder(Number((shoulder / 2.54).toFixed(1)));
      setChest(Number((chest / 2.54).toFixed(1)));
      setFrontLength(Number((frontLength / 2.54).toFixed(1)));
      setWaist(Number((waist / 2.54).toFixed(1)));
      setHip(Number((hip / 2.54).toFixed(1)));
      setInseam(Number((inseam / 2.54).toFixed(1)));
    }
    setUnit(newUnit);
  };

  const currentRec = calculatedRec || calculateFitRecommendation(
    { shoulder, chest, frontLength, waist, hip, inseam, fitPreference, unit },
    product.sizeChart,
    product.stretchFactor,
    product.garmentType
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-gray-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#fff5f7] text-[#ff3f6c] flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm leading-snug">
                TrueFit™ Body Measurement Engine
              </h2>
              <p className="text-[11px] text-gray-500">
                Precision sizing tailored to your shoulder, chest, and torso
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-gray-800">
          {/* Garment Stretch Intelligence Card */}
          <div className="bg-[#fff5f7] border border-[#ffdce3] rounded-xl p-3 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white text-[#ff3f6c] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-pink-100">
              <Activity size={15} />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">Garment Fabric Stretch:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  product.stretchFactor === 'non-stretch'
                    ? 'bg-amber-100 text-amber-800'
                    : product.stretchFactor === 'high-stretch'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {product.stretchFactor.replace('-', ' ')}
                </span>
              </div>
              <p className="text-gray-600 mt-1 leading-relaxed text-[11px]">
                {product.stretchDescription}
              </p>
            </div>
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Input Body Measurements
            </span>
            <div className="flex items-center bg-gray-100 p-0.5 rounded text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleUnitToggle('in')}
                className={`px-3 py-1 rounded transition-all ${
                  unit === 'in' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Inches (in)
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle('cm')}
                className={`px-3 py-1 rounded transition-all ${
                  unit === 'cm' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Measurements Form Grid */}
          <form onSubmit={handleCalculate} className="space-y-3">
            {/* Input 1: Chest or Waist */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Ruler size={14} className="text-[#ff3f6c]" />
                  {isBottomWear ? 'Waist Circumference' : 'Chest Circumference'}
                </label>
                <span className="text-xs font-mono font-bold text-[#ff3f6c] bg-[#fff5f7] px-2 py-0.5 rounded border border-[#ffdce3]">
                  {isBottomWear ? waist : chest} {unit}
                </span>
              </div>
              <input
                type="range"
                min={unit === 'in' ? (isBottomWear ? 24 : 30) : (isBottomWear ? 60 : 76)}
                max={unit === 'in' ? (isBottomWear ? 48 : 54) : (isBottomWear ? 122 : 138)}
                step={unit === 'in' ? 0.5 : 1}
                value={isBottomWear ? waist : chest}
                onChange={(e) => isBottomWear ? setWaist(parseFloat(e.target.value)) : setChest(parseFloat(e.target.value))}
                className="w-full accent-[#ff3f6c] cursor-pointer h-1.5 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>{unit === 'in' ? (isBottomWear ? '24 in' : '30 in') : (isBottomWear ? '60 cm' : '76 cm')}</span>
                <span>{isBottomWear ? 'Natural waistline' : 'Fullest part of chest'}</span>
                <span>{unit === 'in' ? (isBottomWear ? '48 in' : '54 in') : (isBottomWear ? '122 cm' : '138 cm')}</span>
              </div>
            </div>

            {/* Input 2: Shoulder or Hip */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Ruler size={14} className="text-[#ff3f6c]" />
                  {isBottomWear ? 'Hip Circumference' : 'Shoulder Width'}
                </label>
                <span className="text-xs font-mono font-bold text-[#ff3f6c] bg-[#fff5f7] px-2 py-0.5 rounded border border-[#ffdce3]">
                  {isBottomWear ? hip : shoulder} {unit}
                </span>
              </div>
              <input
                type="range"
                min={unit === 'in' ? (isBottomWear ? 30 : 14) : (isBottomWear ? 76 : 35)}
                max={unit === 'in' ? (isBottomWear ? 54 : 23) : (isBottomWear ? 138 : 58)}
                step={unit === 'in' ? 0.2 : 0.5}
                value={isBottomWear ? hip : shoulder}
                onChange={(e) => isBottomWear ? setHip(parseFloat(e.target.value)) : setShoulder(parseFloat(e.target.value))}
                className="w-full accent-[#ff3f6c] cursor-pointer h-1.5 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>{unit === 'in' ? (isBottomWear ? '30 in' : '14 in') : (isBottomWear ? '76 cm' : '35 cm')}</span>
                <span>{isBottomWear ? 'Fullest part of hips' : 'Tip to tip across upper back'}</span>
                <span>{unit === 'in' ? (isBottomWear ? '54 in' : '23 in') : (isBottomWear ? '138 cm' : '58 cm')}</span>
              </div>
            </div>

            {/* Input 3: Front or Inseam Length */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Ruler size={14} className="text-[#ff3f6c]" />
                  {isBottomWear ? 'Inseam Length' : 'Front Torso Length'}
                </label>
                <span className="text-xs font-mono font-bold text-[#ff3f6c] bg-[#fff5f7] px-2 py-0.5 rounded border border-[#ffdce3]">
                  {isBottomWear ? inseam : frontLength} {unit}
                </span>
              </div>
              <input
                type="range"
                min={unit === 'in' ? (isBottomWear ? 24 : 22) : (isBottomWear ? 60 : 55)}
                max={unit === 'in' ? (isBottomWear ? 40 : 36) : (isBottomWear ? 102 : 92)}
                step={unit === 'in' ? 0.5 : 1}
                value={isBottomWear ? inseam : frontLength}
                onChange={(e) => isBottomWear ? setInseam(parseFloat(e.target.value)) : setFrontLength(parseFloat(e.target.value))}
                className="w-full accent-[#ff3f6c] cursor-pointer h-1.5 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>{unit === 'in' ? (isBottomWear ? '24 in' : '22 in') : (isBottomWear ? '60 cm' : '55 cm')}</span>
                <span>{isBottomWear ? 'Crotch to hem' : 'Collar bone to desired hem'}</span>
                <span>{unit === 'in' ? (isBottomWear ? '40 in' : '36 in') : (isBottomWear ? '102 cm' : '92 cm')}</span>
              </div>
            </div>

            {/* Fit Preference Selection */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Preferred Fit Style:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'slim', label: 'Slim Fit', desc: 'Snug & tailored' },
                    { id: 'regular', label: 'Regular Fit', desc: 'Classic ease' },
                    { id: 'relaxed', label: 'Relaxed Fit', desc: 'Roomy & loose' },
                  ] as const
                ).map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setFitPreference(pref.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      fitPreference === pref.id
                        ? 'border-[#ff3f6c] bg-[#fff5f7] text-[#ff3f6c]'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{pref.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{pref.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Engine Outcome Recommendation Card (Clean Minimalist card) */}
          <div className="bg-[#fff5f7] border border-[#ffdce3] rounded-xl p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff3f6c]">
                  Engine Fit Prediction
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
                {currentRec.confidenceScore}% Fit Confidence
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">Size {currentRec.recommendedSize}</span>
              <span className="text-xs text-[#ff3f6c] font-semibold">is your optimal match</span>
            </div>

            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              {currentRec.explanation}
            </p>

            {/* Zone breakdown badges */}
            <div className="mt-3 grid grid-cols-3 gap-2 pt-2.5 border-t border-pink-200/60 text-center">
              <div className="bg-white rounded p-1.5 border border-pink-100">
                <div className="text-[10px] text-gray-500">Chest Ease</div>
                <div className="text-xs font-bold text-gray-800 mt-0.5">
                  +{currentRec.easeDetails.chestEase}"
                </div>
              </div>
              <div className="bg-white rounded p-1.5 border border-pink-100">
                <div className="text-[10px] text-gray-500">Shoulder Seam</div>
                <div className="text-xs font-bold text-gray-800 mt-0.5">
                  +{currentRec.easeDetails.shoulderEase}"
                </div>
              </div>
              <div className="bg-white rounded p-1.5 border border-pink-100">
                <div className="text-[10px] text-gray-500">Torso Drop</div>
                <div className="text-xs font-bold text-gray-800 mt-0.5">
                  +{currentRec.easeDetails.lengthDiff}"
                </div>
              </div>
            </div>

            <div className="mt-2.5 text-[11px] text-emerald-700 flex items-center gap-1.5">
              <ShieldCheck size={14} className="shrink-0" />
              <span>{currentRec.stretchBenefitNote}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-white border-t border-gray-200 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onOpenARViewer}
            className="flex-1 h-11 rounded border border-gray-300 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-98 transition-all"
          >
            <Eye size={15} className="text-[#ff3f6c]" />
            Launch 3D Avatar (AR)
          </button>

          <button
            type="button"
            onClick={handleApplyAndClose}
            className="flex-1 h-11 rounded bg-[#ff3f6c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-[#ff527b] active:scale-98 transition-all"
          >
            <Check size={16} />
            Auto-Select Size {currentRec.recommendedSize}
          </button>
        </div>
      </div>
    </div>
  );
};
