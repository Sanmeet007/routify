import { router } from "../router/router.js"

const jsonCodeDiv = document.querySelector("#json-code");

router.on("routechange", async (e) => {
    if (e.matches("/")) {
        e.doProgress();
        router.setPageTitle("Routify");
        e.render();
    } else if (e.matches("/about-module")) {
        try {
            const result = await e.fetch("https://jsonplaceholder.typicode.com/todos/");
            const data = await result.json();
            data.length = 5;
            jsonCodeDiv.textContent = JSON.stringify(data, null, 4);
            router.setPageTitle("About Routify");
            e.render();
        } catch (err) {
            router.setPageTitle("400 | Error");
            console.log(e.pathname)
            e.renderError();
        }
    } else {
        router.setPageTitle("404 Not found");
        e.renderNoMatch();
    }
});
