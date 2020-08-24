import React, { useState, useEffect } from "react";
import firebase from "../../firebase";

// Style Components
import { Grid, Card, CardActionArea, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import history from "../../history";

const useStyles = makeStyles(theme => ({
  root: {
    margin: "20px auto",
    width: "50vw",
    maxWidth: "400px"
  },
  card: {
    padding: "10px 5px"
  }
}));

const RecipeListItem = props => {
  const classes = useStyles();
  const [state, setState] = useState({
    source: null,
    name: props.recipe.name
  });
  useEffect(() => {
    let author = {
      displayName: props.recipe.source,
      recipeName: props.recipe.name
    };
    async function fetchData(author) {
      try {
        await firebase
          .database()
          .ref("user-list/" + props.recipe.source)
          .once("value", snap => {
            let val = snap.val();
            if (val != null) {
              author.displayName = val.displayName;
            }
            console.log(author.displayName);
            setState(prev => ({
              ...prev,
              source: author.displayName,
              name: author.recipeName
            }));
          });
      } catch (e) {
        //console.log(e);
      }
    }
    fetchData(author);

    /*
    setState(prev => ({
      ...prev,
      source: (author.name && author.name) || null
    }));
    */
  }, [props.recipe]);

  return (
    <Grid className={classes.root} item>
      <Card>
        <CardActionArea
          className={classes.card}
          onClick={() => {
            history.push("/recipe/" + props.recipeKey);
          }}
        >
          <Typography variant="h6" component="h6">
            {props.recipe.name}
          </Typography>
          <Typography variant="h6" component="h6">
            {state.source}
          </Typography>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default RecipeListItem;
