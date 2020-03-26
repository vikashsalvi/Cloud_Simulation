var express = require('express');
app = express();
var cors = require('cors')
app.use(cors())
const fs = require('fs')

app.get("/notesSearch/:searchKeyword", (request,response) => {
    data = readDataFromFile()
    var existingArray
    if(data.hasOwnProperty(request.params.searchKeyword)){
      response.header("Access-Control-Allow-Origin", "*");
      response.send(data[request.params.searchKeyword])
    }else{
      response.header("Access-Control-Allow-Origin", "*");
      response.send('No notes found for the keyword: '+request.params.searchKeyword)
    }
})

app.get("/fetchSampleNotes/:searchKeyword", (request,response) => {
  data = readDataFromFile()
  var existingArray
  if(data.hasOwnProperty(request.params.searchKeyword)){
    response.header("Access-Control-Allow-Origin", "*");
    response.send(""+data[request.params.searchKeyword])
  }else{
    response.header("Access-Control-Allow-Origin", "*");
    response.send('No notes found for the keyword: '+request.params.searchKeyword)
  }
})
  
app.get("/submitNotesForTheKeyword/:searchKeyword/:notes", (request,response) => {
    
    data = readDataFromFile()
    console.log(data)
    var existingArray
  
    if(data.hasOwnProperty(request.params.searchKeyword)){
      existingArray = data[request.params.searchKeyword]
      existingArray.push(request.params.notes)
      data[request.params.searchKeyword] = existingArray
    }else{
      data[request.params.searchKeyword] = [request.params.notes]
    }
    writeDataToFile(data)
    response.header("Access-Control-Allow-Origin", "*");
    response.send(data[request.params.searchKeyword]);
  })
  function writeDataToFile(data){
    path = 'notes.json'
    let file = JSON.stringify(data);
    fs.writeFileSync(path, file);
}
  
function readDataFromFile(){
    path = "notes.json"
    if(fs.existsSync(path)){
      return JSON.parse(fs.readFileSync(path));
    }else{
      return {}
    }
}

app.listen(8082, function () {
    console.log("User notes service started")
});