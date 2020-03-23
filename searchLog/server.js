var express = require('express');
var BodyParser = require('body-parser');

var app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var log = require('log4js');
log.configure({
  appenders: { cheese: { type: 'file', filename: 'search_log.log' } },
  categories: { default: { appenders: ['cheese'], level: 'info' } }
});
var logger = log.getLogger();
logger.level = 'info';

app.get("/searchLog/:searchKey", (request,response) => {
    var input = request.params.searchKey 
    var date = new Date()
    path = "log.csv"
    var data = []
    const csv = require('csv-parser');
    const fs = require('fs');
    const results = [];
    var freq_count = 0
    console.log("call received")
    if(!fs.existsSync(path)){
      fs.writeFileSync(path,"Keyword,Date and time,frequency count \n")
      fs.appendFileSync(path,input+","+date+",0\n")
    }
    fs.createReadStream(path)
    .pipe(csv())
    .on('data', (row) => {
      if(row.Keyword == input){
        freq_count = freq_count +1
      }
    })
    .on('end', () => {  
      if(fs.existsSync(path)){
        fs.readFileSync(path)
        fs.appendFileSync(path,input+","+date +","+freq_count+"\n")
      }
    });
  
    response.send("OK")
});

app.get("/searchLogData", (request,response) => {
  path = "log.csv"
  const csv = require('csv-parser');
  const fs = require('fs');
  data = []
  if(fs.existsSync(path)){
    fs.createReadStream(path).pipe(csv())
    .on('data', (row) => {
      data.push(row)
      console.log(row)
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
    response.send(data)
  }else{
    response.send("No search log created yet")
  }
});
app.listen(8081, function () {
    console.log("Searh log service started")
});