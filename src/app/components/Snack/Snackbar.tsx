import Snackbar from "@mui/material/Snackbar";
import { closeSnackbar } from "../../../features/app/appSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

export function SnackbarPopup() {
  const state = useAppSelector((state) => state.app.snackbarOpen);
  const endMsg = useAppSelector((state) => state.app.endMsg);
  const gameOverWin = useAppSelector((state) => state.app.gameOverWin);

  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(closeSnackbar());

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={state}
        onClose={handleClose}
        message={endMsg}
        autoHideDuration={2500}
        ContentProps={{
          style: {
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            fontSize: 20,
            backgroundColor: gameOverWin ? "#27ae60" : "#e74c3c",
            color: "#FFF",
          },
        }}
        key={"snekbar"}
      />
    </>
  );
}
