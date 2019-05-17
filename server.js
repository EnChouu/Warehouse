const express = require('express');
const serialport = require('serialport');
const SerialPort = serialport.SerialPort;
var portName = process.argv[2];

const Readline = serialport.parsers.Readline;
const parser = new Readline;

const app = express();

var sp = new serialport(portName, {
  baudRate: 9600
});

express.static('public');
app.use(express.urlencoded({ extended: false }));

let counterPackages = 0;

app
  .get('/', (req, res) => {
    res.sendfile('./view/import.html');
  })
  .post('/', (req, res) => {
    console.log(req.body.button);
    counterPackages++;
    if(counterPackages >= 5)
    {
      console.log("Too many packages..")
      counterPackages = 0;
    }
    else
    {
      sp.pipe(parser);
      parser.on('data', console.log);
      sp.write(req.body.button)
      console.log("Amount of packages: " + counterPackages);
    }
    
    
    res.redirect('/');
  });

app.listen(3000);