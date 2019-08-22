const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const XLSX = require('xlsx'); 
const fs = require('fs');

const speech_to_text = new SpeechToTextV1({
  username: "c0918f10-766d-4435-adc3-af2c8171eba9",
  password: "45Ul2mQ0wS8i",
  
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
                    timestamps: false
                    };

        speech_to_text.recognize(params, function (error, transcript) 
        {
            if (error)
            console.log('Error:', error);
            else
            {
                let fileName = file.split("."); 
				
					for (i=0; i < transcript.results.length; i++){ 
				fs.appendFile('./audio/'+fileName[0]+'.txt', JSON.stringify(transcript.results[i].alternatives[0].transcript), function (err) {
				
			});
		}
		console.log('Saved!');
				
            }
			
        });
    });
});