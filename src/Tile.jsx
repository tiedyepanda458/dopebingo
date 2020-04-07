import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import Card from 'react-bootstrap/Card';

class Play extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    	<th onClick={this.props.mark} style={{backgroundColor: this.props.marked ? "green" : "white"}}>
        {this.props.text}
      </th>
    );
  }
}

export default Play;