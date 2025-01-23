import { Alter } from "./Alter";
import { NWK } from "./NWK";

export function findCliques(nwk: NWK): Alter[][] {
  const adjacencyList = createAdjacencyList(nwk);
  const cliques: number[][] = [];

  bronKerbosch(
    new Set(),
    new Set(adjacencyList.keys()),
    new Set(),
    cliques,
    adjacencyList
  );

  return cliques
    .filter((clique) => clique.length >= 3)
    .sort((a, b) => b.length - a.length)
    .map((clique) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clique.map((id) => nwk.alteri.find((alter) => alter.id === id)!)
    );
}

function createAdjacencyList(nwk: NWK): Map<number, Set<number>> {
  const adjacencyList = new Map<number, Set<number>>();
  for (const alter of nwk.alteri) {
    adjacencyList.set(alter.id, new Set());
  }
  for (const conn of nwk.connections) {
    adjacencyList.get(conn.id1)?.add(conn.id2);
    adjacencyList.get(conn.id2)?.add(conn.id1);
  }
  return adjacencyList;
}

// Bron-Kerbosch-Algorithmus zur Berechnung der maximalen Cliquen
function bronKerbosch(
  R: Set<number>,
  P: Set<number>,
  X: Set<number>,
  cliques: Array<Array<number>>,
  adjacencyList: Map<number, Set<number>>
) {
  if (P.size === 0 && X.size === 0) {
    cliques.push(Array.from(R));
    return;
  }
  const PArray = Array.from(P);
  for (const v of PArray) {
    const neighbors = adjacencyList.get(v) || new Set();
    bronKerbosch(
      new Set([...R, v]),
      new Set([...P].filter((x) => neighbors.has(x))),
      new Set([...X].filter((x) => neighbors.has(x))),
      cliques,
      adjacencyList
    );
    P.delete(v);
    X.add(v);
  }
}
