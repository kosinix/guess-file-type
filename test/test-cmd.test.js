const expect = require("chai").expect;
const guessFileType = require("./../index.js");

describe("Test Using guess()", ()=> {
    describe("Image Types", ()=> {
        it("bmp", async ()=> {
            let type = await guessFileType.guessByFileCmd('./test/files/bmp.bmp');

            expect(type).to.equal('image/bmp');
        });
    });
});
