'use strict';

let pug = require('gulp-pug');
let data = require('gulp-data');
let filter = require('gulp-filter');
let wiredep = require('wiredep').stream;
let lazypipe = require('lazypipe');

let config = require('../config');
let Base = require('./base');

class Templates extends Base {
  constructor(dist) {
    super(dist, config.paths.templates);
  }

  getStream() {
    let pipes = this.getLazypipe();

    return this.createStream()
      .pipe(pipes())
      .pipe(this.dest());
  }

  getStreamWithWatch() {
    let pipes = this.getLazypipe();

    return this.createWatchStream()
      .pipe(pipes())
      .pipe(this.dest())
      .pipe(this.reload());
  }

  getLazypipe() {
    let pugFilter = filter('**/*.pug', {restore: true});
    let wiredepPipe = Templates.getLazypipeWiredep();

    return lazypipe()
      .pipe(() => pugFilter)
      .pipe(() => data(() => config.getConstants()))
      .pipe(pug, {
        pretty: true
      })
      .pipe(() => pugFilter.restore)

      .pipe(wiredepPipe);
  }

  static getLazypipeWiredep() {
    let indexFilter = filter('index.html', {restore: true});

    return lazypipe()
      .pipe(() => indexFilter)
      .pipe(wiredep, {
        directory: './bower_components',
        ignorePath: /^(\.\.\/)*\.\.\//
      })
      .pipe(() => indexFilter.restore)
  }

}

module.exports = Templates;
