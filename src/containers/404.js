import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexFlow: "column",
    height: "100vh",
    width: "100vw",
    position: "absolute",
    top: 0,
    right: 0,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center"
  }
});

export default function NotFound() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h3" component="h2" color="error">
        404: Page not found
      </Typography>
    </div>
  );
}
