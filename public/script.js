import { router } from "./router/router.js"

router.on("routechange", async (e) => {
    if (e.matches("/")) {
        e.doProgress();

        console.log("home")
    } else if (e.matches("/app")) {
        try {
            await e.fetch("https://google.com", {
                mode: "no-cors"
            });
        } catch (err) {

        }
        console.log("app")
    } else {
        console.log("404")
    }
});

