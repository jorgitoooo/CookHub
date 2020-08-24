import React, { Component } from "react";
import RecipeFeed from "./RecipeFeed";
import firebase from "../firebase";
import { FormControl } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

class TopRecipeFeed extends Component {
  state = {
    recipeList: [],
    recipeKeys: [],
    numPosts: 12,
    sortType: "rating"
  };

  async componentDidMount() {
    if (!this.state.hasLoaded) {
      // For initial load
      this.sortBy(this.state.sortType);
    } else {
      this.setState({ hasLoaded: true });
    }
  }

  async sortBy(sortType) {
    var recipes;
    switch (sortType) {
      case "rating":
        recipes = await firebase
          .database()
          .ref("recipe-list/recipes")
          .limitToLast(this.state.numPosts)
          .orderByChild("rating/percentage");
        break;
      case "newest":
        recipes = await firebase
          .database()
          .ref("recipe-list/recipes")
          .limitToLast(this.state.numPosts);
        break;
      case "oldest":
        recipes = await firebase
          .database()
          .ref("recipe-list/recipes")
          .limitToFirst(this.state.numPosts);
        break;
      default:
        recipes = await firebase
          .database()
          .ref("recipe-list/recipes")
          .limitToLast(this.state.numPosts)
          .orderByChild("rating/percentage");
        break;
    }
    recipes.once("value", snapshot => {
      let itemList = [];
      let keyList = [];
      snapshot.forEach(function(recipe) {
        itemList.unshift(recipe.val());
        keyList.unshift(recipe.key);
      });
      if (sortType === "oldest") {
        itemList = itemList.reverse();
        keyList = keyList.reverse();
      }
      this.setState({ recipeList: itemList });
      this.setState({ recipeKeys: keyList });
    });
  }

  async changeDirection() {
    this.setState({ lastOrFirst: !this.state.lastOrFirst });
  }

  handleSortChange = event => {
    this.sortBy(event.target.value);
    this.setState({ sortType: event.target.value });
  };

  render() {
    return (
      <div>
        <FormControl>
          <InputLabel>Sort by</InputLabel>
          <Select value={this.state.sortType} onChange={this.handleSortChange}>
            <MenuItem value={"rating"} default>
              Rating
            </MenuItem>
            <MenuItem value={"newest"}>Newest</MenuItem>
            <MenuItem value={"oldest"}>Oldest</MenuItem>
          </Select>
        </FormControl>
        <RecipeFeed
          recipeJson={this.state.recipeList}
          recipeKeys={this.state.recipeKeys}
          handleSetRecipeData={this.props.handleSetRecipeData}
        ></RecipeFeed>
      </div>
    );
  }
}

export default TopRecipeFeed;
