import { BadenWurttembergIcon } from "../../assets/icons/germanStates/BadenWurttembergIcon";
import { BavariaIcon } from "../../assets/icons/germanStates/BavariaIcon";
import { BerlinIcon } from "../../assets/icons/germanStates/BerlinIcon";
import { BrandenburgIcon } from "../../assets/icons/germanStates/BrandenburgIcon";
import { BremenIcon } from "../../assets/icons/germanStates/BremenIcon";
import { HamburgIcon } from "../../assets/icons/germanStates/HamburgIcon";
import { HesseIcon } from "../../assets/icons/germanStates/HesseIcon";
import { LowerSaxonyIcon } from "../../assets/icons/germanStates/LowerSaxonyIcon";
import { MecklenburgVorpommernIcon } from "../../assets/icons/germanStates/MecklenburgVorpommernIcon";
import { NorthRhineWestphaliaIcon } from "../../assets/icons/germanStates/NorthRhineWestphaliaIcon";
import { RhinelandPalatinateIcon } from "../../assets/icons/germanStates/RhinelandPalatinateIcon";
import { SaarlandIcon } from "../../assets/icons/germanStates/SaarlandIcon";
import { SaxonyAnhaltIcon } from "../../assets/icons/germanStates/SaxonyAnhaltIcon";
import { SaxonyIcon } from "../../assets/icons/germanStates/SaxonyIcon";
import { SchleswigHolsteinIcon } from "../../assets/icons/germanStates/SchleswigHolsteinIcon";
import { ThuringiaIcon } from "../../assets/icons/germanStates/ThuringiaIcon";

export interface IDeutschlandle {
  state: JSX.Element;
  label: string;
  lat: number;
  lon: number;
}

const germanStates: IDeutschlandle[] = [
  {
    state: <BadenWurttembergIcon size={"180px"} />,
    label: "Baden-Württemberg",
    lat: 48.566460032817396,
    lon: 9.04023163627849,
  },
  {
    state: <BavariaIcon size={"180px"} />,
    label: "Bavaria",
    lat: 49.03194556100077,
    lon: 11.697127824118434,
  },
  {
    state: <BerlinIcon size={"180px"} />,
    label: "Berlin",
    lat: 52.51859828812771,
    lon: 13.413240201566676,
  },
  {
    state: <BrandenburgIcon size={"180px"} />,
    label: "Brandenburg",
    lat: 52.403786789648485,
    lon: 13.451245305649817,
  },
  {
    state: <BremenIcon size={"180px"} />,
    label: "Bremen",
    lat: 53.07985788987656,
    lon: 8.802502267557328,
  },
  {
    state: <HamburgIcon size={"180px"} />,
    label: "Hamburg",
    lat: 53.553276066801985,
    lon: 10.009963015392476,
  },
  {
    state: <HesseIcon size={"180px"} />,
    label: "Hesse",
    lat: 50.719803899848216,
    lon: 9.00407761138498,
  },
  {
    state: <LowerSaxonyIcon size={"180px"} />,
    label: "Lower Saxony",
    lat: 52.804772590348925,
    lon: 9.548723516281907,
  },
  {
    state: <MecklenburgVorpommernIcon size={"180px"} />,
    label: "Mecklenburg-Vorpommern",
    lat: 53.81877614893434,
    lon: 12.613354268661645,
  },
  {
    state: <NorthRhineWestphaliaIcon size={"180px"} />,
    label: "North Rhine-Westphalia",
    lat: 51.59269138139454,
    lon: 7.6362168541006685,
  },
  {
    state: <RhinelandPalatinateIcon size={"180px"} />,
    label: "Rhineland-Palatinate",
    lat: 49.92084365049643,
    lon: 7.434976588843706,
  },
  {
    state: <SaarlandIcon size={"180px"} />,
    label: "Saarland",
    lat: 49.397687169305165,
    lon: 6.9662171093466805,
  },
  {
    state: <SaxonyAnhaltIcon size={"180px"} />,
    label: "Saxony-Anhalt",
    lat: 52.03540164152089,
    lon: 11.750875724587411,
  },
  {
    state: <SaxonyIcon size={"180px"} />,
    label: "Saxony",
    lat: 51.05643546370381,
    lon: 13.319251749865778,
  },
  {
    state: <SchleswigHolsteinIcon size={"180px"} />,
    label: "Schleswig-Holstein",
    lat: 54.162085,
    lon: 9.815715,
  },
  {
    state: <ThuringiaIcon size={"180px"} />,
    label: "Thuringia",
    lat: 50.91664314288041,
    lon: 11.0209273454811,
  },
];

export { germanStates };
