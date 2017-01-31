# HTTP Probe

Utility for HTTP validation. Implementation is based on the Chrome debugging protocol.

![Version](https://img.shields.io/npm/v/http-probe.svg)
![Dependencies](https://david-dm.org/NicolasSiver/http-probe.svg)
![bitHound Score](https://www.bithound.io/github/NicolasSiver/http-probe/badges/score.svg)
![Code Climate](https://codeclimate.com/github/NicolasSiver/http-probe/badges/gpa.svg)
[![Coverage Status](https://coveralls.io/repos/github/NicolasSiver/http-probe/badge.svg?branch=master)](https://coveralls.io/github/NicolasSiver/http-probe?branch=master)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
 

- [Motivation](#motivation)
- [API](#api)
  - [`constructor(provider)`](#constructorprovider)
  - [`getRequest(search)`](#getrequestsearch)
    - [`RequestResult`](#requestresult)
  - [`getResponse(search)`](#getresponsesearch)
- [Snapshots](#snapshots)
- [Links](#links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

While Selenium provides good set of tools to check UI feedback and states, it lacks tools for HTTP validation. 
HTTP Probe tries to solve an issue with HTTP testing.

## API

Create an instance of the HTTP Probe. Don't forget to teardown an instance, otherwise `http-probe` will accumulate HTTP requests from every consecutive `getRequest` or `getResponse` invocation.

### `constructor(provider)`

- `provider <Function>` should return an array of performance logs

Example: 

```
const HttpProbe = require('http-probe');
let httpProbe = new HttpProbe(() => myMethodToExtractPerformanceLogs());
```

### `getRequest(search)`

- `search <String|RegExp>` a pattern which will be executed against an URL

Returns a `Request` entity with several properties:

- `length <Number>`, - total number of matched requests
- `executed <Boolean>`, - if request was executed at least once
- `executedOnce <Boolean>`, - if request was executed exactly _once_
- `executedTwice <Boolean>`, - if request was executed exactly _twice_
- `executeThrice <Boolean>`, - if request was executed exactly _thrice_
- `first <RequestResult>`, - a result object for the _first_ request
- `second <RequestResult>`, - a result object for the _second_ request
- `third <RequestResult>`, - a result object for the _third_ request
- `last <RequestResult>`, - a result object for the _last_ request

#### `RequestResult`

- `headers <Object>`, - request's headers
- `method <String>`, - HTTP method, 'GET', 'POST', etc.
- `url <String>`, - request's fully qualified URL 

### `getResponse(search)`

- `search <String|RegExp>` a pattern which will be executed against an URL

```
expect(httpProbe.getRequest('accounts/8`).executed).to.be.true;
```

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
