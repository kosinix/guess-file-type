//// Core modules
const fs = require('fs');
const path = require('path');
const util = require('util');
const execAsync = util.promisify(require('child_process').exec);

//// External modules

//// Modules

// Turn callback style api into promise/async
const fsAsync = {
    open: util.promisify(fs.open),
    read: util.promisify(fs.read),
    close: util.promisify(fs.close),
    unlink: util.promisify(fs.unlink),
};

// Guess using `file` command
let guessByFileCmd = async (filePath, filters=null) => {
    try {
        // let command = util.format('file %s --mime-type --brief', filePath);
        let command = util.format('mimetype --brief %s', filePath);
        let { stdout, stderr } = await execAsync(command);

        let mime = stdout.trim();

        // Allow filters override
        if(filters===null){
            // Normalize mime-types
            let filters = [[
                'image/x-ms-bmp', // standardize
                'image/bmp'
            ],
            [
                'text/x-log',
                'text/plain'
            ],
            [
                'audio/x-vorbis+ogg',
                'audio/ogg'
            ],
            [
                'video/x-theora+ogg',
                'video/ogg'
            ]];
        }

        filters.forEach((filter)=>{
            if(mime===filter[0]){
                mime = filter[1]
            }
        });
        
        return mime;
    } catch (err) {
        return 'unknown';
    }
};

// Guess mime type of buffer. Sync.
// See: http://svn.apache.org/viewvc/httpd/httpd/trunk/docs/conf/mime.types?view=markup
// See: https://www.garykessler.net/library/file_sigs.html
let guessByBuffer = (buffer) => {
    // Windows (or device-independent) bitmap image
    // BM
    if(buffer.includes(Buffer.from([0x42, 0x4D]), 0)){
        return 'image/bmp';
    }

    // Graphics interchange format file
    // GIF87a or GIF89a
    if(buffer.includes(Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]), 0) || 
        buffer.includes(Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]), 0)){
        return 'image/gif';
    }

    // Generic JPEGimage file
    // ÿØ
    if(buffer.includes(Buffer.from([0xFF, 0xD8]), 0)){
        return 'image/jpeg';
    }

    // Various JPEG-2000 image file formats
    // ....jP  
    if(buffer.includes(Buffer.from([0x6A, 0x50, 0x20, 0x20]), 4)){
        return 'image/jp2';
    }

    // Portable Network Graphics
    // ‰PNG....
    if(buffer.includes(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), 0)){
        return 'image/png';
    }

    // Tagged Image File Format file (little endian, i.e., LSB first in the byte; Intel)
    // II*.
    // Tagged Image File Format file (big endian, i.e., LSB last in the byte; Motorola)
    // MM.*
    // BigTIFF files; Tagged Image File Format files >4 GB
    // 	MM.+
    // Tagged Image File Format file 
    // I I
    if(buffer.includes(Buffer.from([0x49, 0x49, 0x2A, 0x00]), 0) || 
        buffer.includes(Buffer.from([0x4D, 0x4D, 0x00, 0x2A]), 0) ||
        buffer.includes(Buffer.from([0x4D, 0x4D, 0x00, 0x2B]), 0) ||
        buffer.includes(Buffer.from([0x49, 0x20, 0x49]), 0) ){
        return 'image/tiff';
    }

    // Photoshop image file
    // 8BPS
    if(buffer.includes(Buffer.from([0x38, 0x42, 0x50, 0x53]), 0)){
        return 'image/vnd.adobe.photoshop';
    }

    // Portable BitMap
    // P1.
    // p4.
    if(buffer.includes(Buffer.from([0x50, 0x31, 0x0A]), 0) || 
        buffer.includes(Buffer.from([0x50, 0x34, 0x0A]), 0) ){
        return 'image/x-portable-bitmap';
    }

    // Portable Graymap Graphic
    // P2.
    // P5.
    if(buffer.includes(Buffer.from([0x50, 0x32, 0x0A]), 0) || 
        buffer.includes(Buffer.from([0x50, 0x35, 0x0A]), 0) ){
        return 'image/x-portable-graymap';
    }

    // Portable PixMap
    // P3.
    // P6.
    if(buffer.includes(Buffer.from([0x50, 0x33, 0x0A]), 0) || 
        buffer.includes(Buffer.from([0x50, 0x36, 0x0A]), 0) ){
        return 'image/x-portable-pixmap';
    }

    // Portable AnyMap
    // P7.
    if(buffer.includes(Buffer.from([0x50, 0x37, 0x0A]), 0) ){
        return 'image/x-portable-anymap';
    }

    // MPEG-1 Layer 3 file without an ID3 tag or with an ID3v1 tag (which's appended at the end of the file)
    if(buffer.includes(Buffer.from([0x49, 0x44, 0x33]), 0) ){
        return 'audio/mpeg';
    }

    // MP3 file with an ID3v2 container
    if(buffer.includes(Buffer.from([0xFF, 0xFB]), 0) ){
        return 'audio/mpeg';
    }

    // Flash video file
    // FLV.
    if(buffer.includes(Buffer.from([0x46, 0x4C, 0x56, 0x01]), 0) ){
        return 'video/x-flv';
    }

    // Apple Lossless Audio Codec file
    // ....ftypM4A
    if(buffer.includes(Buffer.from([0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41, 0x20]), 4) ){
        return 'audio/mp4'; // Use standard instead of 'audio/x-m4a'
    }

    // 	ISO Media, MPEG v4 system, or iTunes AVC-LC file.
    // ....ftypM4V
    if(buffer.includes(Buffer.from([0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x56, 0x20]), 4) ){
        return 'video/mp4'; // Use standard instead of 'video/x-m4v'
    }

    // Ogg Vorbis Codec compressed Multimedia file
    // OggS..........
    if(buffer.includes(Buffer.from([0x4F, 0x67, 0x67, 0x53, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), 0) ){
        // theora
        if(buffer.includes(Buffer.from([0x74, 0x68, 0x65, 0x6F, 0x72, 0x61]), 29)){
            return 'video/ogg';
        }
        // vorbis
        if(buffer.includes(Buffer.from([0x76, 0x6F, 0x72, 0x62, 0x69, 0x73]), 29)){
            return 'audio/ogg';
        }
        
    }

    // Resource Interchange File Format - Audio for Windows
    // RIFF....WAVE
    if(buffer.includes(Buffer.from([0x52, 0x49, 0x46, 0x46]), 0) && 
        buffer.includes(Buffer.from([0x57, 0x41, 0x56, 0x45]), 8) ){
        return 'audio/x-wav';
    }
    
    // MPEG-4 video file
    // ....ftypMSNV
    // 	ISO Base Media file (MPEG-4) v1
    // ....ftypisom
    if(buffer.includes(Buffer.from([0x66, 0x74, 0x79, 0x70, 0x4D, 0x53, 0x4E, 0x56]), 4) || 
        buffer.includes(Buffer.from([0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D]), 4) ){
        return 'video/mp4';
    }

    // Resource Interchange File Format -- Windows Audio Video
    // RIFF....AVI LIST
    if(buffer.includes(Buffer.from([0x52, 0x49, 0x46, 0x46]), 0) &&
        buffer.includes(Buffer.from([0x41, 0x56, 0x49, 0x20, 0x4C, 0x49, 0x53, 0x54]), 8) ){
        return 'video/x-msvideo';
    }

    // QuickTime movie file
    // ....ftypqt
    if(buffer.includes(Buffer.from([0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20]), 4) ){
        return 'video/quicktime';
    }

    // Microsoft Windows Media Audio/Video File
    // 0&²u.fÏ.¦Ù.ª.bÎl
    if(buffer.includes(Buffer.from([0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9, 0x00, 0xAA, 0x00, 0x62, 0xCE, 0x6C]), 0) ){
        return 'video/x-ms-wmv';
    }


    // Adobe Portable Document Format
    // %PDF
    if(buffer.includes(Buffer.from([0x25, 0x50, 0x44, 0x46]), 0) ){
        return 'application/pdf';
    }

    // PKZIP archive file
    // PK..
    if(buffer.includes(Buffer.from([0x50, 0x4B, 0x03, 0x04]), 0) ){
        return 'application/zip';
    }

    // TRAILER BYTES - markers that are at the end 


    return 'unknown';
};

// Guess mime type by file extension
let guessByExtension = (filePath) => {
    // Fallback to file extensions
    let ext = path.extname(filePath);
    ext = ext.split('.').pop();
    if(['txt', 'text', 'conf', 'def', 'list', 'log', 'in'].indexOf(ext)!==-1){
        return 'text/plain';
    }

    if(['appcache'].indexOf(ext)!==-1){
        return 'text/cache-manifest';
    }

    if(['ics', 'ifb'].indexOf(ext)!==-1){
        return 'text/calendar';
    }

    if(['css'].indexOf(ext)!==-1){
        return 'text/css';
    }

    if(['csv'].indexOf(ext)!==-1){
        return 'text/csv';
    }

    if(['doc', 'dot'].indexOf(ext)!==-1){
        return 'application/msword';
    }

    if(['docx'].indexOf(ext)!==-1){
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    if(['html', 'htm'].indexOf(ext)!==-1){
        return 'text/html';
    }

    if(['n3'].indexOf(ext)!==-1){
        return 'text/n3';
    }

    return 'unknown';
}

// Guess mime type by checking file signature
let guessByFileSignature = async (filePath)=>{

    let bufLength = 35; // Minimum buffer length to accomodate the longest magic number chunk
    let fd = await fsAsync.open(filePath, 'r');
    let content = await fsAsync.read(fd, Buffer.alloc(bufLength), 0, bufLength, 0);
    await fsAsync.close(fd);
    let buffer = content.buffer;

    return guessByBuffer(buffer);
    
}


let guess = async (filePath)=>{
    // Guess using mimetype command
    let guess = await guessByFileCmd(filePath);
    if(guess!=='unknown'){
        return guess;
    }
    
    guess = await guessByFileSignature(filePath);
    if(guess!=='unknown'){
        return guess;
    }

    return guessByExtension(filePath);
}

module.exports = {
    guess: guess,
    guessByFileCmd: guessByFileCmd,
    guessByFileSignature: guessByFileSignature,
    guessByExtension: guessByExtension,
};
