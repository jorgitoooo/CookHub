import React, { Component } from 'react';

class Ingredient extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { ingredient } = this.props;
    return (
      <>
        <li>{ingredient}</li>
      </>
    );
  }
}

export default Ingredient;
