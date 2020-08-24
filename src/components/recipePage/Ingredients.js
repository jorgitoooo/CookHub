import React, { Component } from "react";

// Components
import Ingredient from "./Ingredient";
import Grid from "@material-ui/core/Grid";

class Ingredients extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { ingredients, gridSize } = this.props;
    return (
      <>
        <Grid item xs={gridSize}>
          <h1>Ingredients</h1>
          {ingredients &&
            ingredients.map((ingredient, index) => (
              <Ingredient key={index} ingredient={ingredient} />
            ))}
        </Grid>
      </>
    );
  }
}

export default Ingredients;
