// import * as localforage from "localforage";
import { download } from "@/assets/utils";
import { Alter } from "@/data/Alter";

export class AlteriList {
  private alteri: Array<Alter>;

  constructor() {
    const storedAlteri = localStorage.getItem("alteri");
    this.alteri = storedAlteri != null ? JSON.parse(storedAlteri) : [];
  }

  // demoData() {
  //   const max = initAlter();
  //   max.name = "Max" //, 30, 20);
  //   max.role = "V";
  //   max.currentGender = "männlich";

  //   const klaudia = new Alter("Klaudia", 60, 40);
  //   klaudia.role = "M";
  //   klaudia.currentGender = "weiblich";

  //   this.alteri.push(...[
  //     max,
  //     klaudia,
  //     new Alter("Klaus", 150, 90),
  //     new Alter("Julia", -10, 50)
  //   ]);
  // }

  addAlter(addedAlter: Alter) {
    this.alteri.unshift(addedAlter);
  }

  removeAlter(alterToRemove: Alter) {
    // TODO "Papierkorb" zum Wiederherstellen von Alteri?
    this.alteri = this.alteri.filter(item => item.id !== alterToRemove.id);

    this.persistAlteri();
  }

  getAlteri(): Array<Alter> {
    return this.alteri;
  }

  // persist(alter: Alter) {
  //   localStorage.setItem("alter-" + alter.id, JSON.stringify(alter));
  // }

  persistAlteri() {
    localStorage.setItem("alteri", JSON.stringify(this.alteri));
  }

  clear() {
    this.alteri = [];
    this.persistAlteri();
  }

  download() {
    const nwk = {
      ego: { name: "Rosalie Müller" },
      alteri: this.alteri,
      relations: []
    };

    download("Rosalie Müller.json", JSON.stringify(nwk));
  }

  upload(savedNWK: any) {
    if (savedNWK.alteri && savedNWK.alteri instanceof Array) {
      this.alteri = savedNWK.alteri;
    }
    this.persistAlteri();
  }
}
