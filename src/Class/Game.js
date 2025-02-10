import { shuffle } from "../utils/utils";
import Box from "./Box";
import Stopwatch from "./Stopwatch";

// Class Game handles the board and includes the boxes of the game
class Game {
    #nCards;
    #idElement;
    #boxes;
    #board;
    stopwatch;

    constructor(nCards, idElement="game") {
        console.log('New game created')
        this.#nCards = nCards;
        this.#idElement = idElement;
        this.#board = document.getElementById(idElement);
        this.#boxes = [];
        this.createBoxes();
        this.paintBoxes();

        this.#board.addEventListener('click', ()=> {
            this.checkOpenBoxes();
        })

        this.initTimer()
    }

    get nCards() {
        return this.#nCards
    }

    // Generating random colors for each box's background-color. Number of colors
    // equals half the number of cards
    getRandomColors() {
        let randomColors = [];
        for (let i = 0; i < this.nCards / 2; i++) { 
            let red = Math.floor(Math.random() * 256);
            let green = Math.floor(Math.random() * 256);
            let blue = Math.floor(Math.random() * 256);
            let color = `rgb(${red}, ${green}, ${blue})`;
            randomColors.push(color);
        }
    
        randomColors = [...randomColors, ...randomColors];
        shuffle(randomColors);
        return randomColors;
    }

    // Asks the user for input, must be an even number to set the amout of cards or boxes in the board
    static getNumberOfCards() {
        let nCards; 
        if (localStorage.getItem('nCards') !== null) {
            nCards = parseInt(localStorage.getItem('nCards'))
        } else {
            nCards = parseInt(prompt('Introduce a number of cards:'))
            
            while (nCards % 2 !== 0) {
                alert('The total amount of cards must be an even number.')
                nCards = parseInt(prompt('Introduce a number of cards:'))
            }            
        }

        localStorage.setItem('nCards', nCards)

        return nCards  
    }

    // Checks if there are 2 open boxes in the board to lock them in their real colour, 
    // otherwise reset the color to black. Then checks if all boxes are locked open
    checkOpenBoxes() {
        
        let nOpenBoxes = this.#boxes.filter(box => box.open && box.free);
        if (nOpenBoxes.length === 2) {
            if (nOpenBoxes[0].color === nOpenBoxes[1].color) {
                nOpenBoxes.map(box => box.free = false);
                this.arrayBoxesToLocalStorage();
                
            } else {
            setTimeout (() => {
                nOpenBoxes.map(box => box.resetColor());
            }, 500)
            }
        } else {
            this.arrayBoxesToLocalStorage();
        }

        this.checkFinishGame()
        
    }

    // Checks if there are no free boxes, meaning all pairs were found
    checkFinishGame() {
        let freeBox = this.#boxes.filter((box) => box.free);
        if (freeBox.length === 0) {
            // Set a delay so that the game has time to turn around the last card before finishing 
          setTimeout(() => {
            this.stopwatch.stop();
            alert("Congratulations! You've found all pairs.");
          }, 200);
        }
      }
    
    // Creates instances of the Box class with different colors and stores them in an array
    createBoxes() {
        this.#boxes = [];
        // Check if there are stored boxes from previus game saved in LocalStorage
        if (localStorage.getItem('boxes') !== null) {
            let arrayBoxesFromLocalStorage = JSON.parse(localStorage.getItem('boxes'));
            arrayBoxesFromLocalStorage.map(box => {
                let newBox = new Box(box.nCards, box.color, box.free, box.open); // box.row, box.col
                this.#boxes.push(newBox);
            })
        // If there is no previus game, create new boxes from scratch and save them in LocalStorage
        } else {
            let randomColors = this.getRandomColors()           
            for (let nCards = 0; nCards < this.nCards; nCards++) {
                let color = randomColors.shift()
                let newBox = new Box(nCards, color)
                this.#boxes.push(newBox)
                this.arrayBoxesToLocalStorage()
            }
        }
    }

    // Creates an array of objects that contain the attributes of each box
    arrayBoxesToLocalStorage() {
        let arrayBoxesToLocalStorage = this.#boxes.map(box => {
            return {
                nCards : box.nCards,
                color : box.color,
                free : box.free,
                open : box.open,
            };
        });
        localStorage.setItem('boxes', JSON.stringify(arrayBoxesToLocalStorage));
    }

    // Create and append in the DOM a header for the timer and a grid container for the boxes
    // Reveals a box's real color if opened and locked
    paintBoxes() {
        let header = document.createElement('header');
        header.setAttribute('id', 'boxHeader')
        this.#board.appendChild(header);
        let boxesContainer = document.createElement('div');
        boxesContainer.setAttribute('id', 'boxesContainer')
        this.#board.appendChild(boxesContainer);

        this.#boxes.map((box) => {
            let boxDiv = document.createElement('div');
            boxDiv.classList.add('box')
            if (!box.free || box.open) {
                boxDiv.style.backgroundColor = box.color;
            }

            box.divElement = boxDiv;
            box.addClickEvent();
            boxesContainer.appendChild(boxDiv)
        })
    }

    // Function to reset LocalStorage and reload the page
    static resetGame() {
        localStorage.clear()
        location.reload()
    }

    // Creates and appends DOM elements to visualize the timer
    // Creates and instance of the Stpwatch class and starts counting when called
    initTimer() {
        let timerWrapper = document.createElement('h2')
        timerWrapper.setAttribute('id', 'timerWrapper')
        timerWrapper.innerHTML = '<span id="timer">00:00:00</span>';
        let header = document.getElementById('boxHeader')
        header.appendChild(timerWrapper)

        this.stopwatch = new Stopwatch('timer')
        this.stopwatch.start()
    }
}

export default Game;