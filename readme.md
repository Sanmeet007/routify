# Routify - Simplified Routing for Web Applications

Routify is a simple and user-friendly routing module designed to streamline navigation within your web applications. Inspired by the popular "react-router," Routify provides an intuitive and efficient way to manage different routes, enabling seamless transitions between pages while maintaining a clean and organized codebase.

## Requirements

To work effectively with Routify and make the most of its features, you will need the following:

1. **Web Browser (Preferably Chrome):**
   Routify is designed to work in modern web browsers, and it is recommended to use Google Chrome or any other up-to-date browser for the best experience.

2. **Good Knowledge of Promises:**
   Routify's `Event.fetch` and `Event.fetchOnce` methods use Promises to handle asynchronous data fetching. Therefore, a good understanding of Promises will be beneficial to efficiently manage data retrieval and rendering.

3. **Module-based JavaScript Usage:**
   Routify is built as a JavaScript module, and it requires you to use the `type="module"` attribute in the script tag when importing the router. Familiarity with module-based JavaScript usage is essential to integrate Routify seamlessly into your web application.

## Importing `router` from Routify

To start using Routify's router and its various methods and event listeners, you must first import the `router` object. This object provides access to all the functionalities of Routify's routing module.

To import the `router`, use the following code snippet:

```js
import { router } from "routify/router.js";
```

By importing the `router` from the specified module, you gain access to all the features needed to handle navigation and route management within your web application.

With the `router` object, you can register event listeners, fetch data, update query parameters, refresh the page, and perform various other routing-related tasks with ease.

## Router Object

The router object, available for import from Routify, is essentially an instance of the `Router` class, making it a singleton, which means we can have a single instance of the Router throughout the application.

The router object contains various useful properties and methods.

### Properties

- `fetchCacheManager`: An instance of FetchCacheManager (singleton) which caches or stores the fetched data for specific URLs in a key-value pair.

- `progressElement`: Returns the progress element used to indicate the loading progress for fetching methods (present in `RouterRouteChangeEvent` object).

### Methods

Basic methods:

- `isInitialLoad`: Returns `true` when the page is loaded for the first time, otherwise, it returns `false`.

- `setPageTitle`: Sets the page title. Use case: When the route is changed, you can call this method on the router object to update the page title.

Advanced methods:

- `updateQuery`:
  Updates a specific query parameter.

  Example:

  Consider this example where we want to update the search query whenever the user enters a value in the input field:

  ```html
  <div class="form-element">
      <input type="search" id="search_field"/>
  </div>

  <script type="module">
      import { router } from "/routify/router.js";

      const inputEl = document.querySelector("#search_field");
      inputEl.addEventListener("input", (e) => {
          router.updateQuery(inputEl.value);
      });
  </script>
  ```

- `refresh`:
  Refreshes the current page without reloading the whole page, preserving the route state.

  It takes one argument, which is passed to its parameter `hard`. If the value is `true`, a hard reload is performed; otherwise, the router reloads the page. By default, the value is `false`.

  Example:

  ```js
  router.refresh();
  ```

- `redirect`:
  Redirects the user to a specific page route.

  It has two parameters:

  - `path`: The pathname of the page to load.
  - `replace`: A boolean type. By default, it is `false`. If `true`, it updates the browser's history using `replaceState`; otherwise, it uses `pushState`.

  Example:

  ```js
  router.redirect("/about");
  ```

- Custom Progress Change - `progressElement.setProgress()`:
  You can implement a custom progress change by calling the `progressElement.progress()` method and passing the progress percentage as a parameter. The progress percentage should be between 0 and 100.

  Example:

  ```js
  // Update progress to 50%
  router.progressElement.setProgress(50);
  ```

- Custom Load with `startProgress` and `endProgress`:
  To perform heavy tasks or custom loading operations that require time, you can use `startProgress()` to begin the progress and `endProgress()` to complete the progress load.

  Example:

  ```js
  // Starting the progress
  router.progressElement.startProgress();

  // Performing some heavy task
  heavyTask();

  // Ending progress load
  router.progressElement.endProgress();
  ```

## Rendering Elements based on the route

With Routify, you can easily render elements based on the current route using specific attributes.

### Linking DOM elements to the router

To link elements to the router and render them based on the page route, add the `data-route` attribute to the element.

### `data-route` attribute

The `data-route` attribute instructs the router to handle the elements and render them based on the specified routes.

There are different ways to use the `data-route` attribute:

- **Matching a single route**

```html
<div data-route="/" hidden>
    <!-- Content for the home route here -->
</div>
```

- **Matching multiple routes** (separated by `;` semicolon)

```html
<div data-route="/;/about" hidden>
    <!-- Content to render in '/' and '/about' -->
</div>
```

- **Matching all routes** (using `*`)

```html
<div data-route="*" hidden>
    <!-- Content to render in every route -->
</div>
```

- **Matching all routes with exceptions** (using `data-except` with `data-route='*'`)

```html
<div data-route="*" data-except="/" hidden>
    <!-- Content to render in all routes except '/' -->
</div>
```

- **No match route (`~`)**

```html
<div data-route="~" hidden>
    <!-- Content that will only be rendered if no route matches -->
</div>
```

- **Error route (`data-error-route`)**

A special type of route that is rendered when an error occurs, such as a failed fetch request.

```html
<div data-error-route>
    <!-- Error page content -->
</div>
```

### Important Points

1. **Avoid `data-route` with error routes**

   Please refrain from using the `data-route` attribute with error routes. Error routes are intended to be handled separately through the `data-error-route` attribute. Mixing both attributes may lead to unexpected behavior.

2. **Specify absolute paths for routes**

   Ensure that all routes are specified as absolute paths to the root link. For instance, if your website URL is `http://domain.com/about`, the route should be expressed as '/about' or as the pathname of the URL.

3. **Route-linked elements require the `hidden` attribute**

   It's essential to include the `hidden` attribute on all route-linked elements. This attribute helps in properly managing element visibility based on the active route.

4. **Call `render` method on `RouterRouteChangeEvent`**

   The routes will not automatically render by themselves. Instead, you need to explicitly call the `render` method on `Event` to trigger the rendering process. This design choice is made to allow any necessary data fetching or preparations before rendering the route elements.

## Link element

There is no need to use any special link element; all you need to do is use `data-link` to enable routing functionality for standard HTML link tags.

### `data-link` attribute

To prevent a page reload when you click a link, add the `data-link` attribute to your link element.

Example:

```html
<a href="/link" data-link>Link</a>
```

By adding the `data-link` attribute, Routify will handle which page needs to be rendered, preventing page reloads.

**Note:** The `data-link` attribute does not need to be used exclusively with route-linked elements.

### `data-current-url` attribute

The `data-current-url` attribute can be used when you want to update the `href` value of an anchor tag or link when the page changes. This is particularly useful for implementing page refresh functionality.

Example:

```html
<a data-link data-current-url>Refresh page</a>
```

**Note:** The `data-current-url` attribute does not need to be used exclusively with route-linked elements.

## Importing router from Routify

To use Routify, ensure that you include the JavaScript module type and use `type="module"` in the script tag:

```html
<script type="module">
    import { router } from "/routify/router.js";
</script>
```

**Note:** The decision to use the module type adds an extra layer of security, making variables, functions, etc. inaccessible from the console when using this approach.

## Router Events

Currently, Routify's router supports only the `routechange` event.

### `routechange` event

You can listen for the `routechange` event emitted by the router whenever the route changes. This event allows you to handle the route change and execute corresponding actions.

Example:

```js
import { router } from "routify/router.js";

router.on("routechange", (e) => {
   // Handle route change here
});
```

## RouterRouteChangeEvent Object

When the route changes and the `routechange` event is fired, the handler function receives a `RouterRouteChangeEvent` object as its first argument. This object provides various properties and methods to work with the route change.

### Properties

- `url`: Returns the current URL with the base path.
- `pathname`: Returns the URL pathname, i.e., the URL without the base path.
- `linkedElements`: Returns an array of DOM elements linked to the specific route.
- `params`: An object with key-value pairs of the URL parameters.
- `query`: An object that contains query-related values.

#### `Event.params`

The `Event.params` property is a special object that contains the values for the keys matched in the specific URL.

Example:

```js
router.on("routechange", (e) => {
  if (e.matches("/user/:id")) {
    console.log(e.params);
    // Considering the request URL was `/user/1`,
    // the output will be: { 'id' : 1 }
  }
});
```

**Note:** The `params` object will be empty or null unless `Event.matches` is called first. See more about the `Event.matches` function in the "Event methods" section.

### `Event.query`

Similar to `Event.params`, `Event.query` is a special object that parses the URL query (URLs with '?' at the end) and contains the following properties:

- `search`: The search string.
- `params`: An object with key-value pairs parsed from the search string.

Example:

```js
router.on("routechange", (e) => {
    if (e.matches("/search")) {
        console.log(e.query.params);
        // Considering the URL is '/search?q=what%20is%20routify',
        // the output will be: { q: 'what is routify' }
    }
});
```

**Note:** Similar to `Event.params`, `Event.query` also requires you to call `Event.matches` explicitly before accessing the `query` object.

### Methods

Routify's router events have various methods. Let's understand them with their usage.

### Matching routes - `Event.matches()`

The `Event.matches()` function is the heart of Routify's router. This method is responsible for getting the linked elements of the route, generating the params, and query objects.

The return type of `Event.matches()` is a boolean, allowing you to use it to write code blocks or logic for specific URLs.

Example:

```js
router.on("routechange", (e) => {
    if (e.matches("/")) {
        console.log("homepage");
    } else if (e.matches("/about")) {
        console.log("about page");
    } else if (e.matches("/:id")) {
        console.log("id page !");
    } else {
        console.log("No match");
    }
});
```

### Rendering elements - `Event.render()`

To render the route-linked elements, you need to call the `Event.render()` method.

Example:

```js
router.on("routechange", (e) => {
    if (e.matches("/search")) {
        console.log(e.query.params);
        // Considering the URL is '/search?q=what%20is%20routify',
        // the output will be: { q: 'what is routify' }
    }
});
```

#### Rendering linked elements

Routify allows you to handle logic for specific routes and provides the ability to fetch data that may take time. Until then, rendering the new page is not ideal. Therefore, rendering the elements after populating them with data ensures the best user experience.

The `Event.render()` method is used to render the route-linked elements.

Example:

```js
router.on("routechange", (e) => {
    if (e.matches("/")) {
        // Renders elements containing '/ in route value of data-route attribute
        e.render();
    }
});
```

#### Rendering error

If there is an error while running some code before rendering, such as a failed fetch request or the user being offline, you can call the `Event.renderError()` method. This method renders the error route (DOM element with the `data-error-route` attribute).

The `Event.renderError()` method takes an argument with the parameter name `defaults`. If set to `true`, the elements with `[data-route='*']` will also render. If set to `false`, only the error route is rendered. By default, it is set to `true`.

Example:

```html
<div data-error-route hidden>
    ERROR PAGE
</div>

<script>
    router.on("routechange", (e) => {
        if (e.matches("/")) {
            try {
                throw new Error("This is a test error");
                e.render();
            } catch (error) {
                e.renderError(false); // Setting defaults to false
            }
        }
    });
</script>
```

**Note:** The `data-error-route` needs to be set up before rendering will work.

#### Rendering no-match element

If none of the matches return true or there is no match for the specified URL, you may want to show the user a 404 page. To handle this scenario, Routify provides `Event.renderNoMatch()` which renders the no-match route elements (elements with `[data-route='~']`).

Similar to `Event.renderError()`, it also takes an optional argument `defaults`. When passed, it renders the default elements, and when passed `false`, it doesn't render them.

Example:

```html
<div data-route="~" hidden>
    404 | Page not found
</div>

<script>
    router.on("routechange", (e) => {
        if (e.matches("/")) {
            e.render();
        } else {
            e.renderNoMatch();
        }
    });
</script>
```

### Fetching Methods

Fetching data has never been as user-friendly as it is with Routify.

Routify introduces custom implemented fetch request methods similar to the original `fetch` method but with additional features like timeout and progress indication. The `Event.fetch` and `Event.fetchOnce` methods in Routify come with timeout functionality and display a progress element in the DOM, resulting in a significantly improved user experience.

Routify provides two kinds of built-in fetch request methods:

#### `Event.fetch`

The `Event.fetch` method is ideal for fetching data from your database or any resource when the route changes to a specific route requiring data population to the route elements.

Example:

Consider a scenario where you want to fetch user details and display them on the user page:

```js
const dataPopulator = (json) => {
    // Implement data fill function for specific DOM elements
}

router.on("routechange", async (e) => {
    if (e.matches("/")) {
        e.render();
    } else if (e.matches("/user/:id")) {
        try {
            const data = await e.fetch("URL_HERE");
            dataPopulator(data);
            e.render();
        } catch (err) {
            console.log(err);
            e.renderError();
        }
    } else {
        e.renderNoMatch();
    }
});
```

**Note:** The `Event.fetch` method returns JSON data by calling `response.json()` behind the scenes, which may produce errors if the data returned by the server is not valid JSON.

#### `Event.fetchOnce`

Similar to `Event.fetch`, the `Event.fetchOnce` method is used to fetch data. The only difference is that it stores the result for a specific URL, more like a cache, and returns the saved result whenever a request to the same URL is made. Initially, it stores the result while returning the result, which should be a valid JSON.

This method is useful when you don't expect the data to change anytime soon. It quickly serves the second request to the same URL, thereby enhancing the user experience.

Using the same example as mentioned in `Event.fetch`, here's how you can use `Event.fetchOnce`:

```js
const dataPopulator = (json) => {
    // Implement data fill function for specific DOM elements
}

router.on("routechange", async (e) => {
    if (e.matches("/")) {
        e.render();
    } else if (e.matches("/user/:id")) {
        try {
            // Fetches data only once, then stores it
            const data = await e.fetchOnce("URL_HERE");
            dataPopulator(data);
            e.render();
        } catch (err) {
            console.log(err);
            e.renderError();
        }
    } else {
        e.renderNoMatch();
    }
});
```

#### `Event.doProgress`

Sometimes, when serving a static website, you might want to show fake progress to the user to make it appear as if the page was fetched exceptionally fast. This is where the `Event.doProgress` function comes in handy.

Example:

```js
router.on("routechange", async (e) => {
    if (e.matches("/")) {
        e.doProgress();
        e.render();
    } else {
        e.renderNoMatch();
    }
});
```

**Note:** The progress bar will be hidden even though the data is being fetched when the page is first being loaded.
