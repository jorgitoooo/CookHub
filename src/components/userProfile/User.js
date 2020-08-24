import React, { useState, useEffect, Component } from "react";
import firebase from "../../firebase";

// Style Components / functions
import { Grid, Typography, TextField } from "@material-ui/core";
import { withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  paper: {},
  root: {
    width: "70vw",
    margin: "0 auto"
  },
  imgStyle: {
    width: "15vw",
    height: "15vw",
    maxWidth: "300px",
    maxHeight: "300px",
    borderRadius: "50%",
    justifySelf: "center"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  nameField: {
    marginRight: theme.spacing(1),
    width: 250
  },
  bio: {
    minHeight: "50px"
  }
});

class User extends Component {
  constructor(props) {
    super(props);
    let curUser = firebase.auth().currentUser;
    let matchUserUid = false;
    if (curUser) {
      matchUserUid = curUser.uid == this.props.uid;
    }
    this.state = {
      user: props.user,
      isLoaded: false,
      isUser: matchUserUid,
      displayNameError: ""
    };
  }

  async componentDidMount() {
    console.log(this.props.user);
    if (!this.state.isLoaded) {
      let myUrl = "";
      await firebase
        .storage()
        .ref("users/" + this.props.user.image)
        .getDownloadURL()
        .then(function(url) {
          myUrl = url;
        })
        .catch(function(error) {
          console.log(error);
          alert(error.code, error.message);
        });
      this.setState(prev => ({
        ...prev,
        url: myUrl,
        isLoaded: true
      }));
    }
  }

  updateUserBio = event => {
    console.log(event.target.value.length);
    if (this.state.isUser) {
      firebase
        .database()
        .ref("user-list/" + this.props.uid + "/bio")
        .set(event.target.value);
    }
  };

  updateUserDisplayName = event => {
    let newUserName = event.target.value.replace(/^\s+|\s+$/g, ""); //Remove entry spaces
    let displayNameError = "";
    if (
      this.state.isUser &&
      newUserName.length > 0 &&
      newUserName.length <= 16
    ) {
      firebase
        .database()
        .ref("user-list/" + this.props.uid + "/displayName")
        .set(newUserName);
    } else {
      if (newUserName.length > 16) {
        displayNameError = "Display Name must be less than 16 characters.";
      } else {
        displayNameError = "Invalid Display Name";
      }
    }
    this.setState({ displayNameError });
  };

  uploadProfilePic = event => {
    if (this.state.isUser) {
      let file = event.target.files[0];
      this.uploadPicture(file);
    }
  };

  async uploadPicture(file) {
    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef
      .child("users/" + this.props.uid + "-profile-pic")
      .put(file);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function(error) {
        console.log(error);
      },
      function() {
        uploadTask.snapshot.ref.getDownloadURL().then(
          function(downloadURL) {
            console.log("File available at", downloadURL);
            this.setState({
              url: downloadURL
            });
            firebase
              .database()
              .ref("user-list/" + this.props.uid + "/image")
              .set(this.props.uid + "-profile-pic");
          }.bind(this)
        );
      }.bind(this)
    );
  }

  render() {
    const { classes } = this.props;
    const screenNotSmall = window.screen.availWidth < 600;

    return (
      <Paper className={classes.paper}>
        <Grid
          className={classes.root}
          container
          direction={screenNotSmall ? "row" : "column"}
          alignItems="center"
          spacing={1}
        >
          <Grid
            container
            justify="center"
            alignItems="flex-end"
            item
            xs={screenNotSmall ? 6 : 12}
          >
            <Grid item xs>
              <div>
                {(this.state.isLoaded && (
                  <img
                    className={classes.imgStyle}
                    src={this.state.url}
                    alt="User Image"
                  />
                )) || <CircularProgress />}
              </div>
              {this.state.isUser ? (
                <Button variant="contained" component="label">
                  Change Profile Pic
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={this.uploadProfilePic}
                  />
                </Button>
              ) : null}
            </Grid>
            <Grid item xs>
              {this.state.isUser ? (
                <TextField
                  defaultValue={
                    this.state.user.displayName ||
                    "Click to change display name. Click out to save"
                  }
                  inputProps={{ maxLength: 28 }}
                  onBlur={this.updateUserDisplayName}
                  className={classes.nameField}
                  error={this.state.displayNameError != ""}
                  helperText={this.state.displayNameError}
                  margin="normal"
                />
              ) : (
                <TextField
                  InputProps={{
                    readOnly: true
                  }}
                  defaultValue={this.state.user.displayName || ""}
                  className={classes.nameField}
                  margin="normal"
                />
              )}
              <Typography component="h4">
                <b>{this.state.user.name}</b>
              </Typography>
              <Typography component="h5">
                <strong>Member since:</strong>{" "}
                {new Date(this.state.user.date_created).toDateString()}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={screenNotSmall ? 6 : 12}>
            <Grid container item direction="column">
              <Typography variant="h4" component="h2">
                Bio
              </Typography>
              <form className={classes.container} noValidate autoComplete="off">
                <TextField
                  id="standard-multiline-static"
                  multiline
                  rows="4"
                  defaultValue={
                    this.state.user.bio ||
                    (this.state.isUser
                      ? "Click to edit bio. Click out to save."
                      : "No bio available.")
                  }
                  className={classes.textField}
                  margin="normal"
                  InputProps={{
                    readOnly: !this.state.isUser
                  }}
                  onBlur={this.updateUserBio}
                  inputProps={{ maxLength: 300 }}
                />
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(User);
