const pdftoimage = require("pdftoimage");
const path = require("path");
const fs = require("fs");
const tmpDir = path.join(__dirname, "../tempdir");

/**
 * @typedef {{status: boolean; msg: string; error: any; name: string;}} Returns
 */

/**
 * @typedef {{file: string; format?: string; prefix: string; outputdirectory?: string; callback: (msg:Returns)=>void; remove?: boolean;}} Config
 */

/**
 * Converts pdf pages to images and save them to specified output directory
 * @package
 * @class
 * @param {Config} options - configuration of the function
 * @returns {void}
 * @author Radhakanta Roy <radhakanta.roy.dev@gmail.com>
 * @version 1.0.0
 */

function PDFToImg(options) {
  this.file = options.file;
  this.format = options.format;
  this.perfix = options.prefix;
  this.outputdirectory = options?.outputdirectory;
  this.callback = options.callback;
  this.remove = typeof options?.remove !== "undefined" ? options.remove : true;
}

/**
 * @function
 * @async
 * */

PDFToImg.prototype.toImg = async function () {
  const context = this;
  if (!context.file) {
    return { status: false, msg: "No file found!", error: null };
  }
  let fileName = this.file.split("/");
  fileName = fileName[fileName.length - 1].split(".")[0];
  pdftoimage(context.file, {
    format: context?.format ? context.format : "png", // png, jpeg, tiff or svg, defaults to png
    prefix: context.prefix, // prefix for each image except svg, defaults to input filename
    outdir: tmpDir,
  })
    .then(function () {
      /** @member {string[]} allPages */
      const allPages = fs.readdirSync(tmpDir);
      if (context.outputdirectory) {
        if (!allPages.length) {
          context.callback({
            status: false,
            msg: "Empty pdf",
            error: `PDF is empty not able to output pdf pages to ${context.format}`,
            name: fileName,
          });
          throw new Error(
            `PDF is empty not able to output pdf pages to ${context.format}`
          );
        } else {
          // copy all pages from tmp directory to destination directory
          /** @member {string[]} allFilteredPages */
          const allFilteredPages = allPages.filter((page) =>
            page.startsWith(fileName)
          );
          allFilteredPages.forEach(function (pageFile) {
            const tempDirPage = path.join(__dirname, "../tempdir/" + pageFile);
            fs.copyFileSync(
              tempDirPage,
              context.outputdirectory + "/" + pageFile,
              fs.constants.COPYFILE_FICLONE
            );
          });
        }
      }
      if (!allPages.length) {
        context.callback({
          status: false,
          msg: "Empty pdf",
          error: `PDF is empty not able to output pdf pages to ${context.format}`,
          name: fileName,
        });
        throw new Error(
          `PDF is empty not able to output pdf pages to ${context.format}`
        );
      } else {
        /** @member {string[]} allFilteredPages */
        if (context.remove) {
          const allFilteredPages = allPages.filter((page) =>
            page.startsWith(fileName)
          );
          allFilteredPages.forEach(function (pageFile) {
            const tempDirPage = path.join(__dirname, "../tempdir/" + pageFile);
            // delete all the files
            fs.unlink(tempDirPage, function (err) {
              if (err) {
                context.callback({
                  status: false,
                  msg: "Error! While generating the file for page " + pageFile,
                  err: err,
                  name: fileName,
                });
              }
            });
          });
        }
      }

      context.callback({
        status: true,
        msg: "Successfull!",
        error: null,
        name: fileName,
      });
    })
    .catch(function (err) {
      context.callback({
        status: true,
        msg: "Error!",
        error: err,
        name: fileName,
      });
    });
};

module.exports = PDFToImg;
