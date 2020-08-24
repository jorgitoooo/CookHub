import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../firebase";
import history from "../../history";

// Components
import Grid from "@material-ui/core/Grid";

const styles = {
  container: {
    width: "100%"
  },
  authorContainer: {
    cursor: "pointer"
  },
  img: {
    borderRadius: "50%",
    width: "100px",
    height: "100px"
  },
  shareLinks: {
    float: "right",
    paddingRight: "20px"
  }
};

class Chef extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isUser: false,
      user: null,
      userUrl: null
    };
  }
  async componentDidMount() {
    console.log("Loading User");
    let author = null;
    let authorUrl = null;
    try {
      await firebase
        .database()
        .ref("user-list/" + this.props.source)
        .once("value", snap => {
          author = snap.val();
        });
      if (author != null) {
        await firebase
          .storage()
          .ref("users/" + author.image)
          .getDownloadURL()
          .then(function(url) {
            authorUrl = url;
          })
          .catch(function(error) {
            alert(error.code, error.message);
          });
      }
    } catch (e) {
      //console.log(e);
    }
    console.log(author);
    console.log(authorUrl);
    this.setState({
      isLoaded: true,
      user: author,
      userUrl: authorUrl,
      isUser: author !== null
    });
  }

  render() {
    const { classes } = this.props;
    console.log(this.props);
    const spacing = 1;
    return (
      (this.state.isLoaded && this.state.isUser && (
        <div style={styles.container}>
          <div
            className={classes.authorContainer}
            onClick={() => {
              history.push("/user/" + this.props.source);
            }}
          >
            <Grid container spacing={spacing}>
              <Grid container item spacing={0} xs={6}>
                <Grid item xs>
                  <img src={this.state.userUrl} style={styles.img} alt="User" />
                </Grid>
                <Grid style={{ float: "left", fontSize: ".9rem" }} item xs>
                  <h3>by: {this.state.user.displayName}</h3>
                  <h4>
                    Member since:
                    {new Date(this.state.user.date_created).toDateString()}
                  </h4>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      )) || (
        <div style={styles.container}>
          <h4>Source: {this.props.source}</h4>
        </div>
      )
    );
  }
}
export default withStyles(styles)(Chef);
