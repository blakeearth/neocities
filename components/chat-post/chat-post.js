fetch("/components/chat-post/chat-post.html")
    .then(stream => stream.text())
    .then(html => {
        // Create the template
        const template = document.createElement('template');
        template.innerHTML = html;
        const element = document.body.appendChild(template);

        class ChatPost extends HTMLElement {
            constructor() {
                super();

                let template = element;
                let templateContent = template.content;

                const shadowRoot = this.attachShadow({
                    mode: "open"
                });
                shadowRoot.appendChild(templateContent.cloneNode(true));
                
                const text = this.getAttribute("data-url");
                shadowRoot.getElementById("title").setAttribute("href", text);
            }
        }
        customElements.define('chat-post', ChatPost);
    });