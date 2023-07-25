import { router } from "./router/router.js"

router.on("routechange", async (e) => {
    if (e.matches("/")) {
        e.doProgress();
        e.render();
    } else if (e.matches("/app")) {
        try {
            await e.fetch("https://google.com", {
                mode: "no-cors"
            });
            e.render();
        } catch (err) {

        }
        router.hideRouteElements(e.linkedElement);
    } else {
        console.log("404")
    }
});

