import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import Card from 'react-bootstrap/Card';

class Play extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    	<th onClick={this.props.mark} style={{backgroundColor: this.props.marked ? this.props.bingo ? "red" : "green" : "white", position:"relative"}}>
          {this.props.text}
          <div style={{position:"absolute", left:0, right:0, top:0, bottom:0}}></div>
      </th>
    );
  }
}

export default Play;