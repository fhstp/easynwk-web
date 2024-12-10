import { type Alter, isConnectable } from "./Alter";
import { HORIZON_KEYS, horizonKey, naehenScore } from "./Horizon";
import { type AlterCategorization, sectorIndex } from "./AlterCategories";
import { Gender } from "./Gender";
import type { NWK } from "./NWK";

export interface NetworkAnalysis {
  alterConnected: number;
  alterConnectable: number;
  intConnCount: number;
  degreeAvg: number;
  degreeDev: number;
  naehenAvg: number;
  naehenDev: number;

  stars: Array<Alter>;
  maxDegree: number;
  isolated: Array<Alter>;
  alterZeroEdge: Array<Alter>;
  genderConnected: Array<number>;
  genderConnectable: Array<number>;
  horizonConnected: Array<number>;
  horizonConnectable: Array<number>;
}

function initNetworkAnalysis(): NetworkAnalysis {
  return {
    alterConnected: 0,
    alterConnectable: 0,
    intConnCount: 0,
    degreeAvg: 0,
    degreeDev: 0,
    naehenAvg: 0,
    naehenDev: 0,

    stars: [],
    maxDegree: 0,
    isolated: [],
    alterZeroEdge: [],
    genderConnected: [],
    genderConnectable: [],
    horizonConnected: [],
    horizonConnectable: [],
  };
}

export function getOrInit(
  map: Map<string, NetworkAnalysis>,
  key: string
): NetworkAnalysis {
  let value = map.get(key);
  if (value == undefined) {
    value = initNetworkAnalysis();
    map.set(key, value);
  }
  return value;
}

interface AlterMetrics {
  alter: Alter;
  degree: number;
  // sector: number;
  naehe: number;
  isolated: boolean;
}

/**
 *
 * Based on Java class NetworkAnalysis by Nikolaus Kelis (v. 1.4.2)
 * @param nwk
 * @returns
 */
export function analyseNWKbyCategory(
  nwk: NWK,
  categories: AlterCategorization
): Map<string, NetworkAnalysis> {
  const result = new Map<string, NetworkAnalysis>();

  for (let i = 0; i < categories.categories.length; i++) {
    const analysis = getOrInit(result, categories.categories[i]);

    const alterMetrics: Map<number, AlterMetrics> = new Map();
    for (const alter of nwk.alteri) {
      const sec = sectorIndex(alter);
      if (sec != null && isConnectable(alter))
        alterMetrics.set(alter.id, {
          alter,
          degree: 0,
          naehe: naehenScore(alter),
          isolated: true,
        });
    }
    for (const conn of nwk.connections) {
      const a1 = alterMetrics.get(conn.id1);
      const a2 = alterMetrics.get(conn.id2);
      if (!(a1 && a2)) continue;

      a1.isolated = false;
      a2.isolated = false;

      if (
        categories.inCategory(i, a1.alter) &&
        categories.inCategory(i, a2.alter)
      ) {
        analysis.intConnCount++;
        a1.degree++;
        a2.degree++;
      }
    }

    let degreeSum = 0;
    let naehenSum = 0;
    const genderConnected = new Map();
    const genderConnectable = new Map();
    const horizonConnected = new Map();
    const horizonConnectable = new Map();

    for (const [, am] of alterMetrics) {
      if (categories.inCategory(i, am.alter)) {
        if (am.degree > analysis.maxDegree) {
          analysis.maxDegree = am.degree;
          analysis.stars = [];
        }

        if (am.degree == analysis.maxDegree) {
          analysis.stars.push(am.alter);
        }

        if (am.alter.edgeType == 0) {
          analysis.alterZeroEdge.push(am.alter);
        }

        if (am.isolated && am.alter.edgeType >= 1) {
          analysis.isolated.push(am.alter);
        }

        analysis.alterConnectable++;
        degreeSum += am.degree;
        countByKey(genderConnectable, am.alter.currentGender);
        countByKey(horizonConnectable, horizonKey(am.alter));
        if (am.alter.edgeType >= 1) {
          analysis.alterConnected++;
          countByKey(genderConnected, am.alter.currentGender);
          countByKey(horizonConnected, horizonKey(am.alter));
          naehenSum += am.naehe;
        }
      }
    }

    analysis.degreeAvg = degreeSum / analysis.alterConnectable;
    analysis.naehenAvg = naehenSum / analysis.alterConnected;
    analysis.genderConnected = mapToArray(genderConnected, Gender);
    analysis.genderConnectable = mapToArray(genderConnectable, Gender);
    analysis.horizonConnected = mapToArray(horizonConnected, HORIZON_KEYS);
    analysis.horizonConnectable = mapToArray(horizonConnectable, HORIZON_KEYS);

    degreeSum = 0;
    naehenSum = 0;

    for (const [, am] of alterMetrics) {
      if (categories.inCategory(i, am.alter)) {
        degreeSum += (am.degree - analysis.degreeAvg) ** 2;
        if (am.alter.edgeType >= 1) {
          naehenSum += (am.naehe - analysis.naehenAvg) ** 2;
        }
      }
    }
    analysis.degreeDev = Math.sqrt(degreeSum / analysis.alterConnectable);
    analysis.naehenDev = Math.sqrt(naehenSum / analysis.alterConnected);
  }

  return result;
}

/*export function analyseNWKbyCategory(
  nwk: NWK,
  categories: AlterCategorization
): Map<string, NetworkAnalysis> {
  // (1) prepare a map of (valid) alters with metrics indexed by id
  const alterMetrics: Map<number, AlterMetrics> = new Map();
  for (const alter of nwk.alteri) {
    const sec = sectorIndex(alter);
    if (sec != null && isConnectable(alter))
      alterMetrics.set(alter.id, {
        alter,
        degree: 0,
        naehe: naehenScore(alter),
        // sector: sec,
        isolated: true,
      });
  }

  const result = new Map<string, NetworkAnalysis>();

  for (let i = 0; i < categories.categories.length; i++) {
    const analysis = getOrInit(result, categories.categories[i]);

    for (const conn of nwk.connections) {
      const a1 = alterMetrics.get(conn.id1);
      const a2 = alterMetrics.get(conn.id2);
      if (!(a1 && a2)) continue;

      // they are not isolated (category irrelevant)
      a1.isolated = false;
      a2.isolated = false;

      // (9) count connections for density
      if (
        categories.inCategory(i, a1.alter) &&
        categories.inCategory(i, a2.alter)
      ) {
        // both sides of connection are in category
        analysis.intConnCount++;

        // (2) increase degree of each node (only if both alters in same sector/category)
        a1.degree++;
        a2.degree++;
      }
    }

    let degreeSum = 0;
    let naehenSum = 0;
    const genderConnected = new Map();
    const genderConnectable = new Map();
    const horizonConnected = new Map();
    const horizonConnectable = new Map();

    for (const [, am] of alterMetrics) {
      if (categories.inCategory(i, am.alter)) {
        // (4) degree higher than before => restart stars list
        if (am.degree > analysis.maxDegree) {
          analysis.maxDegree = am.degree;
          analysis.stars = [];
        }

        // (5) degree at currently highest value => add alter to stars
        // to exclude connectable alteri #46 --> && am.alter.edgeType >= 1
        if (am.degree == analysis.maxDegree) {
          analysis.stars.push(am.alter);
        }

        // count alterZeroEdgeCount in this category
        if (am.alter.edgeType == 0) {
          analysis.alterZeroEdge.push(am.alter);
        }

        // (6) collect isolated (must have edge to ego!)
        // degree cannot be used because it is only within category
        if (am.isolated && am.alter.edgeType >= 1) {
          analysis.isolated.push(am.alter);
        }

        // (8) increase networkSize & naehenSum & size-by-arrays
        analysis.alterConnectable++;
        degreeSum += am.degree;
        countByKey(genderConnectable, am.alter.currentGender);
        countByKey(horizonConnectable, horizonKey(am.alter));
        if (am.alter.edgeType >= 1) {
          analysis.alterConnected++;
          countByKey(genderConnected, am.alter.currentGender);
          countByKey(horizonConnected, horizonKey(am.alter));
          naehenSum += am.naehe;
        }
      }
    }

    analysis.degreeAvg = degreeSum / analysis.alterConnectable;
    analysis.naehenAvg = naehenSum / analysis.alterConnected;
    analysis.genderConnected = mapToArray(genderConnected, Gender);
    analysis.genderConnectable = mapToArray(genderConnectable, Gender);
    analysis.horizonConnected = mapToArray(horizonConnected, HORIZON_KEYS);
    analysis.horizonConnectable = mapToArray(horizonConnectable, HORIZON_KEYS);

    // another iteration to calculate standard deviation
    degreeSum = 0;
    naehenSum = 0;

    for (const [, am] of alterMetrics) {
      if (categories.inCategory(i, am.alter)) {
        degreeSum += (am.degree - analysis.degreeAvg) ** 2;
        if (am.alter.edgeType >= 1) {
          naehenSum += (am.naehe - analysis.naehenAvg) ** 2;
        }
      }
    }
    analysis.degreeDev = Math.sqrt(degreeSum / analysis.alterConnectable);
    analysis.naehenDev = Math.sqrt(naehenSum / analysis.alterConnected);
  }

  return result;
}

 */

function countByKey(map: Map<string, number>, key: string) {
  const prev = map.get(key);
  if (prev) {
    map.set(key, prev + 1);
  } else {
    map.set(key, 1);
  }
}

function mapToArray(map: Map<string, number>, keys: string[]) {
  return keys.map((k) => {
    const value = map.get(k);
    return value ? value : 0;
  });
}

/**
 *
 * Based on Java class NetworkAnalysis by Nikolaus Kelis (v. 1.4.2)
 * @param alterCount
 * @param connectionsCount
 * @returns
 */
export function calculateDensity(
  alterCount: number,
  connectionsCount: number
): number {
  if (alterCount < 2) {
    return 0.0;
  } else {
    const i = (alterCount * (alterCount - 1.0)) / 2.0;
    return connectionsCount / i;
  }
}

// export function calculateExternalDensity(
//   alterCount: number,
//   externalAlterCount: number,
//   connectionsCount: number
// ): number {
//   if (alterCount < 1 || externalAlterCount < 1) {
//     return 0.0;
//   } else {
//     const i = alterCount * externalAlterCount;
//     return connectionsCount / i;
//   }
// }
