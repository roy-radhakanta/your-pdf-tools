![Your PDF Tools](your-pdf-tools.png)

# YOUR PDF TOOLS 🛠️

Your PDF Tools help you to convert your pdf to images or text or both. Super usefull package to play with your pdf.
1.  PDF to Image
2.  PDF to Text

Follow these steps to install

#### Installation ⚙️
```bash
npm i your-pdf-tools
```

### Usage
##### PDF to image
```nodejs
const { PDFToImg, PDFToText } = require("your-pdf-tools");
const path = require("path");

const filePath = path.join(__dirname, "your_pdf_name.pdf");
const yourOutPutDir = path.join(__dirname, "./your_pdf_path");

// PDF to Image only (each image will represent each page of the PDF)
const pdfToimg = new PDFToImg({
  file: filePath,// 🆘required!
  format: "png", // 🆘required! png, jpeg, tiff or svg
  prefix: "your_image",
  outputdirectory: yourOutPutDir, // the directory where you want to save the pdf pages
  callback: cb, // 🆘required! the callback function loaded with results
  remove: false, // set to true if want to remove all your pdf page from temporary directory 🚨 Recommended true
});

pdfToimg.toImg(); // nature is asynchronous

Alternate approach
-------------------
async function name(){
    await pdfToimg.toImg();
}
```

##### PDF to text
```nodejs
const pdftotext = new PDFToText({
  file: filePath,// 🆘required!
  format: "png",// 🆘required! png, jpeg, tiff or svg
  prefix: "your_image",
  outputdirectory: outputDir,// the directory where you want to save the pdf pages
  callback: cb,
  language: 'eng',// 🆘required! the pdf language
  remove: true, // set to true if want to remove all your pdf page from temporary directory 🚨 Recommended true
});

pdftotext.toText();// nature is asynchronous

Alternate approach
-------------------
async function name(){
    await pdftotext.toText();
}
```

### Output 
##### PDF to Image
```
{
    status: boolean;
    msg: string;
    error: any; 
    name: string;
}
```

##### PDF to Text
```
{
    status: boolean; 
    msg: string | Array<string>;  // Array<string> page wise all text
    error: any;
}
```


### Supported Language
1.  NodeJS

### 

### Thanks
