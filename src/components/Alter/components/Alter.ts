import { v4 as uuid } from "uuid";

export class Alter {
  id!: string;
  name!: string;
  role?: string = "";
  currentGender?: string = "";
  note?: string = "";
  edgeWeight?: number = 0;
  angle = 0;
  distance = 0;

  constructor(name: string, $angle: number, $distance: number) {
    this.id = uuid();
    this.name = name;
    this.angle = $angle;
    this.distance = $distance;
  }
}
