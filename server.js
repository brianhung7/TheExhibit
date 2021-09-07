const express = require("express");
const app = express(); 

// this will listen for any GET requests coming to the server
app.get('/', function(request,response){
    response.send("Hello World"); 
});

app.listen(4000, function(){
  console.log("I am live on port 4000");
});