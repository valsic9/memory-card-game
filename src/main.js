import '../sass/style.scss'
import Game from "./Class/Game";
import Box from "./Class/Box";

let resetBtn = document.getElementById('reset')
resetBtn.addEventListener('click', (e) => {
    Game.resetGame()
})

// Asking user for input (number of cards)
let nCards = Game.getNumberOfCards();

const game = new Game(nCards, 'game');
const box = new Box();

