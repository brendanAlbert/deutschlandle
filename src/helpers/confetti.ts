 import party from "party-js";

 export const confetti = () => {
    party.confetti(document.getElementById("state-img") as HTMLElement, {
      count: party.variation.range(75, 100),
    });
  };