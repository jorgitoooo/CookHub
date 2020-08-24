import React, { Component } from "react";
import FeedItem from "./FeedItem";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import history from "../history";

// Takes in parameters:
// recipeJson - the recipe data from firebase
// recipeKeys - the database key of the recipe (Look at TopRecipeFeed.jsx for example)

const styles = {
  paper: {
    height: "100%",
    overflow: "auto",
    backgroundColor: "lightgrey",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  container: {
    height: "80vh"
  },
  textField: {
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
};

class RecipeFeed extends Component {
  state = {};

  handleSetRecipeData(data) {
    history.push("/recipe/" + data);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          {this.props.recipeJson &&
            this.props.recipeKeys &&
            this.props.recipeKeys.length === this.props.recipeJson.length &&
            this.props.recipeJson.map(
              function(recipe, idx) {
                return (
                  <FeedItem
                    recipeJson={recipe}
                    key={this.props.recipeKeys[idx]}
                    id={this.props.recipeKeys[idx]}
                    handleSetRecipeData={this.handleSetRecipeData}
                  ></FeedItem>
                );
              }.bind(this)
            )}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(RecipeFeed);
