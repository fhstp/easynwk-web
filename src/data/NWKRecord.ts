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

export function loadNWKRecord(state: NWKRecord, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  state.versions = loaded.versions;
  state.currentVersion = loaded.currentVersion;
}
