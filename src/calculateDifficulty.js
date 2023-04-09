function calculateComputerMoveEasy(squares) {
    const emptySquares = squares
      .map((square, index) => square === null ? index : null)
      .filter(square => square !== null);
  
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  }
  function calculateComputerMoveMedium(squares, player) {
    const opponent = player === 'X' ? 'O' : 'X';
  
    // Check if computer can win
    const emptyIndex = findWinningIndex(squares, player);
    if (emptyIndex !== null) {
      return emptyIndex;
    }
  
    // Check if player can win and block
    const blockIndex = findWinningIndex(squares, opponent);
    if (blockIndex !== null) {
      return blockIndex;
    }
  
    // Choose random empty square
    const emptySquares = squares
      .map((square, index) => square === null ? index : null)
      .filter(square => square !== null);
  
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  }
  
  function findWinningIndex(squares, player) {
    // Check rows
    for (let i = 0; i < 9; i += 3) {
      const row = squares.slice(i, i + 3);
      const emptyIndex = row.indexOf(null);
      if (emptyIndex !== -1 && row.filter(square => square === player).length === 2) {
        return i + emptyIndex;
      }
    }
  
    // Check columns
    for (let i = 0; i < 3; i++) {
      const column = squares.filter((square, index) => index % 3 === i);
      const emptyIndex = column.indexOf(null);
      if (emptyIndex !== -1 && column.filter(square => square === player).length === 2) {
        return emptyIndex * 3 + i;
      }
    }
  
    // Check diagonals
    const diagonal1 = [squares[0], squares[4], squares[8]];
    const diagonal2 = [squares[2], squares[4], squares[6]];
    const emptyIndex1 = diagonal1.indexOf(null);
    const emptyIndex2 = diagonal2.indexOf(null);
    if (emptyIndex1 !== -1 && diagonal1.filter(square => square === player).length === 2) {
      return emptyIndex1 * 4;
    } else if (emptyIndex2 !== -1 && diagonal2.filter(square => square === player).length === 2) {
      return emptyIndex2 * 2 + 2;
    }
  
    return null;
  }
  
  
  function calculateComputerMoveHard(squares, player) {
    const opponent = player === 'X' ? 'O' : 'X';

    const emptySquares = squares
      .map((square, index) => square === null ? index : null)
      .filter(square => square !== null);
  
    const calculateResult = squares => {
      const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
      ];
  
      for (let i = 0; i < winningLines.length; i++) {
        const [a, b, c] = winningLines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a] === player ? 10 : -10;
        }
      }
  
      return 0;
    };
  
    const minimax = (squares, depth, maximizingPlayer) => {
      const result = calculateResult(squares);
      if (result !== 0 || depth === 0) {
        return result;
      }
  
      const scores = [];
      for (let i = 0; i < emptySquares.length; i++) {
        const squareIndex = emptySquares[i];
        squares[squareIndex] = maximizingPlayer ? player : opponent;
        scores.push(minimax(squares, depth - 1, !maximizingPlayer));
        squares[squareIndex] = null;
      }
  
      return maximizingPlayer ? Math.max(...scores) : Math.min(...scores);
    };
  
    const scores = emptySquares.map(squareIndex => {
      squares[squareIndex] = player;
      const score = minimax(squares, 4, false);
      squares[squareIndex] = null;
      return score;
    });
  
    const maxScoreIndex = scores.reduce((maxIndex, score, index) => {
      if (score > scores[maxIndex]) {
        return index;
      } else {
        return maxIndex;
      }
    }, 0);
  
    return emptySquares[maxScoreIndex];
  }
  
  export { calculateComputerMoveEasy, calculateComputerMoveMedium, calculateComputerMoveHard };