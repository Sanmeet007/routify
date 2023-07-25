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
            console.log("Something went wrong");
        }
    } else {
        e.render();
    }
});

