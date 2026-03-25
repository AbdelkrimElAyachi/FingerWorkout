
let runtimeFlags = {};

export function configureFeatureFlags(flags) {
  runtimeFlags = { ...runtimeFlags, ...flags };
}

/**
 * Check whether a feature flag is enabled.
 *
 * Resolution order:
 *   1. Runtime config (set via configureFeatureFlags)
 *   2. Vite env vars  (VITE_FEATURE_<NAME>)
 *   3. Node env vars  (FEATURE_<NAME>)
 *
 * @param {string} featureName - e.g. "competition"
 * @returns {boolean}
 */
export default function isEnabled(featureName) {
  const key = `FEATURE_${featureName.toUpperCase()}`;
  let value;

  // 1️⃣ Runtime config (works everywhere)
  if (runtimeFlags[key] !== undefined) {
    value = runtimeFlags[key];
  }
  // 2️⃣ Vite — import.meta.env is statically replaced at build time,
  //    so we can safely access it without typeof guards.
  else if (import.meta.env?.[`VITE_${key}`] !== undefined) {
    value = import.meta.env[`VITE_${key}`];
  }
  // 3️⃣ Node / other bundlers
  else if (typeof process !== "undefined" && process.env?.[key] !== undefined) {
    value = process.env[key];
  }

  return value === true || value === "true";
}