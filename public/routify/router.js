import { fetchCacheManager } from "./fetch-cache-manager.js";
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
    /** @type {String} */ pathname;
    /** @type {ParamObject} */ params = {};
    /** @type {QueryObject} */ query;
    /** @type {Array<HTMLElement?>} */ #elements = [];



    /**
     * @param {ObjectConstructor} obj
     */
    constructor(obj = {}) {
        this.pathname = window.location.pathname;
        this.url = window.location.href;


        const urlSearchParams = new URLSearchParams(window.location.search);

        this.query = {
            search: window.location.search,
            params: Object.fromEntries(urlSearchParams.entries())
        }
    }


    /**
   * Returns the element whose route matches with the current url.
   * Note : Only works after match is called 
   * 
   * @returns {Array<HTMLElement?>}
   */
    get linkedElements() {
        return this.#elements;
    }



    /**
     * Matches route but doesn't forms any additional objects
     * @param {String} str 
     * @returns {boolean}
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
     * Matches the current url with route specified by the user
     * @param {String} str 
     * @returns {boolean}
     */
    matches(str) {
        this.#elements = [];

        const path = window.location.pathname;


        if (str === path) {

            const routes = document.querySelectorAll("[data-route]");
            const matchAllRoutes = document.querySelectorAll("[data-route='*']");


            if (routes != null) {
                routes.forEach(route => {
                    if (route.getAttribute("data-route") !== "*") {


                        const registeredRoutes = route.getAttribute("data-route");

                        if (registeredRoutes.includes(";")) {

                            registeredRoutes.split(";").filter(x => x != "").forEach(registeredRoute => {
                                if (this.#matchRoute(registeredRoute)) {
                                    this.#elements.push(route);
                                }
                            })
                        } else {
                            if (this.#matchRoute(registeredRoutes)) {
                                this.#elements.push(route);
                            }
                        }
                    }
                });
            }

            if (matchAllRoutes != null) {
                matchAllRoutes.forEach(route => {
                    const exceptionRoutes = route.getAttribute("data-except-route");
                    if (exceptionRoutes != null) {
                        if (exceptionRoutes.includes(";")) {
                            exceptionRoutes.split(";").filter(x => x != "").forEach(exceptionRoute => {
                                if (!this.#matchRoute(exceptionRoute)) {
                                    this.#elements.push(route);
                                }
                            })
                        } else {
                            if (!this.#matchRoute(exceptionRoutes)) {
                                this.#elements.push(route);
                            }
                        }
                    } else {
                        this.#elements.push(route);
                    }
                });
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
                    const matchAllRoutes = document.querySelectorAll("[data-route='*']");

                    if (routes != null) {
                        routes.forEach(route => {
                            if (route.getAttribute("data-route") !== "*") {


                                const registeredRoutes = route.getAttribute("data-route");

                                if (registeredRoutes.includes(";")) {

                                    registeredRoutes.split(";").filter(x => x != "").forEach(registeredRoute => {
                                        if (this.#matchRoute(registeredRoute)) {
                                            this.#elements.push(route);
                                        }
                                    })
                                } else {

                                    if (this.#matchRoute(registeredRoutes)) {
                                        this.#elements.push(route);
                                    }
                                }
                            }
                        });
                    }

                    if (matchAllRoutes != null) {
                        matchAllRoutes.forEach(route => {
                            const exceptionRoutes = route.getAttribute("data-excpet-route");
                            if (exceptionRoutes != null) {
                                if (exceptionRoutes.includes(";")) {
                                    exceptionRoutes.split(";").filter(x => x != "").forEach(exceptionRoute => {
                                        if (!this.#matchRoute(exceptionRoute)) {
                                            this.#elements.push(route);
                                        }
                                    })
                                } else {
                                    if (!this.#matchRoute(exceptionRoutes)) {
                                        this.#elements.push(route);
                                    }
                                }
                            } else {
                                this.#elements.push(route);
                            }
                        });
                    }

                    this.params = obj;
                }

                return returnType;
            } else {
                return false;
            }
        }
    }



    /**
    * Renders the linked element only and hides all other route elements
    */
    render() {
        if (!router.isInitialLoad()) {
            window.scrollTo(0, 0);
        }

        const errorPage = document.querySelector("data-error-route");
        if (errorPage) {
            errorPage.hidden = true;
        }
        router.hideRouteElements(this.#elements);
    }

    /**
    * Render error route
    * 
    * Note : you can disable rendering of the default routes by passing false when calling
    */
    renderError(defaults = true) {

        if (defaults) {
            this.#elements = Array.from(document.querySelectorAll("[data-route='*']")).concat(Array.from(document.querySelectorAll("[data-error-route]")));
            this.render()

        } else {
            this.#elements = Array.from(document.querySelectorAll("[data-error-route]"));
            this.render()
        }
    }


    /**
    * Renders no match routes elements  
    * 
    * @param {boolean} defaults 
    * 
    * Note : you can disable rendering of the default routes by passing false when calling
    */
    renderNoMatch(defaults = true) {
        this.#elements = [];

        const noMatchRoutes = document.querySelectorAll("[data-route='~']");

        if (defaults === true) {
            const defualtMatchRoutes = Array.from(document.querySelectorAll("[data-route='*']"));

            defualtMatchRoutes.forEach(route => {
                this.#elements.push(route);
            })

            this.#elements = this.#elements.concat(Array.from(noMatchRoutes));
        } else {
            this.#elements = Array.from(noMatchRoutes);
        }

        console.log
        this.render();
    }


    /** 
     * Does a dummy progress loading
    */
    doProgress() {
        if (!Router.isInital) {
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
    }

    /**
     * Peforms the fetch request with timeout and displays progress bar 
     * 
     * @param {String} url 
     * @param {RequestInit} params
     * @returns {Promise<Object?>} 
     */
    fetch(url, options = {}, timeout = 10_000) {
        if (options === null) options = {};

        return new Promise(async (resolver, rejector) => {
            let progress = 0, wasIntruppted = false;


            const progressFunction = (progress) => {
                if (!Router.isInital) {
                    progressBar.setProgress(progress);
                }
            }

            const loadInterval = setInterval(() => {
                if (window.navigator.onLine) {
                    if (progress < 95) {
                        progressFunction(progress += 2);
                    }
                } else {
                    errorFunction(new Error("Network Error"));
                }
            }, 50);

            const successFunction = (data) => {
                progressFunction(100);
                clearInterval(loadInterval);
                return resolver(data);
            }

            const errorFunction = (error) => {
                progressFunction(100);
                clearInterval(loadInterval);
                return rejector(error);

            }

            const abortController = new AbortController();
            try {
                setTimeout(() => {
                    wasIntruppted = true;
                    abortController.abort();
                }, timeout);

                const res = await fetch(url, {
                    ...options,
                    signal: abortController.signal
                });
                const data = await res.json();
                return successFunction(data);
            } catch (error) {
                if (wasIntruppted) {
                    return errorFunction(new Error("Request timeout"));
                } else {
                    return errorFunction(error);
                }
            }
        });
    }



    /**
 * 
 * @param {RequestInfo | URL} url 
 * @param {RequestInit} options
 * @param {number?} timeout
 * 
 * @returns {Promise<Object>}
 */
    fetchOnce(url, options = {}, timeout = 10_000) {
        return new Promise(async (resolver, rejector) => {
            try {
                const staleData = fetchCacheManager.getData(url);
                if (staleData != null) {
                    this.doProgress();
                    return resolver(staleData);
                } else {
                    const data = await this.fetch(url, options, timeout);
                    fetchCacheManager.putData(url, data);
                    return resolver(data);
                }
            } catch (e) {
                return rejector(e);
            }
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
    /** @type {boolean} */ static isInital = true;
    /** @type {Array<HTMLElement>?}  */ #routes = null;
    /** @type {RouterEventManager}  */ #eventManager =
        new RouterEventManager();
    /**@type {ProgressElement} */  progessElement = progressBar;

    constructor() {
        this.#routes = Array.from(document.querySelectorAll("[data-route]"));

        const links = document.querySelectorAll("[data-link]");
        links.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const url = new URL(link.href);
                this.redirect(url.pathname);
            })
        });


        window.addEventListener("load", (e) => {
            Router.isInital = true;
            this.emit("routechange");
            window.addEventListener("popstate", () => {
                if (Router.isInital)
                    Router.isInital = false;

                this.emit("routechange");
            })
        });
    }

    /**
     * Tells if the page was requested initially 
     * @returns {boolean} */
    isInitialLoad() {
        return Router.isInital;
    }

    /**
     * @param {String} title
     */
    setPageTitle(title) {
        document.title = title;
    }

    /**
     * 
     * Updates the  value of the url for a specified variable or key  of the search params or query
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
     * Rereshes the page 
     * Setting hard param to true result in hard reload 
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
     * 
     * Used to perform redirect 
     * 
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
     * 
     * Emits the event
     * 
     * @param {"routechange"|"querychange"} eventType
     */
    emit(eventType, forwardObject = {}) {
        switch (eventType) {
            case RouterEvent.routeChange:
                const links = document.querySelectorAll("[data-current-url]");
                links.forEach(link => {
                    link.href = window.location.pathname;
                });
                this.#eventManager.callRouteChangeEvents(forwardObject);
                break;
        }
    }

    /**
     * Hides all the routed elements except the element passed as an argument 
     * OR Passing nothing to the except arg results hiding all the routed elements
     * @param {Array<HTMLElement>?} exceptElments 
     */
    hideRouteElements(exceptElments = null) {
        this.#routes.forEach(d => d.hidden = true);
        if (exceptElments instanceof Object) {
            exceptElments.forEach(el => {
                if (el instanceof HTMLElement) {
                    el.hidden = false;
                }
            })
        }
    }

    /**
     * 
     * @callback cb
     * @param {RouterRouteChangeEvent} event
     *
     */

    /**
     * Register an event listener for specific event type
     * 
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

