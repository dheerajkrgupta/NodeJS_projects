/* Author: Dheeraj Kr. Gupta */

const fs = require('fs');
const Translator=require("latextomathml");
const recursive = require("recursive-readdir");
const replaceall = require("replaceall");

var c, d, res, mathmlstr, newdata1, newdata2, patLength;

recursive("./QTI/", function (err, files) {

files.forEach( function (file){
                  var quesXml = fs.readFileSync(file,'utf8');
                  var latexPat1 = quesXml.indexOf("\\(");
                  var latexPat2 = quesXml.indexOf("\\)");
                  
                  if(latexPat1 !=-1 && latexPat2 !=-1){

					newdata1 = replaceall("\\(", "latex", quesXml);
                    newdata2 = replaceall("\\)","latex", newdata1);

					patCount = newdata2.match(/\\latex/g);
                    patLength = patCount.length;
					
					for (i = 0; i < patLength; i++) {
						c = newdata2.indexOf("\\latex", i);
                        d = newdata2.indexOf("\\latex", c+6);                                                    
                        res = newdata2.substring(c+6, d);
                        mathmlstr=Translator.LaTeXtoMathML(res); 					
                        newdata2 = newdata2.replace("\\latex"+res+"\\latex", mathmlstr); 
                        patLength = patLength-2;
                     }                                            
					fs.writeFileSync(file, newdata2);
					console.log("File Name: "+ file +" is updated by Automation Script");
                  }
				  
				  });

  });