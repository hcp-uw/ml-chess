import React, { useState } from "react";

export function ChessBoard(props) {
  const [boardfen, setBoard] = useState("");
  const [pieceBeingDragged, setPieceBeingDragged] = useState(false);

  const chess = props.chess;
  
  // use chess.turn() to get current turn, returns 'b' if black and 'w' if white
  // undo button calls chess.undo()  

  const pieceUnicodeMap = {
    br: "♜",
    bn: "♞",
    bb: "♝",
    bq: "♛",
    bk: "♚",
    bp: "♟",
    wr: "♖",
    wn: "♘",
    wb: "♗",
    wq: "♕",
    wk: "♔",
    wp: "♙"
  };

  const numberToLetterMap = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h"
  };

  const handleDragStart = (e, id) => {
    setPieceBeingDragged(id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault(); // Prevent the default behavior
  
    console.log("Dragging from: ", pieceBeingDragged); // Log the piece being dragged
    console.log("Dropping to: ", targetId); // Log the target position
    
    const move = null;

    try {
      const move = chess.move({ from: pieceBeingDragged, to: targetId });
    }
    catch {

    }

    // If piece is pawn and is reaching end rank pop up ui for promotion
    if (chess.get(pieceBeingDragged).type === 'p' && ((pieceBeingDragged[1] === '2' && targetId[1] === '1') 
        || (pieceBeingDragged[1] === '7' && targetId[1] === '8'))) {
      // pop ui up here, and recall the chess.move method but with the extra parameter of what to promote to
    }

    if (move === null) {
      // Handle illegal move (e.g., by showing an error message)
      console.log("Illegal move", move);
    } else {
      // Update the board state based on the new FEN from chess.js
      setBoard(chess.board());
    }
  
    setPieceBeingDragged(null); // Reset the dragged piece state
    
    // check if game is over
    handleGameOver();

    // Check if we are playing against cpu or not
    // If so, call http request and make that move
    if (false) { // placeholder var for whether cpu game or not
      // call http request to get move
      let cpuMove;
      // make move
      chess.move(cpuMove);
      // update board
      setBoard(chess.board());
      // check gamestate
      handleGameOver();
    }
  };

  function handleGameOver() {
    // Check if game over
    if(chess.isCheckmate()) {
      const message = document.createElement('div');
      if (chess.turn() === 'b') {
        message.textContent = 'White wins!'
      }
      else {
        message.textContent = 'Black wins!'
      }
      message.className = 'announcement'
      document.body.appendChild(message);
    }
    else if (chess.isDraw()) {
      const message = document.createElement('div');
      message.textContent = 'Draw!'
      message.className = 'announcement'
      document.body.appendChild(message);
    }
    else if (chess.isStalemate()) {
      const message = document.createElement('div');
      message.textContent = 'Stalemate!'
      message.className = 'announcement'
      document.body.appendChild(message);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const renderBoard = () => {
    let boardArray = chess.board();
    let board = [];

    for (let i = 7; i >= 0; i--) {
      let row = [];
      for (let j = 0; j < 8; j++) {
        let isEven = (i + j) % 2 === 0;
        let cellClass = isEven ? "cell whitecell" : "cell blackcell";
        let piece = null;
        if (boardArray[i][j] != null) {
          piece = pieceUnicodeMap[boardArray[i][j].color + boardArray[i][j].type];
        }
        let square = numberToLetterMap[j] + '' + (8-i);
        row.push(
          <td
            id={square}
            className={cellClass}
            onDragStart={(e) => handleDragStart(e, square)}
            onDrop={(e) => handleDrop(e, square)}
            draggable={piece !== null}
            onDragOver={handleDragOver}
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {piece}
          </td>
        );
      }
      board.push(<tr key={i}>{row}</tr>);
    }
    return board;
  };

  return (
    <table cellSpacing="0" className="center">
      <tbody>{renderBoard()}</tbody>
    </table>
  );
}

export default ChessBoard;
