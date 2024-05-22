import React, { useState } from "react";

export function ChessBoard(props) {
  const [boardfen, setBoard] = useState("");
  const [pieceBeingDragged, setPieceBeingDragged] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);

  const chess = props.chess;
  
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

  // Check if game is active or not to allow dragging
  const handleDragStart = (e, id) => {
    if (isGameActive) {
      setPieceBeingDragged(id);
  
      // Find the piece's text content
      let dragIcon = document.createElement('span');
      dragIcon.textContent = e.target.textContent; // Only the piece text
      dragIcon.style.fontSize = '3.25rem'; // Match your cell's font size
      dragIcon.style.fontFamily = 'Arial, sans-serif'; // Ensure consistent font
      dragIcon.style.color = e.target.style.color; // Match the piece color
      dragIcon.style.backgroundColor = 'transparent'; // Ensure no background
      dragIcon.style.position = 'absolute'; // Position absolutely to avoid affecting layout
      dragIcon.style.top = '-9999px'; // Move off-screen
  
      document.body.appendChild(dragIcon); // Temporarily add to the body
  
      // Use this custom element as the drag image
      e.dataTransfer.setDragImage(dragIcon, 0, 0);
  
      // Clean up after a slight delay to avoid visual glitches
      setTimeout(() => document.body.removeChild(dragIcon), 0);
    }
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault(); 
    if (!isGameActive) return; // Prevent move if the game is over
  
    console.log("Dragging from: ", pieceBeingDragged); 
    console.log("Dropping to: ", targetId); 
    
    const move = null;

    try {
      const move = chess.move({ from: pieceBeingDragged, to: targetId });
    }
    catch {
      // Handle any exception during the move
    }

    if (chess.get(pieceBeingDragged).type === 'p' && ((pieceBeingDragged[1] === '2' && targetId[1] === '1') 
        || (pieceBeingDragged[1] === '7' && targetId[1] === '8'))) {
      // Handle pawn promotion
    }

    if (move === null) {
      console.log("Illegal move", move);
    } else {
      setBoard(chess.board());
    }
  
    setPieceBeingDragged(null); 
    handleGameOver();
  };

  function handleGameOver() {
    let message;
    if (chess.isCheckmate() || chess.isDraw() || chess.isStalemate()) {
      // Make pieces undraggable
      setIsGameActive(false);
      
      if (chess.isCheckmate()) {
        message = chess.turn() === 'b' ? createGameOverMessage('White Wins!') : createGameOverMessage('Black Wins!');
      } else if (chess.isDraw()) {
        message = createGameOverMessage('Draw!');
      } else if (chess.isStalemate()) {
        message = createGameOverMessage('Stalemate!');
      }
      document.body.appendChild(message);
    }
  }

  function createGameOverMessage(text) {
    let message = document.createElement('div');
    message.className = 'announcement';

    let messageText = document.createElement('p');
    messageText.textContent = text;
    message.appendChild(messageText);

    let closeButton = document.createElement('span');
    closeButton.textContent = 'x';
    closeButton.className = 'close-button';
    closeButton.onclick = function() {
        document.body.removeChild(message);
    };
    message.appendChild(closeButton);

    let playAgainButton = document.createElement('button');
    playAgainButton.className = 'play-again-button'
    playAgainButton.textContent = 'Play Again';
    playAgainButton.onclick = function() {
        resetGame();
        document.body.removeChild(message);
    };
    message.appendChild(playAgainButton);

    return message;
  }

  function resetGame() {
    chess.reset();
    setBoard(chess.board());
    setIsGameActive(true); // Re-enable game activity or piece dragability
  }

  function createGameOverMessage(text) {
    // Create the message container
    let message = document.createElement('div');
    message.className = 'announcement';

    // Create the message content
    let messageText = document.createElement('p');
    messageText.textContent = text;
    message.appendChild(messageText);

    // Create the close button
    let closeButton = document.createElement('span');
    closeButton.textContent = 'x';
    closeButton.className = 'close-button';
    closeButton.onclick = function() {
        document.body.removeChild(message);
    };
    message.appendChild(closeButton);

    // Create the "Play Again" button
    let playAgainButton = document.createElement('button');
    playAgainButton.className = 'play-again-button'
    playAgainButton.textContent = 'Play Again';
    playAgainButton.onclick = function() {
        resetGame();
        document.body.removeChild(message); // Close the message window
    };
    message.appendChild(playAgainButton);

    return message;
  }

  // Resets our internal board from chess.js library and re-renders board
  function resetGame() {
    chess.reset();
    setBoard(chess.board());
  }

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
        let pieceElement = null;
        if (boardArray[i][j] != null) {
          let piece = pieceUnicodeMap[boardArray[i][j].color + boardArray[i][j].type];
          let square = numberToLetterMap[j] + '' + (8-i);
          pieceElement = (
            <span
              draggable={isGameActive} 
              onDragStart={(e) => handleDragStart(e, square)}
            >
            {piece}
            </span>
          );
        }
  
        // The cell itself no longer handles drag events
        let square = numberToLetterMap[j] + '' + (8-i);
        row.push(
          <td
            id={square}
            className={cellClass}
            onDrop={(e) => handleDrop(e, square)}
            onDragOver={handleDragOver}
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {pieceElement}
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
