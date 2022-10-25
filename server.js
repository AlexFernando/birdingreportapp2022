const path = require('path');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const myLogic = require('./client/src/myLogic');
const { conservationCodesResults } = require('./client/src/excelConservationCode');

const writeStats = require('./client/src/logicWriteStats');

//heroku config
const port = process.env.PORT || 5000;

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//cors
app.use(cors())

app.use(fileUpload());

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//app.use('/download', express.static(__dirname));

//Upload Endpoint
app.post('/upload', (req, res) => {
    
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    
    const file = req.files.file;

    file.mv(`${__dirname}/uploads/${file.name}`, err => {
        
        if (err) {
            console.error(err);
            return res.status(500).send(err)
        }
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    })
});

//este post para recibir el dato 
app.post('/dates', (req, res) => {
  const myDates = req.body.myDates;
  const filename = req.body.filename;
  myLogic.mySpecialFunction(myDates.initialDate, myDates.endDate, filename);
  myDates["loading"] = '';
  res.json(myDates)
})

// write the stats docx.
app.post('/writestats', (req, res) => {
  const stats = req.body.myStats
  writeStats.writeStatsFunc(stats)
  console.log("hello stats", res.json(stats))
})

app.get('/download', (req, res) => {
    const docPath = path.join(__dirname, 'Report.docx');
 
    res.download(docPath, 'Report.docx', function(err){
      if (err) {
        // if the file download fails, we throw an error
        throw err;
      }
    });
  })

  // FOR STATS DOWNLOAD
  app.get('/downloadstats', (req, res) => {
    const docPath = path.join(__dirname, 'Stats.xlsx');
 
    res.download(docPath, 'Stats.xlsx', function(err){
      if (err) {
        // if the file download fails, we throw an error
        throw err;
      }
    });
  })

  // The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  }); 

app.listen(port, () => console.log( `Server Started...port ${port}`));