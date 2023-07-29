import { router } from "../routify/router.js"

const jsonCodeDiv = document.querySelector("#json-code");

router.on("routechange", async (e) => {
    if (e.matches("/")) {
        e.doProgress();
        router.setPageTitle("Routify");
        e.render();
    } else if (e.matches("/about-module")) {
        if (!router.isInitialMatch()) {
            try {
                const data = await e.fetchOnce("https://jsonplaceholder.typicode.com/todos/");
                data.length = 5;
                jsonCodeDiv.textContent = JSON.stringify(data, null, 4);
                router.setPageTitle("About Routify");
                e.render();
            } catch (err) {
                router.setPageTitle("400 | Error");
                e.renderError(false);
            }
        } else {
            router.setPageTitle("About Routify");
            e.render();
        }
    } else {
        router.setPageTitle("404 Not found");

        // no defaults should render
        e.renderNoMatch(false);
    }
});

