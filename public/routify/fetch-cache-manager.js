class FetchCacheManger {

    #fetchedResources = {};

    /**
     * 
     * @param {String} url 
     * @returns {Object?}
     */
    getData(url) {
        if (url in this.#fetchedResources) {
            return this.#fetchedResources[url];
        } else {
            return null;
        }
    }

    /**
     * 
     * @param {String} url
     * @param {Object} data 
     */
    putData(url, data) {
        this.#fetchedResources[url] = data;
    }
}
export const fetchCacheManager = new FetchCacheManger();