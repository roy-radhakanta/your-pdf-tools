const { createWorker } = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const PDFToImg = require("./pdfToImg");

/**
 * @typedef {{status: boolean; msg: string; error: any;}} Returns
 */

/**
 * @typedef {{ file: string; format: string; prefix: string; outputdirectory: string; callback: (msg:Returns)=>void; remove?: boolean; language: string; worker: any; }} Config
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
  this.format = options.format;
  this.prefix = options.prefix;
  this.outputdirectory = options?.outputdirectory;
  this.callback = options.callback;
  this.remove = options?.remove;
  this.language = options.language;
  this.worker = null;
  this.PDFToImg = PDFToImg;
  this.tempDir = path.join(__dirname, "../tempdir");
  this.currentPageParsing = 0;
  this.textData = [];
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
    const context = this;
    this.worker = await createWorker(this.language);
    const PDFToImg = new this.PDFToImg({
      file: this.file,
      format: this.format,
      prefix: this.prefix,
      outputdirectory: this.outputdirectory,
      callback: toTextCallback,
      remove: false,
    });
    await PDFToImg.toImg();

    async function toTextCallback(data) {
      if (!data.status) {
        context.callback(data);
      } else {
        const allPDFFiles = fs.readdirSync(context.tempDir);
        if (!allPDFFiles.length) {
          context.callback({
            status: false,
            msg: "No file found!",
            error: null,
          });
        } else {
          const resumePageImages = allPDFFiles.filter((page) =>
            page.startsWith(data.name)
          );

          if (!resumePageImages.length) {
            context.callback({
              status: false,
              msg: "No file found!",
              error: null,
            });
          } else {
            await getText(resumePageImages, context);
            await context.worker.terminate();
            // remove all the pages from tempdirectory
            if (context?.remove) {
              resumePageImages.forEach(function (pageFile) {
                const tempDirPage = path.join(
                  __dirname,
                  "../tempdir/" + pageFile
                );
                // delete all the files
                fs.unlink(tempDirPage, function (err) {
                  if (err) {
                    context.callback({
                      status: false,
                      msg: "Error! removing the file for page " + pageFile,
                      err: err,
                      name: pageFile,
                    });
                  }
                });
              });
            }
            context.callback({
              status: true,
              msg: context.textData,
              error: null,
            });
          }
        }
      }
    }

    async function getText(resumePageImages, context) {
      const rpi = resumePageImages;
      const ctx = context;
      let pagePath = rpi[ctx.currentPageParsing];
      pagePath = path.join(__dirname, "../tempdir/" + pagePath);
      const ret = await ctx.worker.recognize(pagePath);
      ctx.currentPageParsing = ctx.currentPageParsing + 1;
      ctx.textData.push(ret.data.text);
      if (ctx.currentPageParsing >= rpi.length) {
        return true;
      } else {
        await getText(rpi, ctx);
      }
    }
  } catch (error) {
    context.callback({
      status: false,
      msg: "Error while converting pdf to text",
      err: error,
    });
  }
};

module.exports = PDFToText;
