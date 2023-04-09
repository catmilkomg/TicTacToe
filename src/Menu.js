import React from "react";
import ReactDOM from "react-dom";
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Game from './Game.js';


function Menu() {
    function goToGame() {
        const gameComponent = <Game />;
        ReactDOM.render(gameComponent, document.getElementById("root"));
      }

    return (
        <div className="row mt-5">
            <div className="col-md-9">
                <h1 className="text-center">TIC-TAC-TOE</h1>

                <div className="container">
                    <div style={{ textAlign: 'center' }}>
                        <button className="play"  onClick={goToGame}> <FontAwesomeIcon icon={faPlay} /> Play</button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Menu;
