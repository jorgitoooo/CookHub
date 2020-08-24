import React, { Component } from "react";
import firebase from "../firebase";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
  card: {
    margin: "1rem",
    cursor: "pointer",
    width: 350,
    maxHeight: "33vh"
  },
  media: {
    height: 140
  },
  actionarea: {},
  spinner: {
    height: 140,
    display: "flex",
    justifyContent: "center"
  }
};

class FeedItem extends Component {
  constructor(props) {
    super(props);
    this.state = { imageUrl: "", isLoaded: false, author: "" };
    this.handleClick = this.handleClick.bind(this);
  }
  async componentDidMount() {
    let author = null;
    let authorUrl = null;
    if (this.props.recipeJson.source != "") {
      try {
        await firebase
          .database()
          .ref("user-list/" + this.props.recipeJson.source)
          .once("value", snap => {
            author = snap.val();
          });
        if (author != null) {
          console.log(author.displayName);
          this.setState({ author: author.displayName });
        }
      } catch (e) {
        //console.log(e);
      }
    }
    if (this.props.recipeJson.image) {
      let myUrl = "";
      let query = await firebase
        .storage()
        .ref("recipes/" + this.props.recipeJson.image)
        .getDownloadURL()
        .then(function(url) {
          myUrl = url;
        })
        .catch(function(error) {
          alert(error.code, error.message);
        });
      this.setState({ imageUrl: myUrl });
      this.setState({ isLoaded: true });
    } else {
      this.setState({ isLoaded: true });
    }
  }

  handleClick(e) {
    e.preventDefault();

    this.props.handleSetRecipeData(this.props.id);
  }

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card} onClick={this.handleClick}>
        <CardActionArea className={classes.actionarea}>
          {this.state.imageUrl ? (
            <CardMedia
              className={classes.media}
              image={this.state.imageUrl}
              title={this.props.recipeJson.name}
            />
          ) : (
            <div className={classes.spinner}>
              <CircularProgress style={{ alignSelf: "center" }} />
            </div>
          )}
          <CardContent>
            <Typography
              color="textPrimary"
              variant="h5"
              component="h2"
              gutterBottom={this.props.recipeJson.source === ""}
            >
              {this.props.recipeJson.name}
            </Typography>
            {this.props.recipeJson.source !== "" && this.state.author != "" && (
              <Typography
                gutterBottom
                color="textSecondary"
                variant="caption"
                component="h5"
              >
                By {this.state.author}
              </Typography>
            )}
            {/* <Typography variant="body1" component="p" gutterBottom>
              {this.props.recipeJson.description !== ""
                ? this.props.recipeJson.description
                : "No description available"}
            </Typography> */}
            <Typography variant="caption" color="textSecondary" component="p">
              {this.props.recipeJson.rating.total !== 0
                ? this.props.recipeJson.rating.likes +
                  " out of " +
                  this.props.recipeJson.rating.total +
                  " users like this recipe."
                : "This recipe has not yet been rated"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(FeedItem);
