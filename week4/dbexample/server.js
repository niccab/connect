var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var urlencodedBodyParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedBodyParser);

app.use(express.static("public"));

app.set('view engine', 'ejs');

var submittedData = [];

app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.post('/formdata', function (req, res) {
    console.log(req.body.data);

    var dataToSave = {
        text: req.body.data,
        number: req.body.number,
        color: req.body.color
    };

    db.insert(dataToSave, function (err, newDoc) { 
        db.find({}, function (err, docs) {
            var dataWrapper = { data: docs };
            res.render("outputtemplate.ejs", dataWrapper);
        });
    });


});

app.listen(80, function () {
    console.log('Example app listening on port 8010!')
});