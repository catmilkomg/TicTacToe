import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { calculateComputerMoveEasy, calculateComputerMoveMedium, calculateComputerMoveHard } from './calculateDifficulty';

import ResetButton from './ResetButton';
import Board from './Board';
import ReactDOM from "react-dom";
import './index.css';
import { faSmile, faFaceGrinBeam } from '@fortawesome/free-regular-svg-icons';
import Menu from './Menu';



class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            frames: [
                {
                    squares: Array(9).fill(null),
                    changed: -1,
                }
            ],
            current: "X",
            index: 0,
            running: true,
            twoplayer: false,
            difficultyLevel: "easy",
            size: 3


        };
        this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
    }




    renderResetButton() {
        return <ResetButton onClick={() => { this.resetGame(this.state.size) }} />;
    }


    renderBoard(frame) { //Return a rendered board
        return (
            <Board squares={frame} size={this.state.size} disabled={!this.state.running} onClick={(i) => { if (this.state.running) this.clickHandler(i); }} />
        );
    }



    toggleAI() {
        if (this.state.twoplayer) {
            if (this.state.current === "O") {
                this.aiMove();
            }
        }
        this.setState({ twoplayer: !this.state.twoplayer });
    }

    resetGame(size) {
        this.setState({
            frames: [
                { squares: Array(size * size).fill(null) }
            ],
            current: "X",
            index: 0,
            size: size,
            running: true, //Allows moves
            game_won: false
        });
    }

    changeFrame(index) {
        this.setState({ index: index, current: index % 2 === 0 ? "X" : "O" });
        if (index < this.state.frames.length - 1) {
            this.setState({ running: false, game_won: false });
        } else {
            this.setState({ running: false, game_won: true });
        }
    }

    handleDifficultyChange(event) {
        console.log(event.target.value); // add this line to check the value of event.target.value
        this.setState({ difficulty: event.target.value });
    }

    getMove() {
        console.log(this.state.difficulty);
        let board = this.state.frames[this.state.index].squares.slice(); // make a copy of the current board state
        let slots = this.getAvailableSquares(this.state.frames[this.state.index].squares);
        let choice = -1;
        let bestScore = -Infinity;
        let isMaximizingPlayer = true; // the AI player is the maximizing player
        let depth = 3; // set a default depth limit for 'easy'

        
        if (this.state.difficulty === 'medium') {
            depth = 4;
        
        } else if (this.state.difficulty === 'hard') {
            depth = 5;
           
        }

        for (let move of slots) {
            board[move] = "O"; // simulate making the move
            let score = this.minimax(board, !isMaximizingPlayer, -Infinity, Infinity, depth); // get the score for the move
            board[move] = null; // undo the move

            if (score > bestScore) { // update the best move if the score is higher
                bestScore = score;
                choice = move;
            }
        }
        return choice;
    }


    minimax(squares, depth, isMaximizingPlayer) {
        const winner = this.gameOverCheck(squares);
        if (winner === "X") {
            return { score: -1 };
        } else if (winner === "O") {
            return { score: 1 };
        } else if (squares.filter(s => s === null).length === 0) {
            return { score: 0 };
        }
    
        if (depth === 0) {
            return { score: 0 };
        }
    
        if (isMaximizingPlayer) {
            let bestScore = -Infinity;
            let bestMove = null;
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = "O";
                    const score = this.minimax(squares, depth - 1, false).score;
                    squares[i] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            return { score: bestScore, index: bestMove };
        } else {
            let bestScore = Infinity;
            let bestMove = null;
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = "X";
                    const score = this.minimax(squares, depth - 1, true).score;
                    squares[i] = null;
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            return { score: bestScore, index: bestMove };
        }
    }
    



    getAvailableSquares(board) {
        let res = [];
        let squares = board;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] == null) {
                res.push(i);
            }
        }
        return res;
    }

    isFull(board) {
        return this.getAvailableSquares(board).length === 0;
    }

    clickHandler(i) {
        if (this.state.frames[this.state.index].squares[i] == null) {
            if (this.state.twoplayer) { //Two player mode
                this.setSquare(i);
                this.setState({ current: (this.state.current === "X") ? "O" : "X" });
            } else { //computer mode
                this.setSquare(i);
                this.aiMove();
            }
        }
    }


    async setSquare(i) {
        if (this.state.running !== false) {
            const boards = this.state.frames.slice(0, this.state.index + 1);
            const squares = boards[this.state.index].squares.slice();
            if (squares[i] == null) { //Prevent altering already set squares
                squares[i] = this.state.current;
                boards.push({ squares: squares, move: i });
                await this.setState({ frames: boards, index: this.state.index + 1 }, () => {
                    this.gameOverCheck(this.state.frames[this.state.index].squares, true);
                });
            }
        }
    }
    aiMove() {
        if (this.state.running) {
            this.setState({ current: "O", running: undefined });
            window.setTimeout(() => {
                if (this.state.running !== false) {
                    let move;
                    if (this.state.difficulty === "easy") {
                        move = this.getEasyMove();
                    } else if (this.state.difficulty === "medium") {
                        move = this.getMediumMove();
                    } else {
                        move = this.getHardMove();
                    }
                    this.setSquare(move);
                    if (!this.gameOverCheck(this.state.frames[this.state.index].squares, true)) {
                        this.setState({ running: true, current: "X" });
                    }
                }
            }, 350);
        }
    }

    getEasyMove() {
        // Return a random move
        const emptySquares = this.getAvailableSquares();
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    getMediumMove() {
        // Return a random move or a winning move if available
        const emptySquares = this.getAvailableSquares();
        const winningMove = this.getWinningMove();
        if (winningMove !== null) {
            return winningMove;
        } else {
            return emptySquares[Math.floor(Math.random() * emptySquares.length)];
        }
    }

    getHardMove() {
        // Return the best move based on minimax algorithm
        return this.minimax(this.state.frames[this.state.index].squares, true).index;
    }




    gameOverCheck(board, actual) {
        let sq = board;

        for (let i = 0; i < this.state.size * this.state.size - 1; i += this.state.size) { //Horizontal - rows
            let curr = sq[i];
            if (curr !== null) {
                for (let j = 1; j < this.state.size; j++) {
                    if (sq[i + j] !== curr) {
                        curr = null;
                        break;
                    }
                }
                if (curr !== null) {
                    if (actual) {
                        this.setState({ current: curr, running: false, game_won: true });
                        return true;
                    } else {
                        return curr;
                    }
                }
            }
        }

        for (let i = 0; i < this.state.size; i++) { //Vertical - columns
            let curr = sq[i];
            if (curr !== null) {
                for (let j = 1; j < this.state.size; j += 1) {
                    if (sq[i + (j * this.state.size)] !== curr) {
                        curr = null;
                        break;
                    }
                }
                if (curr !== null) {
                    if (actual) {
                        this.setState({ current: curr, running: false, game_won: true });
                        return true;
                    } else {
                        return curr;
                    }
                }
            }
        }

        //Left-slanting diagonal
        let curr = sq[0];
        if (curr !== null) {
            for (let i = 0; i < this.state.size * this.state.size; i += this.state.size + 1) {
                if (sq[i] !== curr) {
                    curr = null;
                    break;
                }
            }
            if (curr !== null) {
                if (actual) {
                    this.setState({ current: curr, running: false, game_won: true });
                    return true;
                } else {
                    return curr;
                }
            }
        }

        //Right-slanting diagonal
        curr = sq[this.state.size - 1];
        if (curr !== null) {
            for (let i = this.state.size - 1; i < this.state.size * this.state.size - 1; i += this.state.size - 1) {
                if (sq[i] !== curr) {
                    curr = null;
                    break;
                }
            }
            if (curr !== null) {
                if (actual) {
                    this.setState({ current: curr, running: false, game_won: true });
                    return true;
                } else {
                    return curr;
                }
            }
        }

        let tie = true; //If there is no winner yet, check for a tie
        for (var k = 0; k <= 8; k++) {
            if (sq[k] == null) {
                tie = false;
                break;
            }
        }
        if (tie) {
            if (actual) {
                this.setState({ current: "", running: false, game_won: true });
                return true;
            } else {
                return "";
            }
        }

        if (actual) {
            return false;
        } else {
            return null;
        }
    }



    render() {
        console.log(this.props.difficulty);
        function goToMenu() {
            const gameComponent = <Menu />;
            ReactDOM.render(gameComponent, document.getElementById("root"));
        }

        let msg = "";
        if (this.state.running === false && this.state.game_won === true) {
            if (this.state.current !== "") {
                msg = (
                    <div className="game-tied-container">
                        <h2 className="game-tied-message">
                            Winner is: {this.state.current}
                            <FontAwesomeIcon icon={faFaceGrinBeam} />
                        </h2>
                    </div>
                );
            } else {
                msg = (
                    <div className="game-tied-container">
                        <h2 className="game-tied-message">
                            Game tied! <FontAwesomeIcon icon={faSmile} />
                        </h2>
                    </div>
                );
            }
        } else {
            msg = (
                <div className="game-tied-container">
                    <h2 className="game-tied-message">
                        Next player: {this.state.current}
                    </h2>
                </div>
            );
        }

        return (
            <div className="row mt-5">
                <div className="col-md-9">
                    <h1 className="text-center">TIC-TAC-TOE</h1>

                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="text-center my-3">{msg}</div>
                                <div className="row justify-content-center">
                                    {this.renderBoard(
                                        this.state.frames[this.state.index].squares
                                    )}
                                </div>

                                <div className="pt-4 row text-center">
                                    <h3 className="text-center">
                                        <input
                                            type="checkbox"
                                            name="toggle"
                                            id="toggle-ai"
                                            onChange={() => this.toggleAI()}
                                        />
                                        <label
                                            htmlFor="toggle-ai"
                                            className="toggle-label"
                                        >
                                            Play With Friends

                                        </label>
                                    </h3>
                                </div>



                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="row text-center">
                                <ul>
                                    <li key="-1">
                                        {this.renderResetButton()}
                                    </li>
                                    <li>
                                        <button
                                            className="Rbutton2"
                                            onClick={goToMenu}
                                        >
                                            Main Menu
                                        </button>
                                    </li>
                                    <li>
                                        {this.state.twoplayer === false && (

                                            <h2 className="text-center">
                                                <h3> Difficulty Level:</h3>  {" "}
                                                <select value={this.state.difficulty} onChange={this.handleDifficultyChange}>
                                                    <option value="easy">Easy</option>
                                                    <option value="medium">
                                                        Medium
                                                    </option>
                                                    <option value="hard">Hard</option>
                                                </select>

                                            </h2>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Game