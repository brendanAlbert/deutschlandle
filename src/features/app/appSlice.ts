import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadState, saveState } from "../../app/browserStorage";
import { germanStates } from "../../app/components/States/states";

export interface AppState {
    answer: string;
    guess: string;
    directions: number[];
    distances: number[];
  state: string;
  snackbarOpen: boolean;
  gameOverWin: boolean;
  gameOverLoss: boolean;
  guesses: string[];
  guessPercents: number[];
  endMsg: string;
  clipboardText: string;
  results: number[];
  allResults: number[][];
  randomIndex: number;
}

const loadedState = loadState();
const today = new Date().getDay();
const has24HrsElapsed = loadedState?.day !== today;

let stateIndex = Math.floor(Math.random() * germanStates.length);

if (has24HrsElapsed) {
  let newSaveState = {
    ...loadedState,
    day: today,
    stateIndex
  } 
  saveState(newSaveState)
} else {
  stateIndex = loadedState.stateIndex;
}

const initialState: AppState = {
  answer: '',
  guess: '',
  state: "",
  snackbarOpen: false,
  gameOverWin: false,
  gameOverLoss: false,
  endMsg: Math.floor(Math.random() * 2) % 2 === 0 ? "Gut erledigt !" : "Well done !",
  guesses: [],
  clipboardText: '#Deutschlandle',
  directions: [],
  distances: [],
  guessPercents: [],
  results: [],
  allResults: [],
  randomIndex: stateIndex,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<string>) => {
      state.guesses.push(action.payload);
    },
    closeSnackbar: (state) => {
      state.snackbarOpen = false;
    },
    openSnackbar: (state) => {
      state.snackbarOpen = true;
    },
    setSnackbarMsg: (state, action: PayloadAction<string>) => {
      state.endMsg = action.payload;
    },
    setClipboardText: (state, action: PayloadAction<string>) => {
      state.clipboardText = action.payload;
    },
    setGameOverWin: (state) => {
      state.gameOverWin = true;
    },
    setGameOverLoss: (state) => {
      state.gameOverLoss = true;
    },
    
    addDirection: (state, action: PayloadAction<number>) => {
        state.directions?.push(action.payload);
    },
    addDistance: (state, action: PayloadAction<number>) => {
        state.distances?.push(action.payload);
    },
    addGuessPercent: (state, action: PayloadAction<number>) => {
        state.guessPercents?.push(action.payload);
    },
    setAnswerStr: (state, action: PayloadAction<string>) => {
        state.answer = action.payload;
    },
    setGuess: (state, action: PayloadAction<string>) => {
        state.guess = action.payload;
    },
    setResults: (state, action: PayloadAction<number[]>) => {
        state.results = action.payload;
    },
    addAllResults: (state, action: PayloadAction<number[]>) => {
        state.allResults.push(action.payload);
    },
    // setRandomIndex: (state, action: PayloadAction<number>) => {
    //     state.randomIndex = action.payload;
    // },
  },
});

export const {
  add,
  closeSnackbar,
  openSnackbar,
  setSnackbarMsg,
  setGameOverWin,
  setGameOverLoss,
setClipboardText,
// setRandomIndex,
  addDirection,
  addDistance,
  addGuessPercent,
  setAnswerStr,
  setGuess,
  setResults,
  addAllResults,
} = appSlice.actions;
export default appSlice.reducer;
