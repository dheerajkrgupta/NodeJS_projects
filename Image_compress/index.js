const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const fs = require("fs");
const path = require("path");

const localFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = localFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

const imgFileArray = localFiles("images/");

for(let i=0; imgFileArray.length > i; i++) {
	if(imgFileArray[i].indexOf(".png") != -1 || imgFileArray[i].indexOf(".jpg") != -1  ) {
		
		let uPath = imgFileArray[i].toString();
		let uPath2 = uPath.replace(/\\/g, "/");
		let lastIndex = uPath2.lastIndexOf("/");
		let uPath3 = uPath2.substring(0, lastIndex).replace(/images/g, "build");
		const files = imagemin([uPath2], {
        destination: uPath3,
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.3, 0.5]
            })
        ]
    });

	}
}