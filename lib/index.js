'use strict';

var walker = require('walker');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('graceful-fs'));
var path = require('path');
var debug = require('debug')('unlink-broken-links');

function isSymlink(filepath) {
  return fs.lstatAsync(filepath)
    .then(function checkSymlink(stats) {
      return stats.isSymbolicLink();
    });
}

function isDir(dirpath) {
  return fs.statAsync(dirpath)
    .then(function checkIsDir(stats) {
      return stats.isDirectory();
    });
}

function isOK(symlinkPath) {
  return fs.statAsync(symlinkPath);
}

function unlinkBrokenLinks(dirpath, opts, callback) {
  var removed;
  var errors;

  if (!arguments.length || !typeof dirpath === 'string') {
    throw new Error('directory parameter required');
  }

  function unlink(symlinkPath) {
    return fs.unlinkAsync(symlinkPath)
      .then(function() {
        removed.push(symlinkPath);
      })
      .catch(function(err) {
        errors.push(err);
        return Promise.resolve();
      });
  }

  removed = [];
  errors = [];
  opts = opts || {};

  return isDir(dirpath)
    .then(function(result) {
      var queue;
      if (result) {
        return Promise.method(function() {
          if (opts.recursive) {
            queue = [];
            return new Promise(function(resolve, reject) {
              walker(dirpath)
                .on('symlink', function(symlinkPath) {
                  queue.push(path.relative(dirpath, symlinkPath));
                })
                .on('end', resolve)
                .on('error', reject);
            })
              .return(queue);
          }
          return fs.readdirAsync(dirpath)
            .filter(isSymlink);
        })()
          .each(function(symlinkPath) {
            return isOK(symlinkPath)
              .then(function() {
                debug('"%s" is OK', symlinkPath);
              })
              .catch(function() {
                debug('"%s" is broken', symlinkPath);
                return unlink(symlinkPath);
              });
          })
          .tap(function() {
            debug('Done');
          })
          .return({
            errors: errors,
            removed: removed
          });
      }
      return Promise.reject(new Error(dirpath + ' is not a directory'));
    })
    .nodeify(callback);
}

module.exports = unlinkBrokenLinks;
