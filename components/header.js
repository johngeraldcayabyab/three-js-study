class Header extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
                <title>Particle Ball Sunk In Surface</title>
                <style>
                html, body {
                    margin: 0;
                    overscroll-behavior: none;
                    height: 100%;
                    width: 100%;
                    font-family: Monaco, monospace;
                    font-size: 13px;
                }
                
                canvas {
                    height: 100% !important;
                    width: 100% !important;
                }
                </style>
                </head>
            <body>
        `;
    }
}

customElements.define('header-component', Header);