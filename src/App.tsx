import React, { useState, useEffect } from 'react';
import { 
  Product, 
  UserBodyMeasurements, 
  CartItem, 
  FitRecommendation 
} from './types';
import { PRODUCTS } from './data/products';
import { calculateFitRecommendation } from './utils/fitEngine';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { SizeRecommendationModal } from './components/SizeRecommendationModal';
import { ARFitViewer } from './components/ARFitViewer';
import { WishlistView } from './components/WishlistView';
import { CartView } from './components/CartView';
import { FitProfileView } from './components/FitProfileView';
import { 
  Sparkles, 
  SlidersHorizontal, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Check, 
  X,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';

const DEFAULT_MEASUREMENTS: UserBodyMeasurements = {
  shoulder: 18.0,
  chest: 40.0,
  frontLength: 29.0,
  fitPreference: 'regular',
  unit: 'in'
};

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Measurements State
  const [userMeasurements, setUserMeasurements] = useState<UserBodyMeasurements>(() => {
    const saved = localStorage.getItem('myntra_fit_measurements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_MEASUREMENTS;
      }
    }
    return DEFAULT_MEASUREMENTS;
  });

  // Selected Product State
  const [activeSize, setActiveSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'>('L');
  const [showFitModal, setShowFitModal] = useState<boolean>(false);
  const [showARViewer, setShowARViewer] = useState<boolean>(false);

  // Cart & Wishlist State (Persistent in local storage, no login needed!)
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('myntra_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [PRODUCTS[0], PRODUCTS[2]]; // Pre-populate 2 sample favorites to showcase wishlist
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('myntra_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  // Save measurements
  const handleSaveMeasurements = (measurements: UserBodyMeasurements) => {
    setUserMeasurements(measurements);
    localStorage.setItem('myntra_fit_measurements', JSON.stringify(measurements));
  };

  // Save wishlist
  useEffect(() => {
    localStorage.setItem('myntra_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save cart
  useEffect(() => {
    localStorage.setItem('myntra_cart', JSON.stringify(cart));
  }, [cart]);

  // Current product's recommendation
  const currentProduct = selectedProduct || PRODUCTS[0];
  const fitRec: FitRecommendation = calculateFitRecommendation(
    userMeasurements,
    currentProduct.sizeChart,
    currentProduct.stretchFactor,
    currentProduct.garmentType
  );

  // When product changes, automatically calibrate recommended size
  useEffect(() => {
    if (selectedProduct) {
      const rec = calculateFitRecommendation(
        userMeasurements,
        selectedProduct.sizeChart,
        selectedProduct.stretchFactor,
        selectedProduct.garmentType
      );
      setActiveSize(rec.recommendedSize);
    }
  }, [selectedProduct, userMeasurements]);

  const triggerToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Wishlist Toggle
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      triggerToast('Removed from Wishlist', product.title);
    } else {
      setWishlist((prev) => [...prev, product]);
      triggerToast('Saved to Wishlist ❤️', `${product.brand} - ${product.title}`);
    }
  };

  // Add to Cart
  const handleAddToCart = (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: `${product.id}-${size}-${Date.now()}`,
          product,
          selectedSize: size,
          quantity: 1,
          recommendedForUser: size === fitRec.recommendedSize,
        },
      ]);
    }

    triggerToast(
      'Added to Bag 🛍️',
      `${product.brand} (Size ${size}) calibrated to your measurements.`
    );
  };

  // Apply Fit Recommendation from Modal
  const handleApplyRecommendation = (rec: FitRecommendation) => {
    setActiveSize(rec.recommendedSize);
    triggerToast(
      `Size ${rec.recommendedSize} Auto-Selected! ✓`,
      `${rec.confidenceScore}% match for your ${userMeasurements.chest}" chest & ${userMeasurements.shoulder}" shoulder with ${userMeasurements.fitPreference} fit.`
    );
  };

  // Filter products by category and search
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Men'
        ? product.category === 'men'
        : activeCategory === 'Women'
        ? product.category === 'women'
        : activeCategory === 'Ethnic'
        ? product.category === 'ethnic'
        : activeCategory === 'FWD'
        ? product.category === 'fwd'
        : activeCategory === 'Shirts'
        ? product.garmentType === 'shirt'
        : activeCategory === 'Dresses'
        ? product.garmentType === 'dress'
        : true;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.fabric.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <MobileDeviceFrame>
      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <aside aria-label="Notifications" className="fixed top-12 left-4 right-4 z-50 bg-neutral-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between border border-neutral-700 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0">
              <Check size={16} />
            </div>
            <div>
              <div className="text-xs font-bold">{toastMessage.title}</div>
              <div className="text-[11px] text-neutral-300 leading-tight">
                {toastMessage.desc}
              </div>
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X size={16} />
          </button>
        </aside>
      )}

      {/* Main Header (When not viewing product details) */}
      {!selectedProduct && (
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          wishlistCount={wishlist.length}
          cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
          onOpenWishlist={() => setActiveTab('wishlist')}
          onOpenBag={() => setActiveTab('bag')}
          onLogoClick={() => {
            setActiveTab('home');
            setActiveCategory('All');
            setSearchQuery('');
          }}
        />
      )}

      {/* VIEW ROUTER */}
      {selectedProduct ? (
        /* PRODUCT DETAIL PAGE (PDP) */
        <ProductDetail
          product={selectedProduct}
          userMeasurements={userMeasurements}
          recommendedSize={fitRec.recommendedSize}
          activeSize={activeSize}
          isWishlisted={wishlist.some((p) => p.id === selectedProduct.id)}
          onBack={() => setSelectedProduct(null)}
          onToggleWishlist={handleToggleWishlist}
          onSelectSize={setActiveSize}
          onOpenFitEngine={() => setShowFitModal(true)}
          onOpenARViewer={() => setShowARViewer(true)}
          onAddToCart={handleAddToCart}
          cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
          onOpenBag={() => {
            setSelectedProduct(null);
            setActiveTab('bag');
          }}
        />
      ) : activeTab === 'wishlist' ? (
        /* WISHLIST VIEW */
        <WishlistView
          wishlist={wishlist}
          onRemoveFromWishlist={(prod) =>
            setWishlist((prev) => prev.filter((p) => p.id !== prod.id))
          }
          onMoveToBag={(prod) => {
            handleAddToCart(prod, 'L');
            setWishlist((prev) => prev.filter((p) => p.id !== prod.id));
          }}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          onStartShopping={() => setActiveTab('home')}
          userMeasurements={userMeasurements}
        />
      ) : activeTab === 'bag' ? (
        /* BAG / CART VIEW */
        <CartView
          items={cart}
          onUpdateQuantity={(id, delta) => {
            setCart((prev) =>
              prev
                .map((item) => {
                  if (item.id === id) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                  }
                  return item;
                })
                .filter(Boolean) as CartItem[]
            );
          }}
          onRemoveItem={(id) => setCart((prev) => prev.filter((i) => i.id !== id))}
          onChangeSize={(id, newSize) => {
            setCart((prev) =>
              prev.map((i) => (i.id === id ? { ...i, selectedSize: newSize } : i))
            );
          }}
          onStartShopping={() => setActiveTab('home')}
          onClearCart={() => setCart([])}
        />
      ) : activeTab === 'fit-studio' ? (
        /* FIT STUDIO PROFILE VIEW */
        <FitProfileView
          measurements={userMeasurements}
          onUpdateMeasurements={handleSaveMeasurements}
          onOpenARWithSample={() => {
            setSelectedProduct(PRODUCTS[0]);
            setShowARViewer(true);
          }}
          onStartShopping={() => setActiveTab('home')}
        />
      ) : (
        /* HOME / FWD CATALOG VIEW */
        <div className="pb-24 space-y-3.5 bg-white min-h-full font-sans">
          {/* Category Pills Bar */}
          <div className="bg-white px-3 py-2 border-b border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Men', 'Women', 'Ethnic', 'Shirts', 'Dresses', 'FWD'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hero Promotional Banner with TrueFit™ Feature Highlight (Clean Minimalism) */}
          <div className="px-3">
            <div className="bg-[#fff5f7] border border-[#ffdce3] rounded-xl p-4 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ff3f6c] bg-white px-2 py-0.5 rounded border border-[#ffdce3] w-fit shadow-2xs">
                  <Sparkles size={11} />
                  <span>TrueFit™ AI Guarantee</span>
                </div>
                <h2 className="text-base font-bold mt-2 text-gray-900 leading-tight">
                  Stop Guessing Your Size.
                </h2>
                <p className="text-xs text-gray-600 mt-1 leading-normal max-w-[280px]">
                  Input shoulder, chest & torso once. Our engine calculates garment stretch and renders your virtual 3D avatar in AR.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setShowFitModal(true)}
                    className="px-3.5 py-1.5 bg-[#ff3f6c] text-white font-bold text-xs rounded hover:bg-[#ff527b] active:scale-98 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>Calibrate Measurements</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(PRODUCTS[0]);
                      setShowARViewer(true);
                    }}
                    className="px-3 py-1.5 bg-white text-gray-800 border border-gray-200 font-bold text-xs rounded hover:bg-gray-50 active:scale-98 transition-colors"
                  >
                    Launch 3D Avatar
                  </button>
                </div>
              </div>
            </div>
          </div>



          {/* Deals of the Day Ticker */}
          <div className="px-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide text-gray-800">
              <Flame size={15} className="text-orange-500 fill-orange-500" />
              <span>Trending Apparel ({filteredProducts.length})</span>
            </div>
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              TrueFit Ready
            </span>
          </div>

          {/* Product Grid */}
          <div className="px-3 grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.some((p) => p.id === product.id)}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                }}
                onQuickFitCheck={(p) => {
                  setSelectedProduct(p);
                  setShowFitModal(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedProduct(null);
          setActiveTab(tab);
        }}
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
      />

      {/* Size Recommendation Engine Modal */}
      {showFitModal && (
        <SizeRecommendationModal
          product={currentProduct}
          userMeasurements={userMeasurements}
          onSaveMeasurements={handleSaveMeasurements}
          onApplyRecommendation={handleApplyRecommendation}
          onOpenARViewer={() => {
            setShowFitModal(false);
            setShowARViewer(true);
          }}
          onClose={() => setShowFitModal(false)}
        />
      )}

      {/* 3D Augmented Reality Fit Viewer with Parametric Virtual Avatar */}
      {showARViewer && (
        <ARFitViewer
          product={currentProduct}
          userMeasurements={userMeasurements}
          activeSize={activeSize}
          recommendedSize={fitRec.recommendedSize}
          onSelectSize={setActiveSize}
          onClose={() => setShowARViewer(false)}
          onEditMeasurements={() => {
            setShowARViewer(false);
            setShowFitModal(true);
          }}
        />
      )}
    </MobileDeviceFrame>
  );
}
