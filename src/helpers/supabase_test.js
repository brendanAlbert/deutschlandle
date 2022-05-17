let prev = [3, 15, 9, 4, 11, 8, 13, 10, 7, 0, 5, 1, 2, 6, 12, 14];
const NUMBER_GERMAN_STATES = 16;

console.log({ prev });
// let iterations = 0;

const getRandomNonRecentState = (prev) => {
  let newState = Math.floor(Math.random() * NUMBER_GERMAN_STATES);
  if (prev.length < NUMBER_GERMAN_STATES) {
    while (prev.includes(newState)) {
      newState = Math.floor(Math.random() * NUMBER_GERMAN_STATES);
    }
    prev.push(newState);
  }
  return prev;
};

console.log({ prev, iterations });
