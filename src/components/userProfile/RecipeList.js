import React, { useState } from "react";

// Components
import RecipeListTabs from "./RecipeListTabs";
import RecipeListItems from "./RecipeListItems";

// Style Components
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  paper: {
    width: "70vw",
    margin: "20px auto",
    height: "52vh"
  },
  button: {
    margin: "0 auto"
  }
}));

const RecipeList = props => {
  const classes = useStyles();
  const type = props.favorited != null ? "favorites" : "created";
  const [recipeListType, setRecipeListType] = useState(type);

  return (
    <Paper className={classes.paper}>
      <RecipeListTabs
        displayListType={setRecipeListType}
        created={props.created != null}
        favorited={props.favorited != null}
      />
      <RecipeListItems
        type={recipeListType}
        created={props.created}
        favorited={props.favorited}
      />
    </Paper>
  );
};

export default RecipeList;
