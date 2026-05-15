/** Internally we store everything in millimetres (integer-friendly) and
 * convert to metres only when we hand a value to three.js (which works
 * in metres). One helper so the conversion factor lives in exactly one
 * place. */
export const MM_PER_M = 1000;

export const mmToM = (mm: number): number => mm / MM_PER_M;
export const mToMm = (m: number): number => Math.round(m * MM_PER_M);

export type Vec3 = [number, number, number];
