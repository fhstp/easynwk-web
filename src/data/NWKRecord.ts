import { NWKVersion, initNWKVersion } from "@/data/NWKVersion";

export interface NWKRecord {
  versions: Array<NWKVersion>;
  currentVersion: number;
}

export function initNWKRecordAsJSON(): string {
  return JSON.stringify(initNWKRecord());
}

export function initNWKRecord(): NWKRecord {
  const version = initNWKVersion();
  return {
    versions: [version],
    currentVersion: version.id,
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
  const loaded = JSON.parse(loadedText);

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
