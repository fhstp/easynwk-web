import { NWKVersion, initNWKVersion } from "@/data/NWKVersion";
import roles from "@/data/roles_de.json";

export interface NWKRecord {
  versions: Array<NWKVersion>;
  currentVersion: number;
  size: string;
}

export function initNWKRecordAsJSON(): string {
  return JSON.stringify(initNWKRecord());
}

export function initNWKRecord(): {
  versions: NWKVersion[];
  currentVersion: number;
  size: string;
} {
  const version = initNWKVersion();
  return {
    versions: [version],
    currentVersion: version.id,
    size: "5",
  };
}

/**
 * fills a NWKRecord object from a JSON string.
 * Supports a single NWK object for backwards compatibility.
 *
 * @param state
 * @param loadedText
 */
export function loadNWKRecord(state: NWKRecord, loadedText: string): void {
  let loaded;
  try {
    loaded = JSON.parse(loadedText);
  } catch (jsonError) {
    loaded = parseNWKFile(loadedText);
  }
  if (loaded.currentVersion && loaded.versions) {
    // looks like a NWKRecord object
    state.versions = loaded.versions;
    state.currentVersion = loaded.currentVersion;
  } else if (loaded.ego && loaded.alteri && loaded.connections) {
    // looks like a NWK object
    const version = initNWKVersion();
    version.nwk = loaded;
    state.versions = [version];
    state.currentVersion = version.id;
  } else {
    // looks unexpectedly
    throw new TypeError(
      "The loaded data is neither a NWKRecord nor a single NWK."
    );
  }
}

function parseNWKFile(nwkText: string): any {
  const lines = nwkText.split("\r\n");
  const nwkData: any = {
    ego: {},
    alteri: [],
    connections: [],
    version: {
      id: 0,
      title: "",
      date: "",
      nwk: {}
    }
  };

  lines.forEach(line => {
    if (!line.trim()) {
      return;
    }

    const parts = line.split(";");
    const type = parts[0];

    switch (type) {
      case "E":
        nwkData.ego = {
          name: parts[1],
          currentGender: "nicht festgelegt",
          age: parts[2] || "",
          note: parts[3] || ""
        };
        break;

      case "F":
        nwkData.version.id = parseInt(parts[1]);
        nwkData.version.date = formatDate(parts[2]);
        break;

      case "N":
        if (parts[2]) {
          const name = parts[2];
          const isDeceased = name.startsWith("+");
          const roleAbbrev = parts[4] || "";
          const role = roles.find((r: any) => r.abbrev === roleAbbrev)?.german || roleAbbrev;

          nwkData.alteri.push({
            id: parseInt(parts[1]),
            name: isDeceased ? name.slice(1) : name,
            role: role,
            roleDefault: false,
            human: true,
            currentGender: mapGender(parts[3]),
            genderDefault: false,
            age: "",
            note: parts[5] || "",
            deceased: isDeceased,
            edgeType: 0,
            edgeTypeByUser: 0,
            angle: 0,
            distance: 0
          });
        }
        break;

      case "P":
        const alterId = parseInt(parts[2]);
        const x = parseFloat(parts[3])
        const y = parseFloat(parts[4])
        const edgeType = parseInt(parts[5]);

        const alteri = nwkData.alteri.find((a: { id: number; }) => a.id === alterId);
        if (alteri) {
          const polarCoords = cartesianToPolar(x, y)
          alteri.edgeType = edgeType;
          alteri.edgeTypeByUser = edgeType;
          alteri.angle = polarCoords.angle;
          alteri.distance = polarCoords.distance;
        }
        break;

      case "L":
        nwkData.connections.push({
          id1: parseInt(parts[2]),
          id2: parseInt(parts[3])
        });
        break;
    }
  });

  nwkData.version.nwk = {
    ego: nwkData.ego,
    alteri: nwkData.alteri,
    connections: nwkData.connections
  };

  return {
    versions: [nwkData.version],
    currentVersion: nwkData.version.id
  };
}

function mapGender(gender: string): string {
  switch (gender) {
    case "m":
      return "männlich";
    case "w":
      return "weiblich";
    default:
      return "nicht festgelegt";
  }
}

function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split(".");

  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");

  return `${year}-${paddedMonth}-${paddedDay}`;
}

function cartesianToPolar(x: number, y: number) {
  // Verschieben der Koordinaten um den Ursprung auf (0.5, 0.5) zu setzen
  const centeredX = x - 0.5;
  const centeredY = 0.5 - y;

  // Berechnen des Radius im Kreis und Skalierung auf 200
  const distance = Math.sqrt(centeredX * centeredX + centeredY * centeredY) * 200;

  // Berechnen des Winkels in Grad
  const angle = Math.atan2(centeredY, centeredX) * (180 / Math.PI);

  return { distance: distance, angle: angle };
}
