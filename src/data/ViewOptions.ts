export interface ViewOptionsFlags {
  horizons: boolean;
  connections: boolean;
  connectionsEgo: boolean;
  emoji: boolean;
  alteriNames: boolean;
  ageInNwk: boolean;
  roleInNwk: boolean;
}

export interface ViewOptions extends ViewOptionsFlags {
  labelSizeInNwk: number;
  iconSizeInNwk: number;
}

export function initDefaultViewOptions(): ViewOptions {
  return {
    // pseudonyms: true,
    horizons: false,
    connections: true,
    connectionsEgo: true,
    emoji: false,
    alteriNames: true,
    ageInNwk: false,
    roleInNwk: false,

    labelSizeInNwk: 5,
    iconSizeInNwk: 4,
  };
}
