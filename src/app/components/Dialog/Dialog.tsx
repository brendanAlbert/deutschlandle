import React, { Fragment, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  toggleDialog,
  setSnackbarMsg,
  openSnackbar,
} from "../../../features/app/appSlice";
import { germanStates, IDeutschlandle } from "../States/states";
import { Box, Grid, Paper } from "@mui/material";
import {
  badenWurttembergUri,
  bayernUri,
  coatOfArmsMap,
} from "../../assets/germanStateCoatArms/coatOfArms";
import { loadState } from "../../browserStorage";
import { theme } from "../../../theme";

function SimpleDialog() {
  const dispatch = useAppDispatch();
  const clipboardText = useAppSelector((state) => state.app.clipboardText);
  const dialogOpen = useAppSelector((state) => state.app.dialogOpen);
  const answer = useAppSelector((state) => state.app.answer);

  const loadedState = loadState();

  const [hrs, setHrs] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);

  const shareScore = () => {
    navigator.clipboard.writeText(clipboardText);
    dispatch(setSnackbarMsg("Copied to clipboard"));
    dispatch(openSnackbar());
  };

  const handleClose = () => {
    dispatch(toggleDialog(false));
  };

  useEffect(() => {
    const today = new Date();
    let tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      0
    );
    let x = setInterval(function () {
      const today = new Date();
      const distance = tomorrow.getTime() - today.getTime();
      setHrs(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMins(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSecs(Math.floor((distance % (1000 * 60)) / 1000));
      if (distance < 0) clearInterval(x);
    }, 1000);

    return () => {
      clearInterval(x);
    };
  }, []);

  return (
    <Dialog
      onClose={handleClose}
      open={dialogOpen}
      fullWidth={true}
      maxWidth="xs"
    >
      <Box
        onClick={() => handleClose()}
        sx={{
          border: "1px solid #FFF",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pb: 1,
          width: "26px",
          height: "20px",
          position: "absolute",
          fontSize: "20px",
          top: 20,
          right: 20,
          cursor: "pointer",
          transition: "0.2s ease-in-out",
          "&:hover": {
            transition: "0.2s ease-in-out",
            color: "red",
            borderColor: "red",
          },
        }}
      >
        x
      </Box>
      <Box
        component="span"
        sx={{
          pt: 3,
          pl: 3,
          fontWeight: 400,
          fontSize: "12px",
          color: "#888",
        }}
      >
        Today's State
      </Box>
      <Typography sx={{ fontWeight: 700 }} pl={3} pt={1}>
        {answer}
      </Typography>

      <Grid container sx={{ py: 3, px: 2 }}>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            py: 1,
            mx: 0,
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Grid item sx={{ fontSize: "20px", fontWeight: 700 }}>
            {loadedState?.stats?.current_streak}
          </Grid>
          <Grid item sx={{ color: "#888" }}>
            Current Streak
          </Grid>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            py: 1,
            mx: 0,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid item sx={{ fontSize: "20px", fontWeight: 700 }}>
            {loadedState?.stats?.played}
          </Grid>
          <Grid item sx={{ color: "#888" }}>
            Played
          </Grid>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            py: 1,
            mx: 0,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid item sx={{ fontSize: "20px", fontWeight: 700 }}>
            {loadedState?.stats?.win_percentage}
          </Grid>
          <Grid item sx={{ color: "#888" }}>
            Win %
          </Grid>
        </Grid>

        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            py: 1,
            mx: 0,
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Grid item sx={{ fontSize: "20px", fontWeight: 700 }}>
            {loadedState?.stats?.max_streak}
          </Grid>
          <Grid item sx={{ color: "#888" }}>
            Max Streak
          </Grid>
        </Grid>
      </Grid>

      <List
        dense={true}
        sx={{ pt: 0, maxHeight: "400px", overflowY: "scroll" }}
      >
        {germanStates.map((state: IDeutschlandle) => (
          <Fragment key={state.label}>
            <Paper sx={{ pt: 2, mt: 2, mx: 2, pb: 2 }} elevation={18}>
              <Grid container pl={3}>
                <Grid
                  item
                  xs={2}
                  sx={{
                    pl: 0,
                    fontSize: "14px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid item sx={{}}>
                    {loadedState?.states[state.label] !== undefined &&
                      loadedState?.states[state.label][0] > 0 && (
                        <>✅ {loadedState?.states[state.label][0]}</>
                      )}
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={7}
                  pl={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    width="30"
                    style={{ paddingRight: theme.spacing(2) }}
                    src={coatOfArmsMap(state?.label)}
                  />
                  {state.label}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    pl: 0,
                    fontSize: "14px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    {loadedState?.states[state.label] !== undefined &&
                      loadedState?.states[state.label][1] > 0 && (
                        <>❌ {loadedState?.states[state.label][1]}</>
                      )}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Fragment>
        ))}
      </List>

      <Grid
        container
        sx={{
          p: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ fontSize: "14px", color: "#888" }}
            pl={0}
            pt={0}
            pb={0}
          >
            Next Deutschlandle
          </Typography>
          <Box
            component="span"
            sx={{
              pl: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: "#FFF",
              fontFamily: "monospace",
            }}
          >
            {hrs}h {mins}m {secs}s
          </Box>
        </Grid>
        <Grid item xs={true}>
          <Button
            onClick={() => shareScore()}
            sx={{ mx: 2, my: 2, width: "100%" }}
            variant="contained"
          >
            share
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export { SimpleDialog };
