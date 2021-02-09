//Express is a node module for building HTTP servers
var express = require('express');
var app = express();

//tell express to look in the "public" directory for any files, first!
app.use(express.static("public"));

//the default route of / and what to do!
app.get("/", function (req, res) {
    res.send("Hello thanks for connecting!");
});
//commenting here, listen on port 80!
app.listen(80);