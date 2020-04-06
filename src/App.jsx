import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class App extends Component {
  constructor(props) {
	super(props);
	this.state = {};
  }

  render() {
    return (
    	<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%'}}>
			Straight Engire Bingo
	    </div>
    );
  }
}

export default hot(module)(App);