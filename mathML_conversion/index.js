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
				 let ndata, fdata, sIndex, d, bsIndex, mEquation, upEquation, mathmlstr;
                 let quesXml = fs.readFileSync(file,'utf8');
                 let latexPat1 = quesXml.indexOf("\\(");
                 let latexPat2 = quesXml.indexOf("\\)");
				 let xfileType = file.split(".");

            if(latexPat1 !=-1 && latexPat2 !=-1 && xfileType[1] == "xml")
				{			
					ndata = replaceall("\\\\(", "<dheerajG>", quesXml);
                    fdata = replaceall("\\\\)","</dheerajG>", ndata);
					let patLength = fdata.match(/<dheerajG>/g).length;
					
					while (patLength > 0)
					{
						sIndex = fdata.indexOf("<dheerajG>");
						eIndex = fdata.indexOf("</dheerajG>", sIndex+10);                                                    
						mEquation = fdata.substring(sIndex+10, eIndex);
						bsIndex = mEquation.indexOf("\\\\");
							if(bsIndex != -1)
							{							
								//console.log("*********** MathML Conversion ***********");
								upEquation = replaceall("\\\\", "\\", mEquation);
								mathmlstr=Translator.LaTeXtoMathML(upEquation);
								fdata = replaceall("<dheerajG>"+mEquation+"</dheerajG>", mathmlstr, fdata);
							}
							else 
							{
							fdata = replaceall("<dheerajG>"+mEquation+"</dheerajG>", "<strong>"+mEquation+"</strong>", fdata);
							}
							sIndex = eIndex+10; patLength--;	
			
								if(patLength==0)
								{	
								fdata = replaceall("imsqti_v2p1p1.xsd", "imsqti_v2p1p2.xsd http://www.w3.org/1998/Math/MathML http://www.w3.org/Math/XMLSchema/mathml2/mathml2.xsd",fdata);
								fdata = replaceall("<math>", "<strong><math xmlns='http://www.w3.org/1998/Math/MathML'>", fdata);
								fdata = replaceall("</math>", "</math></strong>", fdata);
								//Replace extra backslash with space 
								fdata = replaceall("<mo>\\</mo>","", fdata);
								fs.writeFileSync(file, fdata);	
								}
                     }
				
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
			console.log("We did not find any xml file in QTI folder.");
		}
 },
	function(error)
	{
		console.error("Something went wrong here", error);
	}
);