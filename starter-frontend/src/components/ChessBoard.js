import React, { useState } from "react";

export function ChessBoard(props) {
  const [boardfen, setBoard] = useState("");
  const [pieceBeingDragged, setPieceBeingDragged] = useState(false);

  const chess = props.chess;
  
  // use chess.turn() to get current turn, returns 'b' if black and 'w' if white
  // undo button calls chess.undo()  

  const pieceUnicodeMap = {
    wr: "♜",
    wn: "♞",
    wb: "♝",
    wq: "♛",
    wk: "♚",
    wp: "♟",
    br: "♖",
    bn: "♘",
    bb: "♗",
    bq: "♕",
    bk: "♔",
    bp: "♙"
  };

  const numberToLetterMap = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
    5: "F",
    6: "G",
    7: "H"
  };

  const handleDragStart = (e, row, col) => {
    setPieceBeingDragged({row, col});
  };

  const handleDrop = (e, targetRow, targetCol) => {
    // Take the id of cell being dragged onto aka target, which should be in chess notation ex A1
    // Translate move into chess notation like NxG5 or sm and call the move function on our chess.js library
    // to determine if its a legal move, and if so then just re-render the board as our 2d array from the chess js
    // library should be updated after calling the move function
    e.preventDefault(); // Prevent the default behavior
  
    console.log("Dragging from:", pieceBeingDragged); // Log the piece being dragged
    console.log("Dropping to:", targetRow, targetCol); // Log the target position
  

    // Assuming pieceBeingDragged contains the source position and the piece type
    const sourceSquare = convertToSquare(pieceBeingDragged.row, pieceBeingDragged.col);
    const targetSquare = convertToSquare(targetRow, targetCol);
  
    const move = chess.move({ from: sourceSquare, to: targetSquare });
  
    if (move === null) {
      // Handle illegal move (e.g., by showing an error message)
      console.log("Illegal move");
    } else {
      // Update the board state based on the new FEN from chess.js
      setBoard(chess.fen());
    }
  
    setPieceBeingDragged(null); // Reset the dragged piece state
  };
  
  // Helper function to convert row and column to chess square notation (e.g., "e4")
  const convertToSquare = (row, col) => {
    const file = String.fromCharCode('a'.charCodeAt(0) + col);
    const rank = 8 - row; // Chess ranks go from 8 at the top to 1 at the bottom
    return `${file}${rank}`;
  };

  const findPiece = (board, piece) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === piece) {
          return [row, col];
        }
      }
    }
    return [null, null];
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const renderBoard = () => {
    let boardArray = chess.board();
    let board = [];

    for (let i = 7; i >= 0; i--) {
      let row = [];
      for (let j = 7; j >= 0; j--) {
        let isEven = (i + j) % 2 === 0;
        let cellClass = isEven ? "cell whitecell" : "cell blackcell";
        let piece = null;
        if (boardArray[i][j] != null) {
          piece = pieceUnicodeMap[boardArray[i][j].color + boardArray[i][j].type];
        }
        row.unshift(
          <td
            id={`${numberToLetterMap[j]}${i+1}`}
            className={cellClass}
            onDragStart={(e) => handleDragStart(e, i, j)}
            onDrop={(e) => handleDrop(e, i, j)}
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
