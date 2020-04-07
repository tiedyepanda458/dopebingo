import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import Tile from './Tile.jsx';

class Play extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const tiles = this.props.gameboard.map((item, i) => (
      <Tile key={i} mark={() => this.props.mark(i)} text={item.text} marked={item.marked} bingo={item.bingo}></Tile>
    ))

    return (
    	<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%'}}>
        <table>
          <tbody>
            <tr>
              {tiles.slice(0, 5)}
            </tr>
            <tr>
              {tiles.slice(5, 10)}
            </tr>
            <tr>
              {tiles.slice(10, 15)}
            </tr>
            <tr>
              {tiles.slice(15, 20)}
            </tr>
            <tr>
              {tiles.slice(20, 25)}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Play;