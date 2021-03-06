var express = require('express');
var BodyParser = require('body-parser');

var app = express();
var cors = require('cors')
app.use(cors())
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var log = require('log4js');
log.configure({
  appenders: { cheese: { type: 'file', filename: 'search_log.log' } },
  categories: { default: { appenders: ['cheese'], level: 'info' } }
});
var logger = log.getLogger();
logger.level = 'info';
var data_csv
app.get("/searchLog/:searchKey", (request,response) => {
  
  
  var input = request.params.searchKey 
  var date = new Date()
  path = "log.csv"
  const csv = require('csv-parser');
  const fs = require('fs');
  const results = [];
  var freq_count = 0
  var csv_rows = []
  if(!fs.existsSync(path)){
    fs.writeFileSync(path,"Keyword,date_time,frequency_count\n")
    fs.appendFileSync(path,input+","+date+",0\n")
  }
  fs.createReadStream(path)
  .pipe(csv())
  .on('data', (row) => {
    csv_rows.push(row)
    if(row.Keyword == input){
      freq_count = freq_count +1
    }
  })
  .on('end', () => {  
    if(fs.existsSync(path)){
      fs.readFileSync(path)
      fs.writeFileSync(path,"Keyword,date_time,frequency_count\n")
      var flag = 0
      for(var i=0;i<csv_rows.length;i++){
          if(csv_rows[i].Keyword == input){
            
            var co = parseInt((csv_rows[i].frequency_count+"").toString().trim())
            co++
            csv_rows[i].date_time = date
            csv_rows[i].frequency_count = co

            flag=0
            break;
          }
          else{
            flag=1
          }
      }
      for(var i=0;i<csv_rows.length;i++){
        fs.appendFileSync(path,csv_rows[i].Keyword+","+csv_rows[i].date_time +","+csv_rows[i].frequency_count+"\n")
      }
      if(flag==1){
        fs.appendFileSync(path,input+","+date +","+1+"\n")
      }
      data_csv = csv_rows
      console.log(data_csv)
    }
  });
  response.header("Access-Control-Allow-Origin", "*");
  response.send("OK")
});

app.get("/getSearchLogData", (request,response) => {
  console.log(data_csv)
  /*path = "log.csv"
  const csv = require('csv-parser');
  const fs = require('fs');
  var data = []
  if(fs.existsSync(path)){
    fs.createReadStream(path).pipe(csv())
    .on('data', (row) => {
      console.log(row)
    })
    .on('end', () => {
      console.log(data)
      console.log('CSV file successfully processed');
    });
    response.send(data)
  }else{
    response.send("No search log created yet")
  }*/
  response.header("Access-Control-Allow-Origin", "*");
  response.send(data_csv)
});
app.listen(8081, function () {
    console.log("Searh log service started")
});