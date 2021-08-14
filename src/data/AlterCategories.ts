import { Alter } from "./Alter";
import { Sectors } from "./Sectors";

export type categorizer = (a: Alter) => string | null;

// export const gender: categorizer = (alter: Alter) => {
//     return alter.currentGender;
// }

export function gender(alter: Alter): string {
    return alter.currentGender;
}

export function sector(alter: Alter): string | null {
    if (alter.distance <= 0)
        return null;

    if (alter.angle < 90) {
        return Sectors[0];
    } else if (alter.angle < 180) {
        return Sectors[1];
    } else if (alter.angle < 270) {
        return Sectors[2];
    } else {
        return Sectors[3];
    }
}
