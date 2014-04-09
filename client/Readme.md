#Backpack Client Example

##Getting Started
All the development dependencies are managed using `npm`. To install the dependencies, type `npm install` at the root of the `/client` application.

This is example application is a static site that is dynamically built using `gulp` tasks. To watch the local directory for changes and to start both the example site server and the jasmine spec server, simply type `gulp watch` at the root of the `/client` project.

While the gulp watch task is running, any files you change in `html`, `js`, `scss`, or `spec` folder will be compiled into the `build` directory for use in the example application.

To run the example site and the jasmine spec suite, type `gulp server` at the `/client` root and this will start 2 servers with the site and spec suites for viewing in your browser.

With the server task running you should be able to view the site at [http://localhost:3000](http://localhost:3000) and view the jasmine specs at [http://localhost:3001](http://localhost:3001).