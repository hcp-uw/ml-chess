import React, { useState } from "react";

export function GameSettings(props) {
    const [moves, setMoves] = useState([]);

    // Function to add a move to the list of played moves
    const addMove = (move) => {
        setMoves([...moves, move]);
    };

    return (
        <div className="white-box"> 
            <h2>Moves Played:</h2>
            <ul>
                {moves.map((move, index) => (
                    <li key={index}>{move}</li>
                ))}
            </ul>
        </div>
    );
}

export default GameSettings;
