# Guess File Type
Detect the file type by doing various checks. Returns the mime type.

## How it Works

* First it tries to use the `mimetype` command. See Requirements > Optional.
* If `mimetype` is not available, it uses the file signature (magic numbers).
* If the type could not be determined, it falls back to using the file extension.
* It returns the mime type of the file on success, and a string 'unknown' on failure.

### Changing the Behavior

You can avoid the default behavior by using the individual functions. See Usage.

## Requirements

* Node >= 8.0.0

### Optional

To improve mime detection, install the `mimetype` command:

    sudo apt install libfile-mimeinfo-perl

Its results are much more accurate than `file`.

## Installation

    npm install guess-file-type


## Usage

    const fileGuesser = require('guess-file-type');

### Auto guess the type

#### Async:
    try {
        let type = await fileGuesser.guess('./test/files/gif.gif');
        console.log(type); // 'image/gif' or 'unknown' on fail
    } catch (err) {
        
    }

#### Promise:

    fileGuesser.guess('./test/files/gif.gif').then( (type) => {
        console.log(type); // 'image/gif' or 'unknown' on fail
    }).catch((err)=>{

    });


### Manual Checking

You can call the individual functions separately and compose them if neccessary.

#### Guess using the file signature only

Async:

    try {
        let type = await fileGuesser.guessByFileSignature('./test/files/png.png');
        console.log(type);  // 'image/png' or 'unknown' on fail
    } catch(err){}

Promise: 

    fileGuesser.guessByFileSignature('./test/files/png.png').then((type)=>{
        console.log(type);  // 'image/png' or 'unknown' on fail
    }).catch((err)=>{});

#### Guess using the file extension only

Async:

    try {
        let type = await fileGuesser.guessByExtension('./test/files/png.png');
        console.log(type);  // 'image/png' or 'unknown' on fail
    } catch(err){}

Promise:

    fileGuesser.guessByExtension('./test/files/png.png').then((type)=>{
        console.log(type);  // 'image/png' or 'unknown' on fail
    }).catch((err)=>{});

    
## Supported Types

1. avi
1. bmp
1. css
1. csv
1. doc
1. docx
1. flv
1. gif
1. html
1. jp2
1. jpg
1. log
1. m4a
1. m4v
1. mov
1. mp3
1. mp4
1. ogg
1. ogv
1. pdf
1. png
1. pptx
1. psd
1. tga
1. tiff
1. txt
1. wav
1. wmv
1. zip



When using `mimetype`, supported types will depend on your mime database: cat /usr/share/mime/types. 
See: [http://manpages.ubuntu.com/manpages/xenial/en/man1/mimetype.1p.html](http://manpages.ubuntu.com/manpages/xenial/en/man1/mimetype.1p.html)