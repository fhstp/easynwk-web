import { v4 as uuid } from "uuid";

export class Alter2 {

    private _id: string;
	private _name: string;
	gender: Array<string> = ["männlich"];
	role = "";
	note = "";
	amountOfEdges = 0;
	angle = 0;
    distance = 0;

	constructor(name: string, $angle: number, $distance: number) {
        this._id = uuid();
		this._name = name;
		this.angle = $angle;
		this.distance = $distance;
	}

	public get id(): string {
		return this._id;
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
