# unlink-broken-links [![Build Status](https://travis-ci.org/boneskull/unlink-broken-links.svg?branch=master)](https://travis-ci.org/boneskull/unlink-broken-links)

> Find broken symlinks and remove them 

## Install

```shell
$ npm install -g unlink-broken-links
```

## Usage

```
unlink-broken-links [directory]

Options:
  --version        Show version number                                 [boolean]
  --recursive, -r  Recursively walk the directory     [boolean] [default: false]
  --help, -h       Show help                                           [boolean]
```

## Programmatic API

```js
var unlinkBrokenLinks = require('unlink-broken-links');

// "recursive" defaults to false
unlinkBrokenLinks('/some/path', {recursive: true})
  .then(function(result) {
    console.log(result.removed); // array of removed files (if any)
    console.log(result.errors); // array of errors (if any)
  });

// or callback-style
unlinkBrokenLinks('/some/path', {recursive: true}, function(err, result) {
  // "err" will only be truthy if something's terribly wrong 
  console.log(result.removed); // array of removed files (if any)
  console.log(result.errors); // array of errors (if any)
});
```

## License

© 2015 [Christopher Hiller](https://boneskull.com).  Licensed MIT.
