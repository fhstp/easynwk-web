import { Alter } from "./Alter";
import { sector } from "./AlterCategories";
import { Connection } from "./Connection";
import { NWK } from "./NWK";

export interface NetworkAnalysis {
  stars: Array<Alter>;
  maxDegree: number;
  isolated: Array<Alter>;
  bridgePersons: Array<Alter>;
  bridges: Array<Connection>;
}

interface AlterMetrics {
  alter: Alter;
  degree: number;
  sector: string;
  bridgePerson: boolean;
}

/**
 *
 * Based on Java class NetworkAnalysis by Nikolaus Kelis (v. 1.4.2)
 * @param nwk
 * @returns
 */
export function analyseNWK(nwk: NWK): NetworkAnalysis {
  const analysis: NetworkAnalysis = {
    stars: [],
    maxDegree: 0,
    isolated: [],
    bridgePersons: [],
    bridges: [],
  };

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
      });
  }

  for (const conn of nwk.connections) {
    const a1 = alterMetrics.get(conn.id1);
    const a2 = alterMetrics.get(conn.id2);
    if (!(a1 && a2)) continue;

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
  }

  return analysis;
}
