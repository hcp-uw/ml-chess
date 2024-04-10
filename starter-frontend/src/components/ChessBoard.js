import React, { useState } from "react";

export function ChessBoard(props) {
  const [boardfen, setBoard] = useState("");
  const [pieceBeingDragged, setPieceBeingDragged] = useState(null);

  const chess = props.chess;
  
  // use chess.turn() to get current turn, returns 'b' if black and 'w' if white
  // undo button calls chess.undo()  

  const pieceUnicodeMap = {
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    p: "♟",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
    P: "♙",
  };

  const handleDragStart = (e, row, col) => {
    setPieceBeingDragged({row, col});
  };

  const handleDrop = (e, targetRow, targetCol) => {
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
    let i = 0;
    let board = [];
    let fen = chess.fen();
    let rowPointer = 0;
    let colPointer = 0;

    for (let i = 0; i < 8; i++) {
      let row = [];
      for (let j = 0; j < 8; j++) {
        // Make default piece holder
        let piece = "";
        // Check if char in fen is next row
        if (fen[0] === "/") {
          rowPointer += 1;
          colPointer = 0;
          // Update our fen
          fen = fen.substring(1);
        }
        // Check if there's a piece on the square
        if (rowPointer === i && colPointer === j) {
          // Check if char in fen is a number
          if (fen[0] >= "1" && fen[0] <= "8") {
            // If it is then add it to our pointer
            colPointer += parseInt(fen[0]);
            // Update our fen
            fen = fen.substring(1);
          }
          // If not an empty space or above checks, must be a piece
          else if (!(fen[0] === " ")) {
            piece = pieceUnicodeMap[fen[0]] || fen[0];
            // Update our pointers
            colPointer += 1;
            // Update our fen
            fen = fen.substring(1);
          }
        }
        let isEven = (i + j) % 2 === 0;
        let cellClass = isEven ? "cell whitecell" : "cell blackcell";
        row.push(
          <td
            key={`${i}-${j}`}
            className={cellClass}
            onDragStart={(e) => handleDragStart(e, i, j)}
            onDrop={(e) => handleDrop(e, i, j)}
            draggable={piece !== ""}
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
