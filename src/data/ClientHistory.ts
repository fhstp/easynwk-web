import { Version } from "@/data/Version";
import { CurrentVersion, initCurrentVersion } from "@/data/CurrentVersion";

export interface ClientHistory {
  versions: Array<Version>;
  currentVersion: CurrentVersion;
}

export function initClientHistoryasJSON(): string {
  return JSON.stringify({
    versions: [],
    currentVersion: initCurrentVersion(),
  });
}

export function loadClientHistory(
  state: ClientHistory,
  loadedText: string
): void {
  const loaded = JSON.parse(loadedText);
  state.versions = loaded.versions;
  state.currentVersion = loaded.currentVersion;
}
