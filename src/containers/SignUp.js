import React, { Component } from "react";
import firebase from "../firebase";
import EmailIcon from "@material-ui/icons/Email";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = {
  input: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: "15px"
  },
  icon: {
    justifySelf: "center",
    alignSelf: "center",
    marginRight: "15px"
  },
  body: {
    backgroundSize: "cover",
    backgroundColor: "#bdbdbd",
    fontFamily: "'Ubuntu', sans-serif"
  },
  container: {
    backgroundColor: "#FFFFFF",
    width: "400px",
    height: "500px",
    margin: "7em auto",
    borderRadius: "1.5em",
    boxShadow: "0px 11px 35px 2px rgba(0, 0, 0, 0.7)"
  },
  title: {
    paddingTop: "50px",
    textAlign: "center",
    paddingBottom: "10px",
    color: "#1c3ec9",
    fontFamily: "'Ubuntu', sans-serif",
    fontWeight: "bold",
    fontSize: "23px"
  },
  signupbtn: {
    cursor: "pointer",
    borderRadius: "5em",
    color: "#fff",
    background: "linear-gradient(to right, #0a29ad, #00aaff)",
    border: 0,
    paddingLeft: "40px",
    paddingRight: "40px",
    paddingBottom: "10px",
    paddingTop: "10px",
    fontFamily: "'Ubuntu', sans-serif",
    marginLeft: "35%",
    fontSize: "13px",
    boxShadow: "0 0 20px 1px rgba(0, 0, 0, 0.04)"
  }
};

const initialState = {
  email: "",
  password: "",
  password_confirmation: "",

  emailError: "",
  passwordError: ""
};

class SignUp extends Component {
  state = initialState;

  handleChange = event => {
    if (this.state.emailError || this.state.passwordError) {
      this.setState({ emailError: "", passwordError: "" });
    }
    this.setState({ [event.target.name]: event.target.value });
  };

  validate = () => {
    let emailError = "";
    let passwordError = "";

    if (!this.state.email) {
      emailError = "Email field is empty";
    }
    // should use !validator.isEmail(this.state.email) for real case
    else if (!this.state.email.includes("@")) {
      emailError = "Invalid email address";
    }

    if (!this.state.password) {
      passwordError = "Password field is empty";
    } else if (this.state.password.length < 6) {
      passwordError = "Password must be at least 6 characters";
    }

    if (!this.state.password_confirmation) {
      passwordError = "Password field is empty";
    }

    if (this.state.password_confirmation !== this.state.password) {
      passwordError = "Password does not match";
    }

    if (emailError || passwordError) {
      this.setState({ emailError, passwordError });
      return false;
    }
    return true;
  };

  handleSubmit = event => {
    event.preventDefault();

    if (!this.validate()) return;

    // Add user to firebase auth
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        // Add user to database user table
        // userData won't actually push anything, but push the date_created value
        let userData = {
          favorited_recipes: {}, // Dictionary of recipe id's => recipe id. Maybe change value to date later?
          created_recipes: {}, // Dictionary of recipe id's => recipe id
          liked_recipes: {
            // Recipe id => rating (0 = disliked, 1 = liked)
          },
          image: "default.png",
          displayName: this.state.email.split("@")[0],
          name: this.state.email,
          date_created: firebase.database.ServerValue.TIMESTAMP
        };

        let uid = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref()
          .child("/user-list/" + uid)
          .set(userData);

        this.props.history.push("/");
      })
      .catch(
        function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          window.alert("Error: " + errorCode + ": " + errorMessage);
          this.setState({ emailError: "Invalid Entry" });
        }.bind(this)
      );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container} onSubmit={this.handleSubmit}>
        <h5 className={classes.title}>Create Account</h5>
        <form className="form-type-material">
          <div className={classes.input}>
            <label htmlFor="email" className={classes.icon}>
              <EmailIcon />
            </label>
            <TextField
              error={this.state.emailError !== ""}
              helperText={this.state.emailError}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              onChange={this.handleChange}
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="password" className={classes.icon}>
              <VpnKeyIcon />
            </label>
            <TextField
              error={this.state.passwordError !== ""}
              helperText={this.state.passwordError}
              id="outlined-password-input"
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              onChange={this.handleChange}
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="password" className={classes.icon}>
              <VpnKeyIcon />
            </label>
            <TextField
              error={this.state.passwordError !== ""}
              helperText={this.state.passwordError}
              id="outlined-password-input"
              label="Password (Confirm)"
              variant="outlined"
              type="password"
              name="password_confirmation"
              onChange={this.handleChange}
            />
          </div>
          <br />
          <button type="submit" className={classes.signupbtn}>
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(SignUp);
