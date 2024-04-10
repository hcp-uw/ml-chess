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
  
    if (move === null) {
      // Handle illegal move (e.g., by showing an error message)
      console.log("Illegal move", move);
    } else {
      // Update the board state based on the new FEN from chess.js
      setBoard(chess.board());
    }
  
    setPieceBeingDragged(null); // Reset the dragged piece state
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const renderBoard = () => {
    let boardArray = chess.board();
    let board = [];

    for (let i = 0; i < 8; i++) {
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
