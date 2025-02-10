// Class Box handles the cards of the game, storing their data
// Takes on the click event for each card and the reset of their color to black

class Box {
    #nCards;
    #color;
    #open;
    #free;
    divElement;

    constructor(nCards, color, free = true, open = false) {
        this.#nCards = nCards;
        this.#color = color;
        this.#free = free;
        this.#open = open;
    }

    get nCards() {
        return this.#nCards
    }

    get open() {
        return this.#open
    }

    get free() {
        return this.#free
    }
    get color() {
        return this.#color
    }

    set free (val) {
        this.#free = val
    }

    // Click ob box reveals its true colour
    addClickEvent() {
        if (this.divElement) {
            this.divElement.addEventListener('click', (e) => {
                if (!this.divElement.open)
                this.divElement.style.backgroundColor = this.#color;
                this.#open = true;
            })
        } else {
            return false
        }
    }

    // Reset the visible colour of the box to black
    resetColor() {
        this.divElement.style.backgroundColor = 'black';
        this.#open = false;
    }
}


export default Box;