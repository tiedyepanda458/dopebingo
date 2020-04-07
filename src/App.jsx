import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Play from './Play.jsx';

class App extends Component {
  constructor(props) {
	super(props);
	this.state = {};
  }

  render() {
    return (
		<div><Play /></div>
    );
  }
}

export default hot(module)(App);