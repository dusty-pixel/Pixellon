/**
 * Currency conversion & formatting utility for Indian Rupee (₹ / INR).
 * Converts USD prices to Indian Rupee using standard market conversion (1 USD ≈ ₹84 INR).
 */

export const USD_TO_INR_RATE = 84;

/**
 * Parses numeric USD amount from number or string (e.g. "$14.99", "14.99", "$59.99")
 */
export function parseUSD(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  if (typeof val === 'string') {
    // Remove currency symbols, commas, and extra whitespace
    const cleaned = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
}

/**
 * Converts a USD value to Indian Rupee (₹) formatted string.
 * Example: "$14.99" -> "₹1,259"
 * Example: "4.99"   -> "₹419"
 * Example: 0        -> "FREE" or "₹0"
 */
export function formatINR(val, options = {}) {
  const { showFree = false, fallback = 'FREE' } = options;
  const numUSD = parseUSD(val);

  if (numUSD === null) {
    if (typeof val === 'string' && (val.toLowerCase().includes('free') || val === 'N/A')) {
      return val;
    }
    return fallback;
  }

  if (numUSD === 0 && showFree) {
    return 'FREE';
  }

  const inrAmount = Math.round(numUSD * USD_TO_INR_RATE);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inrAmount);
}

/**
 * Formats original worth of giveaways into INR.
 * Example: "$14.99" -> "₹1,259"
 */
export function formatWorthINR(worth) {
  if (!worth || worth === 'N/A' || worth === 'Free' || worth === '0') return null;
  return formatINR(worth);
}
