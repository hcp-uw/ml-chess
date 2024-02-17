import React from "react";

export function ChessBoard(props) {
  let renderBoard = () => {
    let board = [];
    let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    let rowPointer = 0;
    let colPointer = 0;
    for (let i = 0; i < 8; i++) {
      let row = [];
      for (let j = 0; j < 8; j++) {
        // Make default piece holder
        let piece = "";
        // Check if char in fen is next row
        if (fen[0] === '/') {
          rowPointer += 1;
          colPointer = 0;
          // Update our fen
          fen = fen.substring(1);
        }
        // Check if theres a piece on the square
        if (rowPointer === i && colPointer === j) {
          // Check if char in fen is a number
          if (fen[0] >= '1' && fen[0] <= '8') {
            // If it is then add it to our pointer
            colPointer += parseInt(fen[0]) + 1;
            // Update our fen
            fen = fen.substring(1);
          }
          // If not an empty space or above checks, must be a piece
          else if (!(fen[0] === " ")) {
            piece = fen[0];
            // Update our pointers
            colPointer += 1;
            // Update our fen
            fen = fen.substring(1);
          }
        }
        let isEven = (i + j) % 2 === 0;
        let cellClass = isEven ? "cell whitecell" : "cell blackcell";
        row.push(<td key={`${i}-${j}`} className={cellClass}>{piece}</td>);
      }
      board.push(<tr key={i}>{row}</tr>);
    }
    return board;
  };

  return (
    <div>
      <table cellSpacing="0" class="center">
        <tbody>{renderBoard()}</tbody>
      </table>
    </div>
  );
}

export default ChessBoard;