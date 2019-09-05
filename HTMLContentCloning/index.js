/* Author: Dheeraj Kr. Gupta */
  
	var fs = require('fs');
	fs.readdir("./source/",function(err, files){
		if (err) { return console.error(err);}
		files.forEach( function (file)
		{
		var sPath = "./source/"+file;
		var tPath = "./target/"+file;
		
/* Reading Source file */
	fs.readFile(sPath,'utf8', function(err, data) {
		var startIndex1 = data.indexOf("<body>");
		var lastIndex1 = data.indexOf("</body>");
		var fileContent1 = data.substring(startIndex1+6,lastIndex1);

  /* Reading target file */
	fs.readFile(tPath,'utf8', function(err, data) {  
		var startIndex2 = data.indexOf("<body>");
		var lastIndex2 = data.indexOf("</body>");
		var fileContent2 = data.substring(startIndex2+6,lastIndex2);
		var newdata = data.replace( fileContent2, fileContent1);
		fs.writeFileSync(tPath, newdata);
		console.log(file+' is cloned in target folder successfully.');
   });  
 });
 });
});