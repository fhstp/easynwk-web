export interface ViewOptionsFlags {
  horizons: boolean;
  connections: boolean;
  alteriNames: boolean;
  ageInNwk: boolean;
  roleInNwk: boolean;
}

export interface ViewOptions extends ViewOptionsFlags {
  labelSizeInNwk: number;
}

export function initDefaultViewOptions(): ViewOptions {
  return {
    // pseudonyms: true,
    horizons: false,
    connections: true,
    alteriNames: true,
    ageInNwk: false,
    roleInNwk: false,

    labelSizeInNwk: 5,
  };
}
