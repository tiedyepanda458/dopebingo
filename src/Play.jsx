import React, { Component } from 'react';
import { boundMethod } from 'autobind-decorator';
import shuffle from 'shuffle-array';
import Button from 'react-bootstrap/Button';
import clues from './clues.js';
import Board from './Board.jsx';

class Play extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameboard : []
    };
  }

  componentWillMount() {
    console.log(this.state.gameboard);
    if (localStorage.getItem("gameboard") === null) {
      this.buildGameBoard();
    }
    else {
      this.setState({gameboard : JSON.parse(localStorage.getItem("gameboard"))});
    }
  }

  @boundMethod
  buildGameBoard() {
    var clueArray = this.findClues();
    shuffle(clueArray);
    var board = clueArray.slice(0, 24).map((val, i) => ({text:val, marked:false, bingo: false}));
    board.splice(12, 0, {text: "FREE SPACE", marked: true, bingo: false})
    localStorage.setItem("gameboard",JSON.stringify(board));
    this.setState({gameboard: board, bingos: 0});
  }

  @boundMethod
  findClues() {
	  return clues
  }

  @boundMethod
  markTile(index) {
    if (index != 12)
    this.setState(state => {
      var board = state.gameboard.map((val, i) => {
        if (i == index) return {...val, marked:!val.marked, bingo:false};
        else return {...val, bingo:false};
      });

      var countBingos = 0;
      // check whether the player has won
      for (let i = 0; i < 5; i++) {
        // check rows and columns
        if (!board.slice(i*5, i*5+5).some(x => !x.marked)) {
          countBingos++;
          board = board.map((t, ind) => ({ ...t, bingo:t.bingo||(ind >= i*5 && ind < i*5+5)}));
        }
        if (!board.filter((x, ind) => (i+ind)%5 == 0).some(x => !x.marked)) {
          countBingos++;
          board = board.map((t, ind) => ({ ...t, bingo:t.bingo||(i+ind)%5 == 0}));
        }
      }
      if (!board.filter((x, i) => i%6 == 0).some(x => !x.marked)) {
        countBingos++;
        board = board.map((t, ind) => ({ ...t, bingo:t.bingo||ind%6 == 0}));
      }
      if (!board.filter((x, i) => i == 4 || i == 8 || i == 12 || i == 16 || i == 20).some(x => !x.marked)) {
        countBingos++;
        board = board.map((t, ind) => ({ ...t, bingo:t.bingo||ind == 4 || ind == 8 || ind == 12 || ind == 16 || ind == 20}));
      }

      if (countBingos > this.state.bingos) this.green.play();

      localStorage.setItem("gameboard", JSON.stringify(board));
      return {
        gameboard: board,
        bingos: countBingos
      };
    })
  }

  render() {
    return (
    	<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%'}}>
        <div style={{display: 'flex', flex:1, flexDirection: 'row', width: '100%', padding: '50px'}}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent:'start'}}>
            <Board mark={this.markTile} gameboard={this.state.gameboard}></Board>
            <div style={{display: 'flex', flex:1, flexDirection: 'row', paddingTop: "20px"}}>
              <Button variant="outline-primary" onClick={this.buildGameBoard}>Scramble</Button>
            </div>
          </div>
          <div style={{position:'absolute', left:0, bottom:0, display:'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', height: '50px'}}>
            <p>Created by Bridger Holly | <a href="https://github.com/tiedyepanda458/dopebingo">Source Code</a></p>
          </div>
        </div>
        <audio ref={(green) => { this.green = green; }}>
          <source src="https://s3.amazonaws.com/freecodecamp/simonSound1.mp3" type="audio/mpeg" >
          </source>
        </audio>
      </div>
    );
  }
}

export default Play;