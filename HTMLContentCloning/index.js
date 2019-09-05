/* Author: Dheeraj Kr. Gupta */
  
	var fs = require('fs');
	fs.readdir("./source/",function(err, files){
		if (err) { return console.error(err);}
		files.forEach( function (file){
		var sPath = "./source/"+file;
		var tPath = "./target/"+file;
/* Reading Source file */
		var sData = fs.readFileSync(sPath,'utf8');
		var startIndex1 = sData.indexOf("</head>");
		var lastIndex1 = sData.indexOf("</body>");
			if(startIndex1!=-1 && lastIndex1!=-1){ 
				var fileContent1 = sData.substring(startIndex1+7,lastIndex1);
			}
			else{
					console.log("HTML Tages are missing in Source "+file);
				}
  /* Reading target file */
		var tData = fs.readFileSync(tPath,'utf8'); 
		var startIndex2 = tData.indexOf("</head>");
		var lastIndex2 = tData.indexOf("</body>");
			if(startIndex2!=-1 && lastIndex2!=-1){ 
				var fileContent2 = tData.substring(startIndex2+7,lastIndex2);
				var newdata = tData.replace( fileContent2, fileContent1);
				fs.writeFileSync(tPath, newdata);
				console.log(file+' is cloned in target folder successfully.');
			}
			else{
				console.log("HTML Tages are missing in target "+file);
			}
 });
});