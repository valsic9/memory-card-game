import { shuffle } from "../utils/utils";
import Box from "./Box";
import Stopwatch from "./Stopwatch";

class Game {
    #rows;
    #cols;
    #idElement;
    #boxes;
    #board;
    stopwatch;

    constructor(rows, cols, idElement="game") {
        console.log('New game created')
        this.#rows = rows;
        this.#cols = cols;
        this.#idElement = idElement;
        this.#board = document.getElementById(idElement);
        this.#boxes = [];
        this.createBoxes();
        this.paintBoxes();
        // this.setCSSGridTemplate();

        this.#board.addEventListener('click', ()=> {
            this.checkOpenBoxes();
        })

        this.initTimer()
    }

    get rows() {
        return this.#rows;
    }


    checkOpenBoxes() {
        // Check if there are 2 open boxes in the board to lock them
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
            alert("Juego finalizado");
          }, 200);
        }
      }

    getRandomColors() {
        let randomColors = [];

        // Create colors. We need half of the total amount of boxes and 
        // then duplicate them to make pairs of same color
        for (let i = 0; i < (this.#cols*this.#rows) / 2; i++) {
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
    
    // Creates instances of the Box class with different colors and stores them in an array
    createBoxes() {
        this.#boxes = [];
        // Check if there are stored boxes from previus game saved in LocalStorage
        if (localStorage.getItem('boxes') !== null) {
            let arrayBoxesFromLocalStorage = JSON.parse(localStorage.getItem('boxes'));
            arrayBoxesFromLocalStorage.map(box => {
                let newBox = new Box(box.row, box.col, box.color, box.free, box.open);
                this.#boxes.push(newBox);
            })
        // If there is no previus game, create new boxes from scratch and save them in LocalStorage
        } else {
            let randomColors = this.getRandomColors()
            for (let row = 0; row < this.#rows; row++) {
                for (let col = 0; col < this.#cols; col++) {
                    let color = randomColors.shift()
                    let newBox = new Box(row, col, color)
                    this.#boxes.push(newBox)
                }
            }
            this.arrayBoxesToLocalStorage()
        }
    }

    arrayBoxesToLocalStorage() {
        let arrayBoxesToLocalStorage = this.#boxes.map(box => {
            return {
                row : box.row,
                col : box.col,
                color : box.color,
                free : box.free,
                open : box.open,
            };
        });
        localStorage.setItem('boxes', JSON.stringify(arrayBoxesToLocalStorage));
    }

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

    // setCSSGridTemplate() {
    //     boxesContainer.style.gridTemplateColumns = `repeat(${this.#cols}, 1fr)`
    //     boxesContainer.style.gridTemplateRows = `repeat(${this.#rows}, 1fr)`
    // }

    static getRowsCols() {
        let rows; 
        let cols;

        if (localStorage.getItem('rows') !== null && localStorage.getItem('cols') !== null) {
            rows = parseInt(localStorage.getItem('rows'))
            cols = parseInt(localStorage.getItem('cols'))
        } else {
            rows = parseInt(prompt('Introduce a number of rows:'))
            cols = parseInt(prompt('Introduce a number of columns:'))
            
            while (rows * cols % 2 !== 0) {
                alert('The total amount of cards must be an even number.')
                rows = parseInt(prompt('Introduce a number of rows:'))
                cols = parseInt(prompt('Introduce a number of columns:'))
            }            
        }

        localStorage.setItem('rows', rows)
        localStorage.setItem('cols', cols)

        return {
            'rows': rows,
            'cols': cols,
        }  
    }

    static resetGame() {
        localStorage.clear()
        location.reload()
    }

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