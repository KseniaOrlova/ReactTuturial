import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
      <button 
		  className="square" 
		  onClick = {props.onClick}
	  >
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
		<Square 
			value={this.props.squares[i]}
			key = {i}
			onClick={()=> this.props.onClick(i)}
		/> //передавать текущее состояние
	)
  }

  render() {
	const rows = 3;
	const cells = 3;
	return (
		<div>
			{[...Array(rows).keys()].map(row => (
				<div className="board-row" key={row}>
					{[...Array(cells).keys()].map(cell => this.renderSquare(row * cells + cell))}
				</div>
			))}
		</div>
	)
  }
}

class Game extends React.Component {
	constructor(props){
		super(props);
		this.state={
			history: [{
				squares: Array(9).fill(null),  //  изначально доска (род. компонент) состоит из 9 квадратов, заполненных null
				row: 0,
				col: 0,
			}],
			stepNumber: 0,
			xIsNext: true,
			isEnd: false,
		};
	}
	
	handleClick(i){
		const history = this.state.history.slice(0, this.state.stepNumber+1);
		const current = history[history.length -1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i])
		{
			this.setState({
				isEnd: true,
			});
			return;
		}
		squares[i]= this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				row: (i < 3) ? 1 : (i >= 3 && i < 6) ? 2 : 3,
				col: (i == 0 || i == 3 || i == 6) ? 1 : (i == 1 || i == 4 || i == 7) ? 2 : 3,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			isEnd: !squares.includes(null),
			
		});
		console.log(this.state.history);

	}
	
	jumpTo(step){
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
			isEnd: this.squares,
		});
	}
  render() {
	  const history = this.state.history;
	  const current = history[this.state.stepNumber];
	  const winner = calculateWinner(current.squares);
	  
	  const moves = history.map((step, move) => {
		  
		  const desc = move ? 'Перейти к ходу #' + move + " " + step.col + " : " + step.row:
		  'К началу игры';
		  return (
			  <li key={move} id={move}>
				  <button onClick={() => {
					  this.jumpTo(move);
					  const elements = document.getElementsByClassName("bisque");
					  for (let i = 0; i < elements.length; i++) {
						  elements[i].classList.remove("bisque");
					  }
					  const el = document.getElementById(move).children[0];
					  el.classList.add("bisque");
				  }}>{desc}</button>
			  </li>
		  );
	  });
	  
	  let status;
	  if(winner){
		  status = 'Выиграл ' + winner + '!';
	  }
	  else{
		  if (!this.state.isEnd)
			{
				status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
			}
			else{
				status = 'Ничья'; 
			}
	  }
	  
    return (
      <div className="game">
        <div className="game-board">
          <Board 
			squares = {current.squares}
			onClick={(i)=>this.handleClick(i)}
		  />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

