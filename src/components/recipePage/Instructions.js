import React, { Component } from "react";

// Components
import Instruction from "./Instruction";
import Grid from "@material-ui/core/Grid";

class Instructions extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { instructions, gridSize } = this.props;
    return (
      <>
        <Grid item xs={gridSize}>
          <h1>Instructions</h1>
          <ul>
            {instructions &&
              instructions.map((instruction, index) => (
                <Instruction key={index} instruction={instruction} />
              ))}
          </ul>
        </Grid>
      </>
    );
  }
}

export default Instructions;
