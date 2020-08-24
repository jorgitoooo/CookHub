import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import firebase from "../firebase";

class RateButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: firebase.auth().currentUser ? firebase.auth().currentUser.uid : null,
      toggle: false
    };
  }

  componentDidMount() {
    if (this.state.uid != null) {
      let ref = firebase
        .database()
        .ref(
          "user-list/" +
            this.state.uid +
            "/favorited_recipes/" +
            this.props.recipeId
        )
        .once("value", snapshot => {
          this.setState({ toggle: snapshot.exists() });
        });
    }
  }

  addToFavorites = async recipeId => {
    if (this.state.uid) {
      const newState = !this.state.toggle;
      if (this.state.toggle == false) {
        var num = Number(recipeId);
        var databaseRef = firebase
          .database()
          .ref(
            "user-list/" +
              firebase.auth().currentUser.uid +
              "/favorited_recipes"
          );
        databaseRef.update({ [recipeId]: num });
      } else if (this.state.toggle == true) {
        var databaseRef = firebase
          .database()
          .ref(
            "user-list/" +
              firebase.auth().currentUser.uid +
              "/favorited_recipes/" +
              this.props.recipeId
          );
        databaseRef.remove();
      }
      this.setState({ toggle: newState });
    }
  };

  render() {
    return (
      <IconButton
        onClick={() => this.addToFavorites(this.props.recipeId)}
        color={this.state.toggle ? "secondary" : "default"}
        disabled={this.state.uid === null}
        aria-label="favorite"
      >
        <FavoriteIcon />
      </IconButton>
    );
  }
}

export default RateButtons;
