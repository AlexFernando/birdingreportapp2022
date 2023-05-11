const path = require('path');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const myLogic = require('./client/src/myLogic');
const statsGenerationFiles = require('./StatsGenerationFiles')
const { conservationCodesResults } = require('./client/src/excelConservationCode');

const writeStats = require('./client/src/logicWriteStats');

// const async = require('async');
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


app.post('/updatepersonaldata', (req, res) => {
    
  if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
  }
  
  const file = req.files.file;

  file.mv(`${__dirname}/updatesfiles/personaldata/personalData.csv`, err => {
      
      if (err) {
          console.error(err);
          return res.status(500).send(err)
      }
      res.json({ fileName: file.name, filePath: `/updatesfiles/personaldata/personalData.csv` });
  })
});

//update stats by user when a new personal data file is uploaded
app.post('/stats', async (req, res) => {
  try {
    statsGenerationFiles.StatsGenerationFiles();
    setTimeout(() => {
      res.send('Stats updated successfully');
    }, 35000); // 35 minute delay
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating stats');
  }
});




app.post('/updatemaindata', (req, res) => {
    
  if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
  }
  
  const file = req.files.file;

  file.mv(`${__dirname}/updatesfiles/maindata/mainData.xlsx`, err => {
      
      if (err) {
          console.error(err);
          return res.status(500).send(err)
      }
      res.json({ fileName: file.name, filePath: `/updatesfiles/maindata/mainData.xlsx` });
  })
});


app.post('/updaterestrictiondata', (req, res) => {
    
  if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
  }
  
  const file = req.files.file;

  file.mv(`${__dirname}/updatesfiles/restrictiondata/RestrictionData.xlsx`, err => {
      
      if (err) {
          console.error(err);
          return res.status(500).send(err)
      }
      res.json({ fileName: file.name, filePath: `/updatesfiles/restrictiondata/RestrictionData.xlsx` });
  })
});

app.post('/updatepresencendata', (req, res) => {
    
  if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
  }
  
  const file = req.files.file;

  file.mv(`${__dirname}/updatesfiles/presencedata/presenceData.xlsx`, err => {
      
      if (err) {
          console.error(err);
          return res.status(500).send(err)
      }
      res.json({ fileName: file.name, filePath: `/updatesfiles/presencedata/presenceData.xlsx` });
  })
});

app.post('/updateconservationdata', (req, res) => {
    
  if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
  }
  
  const file = req.files.file;

  file.mv(`${__dirname}/updatesfiles/conservationdata/conservationData.xlsx`, err => {
      
      if (err) {
          console.error(err);
          return res.status(500).send(err)
      }
      res.json({ fileName: file.name, filePath: `/updatesfiles/conservationdata/conservationData.xlsx` });
  })
});



//este post para recibir el dato 
// app.post('/dates', async (req, res) => {
//   const myDates = req.body.myDates;
//   const filename = req.body.filename;
//   await myLogic.mySpecialFunction(myDates.initialDate, myDates.endDate, filename);
//   myDates["loading"] = '';
//   res.json(myDates)
// })

app.post('/dates', async (req, res) => {
  const myDates = req.body.myDates;
  const filename = req.body.filename;

  try {
    const filteredData = await myLogic.mySpecialFunction(myDates.initialDate, myDates.endDate, filename);
    console.log("filteredData: ", filteredData)
    if(filteredData === 1) {
      myDates["loading"] = '';
      // Do something with the filtered data
      res.json(myDates);
    }
 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


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