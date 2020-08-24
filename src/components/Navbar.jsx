import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Button } from "@material-ui/core";
import SearchBar from "./SearchBar";

import history from "../history";
import firebase from "../firebase";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  navbar: {},
  search: {
    marginLeft: "15px"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  titlespacer: {
    flexGrow: 1
  },
  title: {
    cursor: "pointer"
  },
  button: {
    marginLeft: "1rem"
  }
}));

export default function MenuAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Appbar functionality
  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRedirect = address => {
    history.push(address);
  };

  return (
    <AppBar position="sticky" className={classes.navbar}>
      <Toolbar>
        <Typography
          variant="h5"
          className={classes.title}
          onClick={() => handleRedirect("/")}
        >
          CookHub
        </Typography>
        <div className={classes.search}>
          <SearchBar />
        </div>
        <div className={classes.titlespacer}></div>

        {props.isAuthenticated && (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleRedirect("/user/" + firebase.auth().currentUser.uid);
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={e => {
                  handleClose();
                  props.handleLogout();
                  history.push("/");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        )}
        {!props.isAuthenticated && (
          <div>
            <Button
              variant="contained"
              href="/login"
              className={classes.button}
            >
              Login
            </Button>
            <Button
              variant="contained"
              href="/signup"
              className={classes.button}
            >
              Sign Up
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
