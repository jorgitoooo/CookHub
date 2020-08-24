import React, { Component } from "react";
import TopRecipeFeed from "../components/TopRecipeFeed";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { a: "" };
    this.handleSetRecipeData = this.handleSetRecipeData.bind(this);
  }
  handleSetRecipeData(data) {
    // Must be passed to the Feed, gets the id from clicked FeedItem
    this.props.history.push(`/recipe/${data}`);
  }
  render() {
    return (
      <div>
        <h1>Top Recipes</h1>
        <TopRecipeFeed handleSetRecipeData={this.handleSetRecipeData} />
      </div>
    );
  }
}

export default Home;
