import { Box, Grid, Paper } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { useAppSelector } from "../hooks";
import getDirectionIcon from "./Directions/DirectionIcons";

const BlackSquare = (
  <Box
    sx={{
      width: "20px",
      height: "20px",
      backgroundColor: "#57606f",
    }}
  ></Box>
);

const YellowSquare = (
  <Box
    sx={{
      width: "20px",
      height: "20px",
      backgroundColor: "#f1c40f",
    }}
  ></Box>
);

const GreenSquare = (
  <Box
    sx={{
      width: "20px",
      height: "20px",
      backgroundColor: "#27ae60",
    }}
  ></Box>
);
function GuessTransition({
  index,
  checked,
  results = [2, 2, 2, 1, 0, 15],
}: {
  index: number;
  checked: boolean;
  results: number[];
}) {
  const percents = useAppSelector((state) => state.app.guessPercents);

  return (
    <Paper elevation={12}>
      <Grid
        container
        mt={1}
        p={2}
        sx={{ minHeight: "47.5px", display: "flex", justifyContent: "center" }}
      >
        <Grid item xs={1.5}>
          <Zoom in={checked}>
            <Box>
              {results[0] === 0
                ? BlackSquare
                : results[0] === 1
                ? YellowSquare
                : GreenSquare}
            </Box>
          </Zoom>
        </Grid>
        <Grid item xs={1.5}>
          <Zoom
            in={checked}
            style={{ transitionDelay: checked ? "300ms" : "0ms" }}
          >
            <Box>
              {results[1] === 0
                ? BlackSquare
                : results[1] === 1
                ? YellowSquare
                : GreenSquare}
            </Box>
          </Zoom>
        </Grid>
        <Grid item xs={1.5}>
          <Zoom
            in={checked}
            style={{ transitionDelay: checked ? "600ms" : "0ms" }}
          >
            <Box>
              {results[2] === 0
                ? BlackSquare
                : results[2] === 1
                ? YellowSquare
                : GreenSquare}
            </Box>
          </Zoom>
        </Grid>
        <Grid item xs={1.5}>
          <Zoom
            in={checked}
            style={{ transitionDelay: checked ? "850ms" : "0ms" }}
          >
            <Box>
              {results[3] === 0
                ? BlackSquare
                : results[3] === 1
                ? YellowSquare
                : GreenSquare}
            </Box>
          </Zoom>
        </Grid>
        <Grid item xs={1.5}>
          <Zoom
            in={checked}
            style={{ transitionDelay: checked ? "1050ms" : "0ms" }}
          >
            <Box>
              {results[4] === 0
                ? BlackSquare
                : results[4] === 1
                ? YellowSquare
                : GreenSquare}
            </Box>
          </Zoom>
        </Grid>
        <Grid item xs={1.5}>
          <Zoom
            in={checked}
            style={{ transitionDelay: checked ? "1200ms" : "0ms" }}
          >
            <Box>{getDirectionIcon(results[5])}</Box>
          </Zoom>
        </Grid>
        <Grid item xs={1.5}>
          <Zoom
            in={checked}
            style={{ transitionDelay: checked ? "1300ms" : "0ms" }}
          >
            <Box>{percents[index] + "%"}</Box>
          </Zoom>
        </Grid>
      </Grid>
    </Paper>
  );
}

export { GuessTransition };
