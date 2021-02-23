//Express is a node module for building HTTP servers
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var urlencodedBodyParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedBodyParser);

//tell express to look in the "public" directory for any files, first!
app.use(express.static("public"));

var submittedData = [];


//the default route of / and what to do!
app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.post('/formdata', function (req, res) {
    console.log(req.body.data);
   // console.log(req.query.data);

    /*
    var dataToSave = new Object();
    dataToSave.text = req.body.data;
    dataToSave.color = req.body.color;
    */

    var dataToSave = {
        text: req.body.data,
        number: req.body.number,
        color: req.body.color
    };

    //console.log(dataToSave);s
    submittedData.push(dataToSave);
    console.log(submittedData);

    var output = "<html><body>";
    output += "<h1>Submitted Data </h1>";

    for (var i = 0; i < submittedData.length; i++) {
        output += "<div style='background-color: " + submittedData[i].color + "'>" + "Pin Code: " + submittedData[i].number + "<br />" + submittedData[i].text + "</div>";

    }

    output += "</body></html>";
        res.send(output);

  // res.send("Got your data! You submitted: " + req.body.data + " " + req.body.color);

});

//commenting here, listen on port 80!
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
});