const rows = 9;
const cols = 7;
const colors = ["red", "blue", "green", "yellow", "purple"];
let grid = [];
let score = 0;

const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");

boardElement.style.gridTemplateColumns = `repeat(${cols}, 44px)`; // 40px + margen

function initBoard() {
  grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => {
      return colors[Math.floor(Math.random() * colors.length)];
    })
  );
  score = 0;
  updateScore();
  drawBoard();
}

function drawBoard() {
  boardElement.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = grid[r][c];
      const cell = document.createElement("div");
      if (color) {
        cell.className = "bubble";
        cell.style.background = color;
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener("click", () => handleClick(r, c));
      }
      boardElement.appendChild(cell);
    }
  }
}

function handleClick(r, c) {
  const color = grid[r][c];
  if (!color) return;

  const cluster = getCluster(r, c, color, new Set());
  if (cluster.length >= 3) {
    for (let [rr, cc] of cluster) grid[rr][cc] = null;
    score += cluster.length * 10;
    updateScore();
    applyGravity();
    compactColumns();
    drawBoard();
  }
}

function getCluster(r, c, color, visited) {
  const key = r + "," + c;
  if (
    r < 0 || c < 0 || r >= rows || c >= cols ||
    visited.has(key) || grid[r][c] !== color
  ) return [];

  visited.add(key);
  let cluster = [[r, c]];
  const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
  for (let [dr, dc] of dirs) {
    cluster = cluster.concat(getCluster(r+dr, c+dc, color, visited));
  }
  return cluster;
}

function applyGravity() {
  for (let c = 0; c < cols; c++) {
    let empty = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      if (grid[r][c] !== null) {
        grid[empty][c] = grid[r][c];
        if (empty !== r) grid[r][c] = null;
        empty--;
      }
    }
  }
}

function compactColumns() {
  let writeCol = 0;
  for (let c = 0; c < cols; c++) {
    if (grid[rows - 1][c] !== null) {
      for (let r = 0; r < rows; r++) {
        grid[r][writeCol] = grid[r][c];
        if (writeCol !== c) grid[r][c] = null;
      }
      writeCol++;
    }
  }
}

function updateScore() {
  scoreElement.textContent = score;
}

document.getElementById("restart").addEventListener("click", initBoard);

initBoard();
