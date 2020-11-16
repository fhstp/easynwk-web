import { Gender } from '@/data/Gender';
import { v4 as uuid } from "uuid";

export class Alter {
  private _id!: string;
  private _name!: string;
  role?: string = "";
  contactOfPartner = false;
  currentGender?: string = Gender[0];
  age = "";
  note?: string = "";
  edgeWeight?: number = 0;
  angle = 0;
  distance = 0;
  isSelected = false;

  constructor(name: string, $angle: number, $distance: number) {
    this._id = uuid();
    this._name = name;
    this.angle = $angle;
    this.distance = $distance;
  }

  /**
   * Getter $name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Setter $name
   * @param {string} value
   */
  public set name(value: string) {
    this._name = value;
  }
}
