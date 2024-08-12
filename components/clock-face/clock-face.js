fetch("/components/clock-face/clock-face.html")
    .then(stream => stream.text())
    .then(html => {
        // Create the template
        const template = document.createElement('template');
        template.innerHTML = html;
        const element = document.body.appendChild(template);

        class ClockFace extends HTMLElement {
            set value(value) {
                this._value = value;
                this.valueElement.innerText = this._value;
            }

            get value() {
                return this._value;
            }

            constructor() {
                super();
                this._value = 0;

                let template = element;
                let templateContent = template.content;

                const shadowRoot = this.attachShadow({
                    mode: "open"
                });
                shadowRoot.appendChild(templateContent.cloneNode(true));

                this.secondHand = shadowRoot.querySelector('.second-hand');
                this.minsHand = shadowRoot.querySelector('.min-hand');
                this.hourHand = shadowRoot.querySelector('.hour-hand');

                this.setDate();
                setInterval(this.setDate.bind(this), 1000);
            }

            setDate() {
                const now = new Date();

                const seconds = now.getSeconds();
                const secondsDegrees = ((seconds / 60) * 360) + 90;
                this.secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

                const mins = now.getMinutes();
                const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
                this.minsHand.style.transform = `rotate(${minsDegrees}deg)`;

                const hour = now.getHours();
                const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;
                this.hourHand.style.transform = `rotate(${hourDegrees}deg)`;
            }
        }

        customElements.define('clock-face', ClockFace);
    });