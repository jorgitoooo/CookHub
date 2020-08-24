import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import firebase from "../firebase";
import RateButtons from "../components/RateButtons";
import FavButtons from "../components/FavButtons";
import Share from "../components/Share";

// Components
import Chef from "../components/recipePage/Chef";
import Ingredients from "../components/recipePage/Ingredients";
import Instructions from "../components/recipePage/Instructions";

import Grid from "@material-ui/core/Grid";

const styles = {
  root: {
    flexGrow: 1,
    paddingLeft: "5%",
    paddingRight: "5%"
  },
  recipeImg: {
    overflowX: "hidden",
    objectFit: "contain",
    height: "100%",
    width: "100%"
  }
};

class RecipePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      temp: {},
      isLoaded: false,
      src: ""
    };
  }

  async componentDidMount() {
    let thisRecipe = null;
    let query = await firebase
      .database()
      .ref("recipe-list/recipes/" + this.props.match.params.id)
      .once("value", snap => {
        thisRecipe = snap.val();
      });

    if (thisRecipe == null) {
      this.props.history.push("/NotFound?=" + Date.now());
    } else {
      let myUrl = "";
      query = await firebase
        .storage()
        .ref("recipes/" + thisRecipe.image)
        .getDownloadURL()
        .then(function(url) {
          myUrl = url;
        })
        .catch(function(error) {
          alert(error.code, error.message);
        });

      console.log(thisRecipe);
      this.setState({ temp: thisRecipe, src: myUrl });
      this.setState({ isLoaded: true });
    }
  }

  render() {
    const { classes } = this.props;

    const spacing = 3;
    const gridSize = 6;

    return (
      this.state.isLoaded && (
        <main className={classes.root}>
          <Grid container spacing={spacing}>
            <Grid container item xs={gridSize}>
              {/* Recipe Image */}
              <Grid>
                <img
                  className={classes.recipeImg}
                  src={this.state.src}
                  alt="Recipe"
                />
              </Grid>
              <Chef source={this.state.temp.source} />
            </Grid>
            {/* Recipe's about me */}
            <Grid item xs={gridSize}>
              <h1>
                {this.state.temp.name}{" "}
                <FavButtons recipeId={this.props.match.params.id} />
              </h1>
              <Share
                share={this.state.url}
              />
              <RateButtons
                recipeId={this.props.match.params.id}
                likes={this.state.temp.rating.likes}
                total={this.state.temp.rating.total}
              />
              {/* <Rating value={5} max={5} onChange={value => console.log(value)} /> */}
              <h4>Description</h4>
              <p>{this.state.temp.description}</p>
            </Grid>
          </Grid>
          <Grid container spacing={spacing}>
            <Ingredients ingredients={this.state.temp.ingredients} gridSize />
            <Instructions
              instructions={this.state.temp.instructions}
              gridSize
            />
          </Grid>
        </main>
      )
    );
  }
}
export default withStyles(styles)(RecipePage);
