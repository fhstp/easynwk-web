import { Alter } from "./Alter";

export const HORIZON_KEYS = ["horizon_close", "horizon_middle", "horizon_far"];

export function horizonKey(alter: Alter): string {
  if (alter.distance < 33.33) return HORIZON_KEYS[0];
  else if (alter.distance < 66.67) return HORIZON_KEYS[1];
  else return HORIZON_KEYS[2];
}

/**
 * get the "closeness" of an alter in 9 concentric rings around the ego.
 * 9 = very close, ..., 0 = on or beyond the outer horizon.
 * Based on Java class Position by Nikolaus Kelis (v. 1.4.2)
 * @param alter
 * @returns integer between 9 (close) and 0 (distant)
 */
export function naehenScore(alter: Alter): number {
  return Math.max(9 - Math.floor((alter.distance * 9) / 100), 0);
}
