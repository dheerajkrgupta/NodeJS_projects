const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const fs = require('fs');

const speech_to_text = new SpeechToTextV1({
   username: '60cb2449-78a9-4b00-964d-ed08cb959fd1',
   password: '5cq7yTWJRcfr'
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
                    let cuePoints = JSON.stringify(fileData);
                    let fileName =  file;
                    file = fileName.slice(0, -4)
                    fs.writeFile('./audio/'+file+'.json', cuePoints,  function(err) {
                    if (err) 
                    {
                    return console.error(err);
                    }});
            }
        });

    });
});