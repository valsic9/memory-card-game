class Box {
    #row;
    #col;
    #color;
    #open;
    #free;
    divElement;

    constructor(row, col, color, free = true, open = false) {
        this.#row = row;
        this.#col = col;
        this.#color = color;
        this.#free = free;
        this.#open = open;
    }

    get row() {
        return this.#row
    }

    get col() {
        return this.#col
    }

    get row() {
        return this.#col
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

    resetColor() {
        this.divElement.style.backgroundColor = 'black';
        this.#open = false;
    }
}


export default Box;