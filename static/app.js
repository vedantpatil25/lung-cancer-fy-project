const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

//Setting up our static path and Body Parser
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
  extended: true
}));

//mongoose database
mongoose.connect("mongodb+srv://priyaDB:priya2001@cluster0.xes3k.mongodb.net/dataDB");

const dataSchema = new mongoose.Schema({
  content: String
});

const Data = mongoose.model("Data",dataSchema);
 
 
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/login.html");
})

app.get("/data", function(req, res) {  //finding the data and displaying the data again in the data page
    Data.find({},function(err,data){
        res.render("data",{content: data});
      });
  })
 

app.post("/", function(req, res) {
  const username = req.body.user;
  const password = req.body.pswd;

  if(username == "admin" && password == "iamvaccinated"){ //if the username and password are correct
    res.redirect("/data");   //goes to the data page
  }
  else{
    res.redirect("/")   //else goes back to login page
  }
});

//saving the data in the data page
app.post("/data",function(req,res){
    const dataEntry = new Data({
        content: req.body.dataBody //fetching the user input
      });
      
      dataEntry.save(function(err){
        if(!err){
          res.redirect("/data");
        }
      });
});


//Our listener that opens the server
let port = process.env.PORT;
if(port == null || port == ""){
  port=3000;
}
app.listen(port, function() {
  console.log("Server started sucessfully");
});

