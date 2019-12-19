const fs = require('fs');
const Translator=require("latextomathml");
const recursive = require("recursive-readdir");
const replaceall = require("replaceall");

let newdata1, newdata2;

//Log file creation 
fs.writeFile('Log_file.txt', "", function (err) { });

recursive("./QTI/", function (err, files) {

files.forEach( function (file){
                 let quesXml = fs.readFileSync(file,'utf8');
                 let latexPat1 = quesXml.indexOf("\\(");
                 let latexPat2 = quesXml.indexOf("\\)");
                  
                  if(latexPat1 !=-1 && latexPat2 !=-1){

					newdata1 = replaceall("\\(", "latex", quesXml);
                    newdata2 = replaceall("\\)","latex", newdata1);

					let patLength = newdata2.match(/\\latex/g).length;
					
					for (i = 0; i < patLength; i++) {
						let c = newdata2.indexOf("\\latex", i);
                        let d = newdata2.indexOf("\\latex", c+6);                                                    
                        let res = newdata2.substring(c+6, d);
                        let mathmlstr=Translator.LaTeXtoMathML(res); 					
                        newdata2 = newdata2.replace("\\latex"+res+"\\latex", mathmlstr);
						newdata2 = newdata2.replace(/imsqti_v2p1p1.xsd/g, "imsqti_v2p1p2.xsd http://www.w3.org/1998/Math/MathML http://www.w3.org/Math/XMLSchema/mathml2/mathml2.xsd");
						newdata2 = newdata2.replace(/<math>/g, "<math xmlns='http://www.w3.org/1998/Math/MathML'>");
						patLength = patLength-2;
                     }                                            
					fs.writeFileSync(file, newdata2);
					fs.appendFile('Log_file.txt', ""+ file +" is modified for MathML conversion\n", function (err) {
					if (err) throw err;
					console.log(file +" is modified for MathML conversion\n");
					});
                  }
				  
				  });

  });