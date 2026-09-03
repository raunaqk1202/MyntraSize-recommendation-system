import { GarmentSizeMeasurement, StretchFactor, UserBodyMeasurements, FitRecommendation } from '../types';

/**
 * Calculates garment ease requirements based on stretch factor and user preference
 */
function getTargetEase(stretch: StretchFactor, preference: 'slim' | 'regular' | 'relaxed') {
  // Base chest ease in inches
  let baseChestEase = 2.0; // default regular fit on non-stretch
  let baseShoulderEase = 0.5;

  switch (preference) {
    case 'slim':
      baseChestEase = 1.0;
      baseShoulderEase = 0.2;
      break;
    case 'regular':
      baseChestEase = 2.2;
      baseShoulderEase = 0.6;
      break;
    case 'relaxed':
      baseChestEase = 4.0;
      baseShoulderEase = 1.2;
      break;
  }

  // Adjust for fabric stretch: stretchy fabrics require less physical room for comfortable movement
  let stretchDiscount = 0;
  switch (stretch) {
    case 'non-stretch':
      stretchDiscount = 0;
      break;
    case 'low-stretch':
      stretchDiscount = 0.7; // ~2% elastane gives give
      break;
    case 'medium-stretch':
      stretchDiscount = 1.4; // 4-5% elastane
      break;
    case 'high-stretch':
      stretchDiscount = 2.2; // Knit / Ribbed / Spandex
      break;
  }

  const targetChestEase = Math.max(0.1, baseChestEase - stretchDiscount);
  const targetShoulderEase = Math.max(0.1, baseShoulderEase - (stretchDiscount * 0.3));

  return { targetChestEase, targetShoulderEase };
}

/**
 * Recommends the ideal garment size for user's body measurements
 */
export function calculateFitRecommendation(
  measurements: UserBodyMeasurements,
  sizeChart: GarmentSizeMeasurement[],
  stretch: StretchFactor,
  garmentType: string = 'shirt'
): FitRecommendation {
  const isBottomWear = ['jeans', 'trousers', 'skirt', 'shorts'].includes(garmentType);

  // Convert cm to inches if needed
  const userChest = measurements.unit === 'cm' ? measurements.chest / 2.54 : measurements.chest;
  const userShoulder = measurements.unit === 'cm' ? measurements.shoulder / 2.54 : measurements.shoulder;
  const userLength = measurements.unit === 'cm' ? measurements.frontLength / 2.54 : measurements.frontLength;
  const userWaist = measurements.waist ? (measurements.unit === 'cm' ? measurements.waist / 2.54 : measurements.waist) : userChest * 0.85;

  const { targetChestEase, targetShoulderEase } = getTargetEase(stretch, measurements.fitPreference);

  // Score each size in the chart
  const scoredSizes = sizeChart.map((garment) => {
    let actualChestEase = 0;
    let actualShoulderEase = 0;
    let actualLengthDiff = 0;

    let chestPenalty = 0;
    let shoulderPenalty = 0;
    let lengthPenalty = 0;

    if (isBottomWear) {
      actualChestEase = (garment.waist || 0) - userWaist; // we map waist to "chest" ease conceptually for UI
      actualShoulderEase = 0; // Not applicable for bottom wear
      actualLengthDiff = garment.length - userLength;

      if (actualChestEase < targetChestEase - 1) {
        chestPenalty = Math.pow(Math.abs(actualChestEase) * 2.5, 1.8);
      } else {
        chestPenalty = Math.max(0, actualChestEase * 1.5);
      }
    } else {
      actualChestEase = garment.chest - userChest;
      actualShoulderEase = garment.shoulder - userShoulder;
      actualLengthDiff = garment.length - userLength;

      // Penalties for being too small (especially on non-stretch)
      if (actualChestEase < targetChestEase) {
        const underGap = targetChestEase - actualChestEase;
        // If fabric has stretch, smaller gap is tolerated
        const stretchTolerance = stretch === 'high-stretch' ? 0.4 : stretch === 'medium-stretch' ? 0.7 : 1.0;
        chestPenalty = Math.pow(underGap * 2.5 * stretchTolerance, 1.8);
      } else {
        // Too loose penalty
        const overGap = actualChestEase - targetChestEase;
        chestPenalty = overGap * 1.2;
      }

      // Shoulder penalty
      if (actualShoulderEase < 0) {
        // Garment shoulder narrower than user's shoulders -> looks pinched / pulls
        shoulderPenalty = Math.abs(actualShoulderEase) * 3.0;
      } else {
        const overShoulder = actualShoulderEase - targetShoulderEase;
        shoulderPenalty = Math.max(0, overShoulder * 1.5);
      }
    }

    // Length penalty
    if (actualLengthDiff < 0) {
      lengthPenalty = Math.abs(actualLengthDiff) * (isBottomWear ? 2.5 : 3.5); // Too short!
    } else if (actualLengthDiff > 5.0) {
      lengthPenalty = (actualLengthDiff - 5.0) * 1.0; // Too long
    }

    const totalPenalty = chestPenalty + shoulderPenalty + lengthPenalty;
    const matchScore = Math.max(45, Math.round(100 - (totalPenalty * 3.5)));

    return {
      size: garment.size,
      matchScore,
      actualChestEase,
      actualShoulderEase,
      actualLengthDiff,
      garment
    };
  });

  // Pick highest score
  scoredSizes.sort((a, b) => b.matchScore - a.matchScore);
  const best = scoredSizes[0];

  // Tension classifications
  let chestFit: 'tight' | 'perfect' | 'roomy' = 'perfect';
  if (best.actualChestEase < targetChestEase - 0.7) chestFit = 'tight';
  else if (best.actualChestEase > targetChestEase + 1.8) chestFit = 'roomy';

  let shoulderFit: 'tight' | 'perfect' | 'roomy' = 'perfect';
  if (best.actualShoulderEase < -0.3) shoulderFit = 'tight';
  else if (best.actualShoulderEase > targetShoulderEase + 1.2) shoulderFit = 'roomy';

  let lengthFit: 'short' | 'perfect' | 'long' = 'perfect';
  if (best.actualLengthDiff < 0.5) lengthFit = 'short';
  else if (best.actualLengthDiff > 4.5) lengthFit = 'long';

  // Human explanation
  let stretchText = '';
  if (isBottomWear) {
    stretchText = stretch === 'non-stretch' 
      ? 'Rigid denim or canvas. Requires an exact waist match to sit comfortably.'
      : stretch === 'high-stretch'
      ? 'High-stretch material hugs the waist and thighs without feeling restrictive.'
      : 'Factoring in 1-2% elastane stretch, this size contours nicely at the waist and hips.';
  } else {
    stretchText = stretch === 'non-stretch' 
      ? 'Since this pure cotton fabric has zero stretch, we added sufficient ease so you can move and sit comfortably without pulling.'
      : stretch === 'high-stretch'
      ? 'With high-stretch knit fabric, this size hugs your natural silhouette without feeling restrictive.'
      : 'Factoring in the 2-3% elastane stretch, this size contours comfortably without tight pulling at the chest.';
  }

  const prefText = measurements.fitPreference === 'slim'
    ? 'fitted clean lines'
    : measurements.fitPreference === 'relaxed'
    ? 'relaxed, breezy comfort'
    : 'tailored everyday comfort';

  const explanation = isBottomWear
    ? `Based on your waist, length, and preference for ${prefText}, Size ${best.size} delivers an optimal fit with a comfortable waistband ease.`
    : `Based on your ${measurements.chest}" chest, ${measurements.shoulder}" shoulder, and preference for ${prefText}, Size ${best.size} delivers an optimal drape with ${best.actualChestEase.toFixed(1)}" chest clearance.`;

  return {
    recommendedSize: best.size,
    confidenceScore: Math.min(99, Math.max(88, best.matchScore)),
    chestFit,
    shoulderFit,
    lengthFit,
    easeDetails: {
      chestEase: Number(best.actualChestEase.toFixed(1)),
      shoulderEase: Number(best.actualShoulderEase.toFixed(1)),
      lengthDiff: Number(best.actualLengthDiff.toFixed(1))
    },
    explanation,
    stretchBenefitNote: stretchText
  };
}
