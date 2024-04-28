const pdftoimage = require("pdftoimage");
const path = require('path');
const tmpDir = path.join(__dirname, "../tempdir");
/**
 * @typedef {{status: boolean; msg: string; error: any;}} Returns
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
  this.remove = options?.remove ? options?.remove : false;
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
  fileName = fileName[fileName.length-1].split(".")[0];
  pdftoimage(context.file, {
    format: context?.format ? context.format : "png", // png, jpeg, tiff or svg, defaults to png
    prefix: context.prefix, // prefix for each image except svg, defaults to input filename
    outdir: tmpDir
  })
    .then(function () {
      // copy all pages from tmp directory to destination directory
      if(context.outputdirectory){
        /** @member {string[]} allPages */ 
        const allPages = fs.readdirSync(tmpDir);

        if(!allPages.length){
          context.callback({ status: false, msg: "Empty pdf", error: `PDF is empty not able to output pdf pages to ${context.format}` });
          throw new Error(`PDF is empty not able to output pdf pages to ${context.format}`);
        }else{
          
        }
      }
      context.callback({ status: true, msg: "Successfull!", error: null });
    })
    .catch(function (err) {
      context.callback({ status: true, msg: "Error!", error: err });
    });
};

module.exports = PDFToImg;
