import { Alter, isConnectable, naehenScore } from "./Alter";
import { AlterCategorization, sectorIndex } from "./AlterCategories";
import { Connection } from "./Connection";
import { NWK } from "./NWK";

export interface NetworkAnalysis {
  alterConnected: number;
  alterConnectable: number;
  intConnCount: number;
  extConnCount: number;
  naehenSum: number;

  stars: Array<Alter>;
  maxDegree: number;
  isolated: Array<Alter>;
  bridgePersons: Array<Alter>;
  bridges: Array<Connection>;
  alterZeroEdge: Array<Alter>;
}

function initNetworkAnalysis(): NetworkAnalysis {
  return {
    alterConnected: 0,
    alterConnectable: 0,
    intConnCount: 0,
    extConnCount: 0,
    naehenSum: 0,

    stars: [],
    maxDegree: 0,
    isolated: [],
    bridgePersons: [],
    bridges: [],
    alterZeroEdge: [],
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
  sector: number;
  bridgePerson: boolean;
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
  // (1) prepare a map of (valid) alters with metrics indexed by id
  const alterMetrics: Map<number, AlterMetrics> = new Map();
  for (const alter of nwk.alteri) {
    const sec = sectorIndex(alter);
    if (sec != null && isConnectable(alter))
      alterMetrics.set(alter.id, {
        alter,
        degree: 0,
        sector: sec,
        bridgePerson: false,
      });
  }

  const result = new Map<string, NetworkAnalysis>();

  for (const conn of nwk.connections) {
    const a1 = alterMetrics.get(conn.id1);
    const a2 = alterMetrics.get(conn.id2);
    if (!(a1 && a2)) continue;

    // (2) increase degree of each node
    a1.degree++;
    a2.degree++;

    // (3) mark bridge persons
    if (a1.sector !== a2.sector) {
      a1.bridgePerson = true;
      a2.bridgePerson = true;
    }
  }

  for (let i = 0; i < categories.categories.length; i++) {
    const analysis = getOrInit(result, categories.categories[i]);

    // count alterZeroEdgeCount in this category
    for (const alter of nwk.alteri) {
      if (
        alter.edgeType == 0 &&
        categories.inCategory(i, alter) &&
        isConnectable(alter)
      ) {
        analysis.alterZeroEdge.push(alter);
      }
    }
    // TODO reconsider whether a zero edge alter can be star or bridgeperson

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

        // (6) collect isolated (must have edge to ego!)
        if (am.degree == 0 && am.alter.edgeType >= 1) {
          analysis.isolated.push(am.alter);
        }

        // (7) collect bridge persons
        // to exclude connectable alteri #46 --> && am.alter.edgeType >= 1
        if (am.bridgePerson) {
          analysis.bridgePersons.push(am.alter);
        }

        // (8) increase networkSize & naehenSum
        analysis.alterConnectable++;
        if (am.alter.edgeType >= 1) {
          analysis.alterConnected++;
          analysis.naehenSum += naehenScore(am.alter);
        }
      }
    }

    for (const conn of nwk.connections) {
      const a1 = alterMetrics.get(conn.id1);
      const a2 = alterMetrics.get(conn.id2);
      if (!(a1 && a2)) continue;

      // (9) count connections for density
      if (
        categories.inCategory(i, a1.alter) &&
        categories.inCategory(i, a2.alter)
      ) {
        // both sides of connection are in category
        analysis.intConnCount++;

        // (3b) bridges count only if both sides are in the same category
        // to exclude connectable alteri #46 --> && a1.edgeType >= 1 && a2.edgeType >= 1
        if (a1.sector !== a2.sector) {
          analysis.bridges.push(conn);
        }
      } else if (
        categories.inCategory(i, a1.alter) ||
        categories.inCategory(i, a2.alter)
      ) {
        // exactly one side of connection is in category
        analysis.extConnCount++;
      }
    }
  }

  return result;
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

/**
 *
 * Based on formula by Joseph Richter Mackensteiner (20-Mar-2022)
 * @param alterCount
 * @param connectionsCount
 * @returns
 */
export function calculateAverageDegree(
  alterCount: number,
  connectionsCount: number
): number {
  if (alterCount < 2) {
    return 0.0;
  } else {
    return (2.0 * connectionsCount) / alterCount;
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
