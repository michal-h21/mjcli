#! /usr/bin/env node

/*************************************************************************
 *
 *  This is a modified example taken from MathJax Node Demos
 *  https://github.com/mathjax/MathJax-demos-node
 *
 *  Uses MathJax v3 to convert all TeX in an HTML document.
 *
 * ----------------------------------------------------------------------
 *
 *  Copyright (c) 2018 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// this is used arguments
const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages.js');
//
//  Get the command-line arguments
//
var argv = require('yargs')
  .demand(0).strict()
  .usage('$0 [options] <filename>')
  .options({
    em: {
      default: 16,
      describe: 'em-size in pixels'
    },
    ex: {
      default: 8,
      describe: 'ex-size in pixels'
    },
    latex: {
      alias: "l",
      default: false,
      describe: "Convert LaTeX math",
      type: "boolean"
    },
    mathml: {
      alias: "m",
      default: true,
      describt: "Convert MathML math",
      type: "boolean"
    },
    packages: {
      default: AllPackages.sort().join(', '),
      describe: 'the packages to use, e.g. "base, ams"'
    },
    svg: {
      alias: "s",
      default: false,
      describe: "output math as SVG",
      type: "boolean"
    },

    fontURL: {
      default: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2',
      describe: 'the URL to use for web fonts'
    }
  })
  .argv;

//
//  Load the packages needed for MathJax
//
const {mathjax} = require('mathjax-full/js/mathjax.js');
const {liteAdaptor} = require('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html.js');
const {AssistiveMmlHandler} = require('mathjax-full/js/a11y/assistive-mml.js');
const fs = require('fs');
require('mathjax-full/js/util/entities/all.js');


//
//  Read the HTML file
//
let htmlfile = null;
if(argv._[0]){
  htmlfile = fs.readFileSync(argv._[0], 'utf8');
} else {
  // read from stdin
  htmlfile = fs.readFileSync(0, 'utf8');
}

//
//  Create DOM adaptor and register it for HTML documents
//
const adaptor = liteAdaptor({fontSize: argv.em});
AssistiveMmlHandler(RegisterHTMLHandler(adaptor));

//  Declare tex input object, it will be initialized later
let tex = null;
//
//  Create input and output jax and a document using them on the content from the HTML file
//  We support either MathML (default) or LaTeX math
if(argv.latex==true) {
  const {TeX} = require('mathjax-full/js/input/tex.js');
  tex = new TeX({packages: argv.packages.split(/\s*,\s*/), inlineMath: [['$','$'], ["\\(","\\)"]]});
} else {
  const {MathML} = require('mathjax-full/js/input/mathml.js');
  tex = new MathML();
}

// 
let output = null;

if(argv.svg == true) {
  const {SVG} = require('mathjax-full/js/output/svg.js');
  output = new SVG({fontCache: 'local'});
}
else{
  const {CHTML} = require('mathjax-full/js/output/chtml.js');
  output  = new CHTML({fontURL: argv.fontURL, exFactor: argv.ex / argv.em});
}

const html = mathjax.document(htmlfile, {InputJax: tex, OutputJax: output});

//
//  Typeset the document
//
html.render();

//
//  If no math was found on the page, remove the stylesheet
//
if (Array.from(html.math).length === 0) adaptor.remove(html.outputJax.chtmlStyles);

//
//  Output the resulting HTML
//
console.log(adaptor.doctype(html.document));
console.log(adaptor.outerHTML(adaptor.root(html.document)));
