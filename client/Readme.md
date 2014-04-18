#Backpack Client Example

##Getting Started
All the development dependencies are managed using `npm`. To install the dependencies, type `npm install` at the root of the `/client` application.

This example application is a static site that is dynamically built using [gulp](http://gulpjs.com/) tasks. To watch the local directory for changes simply type `gulp watch` at the root of the `/client` project. While the gulp watch task is running, any files you change in `html`, `js`, `scss`, or `spec` folder will be compiled into the `build` directory for use in the example application.

To run the example site and the jasmine spec suite, type `gulp server` at the `/client` root and this will start 2 servers with the site and spec suites for viewing in your browser. With the server task running you should be able to view the site at [http://localhost:3000](http://localhost:3000) and view the jasmine specs at [http://localhost:3001](http://localhost:3001).

## Client/Server Coordination

### Application Events
There is a global dispatcher based on the Backbone.Events object ([http://backbonejs.org/#Events](http://backbonejs.org/#Events)) which provides coordination between the server side to the client. For example on the dashboard page (html/index.html), at the end of the page there is an inline script that triggers the `dashboard:index` event:

```js
  App.Dispatcher.trigger("dashboard:index", { id: 1 });
```

This triggers an event that the client side code can register for and act upon. In this example, the second argument `{ id: 1 }` represents a bare-bones user JSON structure. With the user's id, the client code can take over and fetch the user's badges or any other user data necessary. This provides a clean coupling between the client and server that reduces the knowledge between the systems to a bare minimum.

### Controller Objects

A Controller object handles the logic of responding to server-side triggered events, and sets up the components necessary for a given set of controller actions (pages). The controller objects manage the references to DOM elements needed for the various Backbone components and initializes the necessary views, collections, and or models for the given page. These objects provide a testable interface for page initialization. Here's a quick example of a controller object that would handle the `dashboard:index` event:

```js
  (App.Controllers.Dashboard = {
  initialize: function() {
    App.Dispatcher.on("dashboard:index", this.initIndex);
  },
  
  initIndex: function(userAttributes) {
    this.user = new App.Models.User(userAttributes);
    this.user.get("badges").totalCount = this.user.get("badgeCount");
    this.user.get("badges").fetch()
      .done(this.doSomethingAfterBadgesFetched);
  },
  
  ...
}).initialize();

```

Using the event dispatcher in this way allows the client side code to change independently of the server side and also allows any other component to respond to the same events without being coupled.

# Vendor Libraries

## Javascript

### jQuery, Underscore, Backbone

This client app is built using [Backbone](backbonejs.org), which depends on [jQuery](jquery.com) and [Underscore](http://underscorejs.org/).

### Underwear

Backbone offers the convenience of using Underscore methods directly on it's components but does not do the same thing for vanilla javascript objects and arrays. The [Underwear](https://github.com/daytonn/underwear) library is used in this project to provide the convenience of Underscore on javascript built-in types.

### jQuery UI

[jQuery UI](https://jqueryui.com/) is included in this project but is not currently being used. It is a custom build that only includes the datepicker library and it's dependencies. It was only being used for the datepicker.


### Sinon

[Sinon.js](http://sinonjs.org/) is a XHR mocking library that stubs AJAX requests on the client side. This library is being used to create a fake server that mocks the Badgekit Backpack API.

### Moment jS

[Moment JS](http://momentjs.com/) is a date library for javascript that is absolutely amazing for any kind of javascript date math needs.

### Handlebars

[Handlebars](http://handlebarsjs.com/) is being used for client side templates.

### Faker

[Faker.js](https://github.com/marak/Faker.js/) is being used to generate realistic data for use in the fake API.

## Styles

### SASS

[Sass](http://sass-lang.com/) (scss) is being used as a css preprocessor because it's better than css.

### Bourbon

[Bourbon](bourbon.io) is a sass mixin library that provides mixins for faster scss development.

### Neat

[Neat](neat.bourbon.io) is a grid library built on top of Bourbon

### Bitters

[Bitters](bitters.bourbon.io) is a default style library that provides a well designed base style.

### Fontawesome

[Fontawesome](fontawesome.io) is an icon font library used for scaleable icons.