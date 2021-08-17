import { Alter, naehenScore } from "./Alter";
import { categorizerType, sector } from "./AlterCategories";
import { Connection } from "./Connection";
import { NWK } from "./NWK";

export interface NetworkAnalysis {
  alterCount: number;
  intConnCount: number;
  extConnCount: number;
  naehenSum: number;

  stars: Array<Alter>;
  maxDegree: number;
  isolated: Array<Alter>;
  bridgePersons: Array<Alter>;
  bridges: Array<Connection>;
}

function initNetworkAnalysis(): NetworkAnalysis {
  return {
    alterCount: 0,
    intConnCount: 0,
    extConnCount: 0,
    naehenSum: 0,

    stars: [],
    maxDegree: 0,
    isolated: [],
    bridgePersons: [],
    bridges: [],
  };
}

function getOrInit(
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
  sector: string;
  bridgePerson: boolean;
  category: string;
}

/**
 *
 * Based on Java class NetworkAnalysis by Nikolaus Kelis (v. 1.4.2)
 * @param nwk
 * @returns
 */
export function analyseNWKbyCategory(
  nwk: NWK,
  categorizer: categorizerType
): Map<string, NetworkAnalysis> {
  // (1) prepare a map of (valid) alters with metrics indexed by id
  // const alterMetrics: AlterMetrics[] = [];
  const alterMetrics: Map<number, AlterMetrics> = new Map();
  for (const alter of nwk.alteri) {
    const sec = sector(alter);
    const category = categorizer(alter);
    if (sec != null && category != null)
      alterMetrics.set(alter.id, {
        alter,
        degree: 0,
        sector: sec,
        bridgePerson: false,
        category,
      });
  }

  const result = new Map<string, NetworkAnalysis>();

  for (const conn of nwk.connections) {
    const a1 = alterMetrics.get(conn.id1);
    const a2 = alterMetrics.get(conn.id2);
    if (!(a1 && a2)) continue;

    // (1.5) count connections
    if (a1.category === a2.category) {
      getOrInit(result, a1.category).intConnCount++;
    } else {
      getOrInit(result, a1.category).extConnCount++;
      getOrInit(result, a2.category).extConnCount++;
    }

    // (2) increase degree of each node
    a1.degree++;
    a2.degree++;

    // (3) detect bridges and mark bridge persons
    if (a1.sector !== a2.sector) {
      a1.bridgePerson = true;
      a2.bridgePerson = true;

      // bridges count only if both sides are of the same category
      if (a1.category === a2.category) {
        const analysis = getOrInit(result, a1.category);
        analysis.bridges.push(conn);
      }
    }
  }

  for (const [, am] of alterMetrics) {
    const analysis = getOrInit(result, am.category);

    // (4) degree higher than before => restart stars list
    if (am.degree > analysis.maxDegree) {
      analysis.maxDegree = am.degree;
      analysis.stars = [];
    }

    // (5) degree at currently highest value => add alter to stars
    if (am.degree == analysis.maxDegree) {
      analysis.stars.push(am.alter);
    }

    // (6) collect isolated
    if (am.degree == 0) {
      analysis.isolated.push(am.alter);
    }

    // (7) collect bridge persons
    if (am.bridgePerson) {
      analysis.bridgePersons.push(am.alter);
    }

    // (8) increase networkSize & naehenSum
    analysis.alterCount++;
    analysis.naehenSum += naehenScore(am.alter);
  }

  return result;
}

/**
 *
 * Based on Java class NetworkAnalysis by Nikolaus Kelis (v. 1.4.2)
 * @param nwk
 * @returns
 */
export function analyseNWK(nwk: NWK): NetworkAnalysis {
  const analysis = initNetworkAnalysis();

  // (1) prepare a map of (valid) alters with metrics indexed by id
  // const alterMetrics: AlterMetrics[] = [];
  const alterMetrics: Map<number, AlterMetrics> = new Map();
  for (const alter of nwk.alteri) {
    const sec = sector(alter);
    if (sec != null)
      alterMetrics.set(alter.id, {
        alter,
        degree: 0,
        sector: sec,
        bridgePerson: false,
        category: "",
      });
  }

  for (const conn of nwk.connections) {
    const a1 = alterMetrics.get(conn.id1);
    const a2 = alterMetrics.get(conn.id2);
    if (!(a1 && a2)) continue;

    // (1.5) count connections
    analysis.intConnCount++;
    // extConnCount stays at zero

    // (2) increase degree of each node
    a1.degree++;
    a2.degree++;

    // (3) detect bridges and mark bridge persons
    if (a1.sector !== a2.sector) {
      a1.bridgePerson = true;
      a2.bridgePerson = true;
      analysis.bridges.push(conn);
    }
  }

  for (const [, am] of alterMetrics) {
    // (4) degree higher than before => restart stars list
    if (am.degree > analysis.maxDegree) {
      analysis.maxDegree = am.degree;
      analysis.stars = [];
    }

    // (5) degree at currently highest value => add alter to stars
    if (am.degree == analysis.maxDegree) {
      analysis.stars.push(am.alter);
    }

    // (6) collect isolated
    if (am.degree == 0) {
      analysis.isolated.push(am.alter);
    }

    // (7) collect bridge persons
    if (am.bridgePerson) {
      analysis.bridgePersons.push(am.alter);
    }

    // (8) increase networkSize & naehenSum
    analysis.alterCount++;
    analysis.naehenSum += naehenScore(am.alter);
  }

  return analysis;
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
