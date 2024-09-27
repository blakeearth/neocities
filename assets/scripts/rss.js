

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
                <chat-post data-url="${el.querySelector("link").innerHTML}">
                    <span slot="content">
                        ${el.querySelector("description").innerHTML}
                    </span>
                    <span slot="title">${el.querySelector("title").innerHTML}</span>
                </chat-post>
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