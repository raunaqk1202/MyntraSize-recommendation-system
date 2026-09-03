import React from 'react';
import { Home, Compass, Sparkles, Heart, ShoppingBag } from 'lucide-react';

export type TabType = 'home' | 'fwd' | 'fit-studio' | 'wishlist' | 'bag';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  wishlistCount: number;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  wishlistCount,
  cartCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'fwd' as TabType, label: 'FWD', icon: Compass },
    { 
      id: 'fit-studio' as TabType, 
      label: 'Fit Studio', 
      icon: Sparkles,
      highlight: true
    },
    { 
      id: 'wishlist' as TabType, 
      label: 'Wishlist', 
      icon: Heart,
      badge: wishlistCount
    },
    { 
      id: 'bag' as TabType, 
      label: 'Bag', 
      icon: ShoppingBag,
      badge: cartCount
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-gray-200 max-w-md mx-auto shadow-xs font-sans">
      <div className="flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-[#ff3f6c] font-bold'
                  : 'text-gray-500 hover:text-gray-900 font-medium'
              }`}
            >
              {tab.highlight && (
                <span className="absolute -top-1 px-1.5 py-0.2 bg-[#ff3f6c] text-[8px] font-bold text-white rounded-full uppercase tracking-wider shadow-2xs">
                  AI
                </span>
              )}

              <div className="relative">
                <Icon size={19} className={isActive && tab.id === 'wishlist' ? 'fill-[#ff3f6c]' : ''} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#ff3f6c] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
