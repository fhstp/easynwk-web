//What is the current version? - to change version

import { defaultVersion } from "@/data/Version";

export interface CurrentVersion {
  id: number;
}

export function initCurrentVersion(): CurrentVersion {
  return {
    id: defaultVersion,
  };
}
