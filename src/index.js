import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={props.onClick}
			id={"square_" + props.id}
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
			id={i}
			key={i}
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
			changedOrder: false,
		};
	}

	handleClick(i){
		const history = this.state.history.slice(0, this.state.stepNumber+1);
		const current = history[history.length -1];
		const squares = current.squares.slice();
		const winner = calculateWinner(current.squares);

		if (winner || squares[i])
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
	}

	changeOrder() {
		this.setState({
			changedOrder: !this.state.changedOrder,
		});
	}
	
	jumpTo(step, winner) {
		if (winner) {
			for (let i = 0; i < winner.squares.length; i++) {
				const el = document.getElementById("square_" + winner.squares[i]);
				el.classList.remove("bisque");
			}
		}
		winner = null;
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
			isEnd: this.squares,
		});
		const elements = document.getElementsByClassName("bisque");
		for (let i = 0; i < elements.length; i++) {
			elements[i].classList.remove("bisque");
		}
		const el = document.getElementById(step).children[0];
		el.classList.add("bisque");
		
	}

  render() {
	  const history = this.state.history;
	  const current = history[this.state.stepNumber];
	  const winner = calculateWinner(current.squares);

	  if (winner) {
			for (let i = 0; i < winner.squares.length; i++) {
				const el = document.getElementById("square_" + winner.squares[i]);
				el.classList.add("bisque");
			}
		}
	  
	  let moves = history.map((step, move) => {
		  
		  const desc = move ? 'Перейти к ходу #' + move + " " + step.col + " : " + step.row:
		  'К началу игры';
		  return (
			  <li key={move} id={move}>
				  <button onClick={() => {
					  this.jumpTo(move, winner);
				  }}>{desc}</button>
			  </li>
		  );
	  });

	  if (this.state.changedOrder) {
		  moves.reverse() ;
	  }
	  
	  let status;
	  if(winner){
		  status = 'Выиграл ' + winner.winner + '!';
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
				<ol>{ moves }</ol>
		</div>
			<div className="game-info">
				<button onClick={() => this.changeOrder()}>
				Измени порядок
			</button>
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
		return { winner: squares[a], squares:[a, b, c] };
    }
  }
  return null;
}

