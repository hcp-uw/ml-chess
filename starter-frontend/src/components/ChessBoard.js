import React, { useState, useEffect } from "react";

export function ChessBoard({ chess }) {
  const [boardFen, setBoardFen] = useState(chess.fen());
  const [pieceBeingDragged, setPieceBeingDragged] = useState(null);
  const [isGameActive, setIsGameActive] = useState(true);

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

  useEffect(() => {
    setBoardFen(chess.fen());
  }, [chess]);

  const sendBoardStateToBackend = async () => {
    const boardFEN = chess.fen();
    const color = chess.turn() === 'w' ? 'white' : 'black';

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board: boardFEN, color }),
      });

      const result = await response.json();
      console.log("Best move predicted by the model:", result);

      if (result && result.move) {
        chess.move(result.move);
        setBoardFen(chess.fen());
        handleGameOver();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDragStart = (e, id) => {
    if (isGameActive) {
      setPieceBeingDragged(id);

      let dragIcon = document.createElement('span');
      dragIcon.textContent = e.target.textContent;
      dragIcon.className = 'drag-icon';
      dragIcon.style.color = e.target.style.color;

      document.body.appendChild(dragIcon);

      e.dataTransfer.setDragImage(dragIcon, 0, 0);

      setTimeout(() => document.body.removeChild(dragIcon), 0);
    }
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!isGameActive) return;

    console.log("Dragging from: ", pieceBeingDragged);
    console.log("Dropping to: ", targetId);

    let move = null;

    try {
      move = chess.move({ from: pieceBeingDragged, to: targetId, promotion: 'q' });
    } catch (error) {
      console.error("Error during move:", error);
    }

    if (move === null) return;

    const piece = chess.get(targetId);
    const isPawn = piece.type === 'p';
    const isPromotion = (piece.color === 'w' && targetId[1] === '8') || (piece.color === 'b' && targetId[1] === '1');

    if (isPawn && isPromotion) {
      setIsGameActive(false);
      choosePromotionPiece(pieceBeingDragged, targetId);
    } else {
      finalizeMove(move);
    }
  };

  function finalizeMove(move) {
    if (move === null) {
      console.log("Illegal move");
    } else {
      setBoardFen(chess.fen());
      setPieceBeingDragged(null);
      if (!handleGameOver()) {
        sendBoardStateToBackend();
      }
    }
  }

  function choosePromotionPiece(from, to) {
    const promotionOptions = ['q', 'r', 'b', 'n'];
    const promotionNames = ['Queen', 'Rook', 'Bishop', 'Knight'];

    let selectionDiv = document.createElement('div');
    selectionDiv.className = 'promotion-selection';

    promotionOptions.forEach((option, index) => {
      let button = document.createElement('button');
      button.textContent = promotionNames[index];
      button.onclick = () => {
        document.body.removeChild(selectionDiv);
        setIsGameActive(true);
        const promotionMove = chess.move({ from, to, promotion: option });
        finalizeMove(promotionMove);
      };
      selectionDiv.appendChild(button);
    });

    document.body.appendChild(selectionDiv);
  }

  function handleGameOver() {
    let message;
    if (chess.isGameOver()) {
      setIsGameActive(false);

      if (chess.isCheckmate()) {
        message = createGameOverMessage(chess.turn() === 'b' ? 'White Wins!' : 'Black Wins!');
      } else if (chess.isDraw()) {
        message = createGameOverMessage('Draw!');
      } else if (chess.isStalemate()) {
        message = createGameOverMessage('Stalemate!');
      }
      document.body.appendChild(message);
      return true;
    }
    return false;
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
    setBoardFen(chess.fen());
    setIsGameActive(true);
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

        let square = numberToLetterMap[j] + '' + (8-i);
        row.push(
          <td
            key={square}
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
