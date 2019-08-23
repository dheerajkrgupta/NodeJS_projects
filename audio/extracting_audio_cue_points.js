const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const XLSX = require('xlsx'); 
const fs = require('fs');

const speech_to_text = new SpeechToTextV1({
  username: "",
  password: ""
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