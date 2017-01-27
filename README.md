# HTTP Probe

Utility for HTTP validation. Implementation is based on the Chrome debugging protocol.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
 

- [Motivation](#motivation)
- [Snapshots](#snapshots)
- [Links](#links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

While Selenium provides good set of tools to check UI feedback and states, it lacks tools for HTTP validation. 
HTTP Probe tries to solve an issue with HTTP testing.

## Snapshots

Tests are working with snapshots. Snapshots are picked randomly and recorded for 30 seconds.
To create a snapshot, instance of the Chrome should be active, if yor are using Mac, it could be done via:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

or run Chrome Browser in the container:

```
$ docker pull justinribeiro/chrome-headless
$ docker run -it --rm -p 9222:9222 justinribeiro/chrome-headless 
```

Now it's possible to make a snapshot:

```
URL=http://some-domain.com node create-snapshot.js
```

## Links

- [Protocol Viewer](https://github.com/ChromeDevTools/debugger-protocol-viewer)
- [Performance Log](https://sites.google.com/a/chromium.org/chromedriver/logging/performance-log)
