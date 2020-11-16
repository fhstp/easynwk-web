import { Alter } from "@/data/Alter";

export class AlteriList {

    private alteri: Array<Alter>;

    constructor() {
        const max= new Alter("Max", 30, 20);
        max.role = "V";
        max.currentGender = "männlich";

        const klaudia= new Alter("Klaudia", 60, 40);
        klaudia.role = "M";
        klaudia.currentGender = "weiblich";

        this.alteri = [
            max,
            klaudia,
            new Alter("Klaus", 150, 90),
            new Alter("Julia", -10, 50)
          ];
    }

    addAlter(addedAlter: Alter) {
        this.alteri.push(addedAlter);
    }

    getAlteri(): Array<Alter> {
        return this.alteri;
    }

}
