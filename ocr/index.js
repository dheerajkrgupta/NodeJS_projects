const { createWorker } = require('tesseract.js');
var fs = require('fs');

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('fra');
  await worker.initialize('fra');
  const { data: { text } } = await worker.recognize('C:/Users/dheeraj.gupta/Desktop/ocr/input/image1.jpg');
  
  fs.appendFile('output.txt', text, function (err) {
  if (err) throw err;
  console.log("Text has been extracted successfully");
});  

await worker.terminate();

})();