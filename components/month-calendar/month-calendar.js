fetch("/components/month-calendar/month-calendar.comp")
    .then(stream => stream.text())
    .then(html => {
        // Create the template
        const template = document.createElement('template');
        template.innerHTML = html;
        const element = document.body.appendChild(template);

        class MonthCalendar extends HTMLElement {
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

                let date = new Date();
                this.year = date.getFullYear();
                this.month = date.getMonth();

                this.day = shadowRoot.querySelector("#days");

                this.currentDate = shadowRoot.querySelector("#current-date");

                const arrows = shadowRoot.querySelectorAll(".nav");
                arrows.forEach(icon => {
                    icon.addEventListener("click", this.onNavigate.bind(this, icon));
                });

                this.manipulate(date);

            }

            onNavigate(icon) {
                this.month = icon.id === "calendar-prev" ? this.month - 1 : this.month + 1;

                let date;
                if (this.month < 0 || this.month > 11) {
                    date = new Date(this.year, this.month, new Date().getDate());
                    this.year = date.getFullYear();
                    this.month = date.getMonth();
                } else {
                    date = new Date();
                }

                this.manipulate(date);
            }

            manipulate(date) {
                let dayone = new Date(this.year, this.month, 1).getDay();
                let lastdate = new Date(this.year, this.month + 1, 0).getDate();
                let dayend = new Date(this.year, this.month, lastdate).getDay();

                let lit = "";

                for (let i = dayone; i > 0; i--) {
                    lit +=
                        `<li></li>`;
                }

                for (let i = 1; i <= lastdate; i++) {
                    let isToday = i === date.getDate() &&
                        this.month === new Date().getMonth() &&
                        this.year === new Date().getFullYear() ?
                        "active" :
                        "";
                    lit += `<li>${i}</li>`;
                }

                for (let i = dayend; i < 6; i++) {
                    lit += `<li></li>`
                }

                this.currentDate.innerText = `${this.month + 1}/${this.year}`;
                this.day.innerHTML = lit;
            }
        }

        customElements.define('month-calendar', MonthCalendar);
    });