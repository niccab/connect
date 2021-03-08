var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/formdata', function (req, res) {
    console.log(req.query.text);

    var dataToSave = {
        text: req.query.text,
        number: req.query.number,
        color: req.query.color
    };

    db.insert(dataToSave, function (err, newDoc) { 
        db.find({}, function (err, docs) {
            //var dataWrapper = { data: docs };

            res.send(docs);
        });
    });
});

app.listen(8040, function () {
    console.log('Example app listening on port 8040!')
});