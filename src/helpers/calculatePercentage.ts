import { IDeutschlandle } from "../app/components/States/states";
import { distance } from "./calculateLatLongDistance";

const calculatePercentage = (guess: IDeutschlandle, answer: IDeutschlandle) => {

    let d = distance(guess.lat, guess.lon, answer.lat, answer.lon)
    
    if ( d > 500 ) {
        return 20;
    }

    if ( d > 400 ) {
        return 40;
    }

    if ( d > 300 ) {
        return 60;
    }

    if ( d > 200 ) {
        return 80;
    }

    if ( d > 100 ) {
        return 90;
    }

    if ( d === 0) {
        return 100;
    }

    return 95
}

export { calculatePercentage };
