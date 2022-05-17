function distance(lat1, lon1, lat2, lon2) {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return Math.floor(12742 * Math.asin(Math.sqrt(a)));
}

const b = { label: "Berlin", lat: 52.51859828812771, long: 13.413240201566676 };

const mv = {
  label: "Mecklenburg-Vorpommern",
  lat: 53.63503524102952,
  long: 11.408328084325102,
};

const bw = {
  label: "Baden-Württemberg",
  lat: 48.566460032817396,
  long: 9.04023163627849,
};

// console.log(
//   `distance from Baden-Wurttemberg to Mecklenburg-Vorpommern is ${distance(
//     bw.lat,
//     bw.long,
//     mv.lat,
//     mv.long
//   )}km`
// );

// Seed Generator

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function xoshiro128ss(a, b, c, d) {
  return function () {
    let t = b << 9,
      r = a * 5;
    r = ((r << 7) | (r >>> 25)) * 9;
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = (d << 11) | (d >>> 21);
    return (r >>> 0) / 4294967296;
  };
}

function jsf32(a, b, c, d) {
  return function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    var t = (a - ((b << 27) | (b >>> 5))) | 0;
    a = b ^ ((c << 17) | (c >>> 15));
    b = (c + d) | 0;
    c = (d + t) | 0;
    d = (a + t) | 0;
    return (d >>> 0) / 4294967296;
  };
}

let dist = { order: 0 };
for (let i = 0; i < 30; i++) {
  //   // let val = Math.ceil((parseFloat(mulberry32(i)().toFixed(2)) * 100) % 15);

  // let val =
  //   Math.ceil(
  //     parseFloat(xoshiro128ss(i, 10.5 + i, 20.3 + i, 3.1)() * 10_000_000)
  //   ) % 15; // <-- best so far    spread from 1 to 3, no 4s which is great
  // let val = Math.ceil(parseFloat(xoshiro128ss(i, i, 2, 3)() * 10_000_000)) % 15;
  // let val = parseInt(jsf32(20, i, 30, 30)() * 100) % 15;
  let val = Math.floor(Math.random() * 16);
  dist[val] = dist[val] != undefined ? dist[val] + "x" : "x";
  dist["order"] += "" + val + "|";
}
// let a = 15;
console.log({
  dist,
  // seedInitial: a,
  // seed: mulberry32(a)(),
  // seed2: Math.ceil(parseFloat(xoshiro128ss(5, 1, 2, 3)() * 10_000_000)) % 15,
  // seed3: parseInt(jsf32(3, 13, 20, 3)() * 100) % 15,
  // str: Math.ceil((parseFloat(mulberry32(a)().toFixed(2)) * 100) % 15),
});
