const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const Jimp = require('jimp');

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
            imageminPngquant({
                quality: [0.5, 0.5]
            })
        ]
    });

	}
	 
	if( i == imgFileArray.length-1) { 
	setTimeout(function(){ jpgOptimize();}, 1000);
	}
}

function jpgOptimize() {
	for(let j=0; imgFileArray.length > j; j++) {
		if (imgFileArray[j].indexOf(".jpg") != -1 ) {
		let jPath = imgFileArray[j].toString();
		let jPath2 = jPath.replace(/\\/g, "/");
		let jPath3 = jPath2.replace(/images/g, "build");
		Jimp.read(jPath2, (err, dkg) => {
			if (err) throw err;
			dkg
			.quality(50) // set JPEG quality
			.write(jPath3); // save
			});
		}

	}
}