import '../sass/style.scss'
import Game from "./Class/Game";
import Box from "./Class/Box";

let resetBtn = document.getElementById('reset')
resetBtn.addEventListener('click', (e) => {
    Game.resetGame()
})

let boardGrid = Game.getRowsCols();
let rows = boardGrid.rows;
let cols = boardGrid.cols;

const game = new Game(rows, cols, 'game');
const box = new Box();

