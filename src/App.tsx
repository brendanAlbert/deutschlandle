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
import { useCallback, useEffect, useState } from "react";
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
  setRandomIndex,
  setResults,
  setSnackbarMsg,
  toggleDialog,
} from "./features/app/appSlice";
import { calculateDirection } from "./helpers/calculateDirection";
import { distance } from "./helpers/calculateLatLongDistance";
import { calculatePercentage } from "./helpers/calculatePercentage";
import { confetti } from "./helpers/confetti";
import { getShareText } from "./helpers/getShareText";
import { useGetTodaysStateQuery } from "./services/stateFetch";
import { theme } from "./theme";
import Skeleton from "@mui/material/Skeleton";
import { SimpleDialog } from "./app/components/Dialog/Dialog";
import { loadState, saveState } from "./app/browserStorage";

// TODO - save users stats in localstorage
const GuessRow = ({
  i,
  guesses,
  answerState,
}: {
  i: number;
  guesses: string[];
  answerState: string;
}) => {
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
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Typography fontSize={14} p={1}>
                  {guesses[i] ?? ""}&nbsp;{" "}
                </Typography>
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
                <Box sx={{ fontSize: "14px" }} pr={1}>
                  {guesses[i] ? dists[i] + ` kms ` : null}
                </Box>
                &nbsp;&nbsp;&nbsp;
                <Box pr={1} mt={1}>
                  {guesses[i] ? dirs && getDirectionIcon(dirs[i]) : ""}
                </Box>
              </Grid>
              <Grid
                xs={2}
                key={i + "c"}
                pr={3}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
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
                display: "flex",
                justifyContent: "flex-end",
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

  return null;
};

const Delay = 2800;

function App() {
  const dispatch = useAppDispatch();
  const guesses = useAppSelector((state) => state.app.guesses);
  const gameOverLoss = useAppSelector((state) => state.app.gameOverLoss);
  const gameOverWin = useAppSelector((state) => state.app.gameOverWin);
  const [value, setValue] = useState<{ label: string } | null>(null);
  const [answer, setAnswer] = useState<IDeutschlandle>({} as IDeutschlandle);

  const allResults = useAppSelector((state) => state.app.allResults);
  const randomIndex = useAppSelector((state) => state.app.randomIndex);

  const { data, error, isLoading } = useGetTodaysStateQuery("");

  const chooseTodayState = useCallback(
    (fetchedState: number) => {
      dispatch(setRandomIndex(fetchedState));
      // dispatch(setRandomIndex(3));
      const ans = germanStates[fetchedState];
      // const ans = germanStates[3];
      setAnswer(ans);
      dispatch(setAnswerStr(ans.label));
    },
    [dispatch, setRandomIndex, setAnswer]
  );

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
    if (data) {
      chooseTodayState(data?.state);
    }
  }, [chooseTodayState, data]);

  const openStatsDialog = () => {
    dispatch(toggleDialog(true));
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
          const loadedState = loadState();

          console.log({ loadedState });

          let wins, losses, new_losses, updatedStateResultsArray, innerStates;
          let loaded_current_streak,
            loaded_played,
            loaded_win_percentage,
            loaded_max_streak,
            loaded_games_won;

          if (loadedState) {
            wins = loadedState?.states[answer.label]
              ? loadedState?.states[answer.label][0]
              : 0;
            losses = loadedState.states[answer.label]
              ? loadedState?.states[answer.label][1]
              : 0;
            new_losses = losses + 1; // [0,0]
            updatedStateResultsArray = [wins, new_losses];

            innerStates = loadedState.states;

            loaded_current_streak = 0;
            loaded_played = loadedState.stats.played + 1;

            loaded_max_streak = loadedState.stats.max_streak;

            loaded_games_won = loadedState.stats.games_won;

            loaded_win_percentage = Math.trunc(
              (loaded_games_won / loaded_played) * 100
            );
          } else {
            updatedStateResultsArray = [0, 1];
            loaded_current_streak = 0;
            loaded_win_percentage = 0;
            loaded_max_streak = 0;
            loaded_games_won = 0;
            loaded_played = 1;
          }

          let newSaveState = {
            ...loadedState,
            guesses,
            today: new Date().getDate(),
            played: true,
            state: answer.label,
            stats: {
              current_streak: loaded_current_streak,
              games_won: loaded_games_won,
              played: loaded_played,
              win_percentage: loaded_win_percentage,
              max_streak: loaded_max_streak,
            },
            states: {
              ...innerStates,
              [answer.label]: updatedStateResultsArray,
            },
          };
          console.log({ state: [answer.label], loadedState, newSaveState });
          saveState(newSaveState);
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
      const loadedState = loadState();

      console.log({ loadedState });

      let wins, losses, new_wins, updatedStateResultsArray, innerStates;
      let loaded_current_streak,
        loaded_played,
        loaded_win_percentage,
        loaded_max_streak,
        loaded_games_won;

      if (loadedState) {
        wins = loadedState?.states[answer.label]
          ? loadedState?.states[answer.label][0]
          : 0;
        losses = loadedState.states[answer.label]
          ? loadedState?.states[answer.label][1]
          : 0;
        new_wins = wins + 1; // [0,0]
        updatedStateResultsArray = [new_wins, losses];

        innerStates = loadedState.states;

        loaded_current_streak = loadedState.stats.current_streak + 1;
        loaded_played = loadedState.stats.played + 1;

        loaded_max_streak = loadedState.stats.max_streak;

        loaded_max_streak =
          loaded_current_streak > loaded_max_streak
            ? loaded_current_streak
            : loaded_max_streak;

        loaded_games_won = loadedState.stats.games_won + 1;

        loaded_win_percentage = Math.trunc(
          (loaded_games_won / loaded_played) * 100
        );
      } else {
        updatedStateResultsArray = [1, 0];
        loaded_current_streak = 1;
        loaded_win_percentage = 100;
        loaded_max_streak = 1;
        loaded_games_won = 1;
        loaded_played = 1;
      }

      let newSaveState = {
        ...loadedState,
        guesses,
        today: new Date().getDate(),
        played: true,
        state: answer.label,
        stats: {
          current_streak: loaded_current_streak,
          games_won: loaded_games_won,
          played: loaded_played,
          win_percentage: loaded_win_percentage,
          max_streak: loaded_max_streak,
        },
        states: {
          ...innerStates,
          [answer.label]: updatedStateResultsArray,
        },
      };
      console.log({ state: [answer.label], loadedState, newSaveState });
      saveState(newSaveState);
      dispatch(openSnackbar());
      confetti();
    }
  }, [gameOverWin, guesses, dispatch]);

  return (
    <Container maxWidth="xs">
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
            mt={1}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1
                style={{
                  fontSize: "36px",
                  margin: theme.spacing(2),
                }}
              >
                <span
                  style={{
                    color: "#111",
                    textShadow: "2px 2px 0 #000",
                  }}
                >
                  Deut
                </span>
                <span
                  style={{
                    color: "#e74c3c",
                    textShadow: "2px 2px 0 #000",
                  }}
                >
                  sch
                </span>
                <span
                  style={{
                    color: "#f1c40f",
                    textShadow: "2px 2px 0 #000",
                  }}
                >
                  lan
                </span>
                <span
                  style={{
                    // color: "#27ae60",
                    color: "green",
                    textShadow: "2px 2px 0 #000",
                  }}
                >
                  dle
                </span>
              </h1>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {isLoading && (
        <>
          <Grid container sx={{ display: "flex", justifyContent: "center" }}>
            <Grid item mt={0}>
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={350}
                height={184}
              />
            </Grid>
          </Grid>
        </>
      )}

      {!isLoading && (
        <>
          <Fade in={true}>
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
          </Fade>
        </>
      )}

      {[0, 1, 2, 3, 4, 5].map((_, i) => (
        <Box key={i}>
          <GuessRow
            i={i}
            guesses={guesses}
            answerState={germanStates[randomIndex]?.label}
          />
        </Box>
      ))}

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
                  "& .MuiAutocomplete-root .MuiInput-root .MuiInput-input": {
                    cursor: "pointer",
                  },
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Autocomplete
                  options={germanStates}
                  sx={{
                    width: "90%",
                  }}
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
                // color={"green"}
                sx={{
                  color: "#FFF",
                  backgroundColor: "green",
                  "&:hover": {
                    backgroundColor: "#009432",
                  },
                }}
                endIcon={<SendIcon />}
              >
                Guess
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      {(gameOverLoss === true || gameOverWin === true) && (
        <>
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
                onClick={() => openStatsDialog()}
                variant="contained"
                sx={{ width: "100%" }}
                color="primary"
              >
                Share
              </Button>
            </Grid>
          </Grid>
          <SimpleDialog />
        </>
      )}
      <SnackbarPopup />
    </Container>
  );
}

export default App;
