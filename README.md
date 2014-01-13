# Logbook - a sailing logbook

A sailing logbook featuring (well, not yet)

- GPX files for showing tracks on Google Maps
- Images from the trip
- Markdown text descriptions
- Historical weather data

The application is based on AngularJS.

## Building and running

To build, run

    mvn package

Building will run the tests, but to explicitly run tests you can use the test target

    mvn test

To start the app, use the [App Engine Maven Plugin](http://code.google.com/p/appengine-maven-plugin/) that is already included in this demo.  Just run the command.

    mvn appengine:devserver

For further information, consult the [Java App Engine](https://developers.google.com/appengine/docs/java/overview) documentation.

To see all the available goals for the App Engine plugin, run

    mvn help:describe -Dplugin=appengine
