import React, { Component } from "react";
import firebase from "../firebase";
import RecipeFeed from "../components/RecipeFeed";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

function searchRecipes(query, callback) {
  firebase
    .database()
    .ref("recipe-list/recipes")
    //.limitToLast(10)
    .orderByChild("name")
    .startAt(query)
    .endAt(query + "\uf8ff")
    .once("value", snap => {
      callback(snap.val());
    });
}

const styles = {
  loadwheel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minHeight: "80vh"
  }
};

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeJson: [],
      recipeKeys: [],
      found: false,
      isLoaded: false
    };
  }
  getRecipeData() {
    searchRecipes(this.props.match.params.id, searches => {
      console.log(searches);
      let json = [];
      let keys = [];
      let found = false;
      for (let key in searches) {
        console.log(key);
        json.push(searches[key]);
        keys.push(key);
      }
      found = json.length > 0 ? true : false;
      this.setState({
        recipeJson: json,
        recipeKeys: keys,
        found: found,
        isLoaded: true
      });
    });
  }
  componentDidUpdate = prevProps => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ isLoaded: false });
      this.getRecipeData();
    }
  };
  async componentDidMount() {
    this.getRecipeData();
  }
  render() {
    const { classes } = this.props;
    return (
      (this.state.isLoaded &&
        ((this.state.found && (
          <div>
            <h1>Search Page</h1>
            <RecipeFeed
              recipeJson={this.state.recipeJson}
              recipeKeys={this.state.recipeKeys}
            ></RecipeFeed>
          </div>
        )) || (
          <div className={classes.loadwheel}>
            <Typography variant="h3" component="h2" color="error">
              Search not found, try again
            </Typography>
          </div>
        ))) || (
        <div className={classes.loadwheel}>
          <CircularProgress />
        </div>
      )
    );
  }
}

export default withStyles(styles)(SearchResults);
