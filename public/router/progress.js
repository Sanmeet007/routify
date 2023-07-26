
class ProgressElement {
    /** @type {HTMLElement} */ #element = null;
    /** @type {HTMLElement} */ #elementCss = null;

    constructor() {

        this.#element = document.createElement("div");
        this.#elementCss = document.createElement("style");

        this.#elementCss.innerHTML = `

        .progress{
            position: fixed;
            top: 0;
            left: 0;
            height: 1px;
            width : 0%;
            margin: 0;
            box-shadow: 0 0 10px 2px rgb(255 0 0 / 47%);
            background-color: red;
            visibility: hidden;
            opacity : 0;
            transition : all 50ms ease-in;
        }
        
        .progress.open{
            visibility : visible;
            opacity : 1;
        }
        `;

        this.#element.classList.add("progress");
        document.body.appendChild(this.#element);
        document.body.appendChild(this.#elementCss);
    }

    /**
     * 
     * @param {number} progess 
     */
    setProgress(progess) {
        if (!this.#element.classList.contains("open")) {
            this.#element.classList.add("open");
        }
        if (progess === 100) {
            this.#element.style.width = progess + "%";
            setTimeout(() => {
                this.#element.classList.remove("open");
            }, 200)
        } else {
            this.#element.style.width = progess + "%";
        }
    }
}


export const progressBar = new ProgressElement();

