class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            </body>
            </html>
        `;
    }
}

customElements.define('footer-component', Footer);