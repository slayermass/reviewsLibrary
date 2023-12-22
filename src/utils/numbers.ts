/**
 * use this instead of using such an expression "(nullableVar?.length || 0) > 0"
 */
export const numberOrDefaultNumber = (probablyNumberValue: number | null | undefined, defaultValue = 0): number =>
  probablyNumberValue || defaultValue;
