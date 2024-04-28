const { createWorker } = require("tesseract.js");
const fs = require("fs");

/**
 * @typedef {{status: boolean; msg: string; error: any;}} Returns
 */

/**
 * @typedef {{ file: string; callback: (msg:Returns)=>void; remove?: boolean; language: string; }} Config
 */

/**
 * Converts pdf pages to text
 * @async
 * @class
 * @param {Config} options - configuration of the function
 * @returns {void}
 * @author Radhakanta Roy <radhakanta.roy.dev@gmail.com>
 * @version 1.0.0
 */

function PDFToText(options) {
    this.file = options.file;
    this.callback = options.callback;
    this?.remove = options.remove;
    this.language = options.language;
    this.worker = null;
}

/** 
 * @async
 * @function
 * */

PDFToText.prototype.toText = async function () {
    try {
        if (!this.file) {
            return { status: false, msg: "No file found!", error: null };
        }

        let fileName = this.file.split("/");
        fileName = fileName[fileName.length-1].split(".")[0];
        
        this.worker = await createWorker(this.language);
        const allPDFFiles = fs.readdirSync(this.file);
        if (!allPDFFiles.length) {
            return { status: false, msg: "No file found!", error: null };
        }
        const resumePageImages = allPDFFiles.filter((page) =>
            page.startsWith(fileName)
        );
    } catch (error) {

    }
}

module.exports = PDFToText;