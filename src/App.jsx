import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {ref: "The entered text will be highlighted orange if spelled wrong, highlighted red if erroneously added, and highlighted blue if skipped entirely.",
    	test: "The entered text will be higligted orange if spelled wrong, highlighted red if if erroneously added, highlighted blue if skipped entirely.",
    	calculating: true,
    	correct: 0,
    	added: 0,
    	mspell: 0,
    	skipped: 0,
    	accuracy: 0,
    	toolong: false,
    	html: ''
    };

    this.refChange = this.refChange.bind(this);
    this.testChange = this.testChange.bind(this);
    this.calculate = this.calculate.bind(this);
    this.calcunlimited = this.calcunlimited.bind(this);
  }

  componentWillMount() {
	// load last state
 	if (window.localStorage.getItem('ref') && window.localStorage.getItem('test')) {
 		this.setState({ref: window.localStorage.getItem('ref'), test: window.localStorage.getItem('test')});
 	}
 	this.calculate(true);
  }

  refChange(event) {
    this.setState({ref: event.target.value, calculating: true});
    this.calculate(true);
  }

  testChange(event) {
  	this.setState({test: event.target.value, calculating: true});
  	this.calculate(true);
  }

  calcunlimited() {
  	this.calculate(false);
  }

  calculate(checktime) {
	this.setState(state => {

		// store current state
		window.localStorage.setItem('ref', state.ref);
		window.localStorage.setItem('test', state.test);

		// get and filter word arrays
	  	let regex = /^\s*[.,:;/]*\s*$/;
	  	let ref = state.ref.split(' ').filter(val => !val.match(regex));
	  	let test = state.test.split(' ').filter(val => !val.match(regex));
		
		// get calculated result
		let val = calcsync(ref, test, 5, checktime ? 50 : Infinity);
		//let val = calc(ref, test, 0, 0);
		
		// check if no result returned
		if (!val) return {html:'<font color=red>Excessive Errors Found</font>'};

		if (val.toolong) return {toolong: true}
		
		// return new state
		return {
			...val,
			calculating: false,
			toolong: false,
			accuracy: Math.round(10000 * (val.correct / (val.correct + val.added + val.mspell + val.skipped))) / 100
		}
	});
  }

  render() {
    return (
    	<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%'}}>
			<div style={{display: 'flex', flex:1, flexDirection: 'row', width: '100%', paddingBottom: '100px'}}>
				<div style={{display: 'flex', flexDirection: 'column', justifyContent:'start', width: '50%', maxHeight: '100vh'}}>
			      	<h2>Reference Text:</h2>
			        <textarea spellcheck="false" type="text" value={this.state.ref} onChange={this.refChange} style={textstyle}/>
			      	<h2>Test Text:</h2>
			        <textarea spellcheck="false" type="text" value={this.state.test} onChange={this.testChange} style={textstyle}/>
			        {this.state.calculating ?
			        	(<p>Calculating....</p>) : 
			        	(<div>
			        		<p><b>Words Correct:</b> {this.state.correct}&nbsp;
			        			<b>Words Misspelled:</b> {this.state.mspell}&nbsp;
			        			<b>Words Skipped:</b> {this.state.skipped}&nbsp;
			        			<b>Words Added:</b> {this.state.added}
			        		</p>
			        		<p><b>Accuracy:</b> {this.state.accuracy}%</p>
			        	</div>)
			        }
			    	<p>Punctuation is ignored. Accuracy is calculated as <code>(words correct / (words correct + total errors)</code></p>
			    </div>
			    <div style={{marginLeft: '50px', width: '40%'}}>
			    	{this.state.toolong ? 
				    	(<div>
				    		<p>Computation Time Exceeded 50 Milliseconds</p>
				    		<button onClick={this.calcunlimited}>Compute Anyway</button>
				    	</div>) :
					    (<p dangerouslySetInnerHTML={{__html: this.state.html}}></p>)
					}
				</div>
		    </div>
	    	<div style={{position:'absolute', left:0, bottom:0, display:'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', height: '50px'}}>
	    		<p>Created by Bridger Holly | <a href="https://github.com/tiedyepanda458/textaccuracy">Source Code</a></p>
	    	</div>
	    </div>
    );
  }
}

export default hot(module)(App);


const textstyle = {
	//height: '200px'
	flex: 1,
	minHeight: '100px'
}

function ciEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent', ignorePunctuation: true}) === 0
        : a === b;
}

var maxoffset = 5;
var maxcount = 5;

function calc(ref, test, offset, count) {

	let x = ref ? (ref.length > 0 ? ref[0] : null) : null;
	let y = test ? (test.length > 0 ? test[0] : null) : null;


	//console.log(x + "   " + y + "   " + offset);

	if (!x && !y) return {correct:0, mspell: 0, skipped: 0, added: 0, html: ''};

	// case where one is run out
	if (!x) {
		return {correct: 0, mspell: 0, skipped: 0, added: test.length, html: '<font color="red"><strike>' + test.join(" ") + '</strike></font>'}
	}
	else if (!y) {
		return {correct: 0, mspell: 0, skipped: ref.length, added: 0, html: '<font color="blue">^<sub>' + ref.join(" ") + '</sub></font>'}
	}

	if(ciEquals(x, y)) {
		let val = calc(ref.slice(1), test.slice(1), 0, 0);
		//console.log("words " + x + " and " + y + " are equal");
		if (!val) return null;

		return {correct: val.correct + 1, mspell: val.mspell, skipped: val.skipped, added: val.added, html: y + " " + val.html};
	}
	else {
		let add = offset >= 0 && offset < maxoffset && count == 0 ?
			calc(x ? ref : null, y ? test.slice(1) : null, offset + 1, 0) : null;
		let miss = count < maxcount ?
			calc(x ? ref.slice(1) : null, y ? test.slice(1) : null, offset, count + 1) : null;
		let skip = offset <= 0 && offset > maxoffset * -1 && count == 0 ?
			calc(x ? ref.slice(1): null, y ? test : null, offset - 1, 0) : null;

		if (!add && !miss && !skip) {
			return null;
		}

		let addsum = add ? add.mspell + add.skipped + add.added - add.correct : Infinity;
		let misssum = miss ? miss.mspell + miss.skipped + miss.added - miss.correct : Infinity;
		let skipsum = skip ? skip.mspell + skip.skipped + skip.added - skip.correct : Infinity;

		if (addsum < misssum && addsum < skipsum) {
			return {correct: add.correct, mspell: add.mspell, skipped: add.skipped, added: add.added + 1, html: '<font color="red"><strike>' + y + '</strike></font> ' + add.html}
		}
		else if (skipsum < misssum) {
			return {correct: skip.correct, mspell: skip.mspell, skipped: skip.skipped + 1, added: skip.added, html: '<font color="blue">^<sub>' + x + '</sub></font> ' + skip.html}
		}
		else {
			return {correct: miss.correct, mspell: miss.mspell + 1, skipped: miss.skipped, added: miss.added, html: '<font color="orange">' + y + '</font> ' + miss.html}
		}
	}
}

function calcsync(ref, test, maxlag, maxtime) {
	let startTime = new Date();
	// queue to put values to try in
	let queue = [];
	
	// current best index
	let besti = 0;
	
	// initialize with zeros, full word set
	queue.push({lastm: false, dir: 0, refi: 0, testi: 0, correct: 0, mspell: 0, skipped: 0, added: 0, html: ''});
	
	// dequeue until queue is empty (should never happen)
	while (queue.length > 0) {
		// dequeue
		let val = queue.shift();

		// check if maxlag is exceeded
		if (val.refi < besti - maxlag && val.testi < besti - maxlag) {
			//console.log(val.refi, val.testi, besti);
			continue;
		}

		// test end cases
		if (val.refi == ref.length && val.testi == test.length) {
			return val;
		}
		if (val.refi == ref.length) {
			queue.push({...val, testi: val.testi + 1, added: val.added + 1, html: val.html + '<font color="red"><strike>' + test[val.testi] + '</strike></font> '});
			continue;
		}
		if (val.testi == test.length) {
			queue.push({...val, refi: val.refi + 1, skipped: val.skipped + 1, html: val.html + '<font color="blue">^<sub>' + ref[val.refi] + '</sub></font> '});
			continue;
		}

		// test if equal
		if (ciEquals(ref[val.refi], test[val.testi])) {
			queue.unshift({...val, lastm: false, dir: 0, refi: val.refi + 1, testi: val.testi + 1, correct: val.correct + 1, html: val.html + test[val.testi] + " "});
			if (val.refi + 1 > besti) besti = val.refi + 1;
			if (val.testi + 1 > besti) besti = val.testi + 1;
			continue;
		}

		if (!val.lastm) {
			// skipped word
			if (val.dir <= 0) queue.push({...val, dir: -1, refi: val.refi + 1, skipped: val.skipped + 1, html: val.html + '<font color="blue">^<sub>' + ref[val.refi] + '</sub></font> '});
			// added word
			if (val.dir >= 0) queue.push({...val, dir: 1, testi: val.testi + 1, added: val.added + 1, html: val.html + '<font color="red"><strike>' + test[val.testi] + '</strike></font> '});
		}
		// misspelled word
		queue.push({...val, lastm: true, refi: val.refi + 1, testi: val.testi + 1, mspell: val.mspell + 1, html: val.html + '<font color="orange">' + test[val.testi] + '</font> '});

		if (maxtime < Infinity && (new Date()) - startTime > maxtime) {
			return {toolong: true};
		}
	}

	console.log("queue empty, something went wrong real bad");

	return null;
}