const fs = require('fs');
const Translator=require("latextomathml");
const readdir = require("recursive-readdir");
const replaceall = require("replaceall");
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const LogfileName =  "Log_file_" + new Date().getTime() + ".txt";

readdir("./QTI/").then( function(files) {
	let counter = 0;
	let totalFiles = files.length; 
	console.log(" Total File(s): "+ totalFiles +"\n");
	
	if (totalFiles > 0)
	{ 
	let fCount = 0;
	bar1.start(totalFiles, 0);	
	files.forEach( function (file)
		{
				
				 let ndata, fdata, sIndex, bsIndex, mEquation, upEquation, mathmlstr, csIndex,pLength, msIndex, meIndex, mtextString, mtextStr;
				 let xfileType = file.split(".");
				 fCount++;	
				 bar1.update(fCount);
            if(xfileType[1] == "xml")
				{
						fs.appendFileSync( LogfileName , ""+ file +" is being loading...\n", function (err) {
						if (err) throw err; });
						let quesXml = fs.readFileSync(file,'utf8');
						let latexPat1 = quesXml.indexOf("\\\\(");
						let latexPat2 = quesXml.indexOf("\\\\)");
						
						if (latexPat1 !=-1 && latexPat2 !=-1) {
							ndata = replaceall("\\\\(", "<dheerajG>", quesXml);
							fdata = replaceall("\\\\)","</dheerajG>", ndata);
							let patLength = fdata.match(/<dheerajG>/g).length;
					
					while (patLength > 0)
					{
						sIndex = fdata.indexOf("<dheerajG>");
						eIndex = fdata.indexOf("</dheerajG>", sIndex+10);                                                    
						mEquation = fdata.substring(sIndex+10, eIndex);
							//console.log("*********** MathML Conversion ***********");
							upEquation = replaceall("\\\\", "\\", mEquation);
							// Replace backward slash with sapce 
							upEquation = replaceall("\\ "," ", upEquation);
							//console.log("upEquation "+ upEquation);
							mathmlstr=Translator.LaTeXtoMathML(upEquation);
							//console.log("mathmlstr "+ mathmlstr);
							
							//Removing internal tags <mtr>,<mtd> in <mtable> 
							mtable = mathmlstr.match(/<mtable>/g);
							mtable = (mtable == undefined) ? 0 : mtable.length;
							if(mtable == 0){		
								mathmlstr = replaceall("<mtd>","", mathmlstr);
								mathmlstr = replaceall("</mtd>","", mathmlstr);
								mathmlstr = replaceall("<mtr>","", mathmlstr);
								mathmlstr = replaceall("</mtr>","", mathmlstr);
								}
								// *********end***********
						
								//Removing internal tags in <mtext> 
								pLength = mathmlstr.match(/<mtext>/g);
								pLength = (pLength == undefined) ? 0 : pLength.length;
								msIndex= 0;
								while (pLength > 0)
								{
								msIndex = mathmlstr.indexOf("<mtext>", msIndex);
								meIndex = mathmlstr.indexOf("</mtext>", msIndex+7);   
								mtextString = mathmlstr.substring(msIndex+7, meIndex);
								mtextStr = replaceall("<mo>","", mtextString);
								mtextStr = replaceall("</mo>","", mtextStr);
								mtextStr = replaceall("<mi>","", mtextStr);
								mtextStr = replaceall("</mi>","", mtextStr);
								mtextStr = replaceall("<mn>","", mtextStr);
								mtextStr = replaceall("</mn>","", mtextStr);
								mathmlstr = replaceall("<mtext>"+mtextString+"</mtext>", "<mtext>"+mtextStr+"</mtext>", mathmlstr);
								msIndex = meIndex+7; pLength--;
								}
								// *********end***********
					 
								fdata = replaceall("<dheerajG>"+mEquation+"</dheerajG>", mathmlstr, fdata);
							
								sIndex = eIndex+10; patLength--;	
										
								if(patLength==0)
								{	
								//Updating header
								fdata = replaceall("imsqti_v2p1p1.xsd", "imsqti_v2p1p2.xsd http://www.w3.org/1998/Math/MathML http://www.w3.org/Math/XMLSchema/mathml2/mathml2.xsd",fdata);
								// *********end***********
								
								// Adding <strong> tag
								fdata = replaceall("<math>", "<strong><math xmlns='http://www.w3.org/1998/Math/MathML'>", fdata);
								fdata = replaceall("</math>", "</math></strong>", fdata);
								// *********end***********
								
								//Replacing symbols in MathML  
								fdata = replaceall("<mo>#</mo><mn>60</mn><mo>;</mo>","<mo>&lt;</mo>", fdata);
								fdata = replaceall("<mo>#</mo><mn>62</mn><mo>;</mo>","<mo>&gt;</mo>", fdata);
								fdata = replaceall("<mo>#</mo><mn>44</mn><mo>;</mo>","<mo>,</mo>", fdata);
								fdata = replaceall("<mo>#</mo><mn>36</mn><mo>;</mo>","<mo>&#36;</mo>", fdata);	
								fdata = replaceall("<mo>#</mo><mn>183</mn><mo>;</mo>","<mo>&#183;</mo>", fdata);
								fdata = replaceall("<mo>#</mo><mn>8722</mn><mo>;</mo>","<mo>&#8722;</mo>", fdata);
								// *********end***********
								
								// Removing double space
								fdata = replaceall("<mo> </mo>","<mo>&#x00A0;</mo>", fdata);
								fdata = replaceall("<mo>&#x00A0;</mo><mo>","<mo>", fdata);
								fdata = replaceall("</mo><mo>&#x00A0;</mo>","</mo>", fdata);
								fdata = replaceall("<mo>&#x00A0;</mo><mo>&#x00A0;</mo>","<mo>&#x00A0;</mo>", fdata);
								// *********end***********
								
								//Find & Replace only 
								fdata = replaceall("<mo>\\</mo><mi>r</mi><mi>i</mi><mi>g</mi><mi>h</mi><mi>t</mi><mi>a</mi><mi>r</mi><mi>r</mi><mi>o</mi><mi>w</mi>","<mo>&#x2192;</mo>", fdata);
								fdata = replaceall("<mo stretchy='true' d='&#x00AF;'></mo>","<mo>&#x00AF;</mo>", fdata);
								fdata = replaceall("<mo>\\</mo><mi>t</mi><mi>r</mi><mi>i</mi><mi>a</mi><mi>n</mi><mi>g</mi><mi>l</mi><mi>e</mi><mo>&#x00A0;</mo>","<mo>&#x2206;</mo>", fdata);
								fdata = replaceall("<mo>\\</mo><mi>d</mi><mi>e</mi><mi>g</mi><mi>r</mi><mi>e</mi><mi>e</mi><mo>&#x00A0;</mo>","<mo>&#x00B0;</mo>", fdata);
								fdata = replaceall("<mo>\\</mo><mi>v</mi><mi>a</mi><mi>r</mi><mi>n</mi><mi>o</mi><mi>t</mi><mi>h</mi><mi>i</mi><mi>n</mi><mi>g</mi>","<mo>&#x2205;</mo>", fdata);
								fdata = replaceall("<mi>&#x0394;</mi><mo>&#x00A0;</mo>","<mi>&#x0394;</mi>", fdata);
								
								// *********end***********
								
								fs.writeFileSync(file, fdata);	
								}
                     }
				
							fs.appendFileSync( LogfileName , ""+ file +" is modified for MathML conversion\n", function (err) {
							if (err) throw err; });	
							counter++;
							
						}
								
				else {
					fs.appendFileSync( LogfileName , ""+ file +" is not modified.\n", function (err) {
					if (err) throw err; });
				}
							
							
				}
				
					if(totalFiles==1 && counter >= 1)
					{
					bar1.stop();
					console.log("\n Total Modified File(s): "+ counter);
					console.log("\n MathML conversion has been done. Please check "+LogfileName+" for modified XML file(s).");
					}
					else if(totalFiles==1 && counter==0)
					{
					console.log("\n We did not find any math equation in xml file(s) for MathML conversion.");
					}
				else
				{
				totalFiles--; 
				}	
		});
	}
	else{
			console.log("\n We did not find any xml file in QTI folder.");
		}
 },
	function(error)
	{
		console.error("\n Something went wrong here", error);
	}
);