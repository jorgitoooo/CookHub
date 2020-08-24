import React from "react";

// Style Components
import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles(theme => ({
  card: {
    width: "70vw",
    margin: "0 auto",
    justifyContent: "center"
  },
  button: {
    margin: "0 auto"
  }
}));

const RecipeListTabs = props => {
  const classes = useStyles();
  const defaultValue = props.favorited ? 0 : 1;
  const [value, setValue] = React.useState(defaultValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    newValue == 0
      ? props.displayListType("favorites")
      : props.displayListType("created");
  };

  return (
    <Card className={classes.card}>
      <Tabs value={value} centered onChange={handleChange}>
        <Tab label="Favorites" disabled={!props.favorited} center></Tab>
        <Tab label="Created" disabled={!props.created}></Tab>
      </Tabs>
    </Card>
  );
};

export default RecipeListTabs;
