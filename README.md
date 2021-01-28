# mjcli

Purpose of this package is to provide a command that can process math in HTML
files, either in MathML or LaTeX formats, to plain HTML.

## Usage

    mjcli [options] <filename> 
    
    <filemame>      Input file name. Process standard input if ommited
    Options:
      --help        Show help                                              [boolean]
      --version     Show version number                                    [boolean]
      --em          em-size in pixels                                  [default: 16]
      --ex          ex-size in pixels                                   [default: 8]
      --latex, -l                                         [boolean] [default: false]
      --mathml, -m                                         [boolean] [default: true]
      --packages    the packages to use, e.g. "base, ams"
          [default: "action, ams, amscd, base, bbox, boldsymbol, braket, bussproofs,
           cancel, color, configmacros, enclose, extpfeil, html, mhchem, newcommand,
                       noerrors, noundefined, tagformat, textmacros, unicode, verb"]
      --fontURL     the URL to use for web fonts                           [default:
            "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2"]

By default, `mjcli` expects math to be included in the MathML format in HTML file. 
If you use LaTeX syntax instead, try to execute

    mjcli --latex file.html > converted.html


## Installation

This project uses [Node.js](ihttps://nodejs.org/en/) and
[npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), so
you need to install them first. 

When you have `npm` ready, clone or download this repository and run

    npm install -g

This will install the `mjcli` command on your system.


## Details

`mjcli` uses Node version of MathJax. In particular, it uses an adapted version of 
[mml2cthml-page](https://github.com/mathjax/MathJax-demos-node/blob/master/direct/mml2chtml-page)
example from [MathJax-demos-node](https://github.com/mathjax/MathJax-demos-node) project.
