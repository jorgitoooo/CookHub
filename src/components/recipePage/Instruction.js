import React, { Component } from 'react';

class Instruction extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { instruction } = this.props;
    return (
      <>
        <li>{instruction}</li>
      </>
    );
  }
}

export default Instruction;
