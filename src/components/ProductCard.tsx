import React from 'react';
import { Product } from '../types';
import { Heart, Star, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickFitCheck?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickFitCheck,
}) => {
  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-2xs hover:shadow-xs transition-all flex flex-col cursor-pointer font-sans"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#fafafc]">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-600 hover:text-[#ff3f6c] shadow-xs transition-transform active:scale-90"
        >
          <Heart
            size={15}
            className={isWishlisted ? 'fill-[#ff3f6c] text-[#ff3f6c]' : 'text-gray-700'}
          />
        </button>

        {/* Rating Pill */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-gray-800 flex items-center gap-1 shadow-2xs border border-gray-100">
          <span>{product.rating}</span>
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-gray-300 font-normal">|</span>
          <span className="text-gray-500 font-medium">
            {product.ratingCount > 1000 ? `${(product.ratingCount / 1000).toFixed(1)}k` : product.ratingCount}
          </span>
        </div>

        {/* 3D Fit Badge */}
        <div className="absolute top-2.5 left-2.5 bg-gray-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
          <Sparkles size={10} className="text-pink-300" />
          <span>TrueFit™ 3D</span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-xs tracking-wide uppercase">
              {product.brand}
            </h3>
            <span className="text-[10px] font-semibold text-gray-400 capitalize">
              {product.stretchFactor === 'non-stretch' ? 'Rigid' : product.stretchFactor.replace('-', ' ')}
            </span>
          </div>

          <p className="text-xs text-gray-500 truncate mt-0.5">
            {product.title}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-sm font-bold text-gray-900">
              ₹{product.price}
            </span>
            <span className="text-[11px] text-gray-400 line-through">
              ₹{product.mrp}
            </span>
            <span className="text-[11px] font-bold text-orange-500">
              ({product.discountPercent}% OFF)
            </span>
          </div>
        </div>

        {/* Fit Guarantee Tag */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-emerald-700">
          <span className="flex items-center gap-1 font-semibold">
            <Check size={12} className="text-emerald-600" /> TrueFit Match
          </span>
          <span className="text-gray-400 font-mono text-[9px]">Zero Return</span>
        </div>
      </div>
    </div>
  );
};
