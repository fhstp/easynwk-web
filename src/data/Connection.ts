/**
 * undirected connection between 2 alteri.
 * A connection can be saved as {id1, id2} or {id2, id1} but not in both ways.
 *
 * Pantucek: "Besteht zwischen zwei Personen Kontakt, werden diese mit einer Linie verbunden."
 */
export interface Connection {
  id1: number;
  id2: number;
  version: number;
}
