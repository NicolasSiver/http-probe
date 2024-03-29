# HTTP Probe

Utility for HTTP validation. Implementation is based on the Chrome debugging protocol.

![Version](https://img.shields.io/npm/v/http-probe.svg)
![Dependencies](https://david-dm.org/NicolasSiver/http-probe.svg)
![Code Climate](https://codeclimate.com/github/NicolasSiver/http-probe/badges/gpa.svg)
[![Coverage Status](https://coveralls.io/repos/github/NicolasSiver/http-probe/badge.svg?branch=master)](https://coveralls.io/github/NicolasSiver/http-probe?branch=master)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
 

- [Motivation](#motivation)
- [API](#api)
  - [`HttpProbe`](#httpprobe)
    - [`constructor(provider)`](#constructorprovider)
    - [`getRequest(search)`](#getrequestsearch)
      - [`RequestResult`](#requestresult)
    - [`getResponse(search)`](#getresponsesearch)
      - [`ResponseResult`](#responseresult)
  - [`NetworkInspector`](#networkinspector)
    - [`constructor(eventTarget)`](#constructoreventtarget)
    - [`dispose()`](#dispose)
    - [`getLogs(deplete)`](#getlogsdeplete)
- [Snapshots](#snapshots)
- [Links](#links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

While Selenium and other end-to-end solutions provide a good set of tools to check UI feedback and states, they lack tools for HTTP validation. 
HTTP Probe tries to solve an issue with HTTP testing by providing API to work and analyze Performance (in particular Network) logs in the modern browsers like Chromium.

## API

Create an instance of the HTTP Probe. Don't forget to teardown an instance, otherwise `http-probe` will accumulate HTTP requests from every consecutive `getRequest` or `getResponse` invocation.

### `HttpProbe`

#### `constructor(provider)`

- `provider <Function>` should return an array of performance logs

Example: 

```js
const {HttpProbe} = require('http-probe');

let httpProbe = new HttpProbe(() => myMethodToExtractPerformanceLogs());
```

Extended example for `WebdriverIO`.

First of all you should activate performance logs for Google Chrome.

```json
{
    "loggingPrefs": {
        "browser": "ALL",
        "performance": "ALL"
    }
}
```

Now in `before` hook you can create an instance of HTTP Probe:

```js
before(() => {
    httpProbe = new HttpProbe(() => {
        return browser.log('performance').value;
    });
});
```

You should use single test case per spec if you don't want fight with cache.

#### `getRequest(search)`

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

##### `RequestResult`

- `headers <Object>`, - request's headers
- `method <String>`, - HTTP method, 'GET', 'POST', etc.
- `postData <Object>`, - request's POST parameters
- `url <String>`, - request's fully qualified URL 

Example:

```js
expect(httpProbe.getRequest('accounts/8').executed).to.be.true;
```

#### `getResponse(search)`

- `search <String|RegExp>` a pattern which will be executed against an URL

Returns a `Response` entity with several properties:

- `length <Number>`, - total number of matched responses
- `received <Boolean>`, - if response was delivered at least once
- `receivedOnce <Boolean>`, - if response was delivered exactly _once_
- `receivedTwice <Boolean>`, - if response was delivered exactly _twice_
- `receivedThrice <Boolean>`, - if response was delivered exactly _thrice_
- `first <ResponseResult>`, - a result object for the _first_ response
- `second <ResponseResult>`, - a result object for the _second_ response
- `third <ResponseResult>`, - a result object for the _third_ response
- `last <ResponseResult>`, - a result object for the _last_ response

##### `ResponseResult`

- `encodedDataLength <Number>`, - Total number of bytes received for this request so far.
- `fromDiskCache <Boolean>`, - Specifies that the request was served from the disk cache.
- `fromServiceWorker <Boolean>`, - Specifies that the request was served from the ServiceWorker.
- `headers <Object>`, - HTTP response headers.
- `requestHeaders <Object>`, - (Optional) Refined HTTP request headers that were actually transmitted over the network.
- `status <Number>`, - HTTP response status code.
- `statusText <String>`, - HTTP response status text.
- `url <String>`, - Response URL. This URL can be different from CachedResource.url in case of redirect.

Example:

```js
expect(httpProbe.getResponse('total/cart').last.status).to.be.equal(200);
```

### `NetworkInspector`

Captures network events through the Chrome debugging protocol for the later use in HttpProbe for analysis.
Specifically designed for the solutions that can not provide performance logs or it's more convenient to use listener abstraction for network logs.

#### `constructor(eventTarget)`

- `eventTarget <EventEmitter>` entity that satisfies EventEmitter interface at least for ability to subscribe (`on`) and unsubscribe (`removeListener`) for the events

Example: 

```js
const {NetworkInspector} = require('http-probe');

let inspector = new NetworkInspector(myEmitter);
console.log(inspector.getLogs());
inspector.dispose();
```

Extended example for `WebdriverIO` with the use of `before` and `after` hooks.

```js
const {HttpProbe, NetworkInspector} = require('http-probe');

let inspector;

before(() => {
    browser.cdp('Network', 'enable');
    inspector = new NetworkInspector(browser);
    httpProbe = new HttpProbe(() => inspector.getLogs());
});

after(() => {
    inspector.dispose(); 
});
```

#### `dispose()`

Resets internal resources and listeners. 
After this point, the instance of Network Inspector is not usable.

Example:

```js
networkInspector.dispose();
```

#### `getLogs(deplete)`

- `deplete <Boolean>` an optional parameter, by default it's always `true`. If the parameter is `false` logs will be preserved before the next `getLogs` invocation.

Returns a list of messages formatted to comply with Chrome debugging protocol.

Example:

```js
let myLogs = networkInspector.getLogs();
console.log(myLogs);
```

## Snapshots

Tests are working with snapshots. Snapshots are picked randomly and recorded for 30 seconds.
To create a snapshot, instance of the Chrome should be active, if yor are using Mac, it could be done via:

```shell
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

or run Chrome Browser in the container:

```shell
$ docker pull justinribeiro/chrome-headless
$ docker run -it --rm -p 9222:9222 justinribeiro/chrome-headless 
```

Now it's possible to make a snapshot:

```shell
URL=http://some-domain.com node create-snapshot.js

// or visit multiple websites 

URL="http://domain1.com http://domain2.com" node create-snapshot.js
```

## Links

- [Protocol Viewer](https://github.com/ChromeDevTools/debugger-protocol-viewer)
- [Performance Log](https://sites.google.com/a/chromium.org/chromedriver/logging/performance-log)
