const board = document.getElementById("board");
const restartButton = document.getElementById("restart");

const SIZE = 8; // Board size
let gameBoard = [];
let currentPlayer = "black";

// Initialize the game board
function initBoard() {
  gameBoard = Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(null));

  // Set initial pieces
  gameBoard[3][3] = "white";
  gameBoard[3][4] = "black";
  gameBoard[4][3] = "black";
  gameBoard[4][4] = "white";

  currentPlayer = "black";
  renderBoard();
}

// Render the board in the UI
function renderBoard() {
  // Render the board visually
  board.innerHTML = "";
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      const piece = gameBoard[row][col];
      if (piece) {
        const pieceDiv = document.createElement("div");
        pieceDiv.classList.add("piece", piece);
        cell.appendChild(pieceDiv);
      }

      cell.addEventListener("click", () => handleMove(row, col));
      board.appendChild(cell);
    }
  }
}

// Handle player moves
function handleMove(row, col) {
  if (isValidMove(row, col, currentPlayer)) {
    // Place the current player's piece
    gameBoard[row][col] = currentPlayer;

    // Flip the opponent's pieces
    flipPieces(row, col, currentPlayer);

    // Re-render the board to reflect the updated state
    renderBoard();

    // Check game state after the move
    checkGameState();
  }
}

// Check game state after each move
function checkGameState() {
  // Switch to the next player
  currentPlayer = currentPlayer === "black" ? "white" : "black";

  // Check if the current player has valid moves
  if (!hasValidMoves(currentPlayer)) {
    // If the current player has no valid moves, switch to the other player
    currentPlayer = currentPlayer === "black" ? "white" : "black";

    // If neither player has valid moves, end the game
    if (!hasValidMoves(currentPlayer)) {
      setTimeout(displayWinner, 100); // Delay to ensure flips are visible
      return;
    }
  }
}

// Check if the move is valid
function isValidMove(row, col, player) {
  if (gameBoard[row][col]) return false;

  // Check all directions
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    let hasOpponentPiece = false;

    while (
      x >= 0 &&
      x < SIZE &&
      y >= 0 &&
      y < SIZE &&
      gameBoard[x][y] &&
      gameBoard[x][y] !== player
    ) {
      hasOpponentPiece = true;
      x += dx;
      y += dy;
    }

    if (
      hasOpponentPiece &&
      x >= 0 &&
      x < SIZE &&
      y >= 0 &&
      y < SIZE &&
      gameBoard[x][y] === player
    ) {
      return true;
    }
  }

  return false;
}

// Flip opponent pieces
function flipPieces(row, col, player) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    let piecesToFlip = [];

    while (
      x >= 0 &&
      x < SIZE &&
      y >= 0 &&
      y < SIZE &&
      gameBoard[x][y] &&
      gameBoard[x][y] !== player
    ) {
      piecesToFlip.push([x, y]);
      x += dx;
      y += dy;
    }

    if (
      piecesToFlip.length > 0 &&
      x >= 0 &&
      x < SIZE &&
      y >= 0 &&
      y < SIZE &&
      gameBoard[x][y] === player
    ) {
      for (const [fx, fy] of piecesToFlip) {
        gameBoard[fx][fy] = player;
      }
    }
  }
}

// Check if a player has valid moves
function hasValidMoves(player) {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (isValidMove(row, col, player)) {
        return true;
      }
    }
  }
  return false;
}

// Display the winner
function displayWinner() {
  const blackCount = countPieces("black");
  const whiteCount = countPieces("white");

  let winnerMessage;
  if (blackCount > whiteCount) {
    winnerMessage = "Black wins!";
  } else if (whiteCount > blackCount) {
    winnerMessage = "White wins!";
  } else {
    winnerMessage = "It's a tie!";
  }

  // Display the message
  alert(winnerMessage);
  initBoard();
}

// Count the number of pieces for a player
function countPieces(player) {
  return gameBoard.flat().filter((piece) => piece === player).length;
}

// Restart the game
restartButton.addEventListener("click", initBoard);

// Initialize the game
initBoard();
