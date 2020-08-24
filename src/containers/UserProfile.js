import React, { Component } from "react";
import firebase from "../firebase";

// Style Components
import Button from "@material-ui/core/Button";

// Components
import User from "../components/userProfile/User";
import RecipeList from "../components/userProfile/RecipeList";

const styles = {
  submitBtn: {
    position: "fixed",
    margin: "5px",
    bottom: "0",
    right: "0"
  }
};

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
      user: null,
      favorited: null,
      created: null
    };
  }
  async componentDidMount() {
    let user = null;
    let query = await firebase
      .database()
      .ref("user-list/" + this.props.match.params.id)
      .once("value", snap => {
        user = snap.val();
      });
    if (user == null) {
      this.props.history.push("/NotFound?=" + Date.now());
    } else {
      // user loaded in fine
      let favorites = {};
      let created = {};
      if (user.favorited_recipes != null) {
        let promiseFavorites = Object.keys(user.favorited_recipes).map(key => {
          // get favorited recipes
          return firebase
            .database()
            .ref("/recipe-list/recipes/")
            .child(key)
            .once("value");
        });
        await Promise.all(promiseFavorites).then(snaps => {
          snaps.forEach(snap => {
            favorites[snap.key] = snap.val();
          });
          this.setState({ favorited: favorites });
        });
      }
      if (user.created_recipes != null) {
        let promiseCreated = Object.keys(user.created_recipes).map(key => {
          // get favorited recipes
          return firebase
            .database()
            .ref("/recipe-list/recipes/")
            .child(key)
            .once("value");
        });
        await Promise.all(promiseCreated).then(snaps => {
          snaps.forEach(snap => {
            created[snap.key] = snap.val();
          });
          this.setState({ created: created });
        });
      }
      this.setState({ hasLoaded: true, user: user });
    }
  }

  render() {
    return (
      this.state.hasLoaded && (
        <div>
          <User user={this.state.user} uid={this.props.match.params.id} />
          {(this.state.created != null || this.state.favorited != null) && (
            <RecipeList
              user={this.state.user}
              created={this.state.created}
              favorited={this.state.favorited}
            />
          )}
          <Button
            style={styles.submitBtn}
            variant="contained"
            color="primary"
            onClick={e => {
              e.preventDefault();
              window.location.pathname = `create-recipe/${this.props.match.params.id}`;
            }}
          >
            Create Recipe
          </Button>
        </div>
      )
    );
  }
}
export default UserProfile;
