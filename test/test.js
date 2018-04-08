const expect = require("chai").expect;
const guessFileType = require("./../index.js");

describe("Test Using guess()", ()=> {
    describe("Image Types", ()=> {
        it("bmp", async ()=> {
            let type = await guessFileType.guess('./test/files/bmp.bmp');
            expect(type).to.equal('image/bmp');
        });
        it("gif", async ()=> {
            let type = await guessFileType.guess('./test/files/gif.gif');
            expect(type).to.equal('image/gif');
        });
        it("jpeg", async ()=> {
            let type = await guessFileType.guess('./test/files/jpeg.jpg');
            expect(type).to.equal('image/jpeg');
        });

        it("jpeg 2000 (jp2)", async ()=> {
            let type = await guessFileType.guess('./test/files/jpeg-2000.jp2');
            expect(type).to.equal('image/jp2');
        });

        it("png", async ()=> {
            let type = await guessFileType.guess('./test/files/png.png');
            expect(type).to.equal('image/png');
        });

        it("png8", async ()=> {
            let type = await guessFileType.guess('./test/files/png-8.png');
            expect(type).to.equal('image/png');
        });

        it("tiff mac", async ()=> {
            let type = await guessFileType.guess('./test/files/tiff-mac.tiff');
            expect(type).to.equal('image/tiff');
        });

        it("tiff pc", async ()=> {
            let type = await guessFileType.guess('./test/files/tiff.tiff');
            expect(type).to.equal('image/tiff');
        });

        

        // TODO: Need valid .pgm file to test
        // it("pgm", async ()=> {
        //     let type = await guessFileType.guess('./test/files/pgm.pgm');
        //     expect(type).to.equal('image/x-portable-graymap');
        // });

    });

    describe("Audio Types", ()=> {
        
        

        it("flv", async ()=> {
            let type = await guessFileType.guess('./test/files/flv.flv');
            expect(type).to.equal('video/x-flv');
        });

        it("m4a", async ()=> {
            let type = await guessFileType.guess('./test/files/m4a.m4a');
            expect(type).to.equal('audio/mp4');
        });


        it("mp3", async ()=> {
            let type = await guessFileType.guess('./test/files/mp3.mp3');
            expect(type).to.equal('audio/mpeg');
        });

        it("ogg", async ()=> {
            let type = await guessFileType.guess('./test/files/ogg.ogg');
            expect(type).to.equal('audio/ogg');
        });

        it("wav", async ()=> {
            let type = await guessFileType.guess('./test/files/wav.wav');
            expect(type).to.equal('audio/x-wav');
        });
    });

    describe("Video Types", ()=> {
        
        it("avi", async ()=> {
            let type = await guessFileType.guess('./test/files/avi.avi');
            expect(type).to.equal('video/x-msvideo');
        });

        it("m4v", async ()=> {
            let type = await guessFileType.guess('./test/files/m4v.m4v');
            expect(type).to.equal('video/mp4');
        });

        it("mov", async ()=> {
            let type = await guessFileType.guess('./test/files/mov.mov');
            expect(type).to.equal('video/quicktime');
        });

        it("mp4", async ()=> {
            let type = await guessFileType.guess('./test/files/mp4.mp4');
            expect(type).to.equal('video/mp4');
        });

        it("ogv", async ()=> {
            let type = await guessFileType.guess('./test/files/ogv.ogv');
            expect(type).to.equal('video/ogg');
        });

        it("wmv", async ()=> {
            let type = await guessFileType.guess('./test/files/wmv.wmv');
            expect(type).to.equal('video/x-ms-wmv');
        });
    });

    describe("Document Types", ()=> {      

        it("css", async ()=> {
            let type = await guessFileType.guess('./test/files/css.css');
            expect(type).to.equal('text/css');
        });

        it("csv", async ()=> {
            let type = await guessFileType.guess('./test/files/csv.csv');
            expect(type).to.equal('text/csv');
        });

        it("doc", async ()=> {
            let type = await guessFileType.guess('./test/files/doc.doc');
            expect(type).to.equal('application/msword');
        });

        it("docx", async ()=> {
            let type = await guessFileType.guess('./test/files/docx.docx');
            expect(type).to.equal('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        });

        it("html", async ()=> {
            let type = await guessFileType.guess('./test/files/html.html');
            expect(type).to.equal('text/html');
        });

        it("log", async ()=> {
            let type = await guessFileType.guess('./test/files/log.log');
            expect(type).to.equal('text/plain');
        });

        it("pdf", async ()=> {
            let type = await guessFileType.guess('./test/files/pdf.pdf');
            expect(type).to.equal('application/pdf');
        });

        it("pptx", async ()=> {
            let type = await guessFileType.guess('./test/files/pptx.pptx');
            expect(type).to.equal('application/vnd.openxmlformats-officedocument.presentationml.presentation');
        });
        
        it("psd", async ()=> {
            let type = await guessFileType.guess('./test/files/psd.psd');
            expect(type).to.equal('image/vnd.adobe.photoshop');
        });
        
        it("txt", async ()=> {
            let type = await guessFileType.guess('./test/files/txt.txt');
            expect(type).to.equal('text/plain');
        });

    });

    describe("Font Types", ()=> {      

        it("eot", async ()=> {
            let type = await guessFileType.guess('./test/files/eot.eot');
            expect(type).to.equal('application/vnd.ms-fontobject');
        });

        it("ttf", async ()=> {
            let type = await guessFileType.guess('./test/files/ttf.ttf');
            expect(type).to.equal('font/ttf');
        });

        it("svg", async ()=> {
            let type = await guessFileType.guess('./test/files/font.svg');
            expect(type).to.equal('image/svg+xml');
        });

        it("woff", async ()=> {
            let type = await guessFileType.guess('./test/files/woff.woff');
            expect(type).to.equal('font/woff');
        });

        it("woff2", async ()=> {
            let type = await guessFileType.guess('./test/files/woff2.woff2');
            expect(type).to.equal('font/woff2');
        });

    });
});