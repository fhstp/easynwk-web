//What is the current version? - to change version

export interface CurrentVersion {
  id: number;
}

export function initCurrentVersion(): CurrentVersion {
  return {
    id: 1,
  };
}
