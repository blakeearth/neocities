fetch("/components/top-bar/top-bar.html")
    .then(stream => stream.text())
    .then(html => {
        // Create the template
        const template = document.createElement('template');
        template.innerHTML = html;
        const element = document.body.appendChild(template);

        class TopBar extends HTMLElement {
            constructor() {
                super();

                let template = element;
                let templateContent = template.content;

                const shadowRoot = this.attachShadow({
                    mode: "open"
                });
                shadowRoot.appendChild(templateContent.cloneNode(true));
            }
        }
        customElements.define('top-bar', TopBar);
    });