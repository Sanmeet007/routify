import { progressBar } from "./progress.js";


/**
 * @typedef  {ObjectConstructor} ParamObject
 */


class QueryObject {
    /** @type {String} */ search;
    /** @type {ObjectConstructor} */ params;
}

class RouterEvent {
        /** @type {String} */ static get routeChange() {
        return "routechange";
    }
        /** @type {String} */ static get queryChange() {
        return "querychange";
    }
}

class RouterRouteChangeEvent {

    /** @type {String} */ eventType = "routechange";
    /** @type {String} */ url;
    /** @type {String} */ path;
    /** @type {ParamObject} */ params = {};
    /** @type {QueryObject} */ query;
    /** @type {HTMLElement?} */ #element = null;

    /**
     * @param {"routechange"} eventType
     */
    constructor(obj = {}) {
        this.path = window.location.pathname;
        this.url = window.location.href;


        const urlSearchParams = new URLSearchParams(window.location.search);

        this.query = {
            search: window.location.search,
            params: Object.fromEntries(urlSearchParams.entries())
        }
    }



    /**
     * 
     * @param {String} str 
     */
    #matchRoute(str) {
        const path = window.location.pathname;
        if (str === path) {
            return true;
        } else {
            /** @type {Array<String>} */
            const keys = str.split("/").filter(x => x != "").map(x => x.replace("/", ""));

            /** @type {Array<String>} */
            const values = path.split("/").filter(x => x != "").map(x => x.replace("/", ""))


            if (keys.length === values.length) {
                let returnType = true;
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i].startsWith(":")) {
                        continue;
                    } else if (keys[i] !== values[i]) {
                        returnType = false;
                        break;
                    }
                }

                return returnType;
            } else {
                return false;
            }
        }
    }

    /**
     * Renders the linked element only 
     */
    render() {
        router.hideRouteElements(this.#element);
    }

    /**
     * 
     * @param {String} str 
     */
    matches(str) {

        Router.matchCount += 1;

        const path = window.location.pathname;
        if (str === path) {
            const routes = document.querySelectorAll("[data-route]");
            let noMatch = true;
            routes.forEach(route => {
                const registeredRoute = route.getAttribute("data-route");
                if (this.#matchRoute(registeredRoute)) {
                    this.#element = route;
                    noMatch = false;
                }
            })

            if (noMatch) {
                const noMatchRoute = document.querySelector("[data-route='*']");
                this.#element = noMatchRoute;
            }

            return true;
        } else {
            /** @type {Array<String>} */
            const keys = str.split("/").filter(x => x != "").map(x => x.replace("/", ""));

            /** @type {Array<String>} */
            const values = path.split("/").filter(x => x != "").map(x => x.replace("/", ""))


            if (keys.length === values.length) {
                const obj = {};
                let returnType = true;
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i].startsWith(":")) {
                        obj[keys[i]] = values[i];
                        continue;
                    } else if (keys[i] !== values[i]) {
                        returnType = false;
                        break;
                    }
                }

                if (returnType) {
                    const routes = document.querySelectorAll("[data-route]");
                    let noMatch = true;
                    routes.forEach(route => {
                        const registeredRoute = route.getAttribute("data-route");
                        if (this.#matchRoute(registeredRoute)) {
                            this.#element = route;
                            noMatch = false;
                        }
                    })

                    if (noMatch) {
                        const noMatchRoute = document.querySelector("[data-route='*']");
                        this.#element = noMatchRoute;
                    }

                    this.params = obj;
                }

                return returnType;
            } else {
                return false;
            }
        }

    }

    get linkedElement() {
        return this.#element;
    }

    /** */
    doProgress() {
        if (Router.matchCount !== 1) {
            let x = 0;
            const interval = setInterval(() => {
                if (x >= 100) {
                    progressBar.setProgress(100);
                    clearInterval(interval);
                }
                x += 100;
                progressBar.setProgress(x);
            }, 30);
        }
        Router.matchCount += 1;
    }

    /**
     * @param {String} url 
     * @param {RequestInit} params
     * @returns {Promise<Response?>} 
     */
    async fetch(url, params = {}, timeout = 10_000) {
        return new Promise((resolver, rejector) => {
            let error = false, progress = 0, request_finish = false;
            let result = null, fetchError = null;

            const progressFunction = (progress) => {
                if (Router.matchCount !== 1) {
                    progressBar.setProgress(progress);
                }
            }

            const successFunction = () => {
                progressFunction(100);
                clearInterval(loadInterval);
                return resolver(result);
            }

            const errorFunction = () => {
                progressFunction(100);
                clearInterval(loadInterval);
                return rejector(fetchError);

            }

            Promise.race([
                fetch(url, params),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout')), timeout)
                )
            ]).then(res => {
                result = res;
                request_finish = true;
                error = false;
                successFunction();
            }).catch(e => {
                error = true;
                request_finish = true;
                fetchError = e;
                errorFunction();
            });


            const loadInterval = setInterval(() => {
                if (window.navigator.onLine) {
                    if (progress < 95) {
                        progress += 2;
                        progressFunction(progress);
                    }
                } else {
                    error = true;
                    errorFunction();
                }
            }, 50);

        });
    }
}


class RouterEventManager {
    /** @type {Array<RouterEvent>} */ #routeChange = [];
    /** @type {Array<RouterEvent>} */ #queryChange = [];

    /**
     * @param {Function} fn
     */
    registerRouteChange(fn) {
        this.#routeChange.push(fn);
    }
    registerQueryChange(fn) {
        this.#queryChange.push(fn);
    }

    callRouteChangeEvents(obj = {}) {
        this.#routeChange.forEach((e) => {
            e(new RouterRouteChangeEvent("routechange"));
        });
        return;
    }
}


class Router {

    /** @type {number} */ static matchCount = 0;
    /** @type {number} */
    /** @type {Array<HTMLElement>?}  */ #routes = null;
    /** @type {RouterEventManager}  */ #eventManager =
        new RouterEventManager();
    /**@type {ProgressElement} */  progessElement = progressBar;

    constructor() {


        this.#routes = Array.from(document.querySelectorAll("[data-route]"));
        this.#routes.forEach(element => {
            const links = element.querySelectorAll("[data-link]");
            links.forEach(link => {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    const url = new URL(link.href);
                    this.redirect(url.pathname);
                })
            });
        })


        window.addEventListener("load", (e) => {
            this.emit("routechange");
            window.addEventListener("popstate", () => {
                this.emit("routechange");
            })
        });
    }




    /**
     * 
     * @param {String} key 
     * @param {String} value 
     */
    updateQuery(key, value) {
        const url = new URL(window.location.href);

        const obj = { ...Object.fromEntries(url.searchParams.entries()) };

        try {
            const currentValue = obj[key];
            if (currentValue !== value) {
                obj[key] = value;
                const search = Object.entries(obj).flat().join("=");

                window.history.replaceState(null, "",
                    url.origin + url.pathname + "?" + search);
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 
     * @param {boolean} hard 
     */
    refresh(hard = false) {
        try {
            if (hard) {
                window.location.reload();
            } else {
                const currentUrl = new URL(window.location.origin);
                const newURL = new URL(currentUrl.origin + currentUrl.pathname);
                window.history.replaceState(null, "", newURL.pathname + newURL.search);
            }
            this.emit("routechange");
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * @param {String} path 
     * @param {boolean}  replace
     */
    redirect(path, replace = false) {
        try {


            const currentUrl = new URL(window.location.origin);
            const newURL = new URL(currentUrl.origin + path);
            if (replace) {
                window.history.replaceState(null, "", newURL.pathname + newURL.search);
            } else {
                window.history.pushState(null, "", newURL.pathname + newURL.search);
            }
            this.emit("routechange");
        } catch (e) {
            console.log(e);
        }
    }


    /**
     * @param {"routechange"|"querychange"} eventType
     */
    emit(eventType, forwardObject = {}) {
        switch (eventType) {
            case RouterEvent.routeChange:
                this.#eventManager.callRouteChangeEvents(forwardObject);
                break;
        }
    }

    /**
     * 
     * @param {HTMLElement} except 
     */
    hideRouteElements(except) {
        this.#routes.forEach(d => d.hidden = true);
        except?.hidden = false;
    }

    /**
     * 
     * @callback cb
     * @param {RouterRouteChangeEvent} event
     *
     */

    /**
     * @param {"routechange"} eventType
     * @param {cb} callback
     * 
     */
    on(eventType, callback) {
        if (typeof callback === "function") {
            if (eventType === RouterEvent.routeChange) {
                this.#eventManager.registerRouteChange(callback);
            }
        }
    }

}

export const router = new Router();

