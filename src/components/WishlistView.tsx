import React from 'react';
import { Product, UserBodyMeasurements } from '../types';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles, Check } from 'lucide-react';

interface WishlistViewProps {
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToBag: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onStartShopping: () => void;
  userMeasurements: UserBodyMeasurements;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlist,
  onRemoveFromWishlist,
  onMoveToBag,
  onSelectProduct,
  onStartShopping,
}) => {
  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-[#ff3f6c] mb-4 shadow-inner">
          <Heart size={36} className="text-[#ff3f6c]" />
        </div>
        <h2 className="text-base font-extrabold text-neutral-900">
          YOUR WISHLIST IS EMPTY
        </h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
          Save your favorite styles, measure your exact body fit, and eliminate sizing guesswork.
        </p>
        <button
          onClick={onStartShopping}
          className="mt-6 px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 active:scale-95 transition-all shadow-md"
        >
          START EXPLORING
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black uppercase text-neutral-900 tracking-wide">
            My Wishlist
          </h2>
          <p className="text-xs text-neutral-500">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Sparkles size={12} className="text-emerald-600" />
          <span>Fit Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div
              className="relative aspect-[3/4] cursor-pointer"
              onClick={() => onSelectProduct(item)}
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromWishlist(item);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-neutral-600 hover:text-red-600 flex items-center justify-center shadow-xs"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="p-2.5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-extrabold text-neutral-900 text-[11px] uppercase tracking-wide">
                  {item.brand}
                </h3>
                <p className="text-[11px] text-neutral-500 truncate">
                  {item.title}
                </p>

                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-bold text-neutral-900">
                    ₹{item.price}
                  </span>
                  <span className="text-[10px] text-neutral-400 line-through">
                    ₹{item.mrp}
                  </span>
                  <span className="text-[10px] font-bold text-[#ff3f6c]">
                    ({item.discountPercent}% OFF)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onMoveToBag(item)}
                className="mt-2.5 w-full py-1.5 rounded-lg border border-[#ff3f6c] text-[#ff3f6c] hover:bg-pink-50 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all"
              >
                <ShoppingBag size={13} />
                MOVE TO BAG
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
