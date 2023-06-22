import { initNWK, NWK } from "@/data/NWK";

export interface Version {
  id: number;
  title: string;
  date: string;
  nwk: NWK;
}

export function initVersion(): Version {
  return {
    id: -1,
    title: "",
    date: "",
    nwk: initNWK(),
  };
}
