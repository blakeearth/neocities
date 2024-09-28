fetch("/components/standard-page/standard-page.comp")
    .then(stream => stream.text())
    .then(html => {
          // Create the template
          const template = document.createElement('template');
          template.innerHTML = html;
          const element = document.body.appendChild(template);

          class StandardPage extends HTMLElement {
              constructor() {
                  super();

                  let template = element;
                  let templateContent = template.content;
            
                  const shadowRoot = this.attachShadow({ mode: "open" });
                  shadowRoot.appendChild(templateContent.cloneNode(true));
              }
          }

          customElements.define('standard-page', StandardPage);
    });