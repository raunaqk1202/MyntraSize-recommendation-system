export type StretchFactor = 'non-stretch' | 'low-stretch' | 'medium-stretch' | 'high-stretch';

export type FitPreference = 'slim' | 'regular' | 'relaxed';

export interface GarmentSizeMeasurement {
  size: string;
  chest: number; // in inches
  shoulder: number; // in inches
  length: number; // in inches (front length / outseam)
  sleeveLength?: number;
  waist?: number; // for bottom wear
  hip?: number; // for bottom wear
  inseam?: number; // for bottom wear
  thigh?: number; // for bottom wear
}

export interface UserBodyMeasurements {
  shoulder: number; // in inches (e.g. 15.0 - 22.0)
  chest: number; // in inches (e.g. 32.0 - 52.0)
  frontLength: number; // in inches (e.g. 24.0 - 34.0)
  waist?: number; // in inches
  hip?: number; // in inches
  inseam?: number; // in inches
  heightCm?: number;
  weightKg?: number;
  fitPreference: FitPreference;
  unit: 'in' | 'cm';
}

export interface FitRecommendation {
  recommendedSize: string;
  confidenceScore: number; // e.g. 98%
  chestFit: 'tight' | 'perfect' | 'roomy';
  shoulderFit: 'tight' | 'perfect' | 'roomy';
  lengthFit: 'short' | 'perfect' | 'long';
  easeDetails: {
    chestEase: number;
    shoulderEase: number;
    lengthDiff: number;
  };
  explanation: string;
  stretchBenefitNote: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  userMeasurements?: string;
  purchasedSize: string;
}

export interface Product {
  id: string;
  brand: string;
  title: string;
  category: 'men' | 'women' | 'fwd' | 'ethnic';
  subcategory: string;
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  images: string[];
  color: string;
  colorHex: string;
  garmentType: 'shirt' | 'tshirt' | 'dress' | 'kurta' | 'jacket' | 'jeans' | 'trousers' | 'skirt' | 'shorts';
  fabric: string;
  stretchFactor: StretchFactor;
  stretchDescription: string;
  fitType: string;
  collar: string;
  sleeve: string;
  careInstructions: string[];
  sizeChart: GarmentSizeMeasurement[];
  inStockSizes: string[];
  description: string;
  highlights: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  quantity: number;
  recommendedForUser?: boolean;
}
