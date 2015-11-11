[tinycolorpicker](http://baijs.com/tinycolorpicker) [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![NPM version][npm-image]][npm-url]
==================================================

Support
----------------------------
- Browser support differs between the jQuery plugin and the plain Javascript microlib. Specifically, the plain Javascript microlib does not support legacy browsers such as IE6-8. Use the jQuery plugin release if support for those browsers is required.

What you need to build your own version of tinycolorpicker
--------------------------------------

In order to build tinycolorpicker, you need to have Node.js/npm, and git 1.7 or later installed.


How to build your own tinycolorpicker
----------------------------

First, clone a copy of the main tinycolorpicker git repo by running:

```bash
git clone git://github.com/wieringen/tinycolorpicker.git
```

Install the grunt-cli package so that you will have the correct version of grunt available from any project that needs it. This should be done as a global install:

```bash
npm install -g grunt-cli
```

Enter the tinycolorpicker directory and install the Node dependencies, this time *without* specifying a global install:

```bash
cd tinycolorpicker && npm install
```

Make sure you have `grunt` installed by testing:

```bash
grunt -version
```

Then, to get a complete, minified (w/ Uglify.js), linted (w/ JSHint) version of tinycolorpicker, type the following:

```bash
grunt
```

The built version of tinycolorpicker will be put in the `dist/` subdirectory, along with the minified copy and associated map file.


Questions?
----------

If you have any questions, please feel free to email [me](mailto:wieringen@gmail.com).

[travis-image]: https://travis-ci.org/wieringen/tinycolorpicker.svg?branch=master
[travis-url]: https://travis-ci.org/wieringen/tinycolorpicker

[coveralls-image]: https://img.shields.io/coveralls/wieringen/tinycolorpicker/master.svg
[coveralls-url]: https://coveralls.io/r/wieringen/tinycolorpicker?branch=master

[npm-image]: https://badge.fury.io/js/tinycolorpicker.png
[npm-url]: http://badge.fury.io/js/tinycolorpicker
