const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const Jimp = require('jimp');

const fs = require("fs");
const path = require("path");

let minFileSize = 50;  /* Minimum file size (KB) for optimization */
let counter = 0;

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

console.log("Total files: "+  imgFileArray.length);
console.log("Image files (jpg/png) will be optimized which are greater than ("+minFileSize+" KB) in file size.");

for(let i=0; imgFileArray.length > i; i++) {
	if(imgFileArray[i].indexOf(".png") != -1) {
		let uPath = imgFileArray[i].toString();
		let uPath2 = uPath.replace(/\\/g, "/");
		let lastIndex = uPath2.lastIndexOf("/");
		let uPath3 = uPath2.substring(0, lastIndex).replace(/images/g, "build");
		let cFile = Math.round(fs.statSync(uPath2).size / 1024);  
			
		if( cFile > minFileSize) {
		counter++
		const files = imagemin([uPath2], {
        destination: uPath3,
        plugins: [
            imageminPngquant({
                quality: [0.5, 0.5]
            })
        ]
    });
	}
}
	 
	if( i == imgFileArray.length-1) { 
	console.log("Total PNG files are being optimized:  "+  counter);
	setTimeout(function(){ jpgOptimize();}, 1600);
	}
}

function jpgOptimize() {
	
	counter = 0;
	for(let j=0; imgFileArray.length > j; j++) {
		if (imgFileArray[j].indexOf(".jpg") != -1 ) {
		let jPath = imgFileArray[j].toString();
		let jPath2 = jPath.replace(/\\/g, "/");
		let jPath3 = jPath2.replace(/images/g, "build");
		let cjFile = Math.round(fs.statSync(jPath2).size / 1024);
		
		if( cjFile > minFileSize) { 
		counter++;
		Jimp.read(jPath2, (err, dkg) => {
			if (err) throw err;
			dkg
			.quality(50)
			.write(jPath3); 
			});
			}
		}
			if( j == imgFileArray.length-1) { 
				console.log("Total JPG files are being optimized:  "+  counter);
			}
	}
}