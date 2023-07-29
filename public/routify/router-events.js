import { fetchCacheManager } from "./fetch-cache-manager.js";


/**
 * @typedef  {ObjectConstructor} ParamObject
 */

class QueryObject {
    /** @type {String} */ search;
    /** @type {ObjectConstructor} */ params;
}


/**
 * Contains all the type of event in router
 */
class RouterEvent {
    /** @type {String} */ static get routeChange() {
        return "routechange";
    }
}


/**
 * Event object 
 */
class RouterRouteChangeEvent {

/** @type {String} */ eventType = "routechange";
/** @type {String} */ url;
/** @type {String} */ pathname;
/** @type {ParamObject} */ params = {};
/** @type {QueryObject} */ query;
/** @type {Array<HTMLElement?>} */ #elements = [];

    /**
     * obj may be used in future
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
     * Matches the current url with route specified by the user and forms the params object while matching 
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
    * Renders the linked element only , hides all other route elements
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
     * Peforms the fetch request with timeout and displays progress bar.
     * 
     * NOTE : returns json object by calling `.json()` on the request 
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
     * Peforms the fetch request once only with timeout and displays progress bar. 
     * In addition to it stores the result for the specfic url.
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


/**
 * Manages all the event emitted by the router
 */
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

export { RouterEvent, RouterEventManager, RouterRouteChangeEvent }