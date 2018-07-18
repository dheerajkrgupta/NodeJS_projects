const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const XLSX = require('xlsx'); 
const fs = require('fs');

const speech_to_text = new SpeechToTextV1({
  username: "c0918f10-766d-4435-adc3-af2c8171eba9",
  password: "45Ul2mQ0wS8i"
  });
  
  fs.readdir("./audio/",function(err, files){
    if (err) {
       return console.error(err);
    }
    files.forEach( function (file)
    {
       let comPath = "./audio/" + file;
       let params = {
                    audio: fs.createReadStream(comPath),
                    content_type: 'audio/mp3',
                    timestamps: true
                    };

        speech_to_text.recognize(params, function (error, transcript) 
        {
            if (error)
            console.log('Error:', error);
            else
            {
                let fileData = new Array;

                for (let i=0; i<transcript.results.length; i++){
                    let temp = transcript.results[i].alternatives[0].timestamps;
                    fileData.push(temp);
                }
					let inputData = fileData;
					
					let headers = ["Title", "Start Time", "End Time"]; 
					let newInput = [];
					for(let i = 0; i<=inputData.length-1; i++){
						newInput = newInput.concat(inputData[i]);
					}
					
					for (let j = 0; j <= newInput.length-1; j++) {
						newInput[j][1];
						newInput[j][2];
						/*
						if (newInput[j][1] <= 10) {
							newInput[j][1] = "00:00:0" + newInput[j][1];
						} else {
							newInput[j][1] = "00:00:" + newInput[j][1];
						}
						if (newInput[j][2] <= 10) {
							newInput[j][2] = "00:00:0" + newInput[j][2];
						} else {
							newInput[j][2] = "00:00:" + newInput[j][2];
						}*/
					}
					newInput.splice(0, 0, headers); 
					let data = newInput; 
					let ws = XLSX.utils.aoa_to_sheet(data); 
					let wb = XLSX.utils.book_new(); 
					XLSX.utils.book_append_sheet(wb, ws, "audio_Cuepoints");
					let fileName =  file;
					file = './audio/'+fileName.slice(0, -4) + '.xlsx';	
					XLSX.writeFile(wb, file,  {type:'buffer', bookType:"xlsx"}); 

            }
        });

    });
});