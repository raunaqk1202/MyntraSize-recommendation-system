import React, { useState } from 'react';
import { CartItem } from '../types';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onChangeSize: (id: string, newSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  onStartShopping: () => void;
  onClearCart: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onChangeSize,
  onStartShopping,
  onClearCart,
}) => {
  const [couponCode, setCouponCode] = useState('FITMYNTRA');
  const [couponApplied, setCouponApplied] = useState(true);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Price calculations
  const totalMrp = items.reduce((sum, item) => sum + (item.product.mrp * item.quantity), 0);
  const totalSellingPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountOnMrp = totalMrp - totalSellingPrice;
  const couponDiscount = couponApplied && items.length > 0 ? 200 : 0;
  const totalAmount = Math.max(0, totalSellingPrice - couponDiscount);

  const handlePlaceOrder = () => {
    setIsOrderPlaced(true);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff3f6c', '#ff527b', '#00bfa5', '#3b82f6']
    });
  };

  const handleContinueAfterOrder = () => {
    setIsOrderPlaced(false);
    onClearCart();
    onStartShopping();
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-lg border border-emerald-100">
          <PackageCheck size={42} />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
          ORDER CONFIRMED
        </span>
        <h2 className="text-xl font-black text-neutral-900 mt-2">
          Thank you for shopping!
        </h2>
        <p className="text-xs text-neutral-600 mt-1 max-w-xs leading-relaxed">
          Order ID: <b className="font-mono text-neutral-800">#MYN-{Math.floor(100000 + Math.random() * 900000)}</b>
        </p>
        <div className="mt-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-left max-w-xs w-full text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <ShieldCheck size={16} />
            <span>Zero Return Fit Guarantee Active</span>
          </div>
          <p className="text-neutral-500 text-[11px] leading-relaxed">
            All apparel items are tailored to your inputted chest & shoulder measurements. Estimated delivery by <b>Tomorrow, 2 PM</b>.
          </p>
        </div>
        <button
          onClick={handleContinueAfterOrder}
          className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white font-extrabold text-xs shadow-lg shadow-pink-600/30 active:scale-95 transition-all"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-[#ff3f6c] mb-4 shadow-inner">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-base font-extrabold text-neutral-900">
          HEY, YOUR BAG IS EMPTY!
        </h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
          There is nothing in your bag. Explore top brands and let FitStudio recommend your exact size.
        </p>
        <button
          onClick={onStartShopping}
          className="mt-6 px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 active:scale-95 transition-all shadow-md"
        >
          EXPLORE CATALOG
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-28 space-y-4">
      {/* Zero Return Anxiety Header Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-2.5 text-emerald-800">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
        <div className="text-xs">
          <span className="font-bold">Zero Return Sizing:</span> Products in your bag are calibrated to your body measurements.
        </div>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-neutral-200 p-3 flex gap-3 shadow-xs"
          >
            {/* Thumbnail */}
            <div className="w-20 h-26 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
              <img
                src={item.product.images[0]}
                alt={item.product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-neutral-900 text-xs uppercase tracking-wide">
                      {item.product.brand}
                    </h3>
                    <p className="text-xs text-neutral-500 truncate max-w-[170px]">
                      {item.product.title}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Size & Quantity Row */}
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="flex items-center gap-1 bg-neutral-100 px-2 py-0.5 rounded text-xs font-semibold text-neutral-700">
                    <span>Size:</span>
                    <select
                      value={item.selectedSize}
                      onChange={(e) =>
                        onChangeSize(
                          item.id,
                          e.target.value as 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
                        )
                      }
                      className="bg-transparent font-bold text-neutral-900 focus:outline-none cursor-pointer"
                    >
                      {item.product.inStockSizes.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 border border-neutral-200 rounded-lg px-2 py-0.5 text-xs">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="text-neutral-500 hover:text-neutral-900"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-bold text-neutral-900 px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="text-neutral-500 hover:text-neutral-900"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-2 mt-2 pt-1 border-t border-neutral-100">
                <span className="text-sm font-bold text-neutral-900">
                  ₹{item.product.price * item.quantity}
                </span>
                <span className="text-[11px] text-neutral-400 line-through">
                  ₹{item.product.mrp * item.quantity}
                </span>
                <span className="text-[11px] font-bold text-[#ff3f6c]">
                  ({item.product.discountPercent}% OFF)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupons Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3.5 space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
          <Tag size={14} className="text-[#ff3f6c]" /> Coupons & Offers
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none focus:border-pink-500"
          />
          <button
            onClick={() => setCouponApplied(!couponApplied)}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors ${
              couponApplied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-neutral-900 text-white'
            }`}
          >
            {couponApplied ? 'Applied ✓' : 'Apply'}
          </button>
        </div>
        {couponApplied && (
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Check size={12} /> Saved extra ₹200 with FITMYNTRA
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3.5 space-y-2.5 text-xs">
        <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 block pb-1 border-b border-neutral-100">
          Price Details ({items.length} {items.length === 1 ? 'Item' : 'Items'})
        </span>

        <div className="flex justify-between text-neutral-600">
          <span>Total MRP</span>
          <span>₹{totalMrp}</span>
        </div>

        <div className="flex justify-between text-neutral-600">
          <span>Discount on MRP</span>
          <span className="text-emerald-600 font-bold">-₹{discountOnMrp}</span>
        </div>

        {couponApplied && (
          <div className="flex justify-between text-neutral-600">
            <span>Coupon Discount</span>
            <span className="text-emerald-600 font-bold">-₹{couponDiscount}</span>
          </div>
        )}

        <div className="flex justify-between text-neutral-600">
          <span>Convenience / Shipping</span>
          <span className="text-emerald-600 font-bold">FREE</span>
        </div>

        <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-100">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      {/* Sticky Place Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 max-w-md mx-auto flex items-center justify-between shadow-2xl">
        <div>
          <div className="text-[10px] text-neutral-500 uppercase font-semibold">Total Payable</div>
          <div className="text-base font-extrabold text-neutral-900">₹{totalAmount}</div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-pink-600/30 active:scale-95 hover:brightness-105 transition-all"
        >
          <span>PLACE ORDER</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
