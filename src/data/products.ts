import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'myntra-001',
    brand: 'ROADSTER',
    title: 'Men Pure Cotton Regular Fit Solid Casual Shirt',
    category: 'men',
    subcategory: 'Shirts',
    price: 799,
    mrp: 1999,
    discountPercent: 60,
    rating: 4.2,
    ratingCount: 4820,
    color: 'Olive Green',
    colorHex: '#526E48',
    garmentType: 'shirt',
    fabric: '100% Pure Combed Cotton',
    stretchFactor: 'non-stretch',
    stretchDescription: 'Rigid 100% cotton weave. Zero elastane stretch. Requires natural room to breathe.',
    fitType: 'Regular Fit',
    collar: 'Spread Collar',
    sleeve: 'Long Sleeves with button cuffs',
    careInstructions: [
      'Machine wash 30°C gentle cycle',
      'Warm iron if needed',
      'Do not bleach',
      'Wash inside out with similar colors'
    ],
    inStockSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeChart: [
      { size: 'XS', chest: 37, shoulder: 16.0, length: 27.5, sleeveLength: 24.0 },
      { size: 'S', chest: 39, shoulder: 16.8, length: 28.5, sleeveLength: 24.5 },
      { size: 'M', chest: 41, shoulder: 17.5, length: 29.5, sleeveLength: 25.0 },
      { size: 'L', chest: 43.5, shoulder: 18.3, length: 30.5, sleeveLength: 25.5 },
      { size: 'XL', chest: 46, shoulder: 19.2, length: 31.5, sleeveLength: 26.0 },
      { size: 'XXL', chest: 49, shoulder: 20.0, length: 32.5, sleeveLength: 26.5 }
    ],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A versatile everyday casual shirt cut from breathable pure combed cotton. Features a spread collar, curved hemline, patch pocket on the chest, and single button rounded cuffs.',
    highlights: [
      '100% Breathable cotton for all-day comfort',
      'Pre-washed fabric to resist post-wash shrinkage',
      'Curved hem designed to be worn tucked or untucked',
      'Zero-return assurance with FitStudio body mapping'
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Arun K.',
        rating: 5,
        date: '24 Aug 2026',
        verified: true,
        purchasedSize: 'L',
        userMeasurements: 'Chest: 40", Shoulder: 18"',
        comment: 'FitStudio suggested size L for my 40" chest and it fits like it was tailored for me! No pulling across shoulders when driving.'
      },
      {
        id: 'r2',
        author: 'Rohan Sharma',
        rating: 4,
        date: '18 Aug 2026',
        verified: true,
        purchasedSize: 'M',
        userMeasurements: 'Chest: 38", Shoulder: 17"',
        comment: 'Fabric feels premium. The AR fit avatar showed accurate shoulder placement before ordering.'
      }
    ]
  },
  {
    id: 'myntra-002',
    brand: "LEVI'S",
    title: 'Men Barstow Western Denim Shirt with Stretch',
    category: 'men',
    subcategory: 'Shirts',
    price: 1899,
    mrp: 3299,
    discountPercent: 42,
    rating: 4.5,
    ratingCount: 3120,
    color: 'Washed Indigo',
    colorHex: '#3B5998',
    garmentType: 'shirt',
    fabric: '98% Cotton, 2% Elastane',
    stretchFactor: 'low-stretch',
    stretchDescription: 'Authentic 2% comfort stretch gives flex during movement while retaining classic denim structure.',
    fitType: 'Slim Fit',
    collar: 'Spread Collar',
    sleeve: 'Long Sleeves',
    careInstructions: [
      'Cold wash with mild detergent',
      'Wash inside out to preserve indigo wash',
      'Line dry in shade'
    ],
    inStockSizes: ['S', 'M', 'L', 'XL'],
    sizeChart: [
      { size: 'XS', chest: 36, shoulder: 15.8, length: 27.0, sleeveLength: 24.0 },
      { size: 'S', chest: 38, shoulder: 16.5, length: 28.0, sleeveLength: 24.5 },
      { size: 'M', chest: 40.5, shoulder: 17.3, length: 29.0, sleeveLength: 25.0 },
      { size: 'L', chest: 43, shoulder: 18.0, length: 30.0, sleeveLength: 25.5 },
      { size: 'XL', chest: 45.5, shoulder: 18.8, length: 31.0, sleeveLength: 26.0 },
      { size: 'XXL', chest: 48, shoulder: 19.5, length: 32.0, sleeveLength: 26.5 }
    ],
    images: [
      'https://images.unsplash.com/photo-1588731234159-8b9963143fca?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80'
    ],
    description: "Classic American western styling with pointed shoulder yokes, pearl snap buttons, and Levi's signature Red Tab on the left pocket.",
    highlights: [
      'Authentic Western pointed yoke styling',
      'Durable denim fabric infused with 2% stretch',
      'Snap button closures for signature rugged aesthetic'
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Vikram Mehta',
        rating: 5,
        date: '12 Aug 2026',
        verified: true,
        purchasedSize: 'L',
        userMeasurements: 'Chest: 41", Shoulder: 18.2"',
        comment: 'I usually hesitate buying denim shirts online due to stiff shoulders. Size L with stretch was spot on.'
      }
    ]
  },
  {
    id: 'myntra-003',
    brand: 'H&M',
    title: 'Women Wrap V-Neck Tie-Up Fit & Flare Dress',
    category: 'women',
    subcategory: 'Dresses',
    price: 1499,
    mrp: 2999,
    discountPercent: 50,
    rating: 4.4,
    ratingCount: 2240,
    color: 'Burgundy Crimson',
    colorHex: '#800020',
    garmentType: 'dress',
    fabric: '95% Viscose, 5% Elastane Jersey',
    stretchFactor: 'medium-stretch',
    stretchDescription: 'Silky smooth viscose-jersey with 5% elastane. Drapes gracefully and moves with your body.',
    fitType: 'Fit and Flare',
    collar: 'Surplice V-Neck',
    sleeve: 'Short Flutter Sleeves',
    careInstructions: [
      'Machine wash cold at 30°C',
      'Do not tumble dry',
      'Iron on reverse with low heat'
    ],
    inStockSizes: ['XS', 'S', 'M', 'L', 'XL'],
    sizeChart: [
      { size: 'XS', chest: 33, shoulder: 14.5, length: 38.0 },
      { size: 'S', chest: 35, shoulder: 15.2, length: 39.0 },
      { size: 'M', chest: 37.5, shoulder: 16.0, length: 40.0 },
      { size: 'L', chest: 40.5, shoulder: 16.8, length: 41.0 },
      { size: 'XL', chest: 43.5, shoulder: 17.6, length: 42.0 },
      { size: 'XXL', chest: 46.5, shoulder: 18.5, length: 43.0 }
    ],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An elegant wrap dress cut in fluid jersey fabric. Designed with a crossover V-neck bodice, tie belt at the waist to cinch the silhouette, and a flared A-line hem.',
    highlights: [
      'Wrap silhouette that flatters diverse waistlines',
      'Medium stretch accommodates active motion without creases',
      'Ideal for Sunday brunch or evening dinners'
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Pooja Nair',
        rating: 5,
        date: '02 Sep 2026',
        verified: true,
        purchasedSize: 'M',
        userMeasurements: 'Chest: 36", Shoulder: 15.5"',
        comment: 'The 3D virtual avatar was uncanny! I saw how the wrap neckline would fit my bustline and bought M. Perfect fit.'
      }
    ]
  },
  {
    id: 'myntra-004',
    brand: 'ANOUK',
    title: 'Women Printed Pure Cotton Straight Kurta with Palazzos',
    category: 'ethnic',
    subcategory: 'Kurtas & Sets',
    price: 1199,
    mrp: 2999,
    discountPercent: 60,
    rating: 4.3,
    ratingCount: 5690,
    color: 'Teal Blue & Gold',
    colorHex: '#005f73',
    garmentType: 'kurta',
    fabric: '100% Cotton with Foil Print Accents',
    stretchFactor: 'non-stretch',
    stretchDescription: 'Traditional woven pure cotton. Structured ethnic silhouette requiring standard ease.',
    fitType: 'Straight Fit',
    collar: 'Mandarin Collar with Notch',
    sleeve: 'Three-Quarter Sleeves',
    careInstructions: [
      'Hand wash recommended for first 2 washes',
      'Do not iron directly on gold foil prints'
    ],
    inStockSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeChart: [
      { size: 'XS', chest: 34, shoulder: 14.2, length: 42.0 },
      { size: 'S', chest: 36, shoulder: 14.8, length: 43.0 },
      { size: 'M', chest: 38.5, shoulder: 15.5, length: 44.0 },
      { size: 'L', chest: 41, shoulder: 16.2, length: 45.0 },
      { size: 'XL', chest: 44, shoulder: 17.0, length: 45.5 },
      { size: 'XXL', chest: 47, shoulder: 17.8, length: 46.0 }
    ],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Adorned in ethnic botanical motifs with subtle metallic foil highlights. Straight cut with side slits for easy movement, paired with matching solid cropped palazzos.',
    highlights: [
      'Pure breathable cotton ideal for Indian climate',
      'Comfortable side-slit cut allows seamless seating',
      'Vibrant colorfast dyes maintain freshness after washing'
    ],
    reviews: [
      {
        id: 'r5',
        author: 'Sunita Rao',
        rating: 5,
        date: '28 Aug 2026',
        verified: true,
        purchasedSize: 'XL',
        userMeasurements: 'Chest: 42", Shoulder: 16.8"',
        comment: 'As someone in my 50s who hates returns, the size engine accurately warned me to pick XL because cotton has zero stretch. Fit like a dream!'
      }
    ]
  },
  {
    id: 'myntra-005',
    brand: 'HIGHLANDER',
    title: 'Men Slim Fit Solid Ribbed Knit Crew Neck T-shirt',
    category: 'men',
    subcategory: 'T-Shirts',
    price: 499,
    mrp: 1199,
    discountPercent: 58,
    rating: 4.1,
    ratingCount: 6810,
    color: 'Charcoal Black',
    colorHex: '#222222',
    garmentType: 'tshirt',
    fabric: '92% Cotton, 8% Elastane Ribbed Knit',
    stretchFactor: 'high-stretch',
    stretchDescription: 'High-density 8% elastane 2x2 ribbed knit. Offers 4-way stretch and recovers shape instantly.',
    fitType: 'Slim Fit',
    collar: 'Ribbed Crew Neck',
    sleeve: 'Short Sleeves',
    careInstructions: ['Machine wash cold', 'Do not wring', 'Dry flat in shade'],
    inStockSizes: ['S', 'M', 'L', 'XL'],
    sizeChart: [
      { size: 'XS', chest: 34, shoulder: 15.0, length: 26.0 },
      { size: 'S', chest: 36, shoulder: 15.8, length: 26.8 },
      { size: 'M', chest: 38.5, shoulder: 16.5, length: 27.5 },
      { size: 'L', chest: 41, shoulder: 17.3, length: 28.5 },
      { size: 'XL', chest: 43.5, shoulder: 18.0, length: 29.5 },
      { size: 'XXL', chest: 46, shoulder: 18.8, length: 30.5 }
    ],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Elevated basic t-shirt in premium ribbed texture. Tailored to hug the upper torso and arms while providing supreme stretch freedom.',
    highlights: [
      'Ribbed knit texture adds dimension',
      'High stretch fabric conforms to torso movements',
      'No shoulder seam dragging'
    ],
    reviews: [
      {
        id: 'r6',
        author: 'Deepak V.',
        rating: 4,
        date: '20 Aug 2026',
        verified: true,
        purchasedSize: 'L',
        comment: 'Great stretch. Size L hugged my chest nicely without suffocating.'
      }
    ]
  },
  {
    id: 'myntra-006',
    brand: 'MANGO',
    title: 'Women Structured Lapel Blazer with Stretch Lining',
    category: 'women',
    subcategory: 'Jackets & Blazers',
    price: 3499,
    mrp: 6990,
    discountPercent: 50,
    rating: 4.6,
    ratingCount: 890,
    color: 'Camel Beige',
    colorHex: '#C19A6B',
    garmentType: 'jacket',
    fabric: '64% Polyester, 32% Viscose, 4% Elastane',
    stretchFactor: 'low-stretch',
    stretchDescription: 'Tailored suiting weave with 4% elastane stretch across shoulder blades.',
    fitType: 'Tailored Fit',
    collar: 'Notched Lapel',
    sleeve: 'Long Sleeves',
    careInstructions: ['Dry clean only', 'Low temperature steam iron'],
    inStockSizes: ['XS', 'S', 'M', 'L', 'XL'],
    sizeChart: [
      { size: 'XS', chest: 34, shoulder: 14.8, length: 27.0 },
      { size: 'S', chest: 36, shoulder: 15.5, length: 27.8 },
      { size: 'M', chest: 38.5, shoulder: 16.2, length: 28.5 },
      { size: 'L', chest: 41, shoulder: 17.0, length: 29.2 },
      { size: 'XL', chest: 44, shoulder: 17.8, length: 30.0 },
      { size: 'XXL', chest: 47, shoulder: 18.6, length: 30.8 }
    ],
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sharp, modern single-breasted blazer featuring tort shell buttons, structured padded shoulders, flap pockets, and back vent for ease of motion.',
    highlights: [
      'Architectural shoulder pads create confident posture',
      'Flexible back shoulder panel avoids tightness when typing',
      'Premium matte suiting fabric'
    ],
    reviews: [
      {
        id: 'r7',
        author: 'Malini K.',
        rating: 5,
        date: '15 Aug 2026',
        verified: true,
        purchasedSize: 'M',
        userMeasurements: 'Chest: 37", Shoulder: 16.1"',
        comment: 'Blazers are always a nightmare online. The AR avatar showed me that M has the exact shoulder width I needed. Fits like custom bespoke!'
      }
    ]
  },
  {
    id: 'myntra-007',
    brand: 'WROGN',
    title: 'Men Boxy Relaxed Fit Checked Casual Shirt',
    category: 'fwd',
    subcategory: 'Shirts',
    price: 1049,
    mrp: 2499,
    discountPercent: 58,
    rating: 4.3,
    ratingCount: 1420,
    color: 'Navy & Rust Plaid',
    colorHex: '#1B263B',
    garmentType: 'shirt',
    fabric: '100% Combed Yarn-Dyed Cotton',
    stretchFactor: 'non-stretch',
    stretchDescription: 'Heavyweight cotton flannel with natural drape. Cut extra roomy for relaxed streetwear silhouette.',
    fitType: 'Relaxed Fit',
    collar: 'Camp Collar',
    sleeve: 'Long Drop-Shoulder Sleeves',
    careInstructions: ['Machine wash warm', 'Warm iron'],
    inStockSizes: ['S', 'M', 'L', 'XL'],
    sizeChart: [
      { size: 'XS', chest: 40, shoulder: 18.0, length: 28.0 },
      { size: 'S', chest: 42, shoulder: 18.8, length: 29.0 },
      { size: 'M', chest: 44, shoulder: 19.5, length: 30.0 },
      { size: 'L', chest: 46.5, shoulder: 20.3, length: 31.0 },
      { size: 'XL', chest: 49, shoulder: 21.0, length: 32.0 },
      { size: 'XXL', chest: 52, shoulder: 21.8, length: 33.0 }
    ],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'On-trend drop shoulder casual overshirt. Can be worn open as an overshirt over a white tee or buttoned up.',
    highlights: [
      'Streetwear drop-shoulder relaxed silhouette',
      'Yarn-dyed cotton maintains color depth',
      'Camp collar casual aesthetic'
    ],
    reviews: [
      {
        id: 'r8',
        author: 'Kabir G.',
        rating: 4,
        date: '10 Aug 2026',
        verified: true,
        purchasedSize: 'M',
        comment: 'Already has a built-in oversized drop. Size engine correctly warned not to size up.'
      }
    ]
  },
  {
    id: 'myntra-008',
    brand: 'MARKS & SPENCER',
    title: 'Pure Linen Regular Fit Striped Smart Casual Shirt',
    category: 'men',
    subcategory: 'Shirts',
    price: 2499,
    mrp: 4999,
    discountPercent: 50,
    rating: 4.7,
    ratingCount: 940,
    color: 'Sky Blue & White Stripe',
    colorHex: '#8ecae6',
    garmentType: 'shirt',
    fabric: '100% European Flax Linen',
    stretchFactor: 'non-stretch',
    stretchDescription: 'Authentic European flax linen. Pure non-stretch fiber engineered for effortless breathable elegance.',
    fitType: 'Regular Fit',
    collar: 'Button-Down Collar',
    sleeve: 'Long Sleeves',
    careInstructions: ['Gentle cycle wash', 'Do not tumble dry', 'Iron damp for crisp finish'],
    inStockSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeChart: [
      { size: 'XS', chest: 38, shoulder: 16.5, length: 28.5 },
      { size: 'S', chest: 40, shoulder: 17.2, length: 29.5 },
      { size: 'M', chest: 42, shoulder: 18.0, length: 30.5 },
      { size: 'L', chest: 44.5, shoulder: 18.8, length: 31.5 },
      { size: 'XL', chest: 47, shoulder: 19.6, length: 32.5 },
      { size: 'XXL', chest: 50, shoulder: 20.5, length: 33.5 }
    ],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted from pure European flax linen that becomes softer with every wash. Tailored with a neat button-down collar and mother-of-pearl buttons.',
    highlights: [
      '100% European flax linen keeps you cool up to 40°C',
      'Classic British tailoring with single chest pocket',
      'Pre-shrunk fibers ensure size stability'
    ],
    reviews: [
      {
        id: 'r9',
        author: 'Praveen S.',
        rating: 5,
        date: '01 Sep 2026',
        verified: true,
        purchasedSize: 'L',
        userMeasurements: 'Chest: 41.5", Shoulder: 18.5"',
        comment: 'Linen has no stretch, so if you get the wrong size it pulls at the chest. The size recommendation engine nailed L for me.'
      }
    ]
  },
  {
    id: 'myntra-009',
    brand: 'LEVI\'S',
    title: 'Men 511 Slim Fit Stretch Jeans',
    category: 'men',
    subcategory: 'Jeans',
    price: 2799,
    mrp: 3599,
    discountPercent: 22,
    rating: 4.8,
    ratingCount: 15420,
    color: 'Dark Wash',
    colorHex: '#1e3a5f',
    garmentType: 'jeans',
    fabric: '99% Cotton, 1% Elastane',
    stretchFactor: 'low-stretch',
    stretchDescription: 'Classic denim with a hint of stretch for all-day comfort.',
    fitType: 'Slim Fit',
    collar: 'N/A',
    sleeve: 'N/A',
    careInstructions: ['Machine wash cold', 'Wash inside out'],
    inStockSizes: ['S', 'M', 'L', 'XL'],
    sizeChart: [
      { size: 'XS', chest: 0, shoulder: 0, length: 40.0, waist: 28, hip: 34, inseam: 30 },
      { size: 'S', chest: 0, shoulder: 0, length: 41.0, waist: 30, hip: 36, inseam: 31 },
      { size: 'M', chest: 0, shoulder: 0, length: 41.5, waist: 32, hip: 38, inseam: 32 },
      { size: 'L', chest: 0, shoulder: 0, length: 42.0, waist: 34, hip: 40, inseam: 32 },
      { size: 'XL', chest: 0, shoulder: 0, length: 42.5, waist: 36, hip: 42, inseam: 32 },
      { size: 'XXL', chest: 0, shoulder: 0, length: 43.0, waist: 38, hip: 44, inseam: 32 }
    ],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A modern slim with room to move. The 511 Slim Fit Jeans are a classic since right now. These jeans sit below the waist with a slim fit from hip to ankle.',
    highlights: [
      'Slim fit through seat and thigh',
      'Sits below your waist',
      'Slim leg opening'
    ],
    reviews: []
  }
];
