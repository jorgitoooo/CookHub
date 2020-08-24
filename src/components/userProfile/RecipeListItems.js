import React from "react";

// Components
import RecipeListItem from "./RecipeListItem";

// Style Components
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  paper: {
    height: "100%",
    overflow: "auto"
  }
});

const RecipeListItems = props => {
  const classes = useStyles();
  let type = props.type == "favorites" ? props.favorited : props.created;
  let recipes = [];
  if (type != null) {
    let keys = Object.keys(type);
    recipes =
      keys != null
        ? keys.map(recipeKey => (
            <RecipeListItem
              recipe={type[recipeKey]}
              recipeKey={recipeKey}
            ></RecipeListItem>
          ))
        : [];
  }
  return <Paper className={classes.paper}>{recipes}</Paper>;
};

export default RecipeListItems;
