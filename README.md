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
    - [`ResponseResult`](#responseresult)
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

Extended example for `Webdriver.io`.

First of all you should activate performance logs for Google Chrome.

```
loggingPrefs: {
    browser: 'ALL',
    performance: 'ALL'
}
```

Now in before hooks you can create an instance of HTTP Probe:

```
before(() => {
    httpProbe = new HttpProbe(() => {
        return browser.log('performance').value;
    });
});
```

You should use single test case per spec if you don't want fight with cache.


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

Example:

```
expect(httpProbe.getRequest('accounts/8`).executed).to.be.true;
```

### `getResponse(search)`

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

#### `ResponseResult`

- `encodedDataLength <Number>`, - Total number of bytes received for this request so far.
- `fromDiskCache <Boolean>`, - Specifies that the request was served from the disk cache.
- `fromServiceWorker <Boolean>`, - Specifies that the request was served from the ServiceWorker.
- `headers <Object>`, - HTTP response headers.
- `requestHeaders <Object>`, - (Optional) Refined HTTP request headers that were actually transmitted over the network.
- `status <Number>`, - HTTP response status code.
- `statusText <String>`, - HTTP response status text.
- `url <String>`, - Response URL. This URL can be different from CachedResource.url in case of redirect.

Example:

```
expect(httpProbe.getResponse('total/cart`).last.status).to.be.equal(200);
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

// or visit multiple websites 

URL="http://domain1.com http://domain2.com" node create-snapshot.js
```

## Links

- [Protocol Viewer](https://github.com/ChromeDevTools/debugger-protocol-viewer)
- [Performance Log](https://sites.google.com/a/chromium.org/chromedriver/logging/performance-log)
