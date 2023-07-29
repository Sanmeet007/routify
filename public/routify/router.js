/**
 * Author:       Sanmeet Singh
 * Created:      25.07.2023
 * Desciption:   User-friendly and efficient routing module for web applications
 * License :     MIT 
 * 
 * (c) Copyright by Routify 2023.
 **/

import { progressBar } from "./progress.js";
import { RouterEvent, RouterEventManager, RouterRouteChangeEvent } from "./router-events.js";

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

