const express = require('express');
const {Worker} = require('worker_threads');

/*The Worker class represents an independent JavaScript execution thread. Most Node.js APIs are available inside of it.
A Worker has a built-in pair of MessagePorts that are already associated with each other when the Worker is created. While the MessagePort object on the parent side is not directly exposed, its functionalities are exposed through worker.postMessage() and the worker.on('message') event on the Worker object for the parent thread.
Workers (threads) are useful for doing JavaScript actions that require a lot of CPU power. They aren't very useful for tasks that require a lot of I/O. Asynchronous I/O operations built into Node.js are more efficient than Workers. Worker threads, unlike child process or cluster, can share memory. They achieve this via sharing SharedArrayBuffer instances or transferring ArrayBuffer objects.
*/

const cors = require('cors');

    const app = express();
    app.use(cors());

    app.get('/non-blocking/', (req, res) => {
    res.status(200).send({ message: 'This is our home page!'});
    });

  app.get('/blocking/', async (req, res) => {

    const worker = new Worker("./worker.js");

    worker.on('message', (data)=> {

        res.status(200).send({ message: `The result is ${data}`});
    });

    worker.on('error', (err)=> {

        res.status(404).send({ message: `An error occurred: ${err}`});
    })

  });


  const server = app.listen(3000, () => {
    console.log(`Worker process ${process.pid} is listening on port 3000`);
  });
