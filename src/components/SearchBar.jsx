import React, { useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

import history from "../history";

const useStyles = makeStyles(theme => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    },
    [theme.breakpoints.up("lg")]: {
      marginLeft: theme.spacing(8),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 400
    },
    [theme.breakpoints.up("lg")]: {
      width: 600
    }
  }
}));

export default function SearchBar() {
  const classes = useStyles();
  const [state, setState] = useState({
    search: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = e => {
    if (
      e.key == "Enter" &&
      state.search &&
      state.search.replace(/\s/g, "").length // Only spaces shouldn't trigger a search
    ) {
      history.push("/search/" + state.search.replace(/\s+/g, " "));
      setState(prev => ({
        ...prev,
        search: ""
      }));
    }
  };

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        name="search"
        placeholder="Search…"
        value={state.search}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ "aria-label": "search" }}
        onKeyPress={e => {
          handleSubmit(e);
        }}
        onChange={handleChange}
      />
    </div>
  );
}
