var fs = require('fs');
var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });

var express = require('express');
var multer = require('multer')
var bodyParser = require('body-parser');
var app = express();

var session = require('express-session');
var nedbstore = require('nedb-session-store')(session);

var bcrypt = require('bcrypt-nodejs');

// https://github.com/kelektiv/node-uuid
// npm install uuid
const uuid = require('uuid');

var upload = multer({ dest: 'public/uploads/' })

var urlencodedBodyParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedBodyParser);

app.use(express.static("public"));

app.set('view engine', 'ejs');

var submittedData = [];

app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.get('/displayrecord', function (req, res) {
    db.find({ _id: req.query._id }, function (err, docs) {
        var dataWrapper = { data: docs[0] };
        res.render("individual.ejs", dataWrapper);
    });
});

app.post('/formdata', upload.single('photo'), function (req, res) {
    console.log(req.file);

    if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png" || req.file.mimetype == "image/jpg" || req.file.mimetype == "image/gif") {

        console.log(req.body.data);

        var dataToSave = {
            file: req.file,
            text: req.body.data,
            number: req.body.number,
			color: req.body.color,
			colorfeel1: req.body.colorfeel1,
			colorfeel2: req.body.colorfeel2,
			colorfeel3: req.body.colorfeel3,
			colorjoy1: req.body.colorjoy1,
			colorjoy2: req.body.colorjoy2,
			colorjoy3: req.body.colorjoy3,
            longtext: req.body.longtext
        };

        db.insert(dataToSave, function (err, newDoc) {
            db.find({}, function (err, docs) {
                var dataWrapper = { data: docs };
                res.render("outputtemplate.ejs", dataWrapper);
            });
        });
    }
    else {
        fs.unlink(req.file.path, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(req.file.path + ' was deleted');
            }
        });
        res.send("Not an accepted image file");
    }
});



app.use(
	session(
		{
			secret: 'secret',
			cookie: {
				maxAge: 365 * 24 * 60 * 60 * 1000   // e.g. 1 year
			},
			store: new nedbstore({
				filename: 'sessions.db'
			})
		}
	)
);

app.use(express.static('public'));

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser);

// User database
var Datastore = require('nedb');
var db = new Datastore({ filename: 'users.db', autoload: true });

function generateHash(password) {
	return bcrypt.hashSync(password);
}

function compareHash(password, hash) {
	return bcrypt.compareSync(password, hash);
}


// Main page
app.get('/', function (req, res) {
	console.log(req.session.username);

	if (!req.session.username) {
		res.redirect('/login.html');
	} else {
		// Give them the main page
		//res.send('session user-id: ' + req.session.userid + '. ');


		var lastlogin = req.session.lastlogin;
		var timeelapsed = Date.now() - lastlogin;
		timeelapsed = timeelapsed / 1000;
		res.send("You were last here: " + Math.round(timeelapsed) + " seconds ago");

		//res.send(req.session);
	}
});

app.post('/register', function (req, res) {
	// We want to "hash" the password so that it isn't stored in clear text in the database
	var passwordHash = generateHash(req.body.password);

	// The information we want to store
	var registration = {
		"username": req.body.username,
		"password": passwordHash
	};

	// Insert into the database
	db.insert(registration);
	console.log("inserted " + registration);

	// Give the user an option of what to do next
	res.redirect('/letsdoit.html');

});

// Post from login page
app.post('/login', function (req, res) {

	// Check username and password in database
	db.findOne({ "username": req.body.username },
		function (err, doc) {
			if (doc != null) {

				// Found user, check password				
				if (compareHash(req.body.password, doc.password)) {
					// Set the session variable
					req.session.username = doc.username;

					// Put some other data in there
					req.session.lastlogin = Date.now();

					res.redirect('/yes.html');

				} else {

					res.send("Invalid Try again");

				}
			}
		}
	);


});

app.get('/logout', function (req, res) {
	delete req.session.username;
	res.redirect('/');
});	

app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
});