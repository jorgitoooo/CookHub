import React, { Component } from "react";
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import firebase from "../firebase";

class RateButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: firebase.auth().currentUser ? firebase.auth().currentUser.uid : null,
            isLoaded: false
        }
    }

    componentDidMount() {
        this.setState({
            likes: this.props.likes,
            total: this.props.total
        });
        if (this.state.uid) {
            var likedList = firebase.database().ref("user-list/" + this.state.uid + "/liked_recipes/" + this.props.recipeId);
            likedList.once("value", snapshot => {
                if(snapshot.val() != null) {
                    console.log(snapshot.val())
                    this.setState({ liked: snapshot.val()}) 
                } else {
                    this.setState({ liked: -1 })
                }
            });
        }
    }

    handleLike = event => {
        var oldLiked = this.state.liked;
        if (this.state.liked === 1) {
            this.setState({
                liked: -1
            });
            this.deleteLike(1)
        } else {
            this.setState({
                liked: 1
            });
            this.updateLike(1, oldLiked);
        }
    }

    handleDislike = event => {
        var oldLiked = this.state.liked;
        if (this.state.liked === 0) {
            this.setState({
                liked: -1
            });
            this.deleteLike(0);
        } else {
            this.setState({
                liked: 0
            });
            this.updateLike(0, oldLiked);
        }
    }

    deleteLike = oldValue => {
        firebase
            .database()
            .ref("user-list/" + this.state.uid + "/liked_recipes/" + this.props.recipeId)
            .remove();
        var ratings = firebase
                    .database()
                    .ref("recipe-list/recipes/" + this.props.recipeId + "/rating")
        ratings.once("value", snapshot=> {
            var newLikes = snapshot.val().likes - oldValue;
            var newTotal = snapshot.val().total - 1;
            var newPerc = (newTotal === 0) ? 0 : newLikes/newTotal;
            ratings.set({
                likes: newLikes,
                total: newTotal,
                percentage: newPerc
            }, function(error) {
                if(error) {
                    console.log(error);
                } else {
                    console.log("Save success!");
                    this.setState({
                        likes: newLikes,
                        total: newTotal
                    });
                }
            }.bind(this));
        });
    }

    updateLike = (newValue, oldLiked) => {
        firebase
            .database()
            .ref("user-list/" + this.state.uid + "/liked_recipes/" + this.props.recipeId)
            .set(newValue);
        var ratings = firebase
            .database()
            .ref("recipe-list/recipes/" + this.props.recipeId + "/rating")
        ratings.once("value", snapshot=> {
            var newLikes = snapshot.val().likes + (oldLiked===1 ? -1 : newValue);
            var newTotal = snapshot.val().total + (oldLiked===-1? 1 : 0);
            var newPerc = (newTotal === 0) ? 0 : newLikes/newTotal;
            ratings.set({
                likes: newLikes,
                total: newTotal,
                percentage: newPerc
            }, function(error) {
                if(error) {
                    console.log(error);
                } else {
                    console.log("Save success!");
                    this.setState({
                        likes: newLikes,
                        total: newTotal
                    });
                }
            }.bind(this));
        });
    }

    render() {
        return ( 
            <div>
                <h4>
                {this.state.total === 0
                  ? "This recipe has not yet been rated"
                  : this.state.likes +
                    " out of " +
                    this.state.total +
                    " users like this recipe."}
                </h4>
                <IconButton onClick={this.handleLike} disabled={this.state.uid == null} color={this.state.liked===1? "primary" : ""}><ThumbUpIcon/></IconButton>
                <IconButton onClick={this.handleDislike} disabled={this.state.uid == null} color={this.state.liked===0? "secondary" : ""}><ThumbDownIcon/></IconButton>
            </div>
        );
    }
}

export default RateButtons;