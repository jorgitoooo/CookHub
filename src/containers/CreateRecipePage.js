import React, { Component } from "react";

import firebase from "../firebase";

// Style Components
import { Grid, TextField, Button, Fab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Add } from "@material-ui/icons";

// Components
import Ingredients from "../components/recipePage/Ingredients";
import Instructions from "../components/recipePage/Instructions";

const styles = {
  root: {
    flexGrow: 1,
    height: "100vh",
    paddingLeft: "5%",
    paddingRight: "5%"
  },
  imgUploadContainer: {
    border: "none"
  },
  selectImgBtn: {
    margin: "5px 0"
  },
  recipeImg: {
    overflowX: "hidden",
    objectFit: "contain",
    border: "none",
    height: "100%",
    width: "100%"
  },
  submitBtn: {
    position: "fixed",
    margin: "5px",
    bottom: "0",
    right: "0"
  },
  textField: { width: "100%", maxWidth: "500px" }
};

// Fields
const NAME = "name";
const DESCRIPTION = "description";
const INGREDIENT = "ingredient";
const INSTRUCTION = "instruction";

class CreateRecipePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {
        name: {
          hasError: false,
          helperText: ""
        },
        ingredients: {
          hasError: false,
          helperText: ""
        },
        instructions: {
          hasError: false,
          helperText: ""
        }
      },
      createdRecipe: {
        name: "",
        description: "",
        imgFile: null,
        ingredient: "",
        instruction: "",
        ingredients: [],
        instructions: []
      },
      src: null,
      temp: null,
      isLoaded: false
    };
  }

  componentDidMount() {
    this.setState({ isLoaded: true });
  }

  async upload(imgFile) {
    let ref = firebase.storage().ref();
    let tacos = ref.child(
      `recipes/${this.props.match.params.id}-${imgFile.name}`
    );
    await tacos.put(imgFile).then(snapshot => {});
  }

  fileHandler = e => {
    let imgFile = e.target.files[0];
    let fReader = new FileReader();

    if (imgFile) {
      // this.upload(imgFile);
      fReader.onload = evt => {
        this.setState({ src: evt.target.result });
      };
      fReader.readAsDataURL(e.target.files[0]);
    }
    this.setState({ createdRecipe: { ...this.state.createdRecipe, imgFile } });
  };

  updateCreatedRecipeState = field => e => {
    this.setState({
      createdRecipe: {
        ...this.state.createdRecipe,
        [field]: e.target.value
      }
    });
  };

  addItem = field => e => {
    const { createdRecipe } = this.state;
    const {
      ingredient,
      ingredients,
      instruction,
      instructions
    } = createdRecipe;
    if (field == INGREDIENT) {
      if (ingredient && ingredient.length > 0) {
        this.setState({
          createdRecipe: {
            ...createdRecipe,
            ingredient: "",
            ingredients: [...ingredients, ingredient]
          }
        });
        // console.log("Ingredient:", ingredient);
      }
    } else if (field == INSTRUCTION) {
      if (instruction && instruction.length > 0) {
        this.setState({
          createdRecipe: {
            ...createdRecipe,
            instruction: "",
            instructions: [...instructions, instruction]
          }
        });
        // console.log("Instruction:", instruction);
      }
    }
  };

  async onSubmit(e) {
    e.preventDefault();
    const { createdRecipe } = this.state;
    const { name, description, ingredients, instructions } = createdRecipe;

    console.log(this.props.match.params.id);

    let hasError = false;
    const error = {
      name: {},
      ingredients: {},
      instructions: {}
    };

    // Test for recipe name
    if (name.length == 0) {
      error.name.hasError = hasError = true;
      error.name.helperText = "Must have a name.";
    } else {
      error.name.hasError = false;
    }

    // Test for recipe ingredients
    if (ingredients.length == 0) {
      error.ingredients.hasError = hasError = true;
      error.ingredients.helperText = "Must have at least one ingredient.";
    } else {
      error.ingredients.hasError = false;
    }

    // Test for recipe instructions
    if (instructions.length == 0) {
      error.instructions.hasError = hasError = true;
      error.instructions.helperText = "Must have at least one instruction.";
    } else {
      error.instructions.hasError = false;
    }

    this.setState({ error });

    // Post to db
    if (!hasError) {
      let uid = this.props.match.params.id;
      let image = "no_image_found.png";
      const { imgFile } = createdRecipe;

      const db = firebase.database();

      // Upload image to firebase storage
      if (imgFile) {
        await this.upload(imgFile);
        image = uid + "-" + imgFile.name;
      }

      // Get next possible recipe ID
      const nextIdRef = db.ref("recipe-list/nextId");
      let nextId;
      await nextIdRef.once("value", snapshot => {
        nextId = snapshot.val();
      });

      const recipeRef = db.ref("recipe-list/recipes/" + nextId);
      let recipeAddedToDb = true;
      let recipeAddedToUser = true;
      // Add to list of recipes
      await recipeRef
        .set({
          name,
          description,
          source: firebase.auth().currentUser.uid,
          ingredients,
          instructions,
          image,
          id: nextId,
          rating: {
            likes: 0,
            percentage: 0,
            total: 0
          }
        })
        .catch(error => {
          alert(error);
          recipeAddedToDb = false;
        });

      let user = firebase.auth().currentUser.uid;
      const userRef = db.ref("user-list/" + user + "/created_recipes");
      console.log("USER: " + user);
      console.log(this.props);
      // Get user object
      //await userRef.once("value", snapshot => (user = snapshot.val()));
      //console.log(user.created_recipes);
      //console.log(user.favorited_recipes);
      console.log(user);

      // Add to user object's created recipes
      //if (user && user.created_recipes) {
      if (user) {
        await userRef
          .update({
            //created_recipes: [...user.created_recipes, nextId]
            [nextId]: nextId
          })
          .catch(error => {
            alert(error);
            recipeAddedToUser = false;
          });
      } else {
        /*
      else if (user) {
        await userRef
          .set({
            ...user,
            created_recipes: { nextId: nextId }
          })
          .catch(error => {
            alert(error);
            recipeAddedToUser = false;
          });
      } 
      */
        recipeAddedToUser = false;
      }

      // We only want to update nextId and redirect if recipe was
      // successfully added to both user object and recipe list
      if (recipeAddedToUser && recipeAddedToDb) {
        await nextIdRef.set(nextId + 1);
        window.location.pathname = `recipe/${nextId}`;
      }
      /*
      else {
        // Remove from recipe list
        if (recipeAddedToDb) {
          await recipeRef.remove();
        }
        // Remove from user object
        if (recipeAddedToUser) {
          if (user && user.created_recipes) {
            userRef.set({
              ...user,
              created_recipes: [...user.created_recipes]
            });
          } else if (user) {
            userRef.set({
              ...user,
              created_recipes: {} 
            });
          }
        }
      }
        */
    }
  }

  render() {
    const spacing = 3;
    const gridSize = 6;

    return this.state.isLoaded && this.props.isAuthenticated ? (
      <form
        noValidate
        autoComplete="off"
        style={styles.root}
        onSubmit={this.onSubmit.bind(this)}
      >
        <Grid container spacing={spacing} style={{ padding: "5px" }}>
          <Grid container item direction="row" justify="center" xs={gridSize}>
            <Grid item xs={10} style={styles.imgUploadContainer}>
              <img
                style={
                  !this.state.src
                    ? { ...styles.recipeImg, background: "lightgrey" }
                    : styles.recipeImg
                }
                src={this.state.src}
                alt={null}
              />
            </Grid>
            <Grid item xs={10}>
              <input
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                onChange={this.fileHandler.bind(this)}
                ref={fileInput => (this.fileInput = fileInput)}
              />
              <Button
                type="button"
                color="primary"
                variant="contained"
                style={styles.selectImgBtn}
                onClick={() => this.fileInput.click()}
              >
                Select Image
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            item
            direction="row"
            alignContent="center"
            xs={gridSize}
          >
            <Grid item xs={10}>
              <TextField
                error={this.state.error.name.hasError}
                helperText={this.state.error.name.helperText}
                label="Recipe Name"
                value={this.state.createdRecipe.name}
                style={styles.textField}
                onChange={this.updateCreatedRecipeState(NAME).bind(this)}
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                multiline
                label="Description"
                onChange={this.updateCreatedRecipeState(DESCRIPTION).bind(this)}
                style={styles.textField}
                value={this.state.createdRecipe.description}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container style={{ padding: "5px" }}>
          {/* INGREDIENTS */}
          <Grid container item xs={gridSize} direction="column">
            <Grid item xs>
              <Ingredients ingredients={this.state.createdRecipe.ingredients} />
            </Grid>
            <Grid container direction="row" item>
              <Grid item xs={10}>
                <TextField
                  label="Ingredient"
                  value={this.state.createdRecipe.ingredient}
                  error={this.state.error.ingredients.hasError}
                  helperText={this.state.error.ingredients.helperText}
                  onChange={this.updateCreatedRecipeState(INGREDIENT).bind(
                    this
                  )}
                  style={styles.textField}
                />
              </Grid>
              <Grid item xs>
                <Fab
                  type="button"
                  color="primary"
                  aria-label="add"
                  onClick={this.addItem(INGREDIENT).bind(this)}
                >
                  <Add />
                </Fab>
              </Grid>
            </Grid>
          </Grid>
          {/* INSTRUCTIONS */}
          <Grid container item xs={gridSize} direction="column">
            <Grid item xs>
              <Instructions
                instructions={this.state.createdRecipe.instructions}
              />
            </Grid>
            <Grid container item>
              <Grid item xs={10}>
                <TextField
                  error={this.state.error.instructions.hasError}
                  label="Instruction"
                  onChange={this.updateCreatedRecipeState(INSTRUCTION).bind(
                    this
                  )}
                  helperText={this.state.error.instructions.helperText}
                  value={this.state.createdRecipe.instruction}
                  style={styles.textField}
                />
              </Grid>
              <Grid item xs>
                <Fab
                  type="button"
                  color="primary"
                  aria-label="add"
                  onClick={this.addItem(INSTRUCTION).bind(this)}
                >
                  <Add />
                </Fab>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Button
          type="submit"
          style={styles.submitBtn}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    ) : (
      <h1>Not authenticated</h1>
    );
  }
}
export default withStyles(styles)(CreateRecipePage);
