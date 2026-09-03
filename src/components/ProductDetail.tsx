import React, { useState } from 'react';
import { Product, UserBodyMeasurements, FitRecommendation } from '../types';
import { MyntraLogo } from './MyntraLogo';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  Ruler, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Info, 
  ChevronRight, 
  Eye, 
  Sliders,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  userMeasurements: UserBodyMeasurements;
  recommendedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  activeSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  isWishlisted: boolean;
  onBack: () => void;
  onToggleWishlist: (product: Product) => void;
  onSelectSize: (size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  onOpenFitEngine: () => void;
  onOpenARViewer: () => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  cartCount: number;
  onOpenBag: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  userMeasurements,
  recommendedSize,
  activeSize,
  isWishlisted,
  onBack,
  onToggleWishlist,
  onSelectSize,
  onOpenFitEngine,
  onOpenARViewer,
  onAddToCart,
  cartCount,
  onOpenBag
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pincode, setPincode] = useState('560001');
  const [isPincodeChecked, setIsPincodeChecked] = useState(true);
  const [showSizeChartModal, setShowSizeChartModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.brand} - ${product.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  return (
    <div className="bg-white min-h-full pb-24 text-gray-800 font-sans">
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-4 h-14 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-900 transition-colors"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-1.5">
            <MyntraLogo size="sm" showWordmark={true} />
            <span className="text-gray-300">|</span>
            <span className="font-bold text-xs text-gray-800 tracking-wide uppercase truncate max-w-[130px]">
              {product.brand}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-gray-700">
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
            title="Share"
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={() => onToggleWishlist(product)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Wishlist"
          >
            <Heart
              size={19}
              className={isWishlisted ? 'fill-[#ff3f6c] text-[#ff3f6c]' : 'text-gray-700'}
            />
          </button>

          <button
            onClick={onOpenBag}
            className="relative w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-colors"
            title="Bag"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#ff3f6c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {copiedNotification && (
        <div className="bg-gray-900 text-white text-xs px-4 py-2 text-center fixed top-14 left-1/2 -translate-x-1/2 z-40 rounded-full shadow-lg">
          Link copied to clipboard!
        </div>
      )}

      {/* Image Gallery with Swiper & Thumbnails */}
      <div className="relative bg-[#fdf2f4] aspect-[3/4] overflow-hidden">
        <img
          src={product.images[activeImageIndex] || product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Clean Minimalist AR Badge matching design */}
        <div className="absolute bottom-3 left-3 bg-white/85 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-gray-800 shadow-xs flex items-center gap-1.5 border border-gray-200/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AR Preview Active</span>
        </div>

        {/* AR Fit Overlay Button on Image */}
        <button
          onClick={onOpenARViewer}
          className="absolute bottom-3 right-3 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-black active:scale-95 transition-all border border-white/10"
        >
          <Sparkles size={14} className="text-pink-400" />
          <span>Open 3D Avatar</span>
        </button>

        {/* Image Dots Indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/25 backdrop-blur-sm px-2 py-1 rounded-full">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeImageIndex === idx ? 'w-3.5 bg-[#ff3f6c]' : 'w-1.5 bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Product Info Section */}
      <div className="p-4 space-y-3.5">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              {product.brand}
            </h1>
            <div className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <span>{product.rating}</span>
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 font-normal">{product.ratingCount}</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
            {product.title}
          </p>

          {/* Pricing Row */}
          <div className="flex items-center mt-1 space-x-2">
            <span className="font-bold text-sm text-gray-900">₹{product.price}</span>
            <span className="text-gray-400 line-through text-[11px]">₹{product.mrp}</span>
            <span className="text-orange-500 text-[11px] font-bold">({product.discountPercent}% OFF)</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            inclusive of all taxes
          </p>
        </div>

        {/* ============================================================== */}
        {/* TRUEFIT™ AI RECOMMENDATION BOX (CLEAN MINIMALISM THEME) */}
        {/* ============================================================== */}
        <div className="bg-[#fff5f7] border border-[#ffdce3] rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#ff3f6c] uppercase tracking-wide">
              TrueFit™ AI Recommendation
            </span>
            <button
              onClick={onOpenFitEngine}
              className="h-4 w-4 rounded-full bg-[#ff3f6c] flex items-center justify-center text-white text-[8px] font-bold hover:opacity-90"
              title="Fit explanation"
            >
              ?
            </button>
          </div>

          {/* 3 Interactive Proportion Boxes */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="flex flex-col">
              <label className="text-[9px] text-gray-500 mb-1 uppercase font-semibold text-center">
                {['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType) ? 'Waist' : 'Shoulder'}
              </label>
              <button
                type="button"
                onClick={onOpenFitEngine}
                className="text-xs p-2 border border-gray-200 rounded bg-white text-center font-bold text-gray-800 hover:border-pink-300 transition-colors shadow-2xs"
              >
                {['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType) ? (userMeasurements.waist || 32) : userMeasurements.shoulder}"
              </button>
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] text-gray-500 mb-1 uppercase font-semibold text-center">
                {['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType) ? 'Hip' : 'Chest'}
              </label>
              <button
                type="button"
                onClick={onOpenFitEngine}
                className="text-xs p-2 border border-gray-200 rounded bg-white text-center font-bold text-gray-800 hover:border-pink-300 transition-colors shadow-2xs"
              >
                {['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType) ? (userMeasurements.hip || 38) : userMeasurements.chest}"
              </button>
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] text-gray-500 mb-1 uppercase font-semibold text-center">
                {['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType) ? 'Inseam' : 'Front'}
              </label>
              <button
                type="button"
                onClick={onOpenFitEngine}
                className="text-xs p-2 border border-gray-200 rounded bg-white text-center font-bold text-gray-800 hover:border-pink-300 transition-colors shadow-2xs"
              >
                {['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType) ? (userMeasurements.inseam || 30) : userMeasurements.frontLength}"
              </button>
            </div>
          </div>

          {/* Recommended Size White Pill Card */}
          <div className="bg-white p-3 rounded-lg border border-pink-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <Check size={16} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-800 leading-tight">
                  Recommended: Size {recommendedSize}
                </p>
                <p className="text-[9px] text-gray-500 mt-0.5">
                  Based on your {userMeasurements.fitPreference} fit preference ({product.stretchFactor.replace('-', ' ')})
                </p>
              </div>
            </div>

            <button
              onClick={onOpenFitEngine}
              className="text-[10px] text-[#ff3f6c] underline font-semibold hover:opacity-80 shrink-0 cursor-pointer"
            >
              Recalculate
            </button>
          </div>

          {/* Garment Stretch & AR Quick Link */}
          <div className="mt-2.5 pt-2 border-t border-pink-200/50 flex items-center justify-between text-[10px] text-gray-600">
            <span>
              Fabric Stretch: <b className="text-gray-800 uppercase">{product.stretchFactor.replace('-', ' ')}</b>
            </span>
            <button
              onClick={onOpenARViewer}
              className="text-[#ff3f6c] font-bold hover:underline flex items-center gap-1"
            >
              <Eye size={12} />
              <span>Preview in 3D AR →</span>
            </button>
          </div>
        </div>

        {/* Size Selection Grid */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-gray-900">SELECT SIZE</span>
            <button
              onClick={() => setShowSizeChartModal(true)}
              className="text-[#ff3f6c] hover:underline cursor-pointer"
            >
              SIZE CHART
            </button>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto py-1 no-scrollbar">
            {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => {
              const isAvailable = product.inStockSizes.includes(size);
              const isSelected = activeSize === size;
              const isRec = recommendedSize === size;

              return (
                <button
                  key={size}
                  disabled={!isAvailable}
                  onClick={() => onSelectSize(size)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all relative shrink-0 ${
                    isSelected
                      ? 'border-2 border-[#ff3f6c] text-[#ff3f6c] bg-white shadow-xs'
                      : isAvailable
                      ? 'border border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                      : 'border border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <span>{size}</span>
                  {isRec && (
                    <div
                      className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-2xs"
                      title="AI TrueFit Match"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Delivery & Services Check */}
        <div className="pt-3 border-t border-neutral-100 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 block">
            Delivery Options
          </span>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-pink-500"
              />
            </div>
            <button
              onClick={() => setIsPincodeChecked(true)}
              className="px-4 py-2 bg-neutral-900 text-white font-bold text-xs rounded-xl"
            >
              Check
            </button>
          </div>

          {isPincodeChecked && (
            <div className="bg-neutral-50 rounded-xl p-3 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                <Truck size={16} className="text-emerald-600 shrink-0" />
                <span>Get it by <b className="text-emerald-700">Tomorrow, 2 PM</b></span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-neutral-500 shrink-0" />
                <span>Easy 14 days returns & exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-neutral-500 shrink-0" />
                <span>Pay on delivery available</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Details & Specifications (Matching Full Myntra App) */}
        <div className="pt-3 border-t border-neutral-100 space-y-2.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 block">
            Product Details & Specifications
          </span>

          <p className="text-xs text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-neutral-50 p-2.5 rounded-lg">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Fabric</div>
              <div className="text-xs font-bold text-neutral-800 mt-0.5">{product.fabric}</div>
            </div>
            <div className="bg-neutral-50 p-2.5 rounded-lg">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Stretchability</div>
              <div className="text-xs font-bold text-neutral-800 mt-0.5 capitalize">{product.stretchFactor.replace('-', ' ')}</div>
            </div>
            <div className="bg-neutral-50 p-2.5 rounded-lg">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Fit</div>
              <div className="text-xs font-bold text-neutral-800 mt-0.5">{product.fitType}</div>
            </div>
            <div className="bg-neutral-50 p-2.5 rounded-lg">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Collar</div>
              <div className="text-xs font-bold text-neutral-800 mt-0.5">{product.collar}</div>
            </div>
            <div className="bg-neutral-50 p-2.5 rounded-lg">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Sleeve Style</div>
              <div className="text-xs font-bold text-neutral-800 mt-0.5">{product.sleeve}</div>
            </div>
            <div className="bg-neutral-50 p-2.5 rounded-lg">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Transparency</div>
              <div className="text-xs font-bold text-neutral-800 mt-0.5">Opaque</div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="pt-3 border-t border-neutral-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
              Customer Ratings & Fit Feedback
            </span>
            <span className="text-xs font-bold text-emerald-600">
              92% True to Size
            </span>
          </div>

          <div className="space-y-2.5">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="bg-neutral-50 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      {rev.rating} <Star size={9} className="fill-white" />
                    </span>
                    <span className="text-xs font-bold text-neutral-800">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 size={11} /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400">{rev.date}</span>
                </div>

                <div className="text-[11px] text-neutral-500 font-mono">
                  Bought Size: <b>{rev.purchasedSize}</b> {rev.userMeasurements && `· (${rev.userMeasurements})`}
                </div>

                <p className="text-xs text-neutral-700 leading-snug">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Purchase (Clean Minimalism style) */}
      <div className="h-16 border-t border-gray-200 flex items-center px-4 space-x-3 bg-white fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 shadow-xs">
        <button
          onClick={() => onToggleWishlist(product)}
          className="flex-1 h-11 border border-gray-300 rounded font-bold text-xs flex items-center justify-center space-x-2 text-gray-800 hover:bg-gray-50 active:scale-98 transition-all"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-[#ff3f6c] text-[#ff3f6c]' : 'text-gray-700'}
          />
          <span>{isWishlisted ? 'WISHLISTED' : 'WISHLIST'}</span>
        </button>

        <button
          onClick={() => onAddToCart(product, activeSize)}
          className="flex-[1.5] h-11 bg-[#ff3f6c] text-white rounded font-bold text-xs flex items-center justify-center space-x-2 hover:bg-[#ff527b] active:scale-98 transition-all shadow-sm"
        >
          <ShoppingBag size={16} />
          <span>ADD TO BAG ({activeSize})</span>
        </button>
      </div>

      {/* Size Chart Modal */}
      {showSizeChartModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-extrabold text-neutral-900 text-sm">
                Garment Measurement Chart (Inches)
              </h3>
              <button
                onClick={() => setShowSizeChartModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100 font-bold text-neutral-700">
                  <tr>
                    <th className="p-2">Size</th>
                    {['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType) ? (
                      <>
                        <th className="p-2">Waist</th>
                        <th className="p-2">Hip</th>
                        <th className="p-2">Length</th>
                      </>
                    ) : (
                      <>
                        <th className="p-2">Chest</th>
                        <th className="p-2">Shoulder</th>
                        <th className="p-2">Length</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                  {product.sizeChart.map((s) => (
                    <tr
                      key={s.size}
                      className={s.size === recommendedSize ? 'bg-pink-50 font-bold text-pink-700' : ''}
                    >
                      <td className="p-2 flex items-center gap-1">
                        {s.size}
                        {s.size === recommendedSize && (
                          <span className="text-[9px] bg-pink-600 text-white px-1 rounded">
                            YOU
                          </span>
                        )}
                      </td>
                      {['jeans', 'trousers', 'skirt', 'shorts'].includes(product.garmentType) ? (
                        <>
                          <td className="p-2">{s.waist}"</td>
                          <td className="p-2">{s.hip}"</td>
                          <td className="p-2">{s.length}"</td>
                        </>
                      ) : (
                        <>
                          <td className="p-2">{s.chest}"</td>
                          <td className="p-2">{s.shoulder}"</td>
                          <td className="p-2">{s.length}"</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-neutral-50 p-2.5 rounded-xl text-[11px] text-neutral-600">
              <b>Garment Stretch:</b> {product.stretchDescription}
            </div>

            <button
              onClick={() => setShowSizeChartModal(false)}
              className="w-full py-2.5 bg-neutral-900 text-white font-bold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
