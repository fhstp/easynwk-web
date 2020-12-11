// import * as localforage from "localforage";
import { download } from "@/assets/utils";
import { Alter } from "@/data/Alter";
import { Ego, initEgo, isEgo } from "./Ego";

export class AlteriList {
  private ego: Ego;
  private alteri: Array<Alter>;

  constructor() {
    const storedAlteri = localStorage.getItem("alteri");
    this.alteri = storedAlteri != null ? JSON.parse(storedAlteri) : [];

    const storedEgo = localStorage.getItem("ego");
    this.ego = storedEgo != null ? JSON.parse(storedEgo) : initEgo();
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

  getEgo(): Ego {
    return this.ego;
  }

  // persist(alter: Alter) {
  //   localStorage.setItem("alter-" + alter.id, JSON.stringify(alter));
  // }

  persistAlteri() {
    localStorage.setItem("alteri", JSON.stringify(this.alteri));
  }

  persistEgo() {
    localStorage.setItem("ego", JSON.stringify(this.ego));
  }

  clear() {
    this.alteri = [];
    this.persistAlteri();
    this.ego = initEgo();
    this.persistEgo();
  }

  download() {
    const nwk = {
      ego: this.ego,
      alteri: this.alteri,
      relations: []
    };

    download(this.ego.name + ".json", JSON.stringify(nwk));
  }

  upload(savedNWK: any) {
    // TODO format checks & error messages
    if (savedNWK.alteri && savedNWK.alteri instanceof Array) {
      this.alteri = savedNWK.alteri;
      this.persistAlteri();
    }
    if (savedNWK.ego && isEgo(savedNWK.ego)) {
      this.ego = savedNWK.ego;
      this.persistEgo();
    }
  }
}
