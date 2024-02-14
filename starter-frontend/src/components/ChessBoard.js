import React from "react";

export function ChessBoard(props) {
    const renderBoard = () => {
        const board = [];
        for (let i = 0; i < 8; i++) {
          const row = [];
          for (let j = 0; j < 8; j++) {
            const isEven = (i + j) % 2 === 0;
            const cellClass = isEven ? "cell whitecell" : "cell blackcell";
            row.push(<td key={`${i}-${j}`} className={cellClass}></td>);
          }
          board.push(<tr key={i}>{row}</tr>);
        }
        return board;
    };
    
    return (
        <div className="center">
        <table cellSpacing="0" width="270px">
            <tbody>{renderBoard()}</tbody>
        </table>
        </div>
    );
} 

export default ChessBoard;