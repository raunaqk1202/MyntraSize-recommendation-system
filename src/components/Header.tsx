import React from 'react';
import { Search, Camera, Mic, Heart, ShoppingBag } from 'lucide-react';
import { MyntraLogo } from './MyntraLogo';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wishlistCount: number;
  cartCount: number;
  onOpenWishlist: () => void;
  onOpenBag: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  wishlistCount,
  cartCount,
  onOpenWishlist,
  onOpenBag,
  onLogoClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2.5 shadow-2xs font-sans">
      <div className="flex items-center justify-between gap-3">
        {/* Authentic Myntra Brand Logo */}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-2 cursor-pointer active:scale-98 transition-transform shrink-0"
        >
          <MyntraLogo size="md" showWordmark={true} />
          <span className="text-gray-300 font-light text-xs">|</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            FitStudio
          </span>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0 text-gray-700">
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
            title="Wishlist"
          >
            <Heart size={19} className={wishlistCount > 0 ? 'fill-[#ff3f6c] text-[#ff3f6c]' : ''} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#ff3f6c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenBag}
            className="relative p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
            title="Shopping Bag"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#ff3f6c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar with Camera & Mic */}
      <div className="mt-2 relative flex items-center">
        <div className="absolute left-3 text-gray-400 pointer-events-none">
          <Search size={15} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products, brands, fits..."
          className="w-full bg-gray-100 hover:bg-gray-150 focus:bg-white text-xs text-gray-800 rounded-lg pl-9 pr-16 py-2 border border-transparent focus:border-gray-300 focus:outline-none transition-all placeholder:text-gray-400 font-medium"
        />
        <div className="absolute right-2.5 flex items-center gap-1.5 text-gray-400">
          <button type="button" className="hover:text-gray-600 transition-colors" title="Visual Search">
            <Camera size={14} />
          </button>
          <button type="button" className="hover:text-gray-600 transition-colors" title="Voice Search">
            <Mic size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
