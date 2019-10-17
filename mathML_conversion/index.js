
/* Author: Dheeraj Kr. Gupta */

const fs = require('fs');
const Translator=require("latextomathml");
const readdir = require("recursive-readdir");
const replaceall = require("replaceall");
const LogfileName =  "Log_file_" + new Date().getTime() + ".txt";

readdir("./QTI/").then( function(files) {
	let counter = 0;
	let totalFiles = files.length; 
	if (totalFiles > 0)
	{ 
	console.log(" Total File(s): "+ totalFiles);
	files.forEach( function (file)
		{
				 let newdata1, newdata2;
                 let quesXml = fs.readFileSync(file,'utf8');
                 let latexPat1 = quesXml.indexOf("\\(");
                 let latexPat2 = quesXml.indexOf("\\)");
				 let xfileType = file.split(".");

            if(latexPat1 !=-1 && latexPat2 !=-1 && xfileType[1] == "xml")
				{			
					newdata1 = replaceall("\\(", "latex", quesXml);
                    newdata2 = replaceall("\\)","latex", newdata1);
					let patLength = newdata2.match(/latex/g).length;
						
					while (patLength > 0)
					{
						let c = newdata2.indexOf("\\latex");
                        let d = newdata2.indexOf("\\latex", c+6);                                                    
                        let res = newdata2.substring(c+6, d);
                        let mathmlstr=Translator.LaTeXtoMathML(res); 		
						let newstr = "\\latex"+res+"\\latex";
                        newdata2 = replaceall(newstr, mathmlstr, newdata2);
						patLength = patLength-2;	
                     }
						newdata2 = replaceall("imsqti_v2p1p1.xsd", "imsqti_v2p1p2.xsd http://www.w3.org/1998/Math/MathML http://www.w3.org/Math/XMLSchema/mathml2/mathml2.xsd",newdata2);
						newdata2 = replaceall("<math>", "<math xmlns='http://www.w3.org/1998/Math/MathML'>", newdata2);
						fs.writeFileSync(file, newdata2);
						fs.appendFileSync( LogfileName , ""+ file +" is modified for MathML conversion\n", function (err) {
						if (err) throw err; });	
						counter++;
				}
			if(totalFiles==1 && counter >= 1)
			{
				console.log(" Total Modified File(s): "+ counter);
				console.log(" MathML conversion has been done. Please check "+LogfileName+" for modified XML file(s).");
			}
			else if(totalFiles==1 && counter==0)
			{
				console.log(" We did not find any math equation in xml file(s) for MathML conversion.");
			}
			else
			{
				totalFiles--; 
			}					
					
		});
	}
	else{
			console.log(" We did not find any xml file in QTI folder.");
		}
 },
	function(error)
	{
		console.error(" Something went wrong here", error);
	}
);