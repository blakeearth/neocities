

export function getEntries(feed, tag) {
    fetch(feed)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
        console.log(data);
        const items = data.querySelectorAll("item");
        let html = ``;
        items.forEach(el => {
            const categoryElements = el.querySelectorAll("category");
            let hasTag = tag ? false : true;
            categoryElements.forEach(catEl => {
                if (catEl.innerHTML.includes(tag)) hasTag = true;
            });

            if (!hasTag) return;

            html += `
                <article>
                    <h2>
                        <a href="${el.querySelector("link").innerHTML}" target="_blank" rel="noopener">
                        ${el.querySelector("title").innerHTML}
                        </a>
                    </h2>
                </article>
            `;
        });
        document.getElementById('rss').insertAdjacentHTML("beforeend", html);
    });
}

export function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0; i < vars.length; i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable) {return pair[1];}
       }

       return null;
}