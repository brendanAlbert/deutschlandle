import SendIcon from "@mui/icons-material/Send";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import { useEffect, useState } from "react";
import "./App.css";
import getDirectionIcon from "./app/components/Directions/DirectionIcons";
import { GuessTransition } from "./app/components/GuessTransition";
import { SnackbarPopup } from "./app/components/Snack/Snackbar";
import { germanStates, IDeutschlandle } from "./app/components/States/states";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  add,
  addAllResults,
  addDirection,
  addDistance,
  addGuessPercent,
  openSnackbar,
  setAnswerStr,
  setClipboardText,
  setGameOverLoss,
  setGameOverWin,
  setGuess,
  setResults,
  setSnackbarMsg,
} from "./features/app/appSlice";
import { calculateDirection } from "./helpers/calculateDirection";
import { distance } from "./helpers/calculateLatLongDistance";
import { calculatePercentage } from "./helpers/calculatePercentage";
import { confetti } from "./helpers/confetti";
import { getShareText } from "./helpers/getShareText";
import { theme } from "./theme";

// TODO - determine how to calculate state of the day for 24 hours
// TODO - create seed generator
// TODO - save users stats in localstorage
// TODO - my stats btn and modal/popup
const GuessRow = (i: number, guesses: string[], answerState: string) => {
  const [animatedRow, showAnimatedRow] = useState(true);
  const dists = useAppSelector((state) => state.app.distances);
  const dirs = useAppSelector((state) => state.app.directions);
  const percents = useAppSelector((state) => state.app.guessPercents);
  const results = useAppSelector((state) => state.app.results);

  if (guesses[i] && animatedRow) {
    setTimeout(() => {
      showAnimatedRow(false);
    }, Delay);

    return (
      <GuessTransition
        index={i}
        checked={guesses[i] ? true : false}
        results={results}
      />
    );
  }

  if (guesses[i] && animatedRow === false) {
    return (
      <Box key={i}>
        <Paper
          elevation={12}
          sx={{
            backgroundColor: guesses[i] === answerState ? "#27ae60" : "#121212",
          }}
        >
          <Fade in={true}>
            <Grid
              container
              my={1}
              py={0.5}
              sx={{
                minHeight: "47.5px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid
                key={i + "a"}
                item
                xs={6.5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography p={1}>{guesses[i] ?? ""}&nbsp; </Typography>
              </Grid>
              <Grid
                key={i + "b"}
                item
                xs={3.5}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <Box pr={1}>{guesses[i] ? dists[i] + ` kms ` : null}</Box>
                &nbsp;&nbsp;&nbsp;
                <Box pr={1}>
                  {guesses[i] ? dirs && getDirectionIcon(dirs[i]) : ""}
                </Box>
              </Grid>
              <Grid
                xs={2}
                key={i + "c"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                item
              >
                <Typography p={1}>
                  {guesses[i] ? `${percents[i]}%` : ""}
                </Typography>
              </Grid>
            </Grid>
          </Fade>
        </Paper>
      </Box>
    );
  }

  if (!guesses[i]) {
    return (
      <Box key={i}>
        <Paper elevation={12}>
          <Grid
            container
            my={1}
            py={0.5}
            sx={{
              minHeight: "47.5px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Grid
              key={i + "a"}
              item
              xs={6.5}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography p={1}>&nbsp; </Typography>
            </Grid>
            <Grid
              key={i + "b"}
              item
              xs={3.5}
              sx={{
                textAlign: "end",
              }}
            >
              <Typography p={1}></Typography>
            </Grid>
            <Grid
              xs={2}
              key={i + "c"}
              sx={{
                textAlign: "center",
              }}
              item
            >
              <Typography p={1}></Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }
};

const Delay = 2800;

function App() {
  const dispatch = useAppDispatch();
  const guesses = useAppSelector((state) => state.app.guesses);
  const gameOverLoss = useAppSelector((state) => state.app.gameOverLoss);
  const gameOverWin = useAppSelector((state) => state.app.gameOverWin);
  const [value, setValue] = useState<{ label: string } | null>(null);
  const [answer, setAnswer] = useState<IDeutschlandle>({} as IDeutschlandle);
  const clipboardText = useAppSelector((state) => state.app.clipboardText);
  const allResults = useAppSelector((state) => state.app.allResults);
  const randomIndex = useAppSelector((state) => state.app.randomIndex);

  const chooseTodayState = () => {
    const ans = germanStates[randomIndex];
    setAnswer(ans);
    dispatch(setAnswerStr(ans.label));
  };

  function submitGuess() {
    if (value) {
      const index = germanStates.findIndex(
        (gstate) => gstate.label === value.label
      );

      const guessedState = germanStates[index];
      const answerState = germanStates[randomIndex];

      dispatch(setGuess(guessedState.label));

      const d = distance(
        guessedState.lat,
        guessedState.lon,
        answer.lat,
        answer.lon
      );
      dispatch(addDistance(d));

      const direction = calculateDirection(
        guessedState.lat,
        guessedState.lon,
        answer.lat,
        answer.lon,
        d
      );
      dispatch(addDirection(direction as number));

      const percentage = calculatePercentage(guessedState, answerState);

      if (percentage) {
        let res: number[] = [0, 0, 0, 0, 0];
        if (percentage === 20) {
          res = [2, 0, 0, 0, 0];
        }
        if (percentage === 40) {
          res = [2, 2, 0, 0, 0];
        }
        if (percentage === 60) {
          res = [2, 2, 2, 0, 0];
        }
        if (percentage === 80) {
          res = [2, 2, 2, 2, 0];
        }
        if (percentage >= 90 && percentage < 100) {
          res = [2, 2, 2, 2, 1];
        }
        if (percentage === 100) {
          res = [2, 2, 2, 2, 2];
        }

        res.push(direction as number);

        dispatch(setResults(res));

        dispatch(addAllResults(res));

        dispatch(addGuessPercent(percentage));
      }

      dispatch(add(value?.label as string));
      setValue(null);

      if (value.label === answer.label) {
        setTimeout(() => {
          dispatch(setGameOverWin());
        }, Delay);
      }
    }
  }

  useEffect(() => {
    chooseTodayState();
  }, []);

  const shareScore = () => {
    navigator.clipboard.writeText(clipboardText);
    dispatch(setSnackbarMsg("Copied to clipboard"));
    dispatch(openSnackbar());
  };

  const showAnswer = () => {
    dispatch(setSnackbarMsg(answer?.label));
    dispatch(openSnackbar());
    if (gameOverWin) {
      confetti();
    }
  };

  useEffect(() => {
    if (guesses.length >= 6) {
      if (value?.label != answer.label) {
        setTimeout(() => {
          showAnswer();
          dispatch(setGameOverLoss());
        }, Delay);
      }
      const emojiStr = getShareText(allResults);
      dispatch(
        setClipboardText(
          `#🇩🇪le #${randomIndex} ${
            guesses.length > 0 && guesses.length < 6
              ? guesses.length
              : guesses.length === 6 && gameOverWin
              ? "6"
              : "X"
          }/6
${emojiStr}`
        )
      );
    }

    if (gameOverWin) {
      const emojiStr = getShareText(allResults);
      dispatch(
        setClipboardText(
          `#🇩🇪le #${randomIndex} ${
            guesses.length > 0 && guesses.length < 6
              ? guesses.length
              : guesses.length === 6 && gameOverWin
              ? "6"
              : "X"
          }/6
${emojiStr}`
        )
      );
      dispatch(openSnackbar());
      confetti();
    }
  }, [gameOverWin, guesses]);

  return (
    <Container>
      <Box>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            id="app-title"
            item
            xs={12}
            my={1}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Paper
              sx={{
                width: "100%",
                p: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              elevation={12}
            >
              <h1
                style={{
                  margin: theme.spacing(2),
                }}
              >
                <span
                  style={{
                    color: "#111",
                  }}
                >
                  Deut
                </span>
                <span
                  style={{
                    color: "#e74c3c",
                  }}
                >
                  sch
                </span>
                <span
                  style={{
                    color: "#f1c40f",
                  }}
                >
                  land
                </span>
                <span
                  style={{
                    color: "#27ae60",
                  }}
                >
                  le
                </span>
              </h1>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box id="state-img">
        <Grid
          container
          my={0}
          py={0}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box>{germanStates[randomIndex].state}</Box>
          </Grid>
        </Grid>
      </Box>

      {[0, 1, 2, 3, 4, 5].map((_, i) => {
        return (
          <Box key={i}>
            {GuessRow(i, guesses, germanStates[randomIndex].label)}
          </Box>
        );
      })}

      {gameOverLoss === false && gameOverWin === false && (
        <>
          <Paper elevation={12}>
            <Grid
              container
              my={1}
              py={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Autocomplete
                  options={germanStates}
                  sx={{ width: 350 }}
                  value={value}
                  onChange={(
                    event: any,
                    newValue: { label: string } | null
                  ) => {
                    setValue(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.label === value.label
                  }
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      color="success"
                      {...params}
                      label="State"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>

          <Grid
            container
            my={0.25}
            py={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() => submitGuess()}
                variant="contained"
                fullWidth={true}
                color="success"
                endIcon={<SendIcon />}
              >
                Guess
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      {(gameOverLoss === true || gameOverWin === true) && (
        <Grid
          container
          my={0.25}
          columnSpacing={2}
          py={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => showAnswer()}
              variant="contained"
              sx={{ width: "100%" }}
              color="success"
            >
              Answer
            </Button>
          </Grid>
          <Grid
            item
            xs={9}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => shareScore()}
              variant="contained"
              sx={{ width: "100%" }}
              color="primary"
            >
              Share
            </Button>
          </Grid>
        </Grid>
      )}
      <SnackbarPopup />
    </Container>
  );
}

export default App;
