const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const fs = require('fs');
const os = require('os');
const speech_to_text = new SpeechToTextV1({
		username: "c0918f10-766d-4435-adc3-af2c8171eba9",
		password: "45Ul2mQ0wS8i"
 });

  fs.readdir("./audio/",function(err, files){
    if (err) { return console.error(err);}
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
            if (error) {console.log('Error:', error);}
            else
				{
                let fileName = file.split("."); 
				let cPath = './audio/'+fileName[0]+'.txt';
					for (i=0; i < transcript.results.length; i++){ 	 
					
				fs.appendFileSync(cPath, JSON.stringify(transcript.results[i].alternatives[0].transcript), function (err) {
			});
		}
		fs.readFile(cPath, 'utf8', function (err,data) {
			if (err) { return console.log(err); }
			var result = data.replace(/""/g,','+os.EOL);
				fs.writeFile(cPath, result, 'utf8', 
				function (err) { if (err) return console.log(err)});
			});	
		console.log("Audio transcript is extracted for \""+file+"\" successfully!");
        }
			
        });
    });
});