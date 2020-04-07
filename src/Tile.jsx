import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import Card from 'react-bootstrap/Card';

class Play extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    	<th onClick={this.props.mark} style={{backgroundColor: this.props.marked ? this.props.bingo ? "red" : "green" : "white"}}>
        {this.props.text}
      </th>
    );
  }
}

export default Play;