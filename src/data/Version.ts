//to give the nwk a version with id, title and the date

export interface Version {
  id: number;
  title: string;
  date: string;
}

export function initVersion(): Version {
  return {
    id: -1,
    title: "",
    date: "",
  };
}

export const defaultVersion = 0;
